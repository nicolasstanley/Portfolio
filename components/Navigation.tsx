'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      isScrolled ? 'bg-white/20 backdrop-blur-md shadow-md border-b border-gray-200/20' : 'bg-transparent'
    }`} role="banner">
      <nav role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="flex items-center justify-between h-16" data-aos="fade-down" data-aos-duration="800">
          <Link 
            href="/"
            className="font-medium text-lg text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Navigate to home page"
          >
            Nicolas Ménard
          </Link>
          
          <div className="hidden md:flex space-x-8 font-medium" role="menubar" aria-label="Main menu">
            <button
              onClick={() => handleNavigation('work')}
              className="text-black hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              role="menuitem"
              aria-label="Navigate to Work section"
            >
              Work
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
          </div>
        </div>
      </div>
      </nav>
    </header>
  )
}