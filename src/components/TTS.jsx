import { useState, useEffect } from "react";
import { FaVolumeUp, FaSpinner } from "react-icons/fa";

function speakText(text, voiceName = null) {
    if (!window.speechSynthesis) {
        alert("TTS not supported in this browser");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    if (voiceName) {
        const voices = window.speechSynthesis.getVoices();
        const selected = voices.find(v => v.name === voiceName);
        if (selected) utterance.voice = selected;
    }

    window.speechSynthesis.speak(utterance);
}

const TTS = () => {
    const [text, setText] = useState("");
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    const handleSpeak = () => {
        if (text.trim()) {
            setIsSpeaking(true);
            speakText(text, selectedVoice);
            
            // Reset speaking state after a delay
            setTimeout(() => {
                setIsSpeaking(false);
            }, 2000);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="p-6 bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Text to Speech</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="tts-text" className="block text-sm font-medium text-slate-300 mb-2">
                            Enter text to convert to speech
                        </label>
                        <textarea
                            id="tts-text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type something to hear it spoken..."
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] text-white placeholder-slate-400"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="voice-select" className="block text-sm font-medium text-slate-300 mb-2">
                            Select Voice
                        </label>
                        <select 
                            id="voice-select"
                            onChange={e => setSelectedVoice(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        >
                            <option value="">Default Voice</option>
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="text-center pt-2">
                        <button 
                            onClick={handleSpeak}
                            disabled={isSpeaking || !text.trim()}
                            className={`px-6 py-3 text-base font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                isSpeaking
                                    ? 'bg-slate-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                            }`}
                        >
                            {isSpeaking ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Speaking...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <FaVolumeUp className="mr-2" />
                                    <span>Speak Text</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TTS;
