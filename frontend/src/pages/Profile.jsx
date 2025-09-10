import React, { useState } from 'react'
import { useAuth } from '../auth'
import { api } from '../api'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Validate password change if attempted
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to change password')
          return
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match')
          return
        }
        if (formData.newPassword.length < 6) {
          setError('New password must be at least 6 characters long')
          return
        }
      }

      const updateData = {
        username: formData.username,
        email: formData.email
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await api.put('/auth/profile', updateData)
      
      // Update user context with new data
      if (response.data.user) {
        updateUser(response.data.user)
      }
      
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

    } catch (e) {
      if (e.response?.status === 401) {
        setError('Current password is incorrect')
      } else if (e.response?.status === 409) {
        setError('Username already exists')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getAvatarInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'U'
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e53e3e'
      case 'user': return '#38a169'
      default: return '#4a5568'
    }
  }

  if (!user) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Profile</h2>
        <div>No user loaded.</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Profile Header */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            {getAvatarInitials(user.username)}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              {user.username}
            </h2>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              background: `${getRoleColor(user.role)}20`,
              color: getRoleColor(user.role),
              marginBottom: '8px'
            }}>
              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Member since {new Date().getFullYear()}
            </div>
          </div>

          {/* Edit Button */}
          <button
            className="btn secondary"
            onClick={() => setIsEditing(!isEditing)}
            style={{ alignSelf: 'flex-start' }}
          >
            {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      {isEditing ? (
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 24 }}>Edit Profile</h3>
          
          <form onSubmit={handleProfileUpdate}>
            {/* Username */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Username
              </label>
              <input
                className="input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Email
              </label>
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>

            {/* Password Change Section */}
            <div style={{ 
              padding: '20px', 
              background: '#f8fafc', 
              borderRadius: '12px', 
              marginBottom: 20,
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#4a5568' }}>Change Password</h4>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Current Password
                </label>
                <input
                  className="input"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  New Password
                </label>
                <input
                  className="input"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Confirm New Password
                </label>
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="badge" style={{ 
                marginBottom: 16, 
                background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
                color: '#742a2a',
                width: '100%',
                textAlign: 'center'
              }}>
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="badge success" style={{ 
                marginBottom: 16,
                width: '100%',
                textAlign: 'center'
              }}>
                ✅ {message}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="btn success"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? '⏳ Updating...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Profile Display */
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>Account Information</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>Username:</span>
              <span>{user.username}</span>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>Email:</span>
              <span>{user.email || 'Not provided'}</span>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>Account Type:</span>
              <span style={{ 
                color: getRoleColor(user.role),
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {user.role}
              </span>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0'
            }}>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>Member Since:</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Account Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="btn danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out?')) {
                logout()
              }
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
