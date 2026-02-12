import { useState, useEffect } from 'react';

export default function App() {
  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [scale, setScale] = useState(1);

  // Calculate scale based on viewport height
  useEffect(() => {
    const calculateScale = () => {
      const viewportHeight = window.innerHeight;
      const prototypeHeight = 844; // iPhone 14 height
      const newScale = viewportHeight / prototypeHeight;
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert Figma prototype URL to embed URL if needed
    let url = prototypeUrl.trim();
    
    // If it's a regular Figma URL, convert to embed format
    if (url.includes('figma.com/proto/')) {
      // Already a prototype URL, just ensure it has embed parameter
      if (!url.includes('embed')) {
        url = url.includes('?') ? `${url}&embed=1` : `${url}?embed=1`;
      }
    } else if (url.includes('figma.com/design/')) {
      // Convert design URL to prototype URL
      url = url.replace('/design/', '/proto/');
      url = url.includes('?') ? `${url}&embed=1` : `${url}?embed=1`;
    }
    
    setEmbedUrl(url);
  };

  const handleReset = () => {
    setPrototypeUrl('');
    setEmbedUrl('');
  };

  return (
    <div className="size-full bg-black">
      {!embedUrl ? (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-2xl">
            <h1 className="text-white mb-6 text-center">Figma Prototype Viewer</h1>
            <p className="text-white/70 mb-8 text-center">
              Paste your Figma prototype URL below. It will automatically scale to fit your iPhone 14 screen.
            </p>
            
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <input
                  type="url"
                  value={prototypeUrl}
                  onChange={(e) => setPrototypeUrl(e.target.value)}
                  placeholder="https://www.figma.com/proto/..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                Load Prototype
              </button>
            </form>

            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm">
                <strong className="text-white">How to use:</strong><br />
                1. Open your Figma file<br />
                2. Click the "Share" button (top right)<br />
                3. Click "Get prototype link"<br />
                4. Copy the link and paste it above
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
          {/* Reset button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
          >
            Change URL
          </button>

          {/* Scaled iframe container */}
          <div
            style={{
              width: '390px',
              height: '844px',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title="Figma Prototype"
            />
          </div>
        </div>
      )}
    </div>
  );
}
