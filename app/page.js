'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef, useEffect } from 'react';

export default function BJUploader() {
  const fileInputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  // Fonts aur Tailwind CDN ko load karne ke liye
  useEffect(() => {
    // Ubuntu Mono aur Inter Font load karna
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Font Awesome load karna
    const fa = document.createElement('link');
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    fa.rel = 'stylesheet';
    document.head.appendChild(fa);
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 10MB LIMIT CHECK
    if (file.size > 10 * 1024 * 1024) {
      triggerToast("Error: Max file size 10MB!", "error");
      e.target.value = '';
      return;
    }
    setCurrentFile(file);
    setShowResult(false);
  };

  const handleUpload = async () => {
    if (!currentFile) return;
    setLoading(true);

    try {
      const randomId = Math.random().toString(36).substring(2, 10);
      const ext = currentFile.name.split('.').pop();
      const secureName = `${randomId}.${ext}`;

      const newBlob = await upload(secureName, currentFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      // Aapka domain mask URL
      const finalUrl = `https://b-jh.vercel.app/f/${newBlob.url.split('/').pop()}`;
      setShortUrl(finalUrl);
      setShowResult(true);
      setCurrentFile(null);
      triggerToast("Upload Successful!");
    } catch (err) {
      triggerToast("Upload failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bj-uploader-root">
      {/* CSS Styles Integrated Inside */}
      <style jsx global>{`
        ::-webkit-scrollbar { display: none !important; }
        
        .bj-uploader-root {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
          color: #334155;
          font-family: 'Ubuntu Mono', 'Inter', monospace;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .encoder-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }
        .encoder-card:hover { border-color: #94a3b8; }

        .btn-black {
          background: #0f172a;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }
        .btn-black:hover { background: #1e293b; }
        .btn-black:disabled { background: #94a3b8; cursor: not-allowed; }

        .btn-outline {
          background: white;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }
        .btn-outline:hover { border-color: #475569; }

        .toast-popup {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 0.875rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          z-index: 100;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-5 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-shield-alt text-slate-900 text-lg"></i>
            <h1 className="text-xl font-bold text-slate-900 tracking-tighter">BJ Uploader</h1>
          </div>
          <a href="https://t.me/bj_Devs" target="_blank" className="text-slate-500 hover:text-black">
            <i className="fab fa-telegram-plane"></i>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        
        {/* Intro */}
        <section className="text-center mb-10">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-bold">Secure Cloud Distribution</p>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">Professional File Distribution</h2>
          <p className="mt-2 text-slate-600 text-sm">Upload files and get anonymous links instantly.</p>
        </section>

        {/* Upload Card */}
        <div className="encoder-card shadow-sm mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Select Source File</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-slate-50 transition-colors bg-slate-50/50"
              >
                <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-4xl text-slate-300 mb-4`}></i>
                <p className="font-bold text-slate-700 text-sm">
                  {currentFile ? currentFile.name : 'Enter your file here...'}
                </p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold">MAX FILE SIZE: 10MB</p>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleUpload}
                disabled={!currentFile || loading}
                className="btn-black"
              >
                <i className="fas fa-lock"></i> {loading ? 'Processing...' : 'Encode & Upload'}
              </button>
              <button 
                onClick={() => {setCurrentFile(null); setShowResult(false);}}
                className="btn-outline"
              >
                <i className="fas fa-trash"></i> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {showResult && (
          <div className="encoder-card border-slate-900 shadow-lg mb-6 transform transition-all scale-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 text-center uppercase tracking-widest">Process Completed</h3>
            <div className="bg-slate-900 p-4 rounded-lg mb-4">
               <p className="text-[9px] text-slate-400 mb-1 font-bold">DISTRIBUTION URL:</p>
               <p className="text-white text-xs font-mono break-all">{shortUrl}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {navigator.clipboard.writeText(shortUrl); triggerToast("Copied to Clipboard!");}}
                className="btn-black"
              >
                <i className="fas fa-copy"></i> Copy URL
              </button>
              <button 
                onClick={() => window.open(shortUrl, '_blank')}
                className="btn-outline"
              >
                <i className="fas fa-external-link-alt"></i> Test / Open
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white border border-gray-200 p-6 mb-10">
          <h3 className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-6 uppercase tracking-widest">
            <i className="fas fa-terminal"></i> How it Works
          </h3>
          <div className="space-y-6">
            {[
              {n: '01', t: 'Selection', d: 'Choose any file (image, zip, mp4, etc) from your local machine.'},
              {n: '02', t: 'Encryption', d: 'Our tool generates a secure random ID to mask your filename.'},
              {n: '03', t: 'Global Share', d: 'Copy the final link and share it globally through our CDN.'},
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="border border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  {step.n}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-slate-900 mb-1 uppercase">{step.t}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thx To All Users And Contributors.</p>
          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">© 2025 BJ TRICKS. All rights reserved.</p>
        </footer>
      </main>

      {/* Donate Button */}
      <button 
        onClick={() => window.open('https://t.me/bj_coder', '_blank')}
        className="fixed bottom-6 right-6 bg-white border border-slate-900 text-slate-900 py-3 px-6 rounded-none text-[10px] font-bold cursor-pointer flex items-center gap-2 shadow-xl hover:bg-slate-900 hover:text-white transition-all z-50 uppercase tracking-widest"
      >
        <i className="fas fa-hand-holding-heart"></i> Donate
      </button>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-popup ${toast.type === 'success' ? 'bg-[#ecfdf5] border border-[#86efac] text-[#166534]' : 'bg-[#fee2e2] border border-[#fca5a5] text-[#991b1b]'}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'} mr-2`}></i>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
