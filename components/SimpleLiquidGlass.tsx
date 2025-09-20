'use client'

interface SimpleLiquidGlassProps {
  className?: string
  children?: React.ReactNode
}

export default function SimpleLiquidGlass({ className = '', children }: SimpleLiquidGlassProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Test background - very visible */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 animate-pulse"
        style={{
          backgroundSize: '200% 200%',
          animation: 'wave 3s ease-in-out infinite'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 bg-white/60 backdrop-blur-sm">
        {children}
      </div>
      
      <style jsx>{`
        @keyframes wave {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}