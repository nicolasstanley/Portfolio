'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Dynamically import the fluid component to isolate it from the main bundle
const FluidEffect = dynamic(() => import('./FluidEffect'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/50">Loading fluid simulation...</div>
    </div>
  ),
})

export default function FluidCursorPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <div className="fixed top-8 left-8 z-20">
        <Link
          href="/experiments"
          className="backdrop-blur-lg py-3 px-5 rounded-full font-sans text-sm transition-colors hover:bg-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          ← Experiments
        </Link>
      </div>

      {/* Fluid container */}
      <div className="w-full h-screen">
        {mounted && <FluidEffect />}
      </div>

      {/* Instructions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <p className="text-white/50 text-sm">Move your cursor around</p>
      </div>
    </div>
  )
}
