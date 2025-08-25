import { useState } from 'react'

const TextToImage = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, we'll use a placeholder image
      // In a real app, this would call an AI image generation API
      setGeneratedImage('https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=Generated+Image')
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Transform Your Ideas Into Images
        </h2>
        <p className="text-xl text-white/70">
          Describe what you want to see, and watch AI bring it to life
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-lg font-medium text-white mb-3">
            Describe Your Image
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the sky..."
            className="w-full h-32 px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none backdrop-blur-sm"
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating
                ? 'bg-gray-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Image'
            )}
          </button>
        </div>
      </div>

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="mt-8 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">
              Your Generated Image
            </h3>
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt="Generated from text description"
                className="max-w-full h-auto rounded-xl shadow-2xl border border-white/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextToImage
