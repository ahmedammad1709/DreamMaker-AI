import { useState } from 'react'
import Navbar from './components/Navbar'
import TextToImage from './components/TextToImage'
import ImageToText from './components/ImageToText'
import RemoveBG from './components/RemoveBG'
import Footer from './components/Footer'
import TTS from './components/TTS'
import Chatbot from './components/chatbot'

function App() {
  const [activeView, setActiveView] = useState('text-to-image')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('/checkerboard.svg')] opacity-5 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar activeView={activeView} setActiveView={setActiveView} />

        <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
          {activeView === 'chatbot' ? (
            <Chatbot />
          ) : activeView === 'text-to-image' ? (
            <TextToImage />
          ) : activeView === 'image-to-text' ? (
            <ImageToText />
          ) : activeView === 'remove-bg' ? (
            <RemoveBG />
          ) : (
            <TTS />
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
