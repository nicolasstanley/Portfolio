'use client'

import { useEffect, useRef } from 'react'

interface LiquidGlassProps {
  className?: string
  children?: React.ReactNode
}

export default function LiquidGlass({ className = '', children }: LiquidGlassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      // Fallback to CSS animation
      const fallback = document.createElement('div')
      fallback.className = 'absolute inset-0'
      fallback.style.background = 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(59,130,246,0.1))'
      fallback.style.animation = 'pulse 2s infinite'
      container.appendChild(fallback)
      return () => fallback.remove()
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    // Liquid Glass fragment shader based on the original repository
    const fragmentShaderSource = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      // Noise function
      float hash(vec2 p) {
        p = fract(p * vec2(5.3983, 5.4427));
        p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
        return fract(p.x * p.y * 95.4337);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p = p * 2.0 + vec2(0.1);
          amplitude *= 0.5;
        }
        return value;
      }
      
      vec2 distort(vec2 uv, float time) {
        vec2 p = uv + vec2(time * 0.2, time * 0.1);
        float n1 = fbm(p * 6.0);
        float n2 = fbm((p + vec2(n1)) * 4.0 + vec2(time * 0.3));
        return uv + vec2(n1, n2) * 0.05;
      }
      
      void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.8;
        
        // Apply liquid distortion
        vec2 distortedUV = distort(uv, time);
        
        // Create liquid caustics - more pronounced
        float caustic = 0.0;
        for (int i = 0; i < 4; i++) {
          float fi = float(i);
          vec2 p = distortedUV * (4.0 + fi * 2.0) + vec2(time * (1.0 + fi * 0.5));
          caustic += sin(length(p) * 8.0 - time * 3.0) * (1.0 / (1.0 + fi));
        }
        caustic = caustic * 0.6 + 0.4;
        
        // Glass refraction effect
        vec2 center = vec2(0.5);
        vec2 toCenter = center - distortedUV;
        float dist = length(toCenter);
        
        // Surface normal simulation
        vec2 normal = normalize(vec2(
          fbm(distortedUV * 8.0 + vec2(time)) - fbm(distortedUV * 8.0 + vec2(time + 0.01, 0.0)),
          fbm(distortedUV * 8.0 + vec2(0.0, time)) - fbm(distortedUV * 8.0 + vec2(0.0, time + 0.01))
        ));
        
        // Fresnel effect
        float fresnel = pow(1.0 - abs(dot(normal, vec2(0.0, 1.0))), 2.0);
        
        // Color composition - very visible liquid glass
        vec3 baseColor = vec3(0.85, 0.9, 1.0);
        vec3 tint = vec3(0.3, 0.6, 1.0);
        vec3 highlight = vec3(1.0, 1.0, 1.0);
        
        vec3 color = mix(baseColor, tint, caustic * 0.7);
        color = mix(color, highlight, fresnel * 0.4);
        
        // Add animated shimmer
        float shimmer = sin(time * 4.0 + uv.x * 10.0) * 0.1 + 0.9;
        color *= shimmer;
        
        // Very visible transparency with animation
        float alpha = 0.7 + fresnel * 0.2 + caustic * 0.15 + sin(time * 2.0) * 0.05;
        alpha = clamp(alpha, 0.5, 0.95);
        
        gl_FragColor = vec4(color, alpha);
      }
    `

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) return null
      
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      
      return shader
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram()
      if (!program) return null
      
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }
      
      return program
    }

    // Create shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    
    if (!vertexShader || !fragmentShader) return
    
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')

    // Set up attributes
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0)
    
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8)

    let animationId: number
    let startTime = Date.now()

    function resize() {
      if (!canvas || !container) return
      
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      gl.viewport(0, 0, canvas.width, canvas.height)
      console.log(`LiquidGlass: Canvas resized to ${canvas.width}x${canvas.height}`)
    }

    function render() {
      if (!gl || !program) return
      
      const currentTime = (Date.now() - startTime) / 1000
      
      gl.useProgram(program)
      gl.uniform1f(timeLocation, currentTime)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      
      // Enable blending for transparency
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      animationId = requestAnimationFrame(render)
    }

    // Set up resize observer
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    
    resize()
    render()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      resizeObserver.disconnect()
      
      // Cleanup WebGL resources
      if (gl) {
        gl.deleteProgram(program)
        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)
        gl.deleteBuffer(buffer)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'normal', opacity: 0.8 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}