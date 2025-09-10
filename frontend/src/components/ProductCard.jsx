import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  const navigate = useNavigate()

  // Sample product images - same as ProductDetail page
  const sampleImages = {
    1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    2: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    3: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    4: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    5: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
    default: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop'
  }

  const handleCardClick = (e) => {
    // Don't navigate if the user clicked on the "Add to Cart" button
    if (e.target.tagName === 'BUTTON') return
    navigate(`/product/${product.id}`)
  }

  const productImage = sampleImages[product.id] || sampleImages.default

  return (
    <div 
      className="card" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(157, 178, 255, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <img 
        src={productImage} 
        alt={product.name}
        style={{ 
          width: '100%', 
          height: '200px', 
          objectFit: 'cover', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '12px'
        }}
      />
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{product.name}</div>
      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>{product.description}</div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>${product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
        <button 
          className="btn" 
          onClick={(e) => {
            e.stopPropagation()
            onAdd?.(product)
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  )
}
