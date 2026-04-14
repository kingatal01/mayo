export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#0d2d6b] mb-4">404</h1>
        <p className="text-gray-500 mb-8">Page introuvable</p>
        <a href="/" className="bg-[#0d2d6b] text-white px-6 py-3 rounded font-medium hover:bg-[#1D6FA4] transition-colors">
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
