// Loader - Paste this in your browser console
;(function () {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/science-lib/books@main'

  console.log('🚀 Loading...')

  const script = document.createElement('script')
  script.src = `${CDN_BASE}/main.js`
  script.onerror = () => {
    console.error('❌ Failed to load. Check your connection or CDN path.')
  }
  script.onload = () => {
    console.log('✅ Loaded successfully!')
  }

  document.head.appendChild(script)
})()
