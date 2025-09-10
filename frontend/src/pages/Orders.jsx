import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600 }}>Order #{o.id}</div>
                  <div>Status: <span style={{ color: '#9db2ff' }}>{o.status}</span></div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Placed: {o.created_at}</div>
                <div style={{ marginTop: 8 }}>
                  {items.map((it, idx) => (
                    <div key={idx} className="row" style={{ justifyContent: 'space-between' }}>
                      <div>Product #{it.productId}</div>
                      <div>Qty: {it.qty}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
