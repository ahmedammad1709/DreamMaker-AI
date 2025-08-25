import { useState } from 'react'
import Navbar from './components/Navbar'
import TextToImage from './components/TextToImage'
import ImageToText from './components/ImageToText'
import Footer from './components/Footer'

function App() {
  const [activeView, setActiveView] = useState('text-to-image')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        {activeView === 'text-to-image' ? (
          <TextToImage />
        ) : (
          <ImageToText />
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App
