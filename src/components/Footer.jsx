const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50 py-5">
      <div className="container mx-auto px-6 text-center">
        <p className="text-slate-400">
          © {currentYear} DreamMaker. All rights reserved | Made with ❤️ by{" "}
          <a
            href="https://ammadahmed.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Ammad Ahmed
          </a>
        </p>

      </div>
    </footer>
  )
}

export default Footer
