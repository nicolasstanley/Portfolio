'use client'

import { useEffect } from 'react'

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initAOS = async () => {
      // Dynamically import both AOS and its CSS
      const [{ default: AOS }] = await Promise.all([
        import('aos'),
        import('aos/dist/aos.css')
      ])
      
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
      })
    }
    
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initAOS()
    }
  }, [])

  return <>{children}</>
}