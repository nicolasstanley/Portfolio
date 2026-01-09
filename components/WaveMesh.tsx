import React, { useState, useEffect, useRef } from 'react';

export default function WaveMesh() {
  const [time, setTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Fixed presets
  const amplitude = 0.10;
  const frequency = 2.0;

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setTime(t => t + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate 3D mesh for a wave surface with isometric projection
  const generateIsometricMesh = (amplitude: number, frequency: number, time: number) => {
    const gridSize = 25;
    const points = [];

    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        const x = (i / (gridSize - 1) - 0.5) * 2.5;
        const z = (j / (gridSize - 1) - 0.5) * 2.5;

        const distance = Math.sqrt(x * x + z * z);
        const y = amplitude * Math.sin(distance * frequency * Math.PI - time * 2);

        row.push({ x, y, z });
      }
      points.push(row);
    }

    const projectIsometric = (point: { x: number; y: number; z: number }) => {
      const scale = 140;
      const centerX = 400;
      const centerY = 300;
      const angle = Math.PI / 6;

      const screenX = centerX + (point.x - point.z) * Math.cos(angle) * scale;
      const screenY = centerY + (point.x + point.z) * Math.sin(angle) * scale - point.y * scale;

      return { x: screenX, y: screenY };
    };

    const projectedPoints = points.map(row => row.map(projectIsometric));

    const paths = [];

    for (let i = 0; i < gridSize; i++) {
      let pathData = '';
      for (let j = 0; j < gridSize; j++) {
        const p = projectedPoints[i][j];
        pathData += j === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
      }
      paths.push(pathData);
    }

    for (let j = 0; j < gridSize; j++) {
      let pathData = '';
      for (let i = 0; i < gridSize; i++) {
        const p = projectedPoints[i][j];
        pathData += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
      }
      paths.push(pathData);
    }

    return paths;
  };

  const meshPaths = generateIsometricMesh(amplitude, frequency, time);

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <g>
        {meshPaths.map((pathData, i) => (
          <path
            key={i}
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
        ))}
      </g>
    </svg>
  );
}
