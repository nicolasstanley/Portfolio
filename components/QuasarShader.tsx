'use client'

import { useEffect, useRef } from 'react'

export default function QuasarShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.warn('WebGL not supported')
      return
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader source - "Quasar 2" shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      // Custom tanh implementation for WebGL compatibility
      vec4 tanh_vec4(vec4 x) {
        vec4 e2x = exp(2.0 * x);
        return (e2x - 1.0) / (e2x + 1.0);
      }
      
      void main() {
        vec2 FC = gl_FragCoord.xy;
        vec2 r = u_resolution;
        float t = u_time * 0.5;
        vec4 o = vec4(0.0);
        
        for(float i = 0.0; i < 70.0; i += 1.0) {
          float z = 0.0;
          float d = 1.0;
          float s = 0.0;
          
          vec3 p = z * normalize(vec3(FC.xy * 2.0 - r.xy, r.y));
          vec3 a = vec3(0.0);
          p.z += 9.0;
          
          a = mix((a - 0.57) * dot(a - 0.57, p), p, cos(s - t)) - sin(s) * cross(a, p);
          s = sqrt(length(a.xz - a.y));
          
          for(float j = 1.0; j < 9.0; j += 1.0) {
            a += sin(a * j - t).yzx / j;
          }
          
          d = length(sin(a) + dot(a, a / max(a, vec3(0.001))) * 0.2) * s / 20.0;
          z += d;
          
          if(d > 0.0) {
            o += vec4(z, 2.0, s, 1.0) / (s + 0.001) / (d + 0.001);
          }
        }
        
        o = tanh_vec4(o / 2000.0);
        gl_FragColor = vec4(o.rgb, 1.0);
      }
    `

    // Create shader function
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
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

    // Create program function
    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
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

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    
    if (!vertexShader || !fragmentShader) return

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time')

    // Create buffer
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Put a full screen quad in the buffer
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    // Resize canvas
    function resizeCanvas() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Render function
    function render(time: number) {
      if (!canvas) return
      
      time *= 0.001 // Convert to seconds

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)
      gl.uniform1f(timeUniformLocation, time)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animationRef.current = requestAnimationFrame(render)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(render)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#000' }}
    />
  )
}