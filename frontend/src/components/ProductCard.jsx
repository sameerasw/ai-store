import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  const navigate = useNavigate()

  const handleCardClick = (e) => {
    // Don't navigate if the user clicked on the "Add to Cart" button
    if (e.target.tagName === 'BUTTON') return
    navigate(`/product/${product.id}`)
  }

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
          Add to Cart
        </button>
      </div>
    </div>
  )
}
