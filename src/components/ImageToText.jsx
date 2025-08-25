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
        <h2 className="text-4xl font-bold text-white mb-4">
          Extract Text From Images
        </h2>
        <p className="text-xl text-white/70">
          Upload any image and let AI extract the text content for you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Upload Image</h3>
          
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
              selectedImage 
                ? 'border-purple-400 bg-purple-500/10' 
                : 'border-white/30 hover:border-purple-400 hover:bg-white/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
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
                <div className="text-6xl text-white/50">📷</div>
                <p className="text-white/70">
                  Drag and drop an image here, or click to browse
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
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {selectedImage && (
            <div className="mt-6 text-center">
              <button
                onClick={handleExtractText}
                disabled={isExtracting}
                className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isExtracting
                    ? 'bg-gray-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40'
                }`}
              >
                {isExtracting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Extracted Text</h3>
          
          {extractedText ? (
            <div className="bg-white/20 rounded-xl p-4 border border-white/30">
              <div className="max-h-96 overflow-y-auto">
                <pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {extractedText}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 rounded-xl p-8 border border-white/30 text-center">
              <div className="text-4xl text-white/50 mb-2">📝</div>
              <p className="text-white/70">
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
