'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useFluid } from '@funtech-inc/use-shader-fx'
import { AboutMe } from '@/types'
import * as THREE from 'three'
import WaveMesh from '@/components/WaveMesh'

interface HeroProps {
  aboutMe: AboutMe | null
}

// Fluid background component
function FluidBackground() {
  const { viewport, size } = useThree()
  const mouseRef = useRef(new THREE.Vector2())
  const timeRef = useRef(0)
  
  const fluidHookResult = useFluid({
    size: {
      width: Math.floor(size.width),
      height: Math.floor(size.height),
      top: 0,
      left: 0
    } as any,
    dpr: 1,
  } as any)

  // Handle mouse movement for cursor tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse coordinates to normalized device coordinates (-1 to +1)
      const rect = document.body.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Access the correct properties from the hook result
  const updateFluid = fluidHookResult.render
  const output = fluidHookResult.texture || fluidHookResult.velocity

  useFrame((state) => {
    timeRef.current += 0.01
    
    if (updateFluid && typeof updateFluid === 'function') {
      try {
        // Call the render function with the state object
        updateFluid(state)
      } catch (error) {
        console.error('Error updating fluid:', error)
      }
    }
  })

  return (
    <mesh scale={[viewport.width * 1.1, viewport.height * 1.1, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={output} 
        transparent={true}
        opacity={0.7}
        side={2} // Double-sided
      />
    </mesh>
  )
}

// Loading fallback
function FluidFallback() {
  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry />
      <meshStandardMaterial 
        color="#3b82f6" 
        transparent={true}
        opacity={0.3}
      />
    </mesh>
  )
}


export default function Hero({ aboutMe }: HeroProps) {
  return (
    <section className="h-[80vh] flex items-center justify-center relative overflow-hidden pt-16" role="banner" aria-label="Hero section introducing Nicolas Ménard">
      {/* Three.js Canvas with Fluid Background */}
      <div className="absolute inset-0 w-full h-full z-0" role="presentation" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 100 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          style={{ 
            background: 'transparent',
            width: '100%',
            height: '100%'
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<FluidFallback />}>
            <FluidBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10" />

      {/* Content */}
      <div className="container relative z-10 pointer-events-none transform -translate-y-12 md:-translate-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          {/* WaveMesh - above on mobile, right on desktop */}
          <div className="w-80 h-80 md:w-[512px] md:h-[512px] md:order-2 md:flex-shrink-0 mx-auto md:mx-0" data-aos="fade-up" data-aos-duration="1000">
            <WaveMesh />
          </div>

          {/* Text content - below on mobile, left on desktop */}
          <div className="flex-1 md:order-1" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            <h1 className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-6 font-semibold leading-relaxed">
              Hi, I'm Nicolas 👋
            </h1>
            <p className="text-lg text-gray-500 leading-6">
              I'm a results-driven designer who specializes in solving complex product challenges, with proven experience leading teams and conducting user research.
            </p>
          </div>
        </div>
      </div>

      {/* Animated arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => {
            const workSection = document.getElementById('work')
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="flex flex-col items-center hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-2"
          style={{ color: 'rgb(107 114 128 / var(--tw-text-opacity, 1))' }}
          aria-label="Scroll to work section"
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      </div>

    </section>
  )
}