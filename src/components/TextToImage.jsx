import { useState, useEffect, useRef } from 'react'

const TextToImage = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [jobId, setJobId] = useState(null)
  const pollingIntervalRef = useRef(null)

  // Clear any existing polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Function to submit image generation request to AI Horde
  const submitGenerationRequest = async (textPrompt) => {
    try {
      const response = await fetch('https://aihorde.net/api/v2/generate/async', {
        method: 'POST',
        headers: {
          'apikey': '0000000000',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: textPrompt,
          params: {}
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      const data = await response.json()
      return data.id // Return the job ID
    } catch (error) {
      console.error('AI Horde submission error:', error)
      throw error
    }
  }

  // Function to check generation status
  const checkGenerationStatus = async (id) => {
    try {
      const response = await fetch(`https://aihorde.net/api/v2/generate/status/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Status check error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('AI Horde status check error:', error)
      throw error
    }
  }

  // Function to start polling for job status
  const startPolling = (id) => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusData = await checkGenerationStatus(id)

        if (statusData.done) {
          // Job is complete, clear the interval
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null

          // Check if we have generations
          if (statusData.generations && statusData.generations.length > 0) {
            const imageUrl = statusData.generations[0].img
            setGeneratedImage(imageUrl)
            setIsGenerating(false)
          } else {
            throw new Error('No image was generated')
          }
        }
      } catch (err) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
        setError(err.message)
        setIsGenerating(false)
      }
    }, 4000) // Poll every 4 seconds
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)
    setJobId(null)

    try {
      const id = await submitGenerationRequest(prompt.trim())
      setJobId(id)
      startPolling(id)
    } catch (err) {
      setError(err.message)
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    if (prompt.trim()) {
      handleGenerate()
    }
  }

  // Demo toggle removed; always using HF API

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Transform Your Ideas Into Images
        </h2>
        <p className="text-lg text-slate-300">
          Describe what you want to see, and watch AI bring it to life
        </p>
      </div>

      <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-6 border border-slate-700/50 shadow-lg">
        <div className="mb-5">
          <label htmlFor="prompt" className="block text-base font-medium text-white mb-2">
            Describe Your Image
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the sky..."
            className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none backdrop-blur-sm"
          />
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-500/10 border border-red-400/20 rounded-md">
            <p className="text-red-300 text-center mb-2">{error}</p>
            <div className="text-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`px-6 py-3 text-base font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isGenerating
              ? 'bg-slate-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Image'
            )}
          </button>
        </div>
      </div>

      {generatedImage && (
        <div className="mt-8">
          <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-5 border border-slate-700/50 shadow-lg">
            <h3 className="text-xl font-medium text-white mb-4 text-center">Your Generated Image</h3>
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt="Generated from text description"
                className="max-w-full h-auto rounded-md shadow-lg border border-slate-600/30"
                onError={(e) => {
                  e.target.style.display = 'none'
                  setError('Failed to load generated image')
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-slate-300 text-sm mb-3">
                Prompt: <span className="text-white font-medium">"{prompt}"</span>
              </p>
              <a
                href={generatedImage}
                download="generated-image.png"
                className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextToImage
