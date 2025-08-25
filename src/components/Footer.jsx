const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-white/70">
          © {currentYear} DreamMaker AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
