import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <aside className="sidebar">
      <h2>AI Store</h2>
      <nav className="nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          🏠 Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          📦 Products
        </NavLink>
        <NavLink to="/offers" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          🎁 Offers
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          🛒 Orders
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          👤 Profile
        </NavLink>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Logged in as {user?.username}</div>
        <button className="btn secondary" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  )
}
