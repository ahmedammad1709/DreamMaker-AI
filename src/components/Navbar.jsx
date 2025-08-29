import PropTypes from 'prop-types'

const Navbar = ({ activeView, setActiveView }) => {
  return (
    <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo/Heading */}
          <div className="mb-4 md:mb-0 flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Gen<span className="text-blue-400">Craft</span>
            </h1>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 bg-slate-700/50 rounded-lg p-1.5 backdrop-blur-sm">
            <button
              onClick={() => setActiveView('text-to-image')}
              className={`px-5 py-2.5 rounded-md font-medium transition-all ${activeView === 'text-to-image'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-slate-600/70'
                }`}
            >
              Text to Image
            </button>
            <button
              onClick={() => setActiveView('image-to-text')}
              className={`px-5 py-2.5 rounded-md font-medium transition-all ${activeView === 'image-to-text'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-slate-600/70'
                }`}
            >
              Image to Text
            </button>
            <button
              onClick={() => setActiveView('remove-bg')}
              className={`px-5 py-2.5 rounded-md font-medium transition-all ${activeView === 'remove-bg'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-slate-600/70'
                }`}
            >
              Remove Background
            </button>
            <button
              onClick={() => setActiveView('tts')}
              className={`px-5 py-2.5 rounded-md font-medium transition-all ${activeView === 'tts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-slate-600/70'
                }`}
            >
              Text to Speech
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  activeView: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired
}

export default Navbar
