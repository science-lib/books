// Main Script
;(async function () {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/science-lib/books@main'

  // Create global namespace
  window.unblockable = {
    CDN_BASE,

    // Load books list view
    async loadBooksList() {
      try {
        // Cleanup any blob URLs from previous book
        this._cleanupBlobUrl()

        console.log('📚 Loading books list...')
        const response = await fetch(`${CDN_BASE}/books-list.html`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const html = await response.text()
        document.body.innerHTML = html

        // Now load books data and populate grid
        await this._loadBooksData()

        console.log('✅ Books list loaded!')
      } catch (error) {
        console.error('❌ Error loading books list:', error.message)
        this.showError('Failed to load books list', error.message)
      }
    },

    // Load books data from JSON and render
    async _loadBooksData() {
      try {
        console.log('📥 Fetching books data...')
        const response = await fetch(`${CDN_BASE}/books.json`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const books = await response.json()

        // Store books data for filtering
        this._allBooks = books

        // Render all books initially
        this._renderBooks(books)

        // Setup search functionality
        this._setupSearch()

        console.log(`✅ Loaded ${books.length} books`)
      } catch (error) {
        console.error('❌ Error loading books data:', error.message)
        const grid = document.getElementById('booksGrid')
        if (grid) {
          grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #ff6b6b;">
              <p>Failed to load books</p>
              <p style="font-size: 0.875rem; margin-top: 0.5rem;">${error.message}</p>
            </div>
          `
        }
      }
    },

    // Render books into grid
    _renderBooks(books) {
      const grid = document.getElementById('booksGrid')
      if (!grid) {
        console.error('❌ Books grid element not found')
        return
      }

      // Clear grid
      grid.innerHTML = ''

      // Check if there are no books
      if (books.length === 0) {
        grid.innerHTML = '<div class="no-results">No books found matching your search</div>'
        return
      }

      // Create book cards
      books.forEach((book) => {
        const card = document.createElement('div')
        card.className = 'book-card'
        card.onclick = () => this.loadBook(book.id, book.title, book.url)

        card.innerHTML = `
          <img src="${book.cover}" alt="${book.title}" class="book-cover" />
          <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-description">${book.description}</div>
          </div>
        `

        grid.appendChild(card)
      })
    },

    // Setup search functionality
    _setupSearch() {
      const searchInput = document.getElementById('searchInput')
      if (!searchInput) {
        console.warn('⚠️ Search input not found')
        return
      }

      // Add input event listener for real-time search
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim()

        // Filter books based on query
        const filteredBooks = this._allBooks.filter((book) => {
          const titleMatch = book.title.toLowerCase().includes(query)
          const descriptionMatch = book.description.toLowerCase().includes(query)
          return titleMatch || descriptionMatch
        })

        // Render filtered books
        this._renderBooks(filteredBooks)
      })
    },

    // Load book view
    async loadBook(bookId, bookTitle, bookUrl) {
      try {
        // Cleanup any blob URLs from previous book
        this._cleanupBlobUrl()

        console.log(`📖 Loading book: ${bookTitle}`)

        // Fetch book view template
        const templateResponse = await fetch(`${CDN_BASE}/book-view.html`)
        if (!templateResponse.ok) {
          throw new Error(`Template HTTP ${templateResponse.status}: ${templateResponse.statusText}`)
        }

        let html = await templateResponse.text()

        // Replace placeholders
        html = html.replace(/\{\{BOOK_TITLE\}\}/g, bookTitle)

        // Set the view first
        document.body.innerHTML = html

        // Now fetch the book content and create blob URL
        console.log('📥 Fetching book content...')
        const bookResponse = await fetch(bookUrl)
        if (!bookResponse.ok) {
          throw new Error(`Book HTTP ${bookResponse.status}: ${bookResponse.statusText}`)
        }

        let bookHtml = await bookResponse.text()

        // Replace Google Analytics ID
        bookHtml = bookHtml.replace(/G-7FN7LEVWXD/g, 'G-VZ7L6LF7YK')

        // Create blob with proper content-type
        const blob = new Blob([bookHtml], { type: 'text/html' })
        const blobUrl = URL.createObjectURL(blob)

        // Set iframe src to blob URL
        const iframe = document.getElementById('bookFrame')
        if (iframe) {
          iframe.onload = () => {
            const loading = document.getElementById('loading')
            if (loading) loading.style.display = 'none'
            console.log('✅ Book loaded!')
          }
          iframe.onerror = () => {
            console.error('❌ Failed to load book in iframe')
            const loading = document.getElementById('loading')
            if (loading) {
              loading.innerHTML = '<div style="color: #ff6b6b;">Failed to load book</div>'
            }
          }
          iframe.src = blobUrl
        }

        // Store blob URL for cleanup (optional)
        this._currentBlobUrl = blobUrl
      } catch (error) {
        console.error('❌ Error loading book:', error.message)
        this.showError('Failed to load book', error.message)
      }
    },

    // Cleanup blob URL when switching views
    _cleanupBlobUrl() {
      if (this._currentBlobUrl) {
        URL.revokeObjectURL(this._currentBlobUrl)
        this._currentBlobUrl = null
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
    },
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

    // Now load the books data
    await window.unblockable._loadBooksData()
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
        <title>Error</title>
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
