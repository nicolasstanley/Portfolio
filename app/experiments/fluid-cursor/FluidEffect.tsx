'use client'

import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useFluid } from '@funtech-inc/use-shader-fx'

function FluidBackground() {
  const { viewport, size } = useThree()
  const timeRef = useRef(0)

  const fluidSize = useMemo(() => ({
    width: Math.floor(size.width),
    height: Math.floor(size.height),
    top: 0,
    left: 0
  }), [Math.floor(size.width / 100) * 100, Math.floor(size.height / 100) * 100])

  const fluidHookResult = useFluid({
    size: fluidSize as any,
    dpr: 1,
  } as any)

  useEffect(() => {
    const { renderTarget, material, scene } = fluidHookResult

    return () => {
      if (renderTarget && 'dispose' in renderTarget) {
        (renderTarget as any).dispose()
      }
      if (material && 'dispose' in material) {
        material.dispose()
      }
      if (scene) {
        scene.traverse((obj: any) => {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m: any) => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        })
      }
    }
  }, [fluidHookResult])

  const updateFluid = fluidHookResult.render
  const output = fluidHookResult.texture || (fluidHookResult as any).velocity

  useFrame((state) => {
    timeRef.current += 0.01

    if (updateFluid && typeof updateFluid === 'function') {
      try {
        updateFluid(state)
      } catch {
        // Silently handle errors
      }
    }
  })

  return (
    <mesh scale={[viewport.width * 1.1, viewport.height * 1.1, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={output}
        transparent={true}
        opacity={0.9}
        side={2}
      />
    </mesh>
  )
}

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

export default function FluidEffect() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 100 }}
      gl={{ alpha: true, antialias: false }}
      style={{
        background: '#000000',
        width: '100%',
        height: '100%'
      }}
      dpr={1}
    >
      <Suspense fallback={<FluidFallback />}>
        <FluidBackground />
      </Suspense>
    </Canvas>
  )
}
