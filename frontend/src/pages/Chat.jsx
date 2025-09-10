import React, { useState } from 'react'
import { api } from '../api'
import ProductCard from '../components/ProductCard'

export default function Chat() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! Ask me for products by keyword, category, or tag.' }])
  const [input, setInput] = useState('wireless headphones')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setLoading(true)
    try {
      const { data } = await api.post('/chat', { message: input })
      setMessages((m) => [...m, { role: 'assistant', text: data.reply }])
      setResults(data.products || [])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ margin: '8px 0', color: m.role === 'user' ? '#e7e9ee' : '#9db2ff' }}>
              <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong> {m.text}
            </div>
          ))}
        </div>
        <div className="row">
          <input
            className="input"
            placeholder="Ask for a product..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="btn" onClick={send} disabled={loading}>{loading ? 'Searching...' : 'Send'}</button>
        </div>
      </div>

      <div className="grid">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => {}} />
        ))}
      </div>
    </div>
  )
}
