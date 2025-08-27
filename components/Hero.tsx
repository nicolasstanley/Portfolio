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
      <div className="container relative z-10 pointer-events-none">
        <div className="animate-fade-in">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-6 font-light">
            Hi, I'm Nicolas, a UX Designer & Researcher
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl">
            I design delightful, accessible experiences that solve real problems. Specializing in user research, prototyping, and end-to-end design for web and mobile.
          </p>
        </div>
      </div>
    </section>
  )
}