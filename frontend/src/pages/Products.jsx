import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('') // empty = All
  const [tags, setTags] = useState('') // comma-separated
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState([]) // [{productId, qty, product}]
  const [ordering, setOrdering] = useState(false)
  const [message, setMessage] = useState('')
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

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
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

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
    // Load cart from localStorage if present
    try {
      const raw = localStorage.getItem('cart')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setCart(parsed)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addToCart = (product) => {
    setCart((c) => {
      const idx = c.findIndex((x) => x.productId === product.id)
      if (idx >= 0) {
        const copy = [...c]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [...c, { productId: product.id, qty: 1, product }]
    })
  }

  const removeFromCart = (productId) => setCart((c) => c.filter((x) => x.productId !== productId))

  const subtotal = useMemo(() => cart.reduce((s, x) => s + x.product.price * x.qty, 0), [cart])
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0
    const code = appliedCoupon.toUpperCase()
    if (code === 'SAVE10') return subtotal * 0.1
    if (code === 'SAVE20') return subtotal * 0.2
    return 0
  }, [appliedCoupon, subtotal])
  const afterDiscount = Math.max(0, subtotal - discount)
  const tax = useMemo(() => afterDiscount * 0.08, [afterDiscount]) // 8% tax
  const shipping = useMemo(() => {
    const code = (appliedCoupon || '').toUpperCase()
    if (code === 'FREESHIP' || afterDiscount >= 100) return 0
    return cart.length > 0 ? 5 : 0
  }, [appliedCoupon, afterDiscount, cart.length])
  const total = afterDiscount + tax + shipping

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (!code) return setAppliedCoupon(null)
    const valid = ['SAVE10', 'SAVE20', 'FREESHIP']
    if (valid.includes(code)) setAppliedCoupon(code)
    else setAppliedCoupon(null)
  }

  const placeOrder = async () => {
    if (cart.length === 0) return
    setOrdering(true)
    setMessage('')
    try {
      const items = cart.map(({ productId, qty }) => ({ productId, qty }))
      const { data } = await api.post('/orders', { items })
      setCart([])
      setAppliedCoupon(null)
      setCoupon('')
      setMessage(`Order #${data.id} placed! Status: ${data.status}`)
    } catch (e) {
      setMessage('Failed to place order (are you logged in?)')
    } finally {
      setOrdering(false)
    }
  }

  // Persist cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

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
