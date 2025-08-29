import { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'

const ImageToText = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setExtractedText('')
    }
  }

  const handleExtractText = async () => {
    if (!selectedImage) return

    setIsExtracting(true)
    setExtractedText('')

    try {
      const result = await Tesseract.recognize(selectedImage, 'eng', {
        logger: m => console.log(m)
      })

      setExtractedText(result.data.text)
    } catch (error) {
      console.error('Error extracting text:', error)
      setExtractedText('Error extracting text. Please try again.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setExtractedText('')
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const clearSelection = () => {
    setSelectedImage(null)
    setExtractedText('')
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Extract Text From Images
        </h2>
        <p className="text-lg text-slate-300">
          Upload an image and let AI extract the text content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-6 border border-slate-700/50 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Upload Image</h3>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${selectedImage
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
                  className="max-h-64 mx-auto rounded-md border border-slate-600/30"
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
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {selectedImage && (
            <div className="mt-6 text-center">
              <button
                onClick={handleExtractText}
                disabled={isExtracting}
                className={`px-6 py-3 text-base font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isExtracting
                    ? 'bg-slate-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  }`}
              >
                {isExtracting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Extracting...</span>
                  </div>
                ) : (
                  'Extract Text'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Extracted Text Section */}
        <div className="bg-slate-800/70 backdrop-blur-md rounded-lg p-6 border border-slate-700/50 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Extracted Text</h3>

          {extractedText ? (
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="max-h-96 overflow-y-auto">
                <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {extractedText}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600/30 text-center">
              <div className="text-3xl text-slate-400 mb-2"></div>
              <p className="text-slate-300">
                {selectedImage
                  ? 'Click "Extract Text" to get started'
                  : 'Upload an image to extract text'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageToText
