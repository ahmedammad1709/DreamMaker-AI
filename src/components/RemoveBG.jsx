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
      formData.append('image', imageData)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || 'Failed to remove background')
        } catch (e) {
          throw new Error('Failed to process image: ' + (errorText || response.statusText))
        }
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
        <h2 className="text-4xl font-bold text-white mb-4">
          Remove Image Background
        </h2>
        <p className="text-xl text-white/70">
          Upload an image and get a transparent background version instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Upload Image</h3>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${previewUrl
                ? 'border-purple-400 bg-purple-500/10'
                : 'border-white/30 hover:border-purple-400 hover:bg-white/5'
              }`}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg mx-auto shadow-lg"
                />
                <div className="space-y-2">
                  <p className="text-white/80 text-sm">
                    {selectedImage?.name}
                  </p>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl text-white/50">🖼️</div>
                <p className="text-white/70">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="text-white/50 text-sm">
                  Supports JPG and PNG formats
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Choose Image
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

          {selectedImage && (
            <div className="mt-6 text-center">
              <button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isProcessing
                    ? 'bg-gray-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40'
                  }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Remove Background'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Processed Image Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Processed Image</h3>

          {processedImage ? (
            <div className="space-y-4">
              <div className="bg-[url('/checkerboard.svg')] bg-repeat rounded-lg p-2">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full h-auto rounded-lg mx-auto"
                />
              </div>
              <div className="text-center mt-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <FaDownload className="mr-2" />
                  Download Image
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 rounded-xl p-8 border border-white/30 text-center h-64 flex flex-col items-center justify-center">
              <div className="text-4xl text-white/50 mb-2">✨</div>
              <p className="text-white/70">
                {selectedImage
                  ? 'Click "Remove Background" to process your image'
                  : 'Upload an image to get started'
                }
              </p>
              {error && (
                <p className="text-red-300 mt-4 p-2 bg-red-500/20 rounded-lg">
                  {error}
                </p>
              )}
              {isProcessing && (
                <div className="mt-4">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                  <p className="text-white/70 mt-2">Processing your image...</p>
                </div>
              )}
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
