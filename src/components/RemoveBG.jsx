import React, { useState, useRef } from 'react'
import { FaDownload } from 'react-icons/fa'

const RemoveBG = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setProcessedImage(null)
      setError('')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        setSelectedImage(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setProcessedImage(null)
        setError('')
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const clearSelection = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setPreviewUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = () => {
    if (processedImage) {
      const a = document.createElement('a')
      a.href = processedImage
      a.download = `${selectedImage.name || 'image'}-no-bg.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleRemoveBackground = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setError('')
    setProcessedImage(null)

    try {
      // Get the file from selectedImage
      const file = selectedImage instanceof File ? selectedImage : selectedImage
      const imageData = await downscaleIfNeeded(file)
      
      const formData = new FormData()
      formData.append('image_file', imageData)
      formData.append('size', 'auto')

      // Direct API call to remove.bg
      const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY
      
      if (!apiKey) {
        throw new Error('API key not found. Please add VITE_REMOVE_BG_API_KEY to your .env.local file')
      }
      
      console.log('API Key available:', apiKey ? 'Yes' : 'No')
      
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error from remove.bg:', errorText)
        throw new Error('Failed to process image: ' + response.statusText)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setProcessedImage(url)
    } catch (err) {
      console.error('Error removing background:', err)
      setError(err.message || 'Failed to remove background. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Remove Image Backgrounds
        </h2>
        <p className="text-lg text-slate-300">
          Upload an image and get a clean, background-free result in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image Section */}
        <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-6 border border-slate-700/50 shadow-lg">
          <h3 className="text-xl font-medium text-white mb-4">Original Image</h3>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${previewUrl
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-slate-600/50 hover:border-blue-400 hover:bg-slate-700/50'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto rounded-md mx-auto shadow-md border border-slate-600/30"
                />
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm">
                    {selectedImage?.name}
                  </p>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <svg 
                  className="w-14 h-14 mx-auto text-slate-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-slate-300">
                  Drag & drop your image here, or click to select
                </p>
                <p className="text-slate-400 text-sm">
                  Supports JPG and PNG formats
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                >
                  Select Image
                </button>
              </div>
            )}
          </div>

          <input
             ref={fileInputRef}
             type="file"
             accept="image/jpeg, image/png"
             onChange={handleImageSelect}
             className="hidden"
            />

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-400/20 rounded-md">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          )}

          {selectedImage && !processedImage && !isProcessing && (
            <div className="mt-6 text-center">
              <button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className={`px-6 py-3 text-base font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isProcessing
                    ? 'bg-slate-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Remove Background'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Result Image Section */}
        <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-6 border border-slate-700/50 shadow-lg">
          <h3 className="text-xl font-medium text-white mb-4">Result</h3>

          {processedImage ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full h-auto rounded-md shadow-lg border border-slate-600/30"
                />
              </div>
              <div className="text-center">
                <a
                  href={processedImage}
                  download="removed-background.png"
                  className="inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                >
                  <FaDownload className="mr-2" />
                  Download Image
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600/30 text-center">
              <svg 
                className="w-12 h-12 mx-auto text-slate-400 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-slate-300">
                {selectedImage
                  ? 'Click "Remove Background" to process your image'
                  : 'Upload an image to get started'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// Optional: client-side downscale to speed things up
async function downscaleIfNeeded(file, maxDim = 1600) {
  const img = await readImage(file);
  const { width, height } = img;

  const scale = Math.min(1, maxDim / Math.max(width, height));
  if (scale === 1) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((r) => canvas.toBlob(r, file.type || 'image/jpeg', 0.92));
  return new File([blob], file.name.replace(/\.(\w+)$/, '') + '_scaled.jpg', { type: 'image/jpeg' });
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default RemoveBG;
