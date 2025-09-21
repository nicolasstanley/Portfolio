import Link from 'next/link'
import QuasarShader from '@/components/QuasarShader'

export default function NotFound() {
  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden" role="main" aria-labelledby="not-found-heading">
      <QuasarShader />
      <div className="text-center relative z-10">
        <div className="text-9xl font-bold text-white/20 mb-4" aria-hidden="true">404</div>
        <h1 id="not-found-heading" className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent border border-white/20"
          aria-label="Go back to portfolio home page"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </main>
  )
}