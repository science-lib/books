// Unblockable Main Script
;(async function () {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/science-lib/books@main'

  // Create global namespace
  window.unblockable = {
    CDN_BASE,

    // Load books list view
    async loadBooksList() {
      try {
        console.log('📚 Loading books list...')
        const response = await fetch(`${CDN_BASE}/books-list.html`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const html = await response.text()
        document.body.innerHTML = html
        console.log('✅ Books list loaded!')
      } catch (error) {
        console.error('❌ Error loading books list:', error.message)
        this.showError('Failed to load books list', error.message)
      }
    },

    // Load book view
    async loadBook(bookId, bookTitle, bookUrl) {
      try {
        console.log(`📖 Loading book: ${bookTitle}`)
        const response = await fetch(`${CDN_BASE}/book-view.html`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        let html = await response.text()

        // Replace placeholders
        html = html.replace(/\{\{BOOK_TITLE\}\}/g, bookTitle)
        html = html.replace(/\{\{BOOK_URL\}\}/g, bookUrl)

        document.body.innerHTML = html
        console.log('✅ Book loaded!')
      } catch (error) {
        console.error('❌ Error loading book:', error.message)
        this.showError('Failed to load book', error.message)
      }
    },

    // Show error message
    showError(title, message) {
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-align: center;
          padding: 2rem;
        ">
          <div>
            <h1 style="font-size: 3rem; margin: 0 0 1rem 0;">⚠️ ${title}</h1>
            <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem;">${message}</p>
            <button
              onclick="window.unblockable.loadBooksList()"
              style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid white;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
              "
            >
              Try Again
            </button>
          </div>
        </div>
      `
    }
  }

  // Initial load - show books list
  try {
    console.log('🚀 Starting Unblockable...')

    const response = await fetch(`${CDN_BASE}/books-list.html`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Replace entire document
    document.open()
    document.write(html)
    document.close()

    console.log('✨ Unblockable ready!')
  } catch (error) {
    console.error('❌ Error loading Unblockable:', error.message)

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
