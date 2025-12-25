'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef, useEffect } from 'react';

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState({ total: 0, size: 0 });
  const [history, setHistory] = useState([]);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('hs_stats')) || { total: 0, size: 0 };
    const h = JSON.parse(localStorage.getItem('hs_history')) || [];
    setStats(s);
    setHistory(h);
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Error: File 10MB se badi hai!");
      e.target.value = '';
      return;
    }
    setCurrentFile(file);
    setShowResponse(false);
  };

  const uploadNow = async () => {
    if (!currentFile) return;
    setLoading(true);

    try {
      const newBlob = await upload(currentFile.name, currentFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const finalUrl = `https://b-jh.vercel.app/f/${newBlob.url.split('/').pop()}`;

      const newStats = { ...stats, total: stats.total + 1, size: stats.size + currentFile.size };
      const newHistory = [{ name: currentFile.name, url: finalUrl, size: currentFile.size, date: new Date() }, ...history].slice(0, 10);

      localStorage.setItem('hs_stats', JSON.stringify(newStats));
      localStorage.setItem('hs_history', JSON.stringify(newHistory));

      setStats(newStats);
      setHistory(newHistory);
      setShortUrl(finalUrl);
      setShowResponse(true);
      setCurrentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <head>
        <title>BJDEVS Hosting</title>
        <meta name="description" content="Professional File Distribution - Fast & Secure File Hosting by @bj_coder" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>

      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  mono: ['Ubuntu Mono', 'monospace'],
                  sans: ['Inter', 'system-ui', 'sans-serif'],
                },
                colors: {
                  slate: {
                    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
                    400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
                    800: '#1e293b', 900: '#0f172a',
                  },
                },
              },
            },
          };
        `
      }} />

      <style jsx global>{`
        ::-webkit-scrollbar { display: none !important; }

        .slide-down { animation: slideDown 0.15s ease-out; }
        .slide-up   { animation: slideUp   0.15s ease-out; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp   { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-10px); } }

        .encoder-card {
          background:#fff;
          border:1px solid #e5e7eb;
          transition:all .2s ease;
        }
        .encoder-card:hover { border-color:#9ca3af; }

        .toast {
          color: #1f2937;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          font-weight: 600;
          font-size: 0.875rem;
          max-width: 90%;
          animation: slideDown 0.3s ease forwards;
          opacity: 0;
        }
        .toast.success { background-color: #ecfdf5; border-color: #86efac; color: #166534; }
        .toast.error   { background-color: #fee2e2; border-color: #fca5a5; color: #991b1b; }
      `}</style>

      <body className="bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 antialiased font-sans min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 py-5">
          <div className="max-w-2xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <i className="fas fa-cloud-upload-alt text-slate-900 text-xl"></i>
              <h1 className="text-xl font-bold text-slate-900">BJDEVS Hosting</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://t.me/bj_Devs" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-slate-900">
                <i className="fab fa-telegram-plane text-lg"></i>
              </a>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-2xl mx-auto px-6 py-10">

          {/* Intro */}
          <section className="text-center mb-8">
            <p className="text-slate-600 text-xs mb-2">Fast and secure</p>
            <h2 className="text-3xl font-bold text-slate-900">Professional File Distribution</h2>
            <p className="mt-2 text-slate-700 text-sm">Upload files up to 10MB • Anonymous links • All formats supported</p>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="encoder-card p-5 text-center">
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              <p className="text-xs text-slate-600 mt-1">FILES</p>
            </div>
            <div className="encoder-card p-5 text-center">
              <h3 className="text-2xl font-bold text-slate-900">{new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</h3>
              <p className="text-xs text-slate-600 mt-1">TODAY</p>
            </div>
            <div className="encoder-card p-5 text-center">
              <h3 className="text-2xl font-bold text-slate-900">{formatSize(stats.size)}</h3>
              <p className="text-xs text-slate-600 mt-1">USED</p>
            </div>
            <div className="encoder-card p-5 text-center">
              <h3 className="text-2xl font-bold text-green-600">Active</h3>
              <p className="text-xs text-slate-600 mt-1">STATUS</p>
            </div>
          </div>

          {/* Upload Card */}
          <div className="encoder-card p-6 mb-6">
            <div className="space-y-6">

              {!currentFile && !loading && (
                <div className="text-center py-10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <i className="fas fa-cloud-upload-alt text-6xl text-slate-400 mb-4"></i>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Your Files</h3>
                  <p className="text-sm text-slate-600 mb-6">Max 10MB • Images, Videos, ZIP, PDF, Code etc.</p>
                  <button className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition font-medium mx-auto">
                    <i className="fas fa-folder-open"></i> Browse Files
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                </div>
              )}

              {currentFile && !loading && (
                <div className="text-center">
                  <div className="bg-gray-50 p-6 rounded-lg mb-6 flex flex-col items-center gap-4">
                    <i className="fas fa-file text-5xl text-slate-600"></i>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{currentFile.name}</div>
                      <div className="text-sm text-slate-600">{formatSize(currentFile.size)}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setCurrentFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="flex-1 bg-white border border-gray-300 hover:border-slate-400 text-slate-900 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    <button onClick={uploadNow}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
                      <i className="fas fa-upload"></i> Upload Now
                    </button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-10">
                  <div className="text-lg font-bold text-slate-900 mb-4">Uploading to BJDEVS Cloud...</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-full bg-slate-900 w-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Success */}
          {showResponse && (
            <div className="encoder-card p-6 mb-6 bg-green-50 border-green-300">
              <h3 className="text-lg font-bold text-center text-green-800 mb-4">✅ Upload Successful</h3>
              <input readOnly value={shortUrl} className="w-full p-4 border border-gray-300 rounded-lg text-sm font-mono mb-4 bg-white" />
              <div className="flex gap-3">
                <button onClick={() => { navigator.clipboard.writeText(shortUrl); alert("Copied!"); }}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
                  <i className="fas fa-copy"></i> Copy URL
                </button>
                <a href={shortUrl} target="_blank" rel="noreferrer"
                   className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                  <i className="fas fa-external-link-alt"></i> Open File
                </a>
              </div>
              <div className="text-center mt-4">
                <button onClick={() => setShowResponse(false)} className="text-sm text-slate-600 hover:text-slate-900">✖ Close</button>
              </div>
            </div>
          )}

          {/* Recent Uploads */}
          {history.length > 0 && (
            <div className="encoder-card p-6 mb-6">
              <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-5">
                <i className="fas fa-history"></i> Recent Uploads
              </h3>
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <i className="fas fa-file text-2xl text-slate-600"></i>
                      <div>
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-600">{formatSize(item.size)}</div>
                      </div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(item.url); alert("Copied!"); }}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                      <i className="fas fa-copy"></i> Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use */}
          <div className="encoder-card p-6">
            <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-5">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              How to Use
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Select File</h4>
                  <p className="text-xs text-slate-600">Click browse and choose your file (max 10MB).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Upload</h4>
                  <p className="text-xs text-slate-600">Click Upload Now – file name will be hidden automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Share</h4>
                  <p className="text-xs text-slate-600">Copy the anonymous link and share anywhere.</p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-12 text-center text-xs text-slate-600">
            <p>Thanks to all users and contributors.</p>
            <p className="mt-1">© 2025 BJDEVS. All rights reserved.</p>
          </footer>
        </main>

        {/* Donate Button */}
        <button onClick={() => window.open('https://t.me/bj_coder', '_blank')}
                className="fixed bottom-6 right-6 z-30 bg-slate-900 text-white py-3 px-4 rounded-full text-sm flex items-center gap-2 shadow-lg hover:bg-slate-800 transition">
          <i className="fas fa-hand-holding-heart"></i> Donate
        </button>
      </body>
    </>
  );
}
