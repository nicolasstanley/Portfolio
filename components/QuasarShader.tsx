'use client'

import { useEffect, useRef } from 'react'

export default function QuasarShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0.5, y: 0.5, moved: false })
  const startTimeRef = useRef(Date.now())
  const clickedTimeRef = useRef(0)
  const massRef = useRef(0)
  const targetMassRef = useRef(1500)

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
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    // Fragment shader source - Black hole effect
    const fragmentShaderSource = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      #define PI 3.14159265359

      varying vec2 v_texCoord;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_mass;
      uniform float u_time;
      uniform float u_clickedTime;

      // Generate a procedural starfield background
      vec3 generateBackground(vec2 st) {
        vec3 color = vec3(0.0);
        
        // Create starfield
        vec2 starPos = st * 50.0;
        float star = 0.0;
        
        for(int i = 0; i < 20; i++) {
          vec2 offset = vec2(sin(float(i) * 43.0), cos(float(i) * 37.0)) * 25.0;
          vec2 starCoord = starPos + offset;
          float starDist = length(fract(starCoord) - 0.5);
          star += 0.01 / starDist;
        }
        
        // Nebula-like background
        vec2 nebula = st * 3.0 + u_time * 0.1;
        float n1 = sin(nebula.x * 2.0) * sin(nebula.y * 1.5);
        float n2 = sin(nebula.x * 3.0 + u_time * 0.2) * sin(nebula.y * 2.0 + u_time * 0.15);
        
        color += vec3(0.1, 0.05, 0.2) * (n1 + n2) * 0.5;
        color += vec3(0.05, 0.1, 0.3) * star;
        color += vec3(0.02, 0.01, 0.05); // Base space color
        
        return color;
      }

      vec2 rotate(vec2 mt, vec2 st, float angle) {
        float cos_a = cos((angle + u_clickedTime) * PI);
        float sin_a = sin(angle * 0.0);
        
        float nx = (cos_a * (st.x - mt.x)) + (sin_a * (st.y - mt.y)) + mt.x;
        float ny = (cos_a * (st.y - mt.y)) - (sin_a * (st.x - mt.x)) + mt.y;
        return vec2(nx, ny);
      }

      void main() {
        vec2 st = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_resolution;
        vec2 mt = vec2(u_mouse.x, u_resolution.y - u_mouse.y) / u_resolution;

        float dx = st.x - mt.x;
        float dy = st.y - mt.y;

        float dist = sqrt(dx * dx + dy * dy);
        float pull = u_mass / (dist * dist);
        
        vec3 color = vec3(0.0);
        
        vec2 r = rotate(mt, st, pull);
        vec3 bgColor = generateBackground(r);
        
        color = vec3(
          (bgColor.x - (pull * 0.25)),
          (bgColor.y - (pull * 0.25)), 
          (bgColor.z - (pull * 0.25))
        );

        gl_FragColor = vec4(color, 1.0);
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
    const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord')
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
    const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse')
    const massUniformLocation = gl.getUniformLocation(program, 'u_mass')
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time')
    const clickedTimeUniformLocation = gl.getUniformLocation(program, 'u_clickedTime')

    // Create position buffer
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    // Create texture coordinate buffer
    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    const texCoords = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

    // Mouse handling
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        moved: true
      }
    }

    const handleMouseDown = () => {
      clickedTimeRef.current += 0.03
    }

    const handleMouseUp = () => {
      // Mouse up handled in render loop
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)

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
    function render() {
      if (!canvas) return
      
      const currentTime = (Date.now() - startTimeRef.current) / 1000

      // Update mass with easing
      if (massRef.current < targetMassRef.current - 50) {
        massRef.current += (targetMassRef.current - massRef.current) * 0.03
      }

      // Auto-move mouse if not moved by user
      if (!mouseRef.current.moved) {
        mouseRef.current.y = (canvas.height / 2) + Math.sin(currentTime * 0.7) * (canvas.height * 0.25)
        mouseRef.current.x = (canvas.width / 2) + Math.sin(currentTime * 0.6) * -(canvas.width * 0.35)
      }

      // Gradually reduce clicked time
      if (clickedTimeRef.current > 0) {
        clickedTimeRef.current -= clickedTimeRef.current * 0.015
      }

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      // Setup position attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      // Setup texture coordinate attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
      gl.enableVertexAttribArray(texCoordAttributeLocation)
      gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      // Set uniforms
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)
      gl.uniform2f(mouseUniformLocation, mouseRef.current.x, mouseRef.current.y)
      gl.uniform1f(massUniformLocation, massRef.current * 0.00001)
      gl.uniform1f(timeUniformLocation, currentTime)
      gl.uniform1f(clickedTimeUniformLocation, clickedTimeRef.current)

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
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
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