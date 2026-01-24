'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

// 3D rotation matrix - moved outside component
const rotateY = (point: { x: number; y: number; z: number }, angle: number) => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos
  }
}

// Generate sphere - moved outside component to avoid recreation
const generateSphere = (time: number) => {
  const radius = 220
  const latitudes = 12
  const longitudes = 18

  const vertices: { x: number; y: number; z: number }[][] = []

  for (let lat = 0; lat <= latitudes; lat++) {
    const theta = (lat * Math.PI) / latitudes
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)

    const row: { x: number; y: number; z: number }[] = []
    for (let lon = 0; lon <= longitudes; lon++) {
      const phi = (lon * 2 * Math.PI) / longitudes
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)

      let point = {
        x: radius * sinTheta * cosPhi,
        y: radius * cosTheta,
        z: radius * sinTheta * sinPhi
      }

      point = rotateY(point, time * 0.5)
      row.push(point)
    }
    vertices.push(row)
  }

  const project = (point: { x: number; y: number; z: number }) => {
    const scale = 1.0
    const centerX = 300
    const centerY = 300
    const screenX = centerX + (point.x - point.z) * 0.866 * scale
    const screenY = centerY + (point.x + point.z) * 0.5 * scale - point.y * scale
    return { x: screenX, y: screenY, z: point.z }
  }

  const projected = vertices.map(row => row.map(project))

  const lines: { x1: number; y1: number; x2: number; y2: number; z: number; opacity: number }[] = []
  const dots: { x: number; y: number; z: number; r: number; opacity: number }[] = []

  const vx = 0.577, vy = 0.577, vz = 0.577

  // Generate latitude lines
  for (let lat = 0; lat <= latitudes; lat++) {
    for (let lon = 0; lon < longitudes; lon++) {
      const v1 = vertices[lat][lon]
      const v2 = vertices[lat][lon + 1]
      const p1 = projected[lat][lon]
      const p2 = projected[lat][lon + 1]

      const midX = (v1.x + v2.x) / 2
      const midY = (v1.y + v2.y) / 2
      const midZ3D = (v1.z + v2.z) / 2

      const length = Math.sqrt(midX * midX + midY * midY + midZ3D * midZ3D)
      const nx = midX / length, ny = midY / length, nz = midZ3D / length
      const facing = nx * vx + ny * vy + nz * vz
      const midZ = (p1.z + p2.z) / 2

      if (facing > -0.1) {
        const depthFactor = (midZ + radius) / (2 * radius)
        const baseFacing = Math.max(0, facing)
        const opacity = (0.4 + depthFactor * 0.4) * Math.pow(baseFacing, 0.3)
        if (opacity > 0.05) {
          lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, z: midZ, opacity })
        }
      }
    }
  }

  // Generate longitude lines
  for (let lon = 0; lon <= longitudes; lon++) {
    for (let lat = 0; lat < latitudes; lat++) {
      const v1 = vertices[lat][lon]
      const v2 = vertices[lat + 1][lon]
      const p1 = projected[lat][lon]
      const p2 = projected[lat + 1][lon]

      const midX = (v1.x + v2.x) / 2
      const midY = (v1.y + v2.y) / 2
      const midZ3D = (v1.z + v2.z) / 2

      const length = Math.sqrt(midX * midX + midY * midY + midZ3D * midZ3D)
      const nx = midX / length, ny = midY / length, nz = midZ3D / length
      const facing = nx * vx + ny * vy + nz * vz
      const midZ = (p1.z + p2.z) / 2

      if (facing > -0.1) {
        const depthFactor = (midZ + radius) / (2 * radius)
        const baseFacing = Math.max(0, facing)
        const opacity = (0.4 + depthFactor * 0.4) * Math.pow(baseFacing, 0.3)
        if (opacity > 0.05) {
          lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, z: midZ, opacity })
        }
      }
    }
  }

  // Generate dots
  for (let lat = 0; lat <= latitudes; lat++) {
    for (let lon = 0; lon <= longitudes; lon++) {
      const v = vertices[lat][lon]
      const p = projected[lat][lon]

      const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
      const nx = v.x / length, ny = v.y / length, nz = v.z / length
      const facing = nx * vx + ny * vy + nz * vz

      if (facing > -0.1) {
        const depthFactor = (p.z + radius) / (2 * radius)
        const baseFacing = Math.max(0, facing)
        const opacity = (0.6 + depthFactor * 0.4) * Math.pow(baseFacing, 0.3)
        if (opacity > 0.05) {
          dots.push({ x: p.x, y: p.y, z: p.z, r: 5, opacity })
        }
      }
    }
  }

  // Generate diagonal lines
  for (let lat = 0; lat < latitudes; lat++) {
    for (let lon = 0; lon < longitudes; lon++) {
      const v1 = vertices[lat][lon]
      const v2 = vertices[lat + 1][lon + 1]
      const p1 = projected[lat][lon]
      const p2 = projected[lat + 1][lon + 1]

      const midX = (v1.x + v2.x) / 2
      const midY = (v1.y + v2.y) / 2
      const midZ3D = (v1.z + v2.z) / 2

      const length = Math.sqrt(midX * midX + midY * midY + midZ3D * midZ3D)
      const nx = midX / length, ny = midY / length, nz = midZ3D / length
      const facing = nx * vx + ny * vy + nz * vz
      const midZ = (p1.z + p2.z) / 2

      if (facing > -0.1) {
        const depthFactor = (midZ + radius) / (2 * radius)
        const baseFacing = Math.max(0, facing)
        const opacity = (0.4 + depthFactor * 0.4) * Math.pow(baseFacing, 0.3)
        if (opacity > 0.05) {
          lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, z: midZ, opacity })
        }
      }
    }
  }

  lines.sort((a, b) => a.z - b.z)
  dots.sort((a, b) => a.z - b.z)

  return { lines, dots }
}

export default function WireSphere() {
  const [frame, setFrame] = useState(0)
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  // Animation loop - throttled to ~30fps
  useEffect(() => {
    let lastUpdate = 0
    const targetInterval = 33

    const animate = (timestamp: number) => {
      timeRef.current += 0.006

      if (timestamp - lastUpdate >= targetInterval) {
        lastUpdate = timestamp
        setFrame(f => f + 1)
      }

      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const { lines, dots } = useMemo(() => generateSphere(timeRef.current), [frame])

  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <g>
        {/* Draw lines */}
        {lines.map((line, i) => (
          <line
            key={`l${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#3b82f6"
            strokeWidth="2"
            opacity={line.opacity}
          />
        ))}

        {/* Draw dots */}
        {dots.map((dot, i) => (
          <circle
            key={`d${i}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill="#3b82f6"
            opacity={dot.opacity}
          />
        ))}
      </g>
    </svg>
  )
}
