// Lightweight API smoke script (read-only by default)
// Usage: node scripts/api-smoke.js
// Env:
//   BACKEND_URL (default http://localhost:4000)
//   USERNAME (default user)
//   PASSWORD (default user123)
//   ALLOW_MUTATION (optional: 'true' to allow order creation test)

const base = process.env.BACKEND_URL || 'http://localhost:4000'
const username = process.env.USERNAME || 'user'
const password = process.env.PASSWORD || 'user123'
const allowMutation = String(process.env.ALLOW_MUTATION || 'false').toLowerCase() === 'true'

async function main() {
  console.log('API Smoke against', base)

  // Health
  let r = await fetch(base + '/')
  console.log('GET / ->', r.status)
  const health = await r.json()
  if (!health || health.status !== 'ok') throw new Error('Health check failed')

  // Products
  r = await fetch(base + '/products')
  console.log('GET /products ->', r.status)
  const products = await r.json()
  if (!Array.isArray(products)) throw new Error('Products should be an array')

  // Offers
  r = await fetch(base + '/offers')
  console.log('GET /offers ->', r.status)
  const offers = await r.json()
  if (!Array.isArray(offers)) throw new Error('Offers should be an array')

  // Login
  r = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  console.log('POST /auth/login ->', r.status)
  if (r.status !== 200) throw new Error('Login failed')
  const auth = await r.json()
  const token = auth.token
  if (!token) throw new Error('No token from login')

  // My Orders
  r = await fetch(base + '/orders', { headers: { Authorization: 'Bearer ' + token } })
  console.log('GET /orders ->', r.status)
  const myOrders = await r.json()
  if (!Array.isArray(myOrders)) throw new Error('Orders should be an array')

  if (allowMutation) {
    const item = products && products[0]
    if (item) {
      r = await fetch(base + '/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ items: [{ productId: item.id, qty: 1 }] })
      })
      console.log('POST /orders ->', r.status)
      if (r.status !== 201) throw new Error('Create order failed')
    } else {
      console.log('No products found; skipping order creation')
    }
  }

  console.log('Smoke OK')
}

main().catch((e) => {
  console.error('Smoke FAILED:', e.message)
  process.exit(1)
})
