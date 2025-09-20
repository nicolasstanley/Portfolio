import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" role="main" aria-labelledby="not-found-heading">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-200" aria-hidden="true">404</div>
        <h1 id="not-found-heading" className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Go back to portfolio home page"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </main>
  )
}