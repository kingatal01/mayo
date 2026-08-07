'use client'

// Page d'erreur globale de l'App Router. Sa présence évite que Next.js
// retombe sur la page `_error` du Pages Router (qui importe <Html> et fait
// échouer le build au prérendu de /404 et /500, notamment sous Linux).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#0d2d6b', marginBottom: '0.5rem' }}>Oups</h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Une erreur inattendue est survenue.</p>
            <button
              onClick={() => reset()}
              style={{ background: '#0d2d6b', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: 500, border: 'none', cursor: 'pointer' }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
