import React from 'react'

export default function Logo({ size = 'medium' }) {
  const sizes = {
    small: { fontSize: '20px', iconSize: '24px' },
    medium: { fontSize: '28px', iconSize: '32px' },
    large: { fontSize: '36px', iconSize: '40px' }
  }

  const currentSize = sizes[size]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Logo Icon */}
      <div style={{
        width: currentSize.iconSize,
        height: currentSize.iconSize,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Inner glow effect */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          right: '2px',
          bottom: '2px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
          borderRadius: '6px'
        }} />
        
        {/* Lightning bolt icon */}
        <svg 
          width="60%" 
          height="60%" 
          viewBox="0 0 24 24" 
          fill="none" 
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path 
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1'
      }}>
        <span style={{
          fontSize: currentSize.fontSize,
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}>
          ZapMart
        </span>
        <span style={{
          fontSize: `${parseInt(currentSize.fontSize) * 0.35}px`,
          color: '#64748b',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: '-2px'
        }}>
          Smart Shopping
        </span>
      </div>
    </div>
  )
}
