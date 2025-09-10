import React from 'react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{product.name}</div>
      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>{product.description}</div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>${product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
        <button className="btn" onClick={() => onAdd?.(product)}>Add to Cart</button>
      </div>
    </div>
  )
}
