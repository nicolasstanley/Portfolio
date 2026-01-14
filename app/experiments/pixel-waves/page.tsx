import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getAboutMe } from '@/lib/cosmic'
import HalftoneBackground from '@/components/HalftoneBackground'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pixel Waves - Nicolas Ménard',
  description: 'An animated canvas of pixel waves',
}

export default async function PixelWavesPage() {
  const aboutMe = await getAboutMe().catch(() => null)

  return (
    <div className="min-h-screen relative">
      <Navigation aboutMe={aboutMe} />
      <HalftoneBackground />

      {/* Content container aligned with navbar */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="max-w-7xl mx-auto h-full relative">
            {/* Back button */}
            <Link
              href="/experiments"
              className="pointer-events-auto absolute top-32 left-0 backdrop-blur-lg py-3 px-5 rounded-full font-sans text-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              ← Experiments
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
