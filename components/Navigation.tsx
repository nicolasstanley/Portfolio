'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { AboutMe } from '@/types'

interface NavigationProps {
  aboutMe?: AboutMe | null
}

export default function Navigation({ aboutMe }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (sectionId: string) => {
    // Check if we're on the homepage
    if (pathname === '/') {
      // We're on homepage, scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        const headerHeight = 80 // Account for fixed header height
        const elementPosition = element.offsetTop - headerHeight
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    } else {
      // We're on another page (like ProjectDetail), redirect to homepage with anchor
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <header className="fixed top-6 left-0 right-0 z-50" role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto rounded-full py-3 bg-black/90 backdrop-blur-lg border border-gray-800/50">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="font-medium text-base text-white hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black rounded-md"
                aria-label="Navigate to home page"
              >
                Nicolas Ménard
              </Link>

              <div className="flex items-center gap-1 font-medium text-sm" role="menubar" aria-label="Main menu">
                <button
                  onClick={() => handleNavigation('work')}
                  className="hidden md:block text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full px-4 py-2"
                  role="menuitem"
                  aria-label="Navigate to Projects section"
                >
                  Projects
                </button>
                <button
                  onClick={() => handleNavigation('experience')}
                  className="hidden md:block text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full px-4 py-2"
                  role="menuitem"
                  aria-label="Navigate to Experience section"
                >
                  Experience
                </button>
                <button
                  onClick={() => handleNavigation('contact')}
                  className="hidden md:block text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full px-4 py-2"
                  role="menuitem"
                  aria-label="Navigate to Contact section"
                >
                  Contact
                </button>
                {aboutMe?.metadata?.resume_cv?.url && (
                  <a
                    href={aboutMe.metadata.resume_cv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full px-4 py-2"
                    role="menuitem"
                    aria-label="Open Resume in new tab"
                  >
                    Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}