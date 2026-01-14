'use client'

import { useEffect, useRef, useState } from 'react'
import { Connection } from '@solana/web3.js'
import Link from 'next/link'

const COLORS: Record<string, string> = {
  transfer: '#14F195',
  vote: '#9945FF',
  stake: '#19FB9B',
  swap: '#FFB84D',
  nft: '#FF6B9D'
}

const MAX_PARTICLES = 150

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  type: string
  lifetime: number
  age: number
  canvasWidth: number
  canvasHeight: number

  constructor(type: string, canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 4
    this.vy = (Math.random() - 0.5) * 4
    this.size = Math.random() * 2 + 1
    this.color = COLORS[type] || COLORS.transfer
    this.type = type
    this.lifetime = 5000
    this.age = 0
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  update(deltaTime: number) {
    this.age += deltaTime
    this.vx *= 0.98
    this.vy *= 0.98
    this.x += this.vx
    this.y += this.vy

    if (this.x <= 0 || this.x >= this.canvasWidth) {
      this.vx *= -0.8
      this.x = Math.max(0, Math.min(this.canvasWidth, this.x))
    }
    if (this.y <= 0 || this.y >= this.canvasHeight) {
      this.vy *= -0.8
      this.y = Math.max(0, Math.min(this.canvasHeight, this.y))
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const fadeStart = this.lifetime - 1000
    let opacity = 1
    if (this.age > fadeStart) {
      opacity = 1 - (this.age - fadeStart) / 1000
    }

    ctx.globalCompositeOperation = 'lighter'

    // Parse the particle color to RGB for glow layers
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 }
    }
    const rgb = hexToRgb(this.color)

    // Outer glow - darker version of particle color
    const outerGlow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 4
    )
    outerGlow.addColorStop(0, `rgba(${rgb.r * 0.5}, ${rgb.g * 0.5}, ${rgb.b * 0.5}, 0.2)`)
    outerGlow.addColorStop(0.3, `rgba(${rgb.r * 0.3}, ${rgb.g * 0.3}, ${rgb.b * 0.3}, 0.1)`)
    outerGlow.addColorStop(0.6, `rgba(${rgb.r * 0.2}, ${rgb.g * 0.2}, ${rgb.b * 0.2}, 0.05)`)
    outerGlow.addColorStop(1, 'transparent')

    ctx.globalAlpha = opacity
    ctx.fillStyle = outerGlow
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
    ctx.fill()

    // Middle glow - particle color
    const middleGlow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 2
    )
    middleGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`)
    middleGlow.addColorStop(0.4, `rgba(${rgb.r * 0.8}, ${rgb.g * 0.8}, ${rgb.b * 0.8}, 0.3)`)
    middleGlow.addColorStop(0.7, `rgba(${rgb.r * 0.5}, ${rgb.g * 0.5}, ${rgb.b * 0.5}, 0.15)`)
    middleGlow.addColorStop(1, 'transparent')

    ctx.globalAlpha = opacity
    ctx.fillStyle = middleGlow
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
    ctx.fill()

    // Inner bright core - white center fading to particle color
    const coreGlow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    )
    coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    coreGlow.addColorStop(0.3, `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)}, 0.6)`)
    coreGlow.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`)
    coreGlow.addColorStop(1, 'transparent')

    ctx.globalAlpha = opacity
    ctx.fillStyle = coreGlow
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  isDead() {
    return this.age >= this.lifetime
  }
}

export default function SolanaPulseViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef(Date.now())
  const lastTpsUpdateRef = useRef(Date.now())
  const transactionCountRef = useRef(0)

  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [tps, setTps] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)

  const detectTransactionType = (logs: string[] | undefined): string => {
    if (!logs || !Array.isArray(logs)) return 'transfer'

    const logString = logs.join(' ').toLowerCase()

    if (logString.includes('vote')) return 'vote'
    if (logString.includes('stake')) return 'stake'
    if (logString.includes('swap')) return 'swap'
    if (logString.includes('mint')) return 'nft'

    return 'transfer'
  }

  const addParticle = (type: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const particle = new Particle(type, canvas.width, canvas.height)
    particlesRef.current.push(particle)

    if (particlesRef.current.length > MAX_PARTICLES) {
      particlesRef.current.shift()
    }

    transactionCountRef.current++
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const now = Date.now()
    const deltaTime = now - lastTimeRef.current
    lastTimeRef.current = now

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach(particle => {
      particle.update(deltaTime)
      particle.draw(ctx)
    })

    particlesRef.current = particlesRef.current.filter(p => !p.isDead())

    if (now - lastTpsUpdateRef.current >= 1000) {
      const currentTps = transactionCountRef.current
      setTps(currentTps)
      setTotalTransactions(prev => prev + currentTps)
      transactionCountRef.current = 0
      lastTpsUpdateRef.current = now
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    animate()

    const connection = new Connection('https://api.devnet.solana.com', {
      wsEndpoint: 'wss://api.devnet.solana.com',
      commitment: 'confirmed'
    })

    let subscriptionId: number | undefined

    const setupConnection = async () => {
      try {
        subscriptionId = connection.onLogs(
          'all',
          (logs) => {
            const type = detectTransactionType(logs.logs)
            addParticle(type)
          },
          'confirmed'
        )

        setConnectionStatus('✓ Connected')

        connection.onSlotChange(() => {})
      } catch {
        setConnectionStatus('Connection Failed')
      }
    }

    setupConnection()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (subscriptionId !== undefined) {
        connection.removeOnLogsListener(subscriptionId)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ background: '#000000' }}
      />

      {/* Content container aligned with navbar */}
      <div className="absolute inset-0 pointer-events-none">
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

            {/* Stats panel */}
            <div className="pointer-events-auto absolute top-48 left-0 bg-black/70 backdrop-blur-lg p-5 rounded-lg text-white font-sans text-sm min-w-[250px]">
              <h1 className="text-2xl mb-4 text-[#14F195] font-bold">
                Solana Live
              </h1>

              <div className="mb-3">
                <div className="text-gray-400 text-xs">TPS (Transactions/sec)</div>
                <div className="text-3xl text-[#14F195] font-bold">
                  {tps}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-gray-400 text-xs">Total Transactions</div>
                <div className="text-xl text-white">
                  {totalTransactions.toLocaleString()}
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="text-gray-400 text-xs mb-2">
                  Transaction Types
                </div>
                {Object.entries(COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center mb-1.5">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        background: color,
                        boxShadow: `0 0 8px ${color}`
                      }}
                    />
                    <span className="capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-right status badge */}
            <div
              className="pointer-events-auto absolute top-32 right-0 backdrop-blur-lg py-3 px-5 rounded-full font-sans text-sm cursor-default"
              style={{
                background: connectionStatus === '✓ Connected'
                  ? 'rgba(20, 241, 149, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: connectionStatus === '✓ Connected' ? '#14F195' : '#fff',
                border: connectionStatus === '✓ Connected'
                  ? '1px solid rgba(20, 241, 149, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {connectionStatus}
            </div>

            {/* Bottom-right info */}
            <div className="pointer-events-auto absolute bottom-5 right-0 bg-black/70 backdrop-blur-lg py-4 px-5 rounded-lg text-gray-400 font-sans text-base max-w-[400px] leading-relaxed">
              Each particle represents a real-time transaction on the Solana blockchain.
              Colors indicate transaction types. Watch the network pulse in real-time.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
