import React from 'react'
import { useAuth } from '../auth'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      {user ? (
        <div>
          <div><strong>Username:</strong> {user.username}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
            This is a demo profile page. Extend with address, payment methods, etc.
          </div>
        </div>
      ) : (
        <div>No user loaded.</div>
      )}
    </div>
  )
}
