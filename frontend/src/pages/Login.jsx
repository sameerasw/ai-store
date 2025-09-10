import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('user123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (e) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form className="card" onSubmit={onSubmit} style={{ width: 360 }}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Sign in</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: '#ff6b6b', marginBottom: 12 }}>{error}</div>}
        <button className="btn" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 12 }}>
          Try admin/admin123 for admin access
        </div>
      </form>
    </div>
  )
}
