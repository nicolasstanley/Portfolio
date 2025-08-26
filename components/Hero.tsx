'use client'

import { Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useFluid } from '@funtech-inc/use-shader-fx'
import { AboutMe } from '@/types'
import SocialLinks from '@/components/SocialLinks'

interface HeroProps {
  aboutMe: AboutMe
}

// Fluid background component
function FluidBackground() {
  const { viewport, size } = useThree()
  
  console.log('FluidBackground rendering with size:', size)
  
  const fluidHookResult = useFluid({
    size: {
      width: Math.floor(size.width),
      height: Math.floor(size.height),
      top: 0,
      left: 0
    } as any,
    dpr: 1,
  } as any)

  console.log('useFluid result:', fluidHookResult)
  
  // Access the correct properties from the hook result
  const updateFluid = fluidHookResult.render
  const output = fluidHookResult.texture || fluidHookResult.velocity

  console.log('updateFluid:', updateFluid, 'output:', output)

  useFrame((state) => {
    if (updateFluid && typeof updateFluid === 'function') {
      try {
        // Call the render function with the full state object
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
  const { metadata } = aboutMe

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Three.js Canvas with Fluid Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
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
      <div className="container relative z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            {metadata?.profile_image && (
              <img
                src={`${metadata.profile_image.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                alt={metadata?.full_name || 'Profile'}
                width="150"
                height="150"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-8 shadow-lg object-cover"
              />
            )}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
              {metadata?.full_name || 'Welcome'}
            </h1>
            
            {metadata?.professional_title && (
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 font-light">
                {metadata.professional_title}
              </h2>
            )}
            
            {metadata?.location && (
              <p className="text-lg text-gray-500 mb-8">
                📍 {metadata.location}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 pointer-events-auto">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary px-8 py-3 text-lg"
              >
                View My Work
              </button>
              
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary px-8 py-3 text-lg"
              >
                Get In Touch
              </button>
            </div>
          </div>
          
          <div className="pointer-events-auto">
            <SocialLinks aboutMe={aboutMe} />
          </div>
        </div>
      </div>
    </section>
  )
}