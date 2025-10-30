'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { AboutMe } from '@/types'

interface NavigationProps {
  aboutMe?: AboutMe | null
}

export default function Navigation({ aboutMe }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Update scroll state
      setIsScrolled(currentScrollY > 0)
      
      // Show/hide logic
      if (currentScrollY === 0) {
        // At the top - always show
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show nav
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide nav
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

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
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled ? 'bg-white/20 backdrop-blur-md border-b border-gray-200/20' : 'bg-white/10 backdrop-blur-sm'
    }`} role="banner">
      <nav role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="flex items-center justify-between h-16" data-aos="fade-down" data-aos-duration="400">
          <Link
            href="/"
            className="font-medium text-lg text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
            aria-label="Navigate to home page"
          >
            Nicolas Ménard
          </Link>
          
          <div className="hidden md:flex space-x-8 font-medium" role="menubar" aria-label="Main menu">
            <button
              onClick={() => handleNavigation('work')}
              className="text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              role="menuitem"
              aria-label="Navigate to Projects section"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavigation('experience')}
              className="text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              role="menuitem"
              aria-label="Navigate to Experience section"
            >
              Experience
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className="text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
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
                className="text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
                role="menuitem"
                aria-label="Open Resume in new tab"
              >
                Resume
              </a>
            )}
          </div>
        </div>
      </div>
      </nav>
    </header>
  )
}