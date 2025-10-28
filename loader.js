// Unblockable Loader - Paste this in your browser console
(function() {
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/science-lib/books@main';

  console.log('🚀 Loading Unblockable...');

  const script = document.createElement('script');
  script.src = `${CDN_BASE}/main.js`;
  script.onerror = () => {
    console.error('❌ Failed to load Unblockable. Check your connection or CDN path.');
  };
  script.onload = () => {
    console.log('✅ Unblockable loaded successfully!');
  };

  document.head.appendChild(script);
})();
