import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/offers')
      setOffers(data)
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Active Offers</h2>
          <button className="btn" onClick={fetchOffers} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>
      <div className="grid">
        {offers.map((o) => (
          <div key={o.id} className="card">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{o.title}</div>
            <div style={{ marginBottom: 8, opacity: 0.9 }}>{o.description}</div>
            <div style={{ color: '#9db2ff' }}>Save {o.discount_percent}%</div>
          </div>
        ))}
        {offers.length === 0 && !loading && (
          <div className="card">No active offers right now.</div>
        )}
      </div>
    </div>
  )
}
