// Unblockable Main Script
;(async function () {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/science-lib/books@main'

  try {
    console.log('🎯 Fetching content...')

    const response = await fetch(`${CDN_BASE}/content.html`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Replace entire document
    document.open()
    document.write(html)
    document.close()

    console.log('✨ Content loaded!')
  } catch (error) {
    console.error('❌ Error loading content:', error.message)

    // Fallback error page
    document.open()
    document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Unblockable</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .error-container {
            padding: 2rem;
          }
          h1 {
            font-size: 3rem;
            margin: 0 0 1rem 0;
          }
          p {
            font-size: 1.2rem;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>⚠️ Oops!</h1>
          <p>Failed to load content.</p>
          <p style="font-size: 0.9rem; margin-top: 2rem;">${error.message}</p>
        </div>
      </body>
      </html>
    `)
    document.close()
  }
})()
