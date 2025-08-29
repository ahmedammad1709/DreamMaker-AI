import { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: "user", text: input };
        setMessages([...messages, newMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();

            setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "bot", text: "Error: Try again later." }]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="p-6 bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Chat with GenCraft AI</h2>

                <div className="bg-slate-700/30 rounded-lg p-4 h-80 overflow-y-auto mb-4 border border-slate-600/50">
                    {messages.length === 0 ? (
                        <div className="text-slate-400 text-center py-8">
                            Ask me anything about AI, image generation, or how I can help you!
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`mb-3 p-3 rounded-lg ${msg.role === "user"
                                    ? "bg-blue-600/20 border border-blue-500/30 ml-8"
                                    : "bg-slate-600/20 border border-slate-500/30 mr-8"
                                }`}>
                                <div className="font-medium text-sm text-slate-400 mb-1">
                                    {msg.role === "user" ? "You" : "GenCraft AI"}
                                </div>
                                <div className={`${msg.role === "user" ? "text-blue-100" : "text-white"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="bg-slate-600/20 border border-slate-500/30 mr-8 mb-3 p-3 rounded-lg">
                            <div className="font-medium text-sm text-slate-400 mb-1">
                                GenCraft AI
                            </div>
                            <div className="flex items-center text-white">
                                <FaSpinner className="animate-spin mr-2" />
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center bg-slate-700/30 rounded-lg border border-slate-600/50 overflow-hidden">
                    <textarea
                        className="flex-1 bg-transparent p-3 text-white placeholder-slate-400 outline-none resize-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        rows="2"
                    />
                    <button
                        className={`p-3 m-2 rounded-lg transition-all ${input.trim()
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-slate-600/50 text-slate-400 cursor-not-allowed"
                            }`}
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin w-5 h-5" />
                        ) : (
                            <FaPaperPlane className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
