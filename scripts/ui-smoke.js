// Lightweight UI smoke script
// Usage: node scripts/ui-smoke.js
// Env: FRONTEND_URL (default http://localhost:5173)

const base = process.env.FRONTEND_URL || 'http://localhost:5173'

async function main() {
  console.log('UI Smoke against', base)
  const r = await fetch(base)
  console.log('GET / ->', r.status)
  if (r.status !== 200) throw new Error('Frontend not reachable')
  const html = await r.text()
  if (!html || !html.includes('<div id="root"></div>')) {
    console.warn('Warning: expected root div not found; page may still be OK depending on build')
  }
  console.log('UI Smoke OK')
}

main().catch((e) => {
  console.error('UI Smoke FAILED:', e.message)
  process.exit(1)
})
