import React, { useEffect, useState } from 'react'
import { api } from '../api'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

export default function Products() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('') // empty = All
  const [tags, setTags] = useState('') // comma-separated
  const [loading, setLoading] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [message, setMessage] = useState('')
  
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    coupon,
    setCoupon,
    appliedCoupon,
    applyCoupon,
    subtotal,
    discount,
    tax,
    shipping,
    total
  } = useCart()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (q) params.q = q
      if (category) params.category = category
      if (tags) params.tags = tags
      const { data } = await api.get('/products', { params })
      setItems(data)
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch for products and to build category options
    fetchProducts()
    ;(async () => {
      try {
        const { data } = await api.get('/products')
        const cats = Array.from(new Set((data || []).map(p => p.category).filter(Boolean)))
        setCategories(cats)
      } catch (e) {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeOrder = async () => {
    if (cart.length === 0) return
    setOrdering(true)
    setMessage('')
    try {
      const items = cart.map(({ productId, qty }) => ({ productId, qty }))
      console.log('Placing order with items:', items)
      console.log('Auth headers:', api.defaults.headers.common)
      const { data } = await api.post('/orders', { items })
      clearCart()
      setMessage(`Order #${data.id} placed! Status: ${data.status}`)
    } catch (e) {
      console.error('Order placement error:', e.response?.data || e.message)
      if (e.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.')
      } else if (e.response?.status === 400) {
        setMessage('Invalid order data. Please check your cart.')
      } else {
        setMessage('Failed to place order. Please try again.')
      }
    } finally {
      setOrdering(false)
    }
  }


  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ flexWrap: 'wrap', gap: 12 }}>
          <input
            className="input"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key==='Enter' && fetchProducts()}
            style={{ flex: 2, minWidth: 220 }}
          />
          <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)} style={{ flex: 1, minWidth: 160 }}>
            <option value="">All Categories</option>
            {categories.map((c)=> (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e)=>setTags(e.target.value)}
            onKeyDown={(e) => e.key==='Enter' && fetchProducts()}
            style={{ flex: 1, minWidth: 220 }}
          />
          <button className="btn" onClick={fetchProducts} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</button>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: 16 }}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600 }}>Cart</div>
          <div>Total: ${total.toFixed(2)}</div>
        </div>
        {cart.length === 0 ? (
          <div style={{ opacity: 0.8, marginTop: 8 }}>No items in cart.</div>
        ) : (
          <div style={{ marginTop: 8 }}>
            {cart.map((x) => (
              <div key={x.productId} className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                <div>{x.product.name} × {x.qty}</div>
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn secondary" onClick={() => setCart((c)=>c.map(i=>i.productId===x.productId?{...i, qty: Math.max(1, i.qty-1)}:i))}>-</button>
                  <button className="btn secondary" onClick={() => setCart((c)=>c.map(i=>i.productId===x.productId?{...i, qty: i.qty+1}:i))}>+</button>
                  <button className="btn secondary" onClick={() => removeFromCart(x.productId)}>Remove</button>
                </div>
              </div>
            ))}

            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <input className="input" placeholder="Coupon (SAVE10, SAVE20, FREESHIP)" value={coupon} onChange={(e)=>setCoupon(e.target.value)} />
              <button className="btn secondary" onClick={applyCoupon}>Apply</button>
              {appliedCoupon && <div style={{ color: '#9db2ff' }}>Applied: {appliedCoupon}</div>}
            </div>

            <div style={{ marginTop: 8, fontSize: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>Subtotal</div>
                <div>${subtotal.toFixed(2)}</div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>Discount</div>
                <div>- ${discount.toFixed(2)}</div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>Tax (8%)</div>
                <div>${tax.toFixed(2)}</div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>Shipping</div>
                <div>${shipping.toFixed(2)}</div>
              </div>
              <hr style={{ borderColor: '#1c254a' }} />
              <div className="row" style={{ justifyContent: 'space-between', fontWeight: 600 }}>
                <div>Total</div>
                <div>${total.toFixed(2)}</div>
              </div>
            </div>

            <button className="btn" onClick={placeOrder} disabled={ordering}>
              {ordering ? 'Placing...' : 'Place Order'}
            </button>
            {message && <div style={{ marginTop: 8, color: '#9db2ff' }}>{message}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
