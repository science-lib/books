# Unblockable

A browser console-loaded web application that replaces page content.

## Usage

Copy the code below and paste it into any browser console:

```javascript
(function() {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/science-lib/books@main';

  console.log('🚀 Loading Books...');

  const script = document.createElement('script');
  script.src = `${CDN_BASE}/main.js`;
  script.onerror = () => {
    console.error('❌ Failed to load Books. Check your connection or CDN path.');
  };
  script.onload = () => {
    console.log('✅ Books loaded successfully!');
  };

  document.head.appendChild(script);
})();
```

Or use the pre-made loader:

1. Open any website
2. Open browser console (F12 or Cmd+Option+J / Ctrl+Shift+J)
3. Copy contents of `loader.js` from this repo
4. Paste and press Enter
5. Watch the magic happen! ✨

## How it works

1. **Loader** - Loads main script from jsDelivr CDN
2. **Main Script** - Fetches HTML content and replaces the document
3. **Content** - Custom HTML page displayed to user

## Files

- `loader.js` - Console snippet for easy loading
- `main.js` - Main application logic

## CDN

This project uses [jsDelivr](https://www.jsdelivr.com/) CDN for fast global delivery.

URL: `https://cdn.jsdelivr.net/gh/science-lib/books@main/`

## Notes

- Requires modern browser (ES6+ support)
- Works on any webpage
- Simple error handling included
