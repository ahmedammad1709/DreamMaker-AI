import PropTypes from 'prop-types'

const Navbar = ({ activeView, setActiveView }) => {
  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo/Heading */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DreamMaker AI
            </h1>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex space-x-2 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveView('text-to-image')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                activeView === 'text-to-image'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              Text to Image
            </button>
            <button
              onClick={() => setActiveView('image-to-text')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                activeView === 'image-to-text'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              Image to Text
            </button>
            <button
              onClick={() => setActiveView('remove-bg')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                activeView === 'remove-bg'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              Remove Background
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
