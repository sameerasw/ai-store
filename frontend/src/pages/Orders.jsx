import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingOrders, setDeletingOrders] = useState(new Set())

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (e) {
      console.error('Failed to fetch products:', e)
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch (e) {
      setError('Failed to load orders. Make sure you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return
    
    setDeletingOrders(prev => new Set([...prev, orderId]))
    try {
      await api.delete(`/orders/${orderId}`)
      setOrders(prev => prev.filter(order => order.id !== orderId))
    } catch (e) {
      setError('Failed to delete order. Please try again.')
    } finally {
      setDeletingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Your Orders</h2>
          <button className="btn" onClick={fetchOrders} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
        {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
      </div>

      {orders.length === 0 && !loading ? (
        <div className="card">No orders found.</div>
      ) : (
        <div className="grid">
          {orders.map((o) => {
            let items = []
            try { items = JSON.parse(o.products) } catch {}
            return (
              <div key={o.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Order #{o.id}</div>
                    <div>Status: <span className="badge info">📦 {o.status}</span></div>
                  </div>
                  <button 
                    className="btn danger"
                    onClick={() => deleteOrder(o.id)}
                    disabled={deletingOrders.has(o.id)}
                  >
                    {deletingOrders.has(o.id) ? '⏳ Removing...' : '🗑️ Remove'}
                  </button>
                </div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Placed: {o.created_at}</div>
                <div style={{ marginTop: 8 }}>
                  {items.map((it, idx) => {
                    const product = products.find(p => p.id === it.productId)
                    const productName = product ? product.name : `Product #${it.productId}`
                    return (
                      <div key={`${o.id}-${it.productId}-${idx}`} className="row" style={{ justifyContent: 'space-between' }}>
                        <div>{productName}</div>
                        <div>Qty: {it.qty}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
