'use client'

import { useEffect, useRef } from 'react'

export default function HalftoneBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width: number, height: number
    let dots: Array<{
      x: number
      y: number
      baseSize: number
      phase: number
    }> = []
    let time = 0
    const dotSpacing = 8
    const maxDotSize = 4
    const waveSpeed = 0.008
    const waveAmplitude = 2
    let animationId: number

    function resize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initDots()
    }

    function initDots() {
      dots = []
      const cols = Math.ceil(width / dotSpacing)
      const rows = Math.ceil(height / dotSpacing)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * dotSpacing + dotSpacing / 2,
            y: j * dotSpacing + dotSpacing / 2,
            baseSize: 1,
            phase: (i + j) * 0.1
          })
        }
      }
    }

    // Define color palette
    const colors = [
      { r: 0, g: 0, b: 0 },         // #000000 - black
      { r: 30, g: 42, b: 68 },      // #1E2A44 - dark blue
      { r: 74, g: 144, b: 226 },    // #4A90E2 - bright blue
      { r: 211, g: 216, b: 224 },   // #D3D8E0 - light gray
      { r: 255, g: 255, b: 255 }    // #FFFFFF - white
    ]

    function lerp(start: number, end: number, t: number) {
      return start + (end - start) * t
    }

    function animate() {
      if (!ctx) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, width, height)

      time += waveSpeed

      dots.forEach(dot => {
        const distFromCenter = Math.sqrt(
          Math.pow(dot.x - width / 2, 2) + 
          Math.pow(dot.y - height / 2, 2)
        )

        // Create multiple wave patterns
        const wave1 = Math.sin(distFromCenter * 0.01 - time * 2 + dot.phase)
        const wave2 = Math.sin(dot.x * 0.01 + time * 3) * Math.cos(dot.y * 0.01 - time * 2)
        const wave3 = Math.sin(time * 4 + dot.phase * 2) * 0.3
        
        const combinedWave = (wave1 + wave2 * 0.5 + wave3) / 2.5
        
        // Calculate size based on waves and distance from center
        const centerFactor = 1 - (distFromCenter / (Math.max(width, height) * 0.7))
        const size = Math.max(0, 
          dot.baseSize + 
          combinedWave * waveAmplitude * Math.max(0, centerFactor)
        )

        // Color based on wave intensity and position
        const intensity = (combinedWave + 1) * 0.5
        
        // Map intensity to color palette
        let r: number, g: number, b: number, alpha: number
        const colorIndex = intensity * (colors.length - 1)
        const colorIndexFloor = Math.floor(colorIndex)
        const colorIndexCeil = Math.min(colorIndexFloor + 1, colors.length - 1)
        const t = colorIndex - colorIndexFloor
        
        // Interpolate between colors
        r = lerp(colors[colorIndexFloor].r, colors[colorIndexCeil].r, t)
        g = lerp(colors[colorIndexFloor].g, colors[colorIndexCeil].g, t)
        b = lerp(colors[colorIndexFloor].b, colors[colorIndexCeil].b, t)
        
        // Alpha based on intensity and size
        alpha = 0.3 + intensity * 0.7 + (size / maxDotSize) * 0.3

        // Apply size threshold for visibility
        if (size > 0.1) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`
          ctx.fill()
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    // Initialize
    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)
    resize()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10"
      style={{ 
        background: '#000000', 
        display: 'block',
        width: '100%', 
        height: '100%' 
      }}
      aria-hidden="true"
    />
  )
}