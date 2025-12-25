'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef, useEffect } from 'react';

export default function BJ_Uploader() {
  const fileInputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Show Telegram Popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('popupClosed')) {
        setShowPopup(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB Limit
      alert("Error: File is too large! Maximum limit is 10MB.");
      e.target.value = '';
      return;
    }
    setCurrentFile(file);
    setShowResponse(false);
  };

  const uploadFile = async () => {
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

      const finalUrl = `https://b-jh.vercel.app/f/${newBlob.url.split('/').pop()}`;
      setShortUrl(finalUrl);
      setShowResponse(true);
      setCurrentFile(null);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 antialiased font-mono min-h-screen">
      
      {/* Telegram Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-gray-200 rounded-none max-w-sm w-full text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Community!</h3>
            <p className="text-sm text-gray-600 mb-6">Connect with us on Telegram for updates and support.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => { window.open('https://t.me/BJ_DEVS', '_blank'); setShowPopup(false); }}
                className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold"
              >Open Link</button>
              <button 
                onClick={() => { setShowPopup(false); localStorage.setItem('popupClosed', 'true'); }}
                className="flex-1 bg-gray-50 text-gray-900 border border-gray-200 py-3 rounded-lg font-bold"
              >Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 py-5">
        <div className="max-w-2xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-cloud-upload-alt text-slate-900 text-xl"></i>
            <h1 className="text-xl font-bold text-slate-900">BJ Cloud Uploader</h1>
          </div>
          <a href="https://t.me/bj_Devs" target="_blank" className="text-slate-600 hover:text-slate-900">
            <i className="fab fa-telegram-plane text-xl"></i>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        
        {/* Intro */}
        <section className="text-center mb-8">
          <p className="text-slate-600 text-xs mb-2 uppercase tracking-widest">Professional File Distribution</p>
          <h2 className="text-3xl font-bold text-slate-900">Secure Global Storage</h2>
          <p className="mt-2 text-slate-700 text-sm">Upload files up to 10MB and get instant short links.</p>
        </section>

        {/* Uploader Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-none mb-6 hover:border-gray-400 transition-all">
          <div className="space-y-5">
            
            {/* File Selection Area */}
            {!loading && (
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Select Your File</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition"
                >
                  {currentFile ? (
                    <div className="text-slate-900">
                      <i className="fas fa-file-alt text-2xl mb-2"></i>
                      <p className="text-sm font-bold">{currentFile.name}</p>
                      <p className="text-xs text-slate-500">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600">Click to browse or drag file here</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="py-10 text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-slate-900 mb-4"></i>
                <p className="text-sm font-bold">Uploading to BJDEVS Cloud...</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 animate-pulse w-full"></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            {!loading && (
              <div className="flex gap-3">
                <button 
                  onClick={uploadFile}
                  disabled={!currentFile}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition ${currentFile ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <i className="fas fa-upload"></i> Upload Now
                </button>
                <button 
                  onClick={() => { setCurrentFile(null); setShowResponse(false); }}
                  className="flex-1 bg-white border border-gray-300 hover:border-slate-400 text-slate-900 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
                >
                  <i className="fas fa-trash"></i> Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Area */}
        {showResponse && (
          <div className="bg-white border-2 border-slate-900 p-6 rounded-none mb-6 animate-[slideDown_0.3s_ease]">
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">File Ready! ✅</h3>
            <input 
              readOnly 
              value={shortUrl} 
              className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg text-xs mb-4 text-center focus:outline-none"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => { navigator.clipboard.writeText(shortUrl); alert("URL Copied!"); }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <i className="fas fa-copy"></i> Copy Link
              </button>
              <button 
                onClick={() => window.open(shortUrl, '_blank')}
                className="flex-1 bg-white border border-gray-300 hover:border-slate-400 text-slate-900 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <i className="fas fa-external-link-alt"></i> Open
              </button>
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="bg-white border border-gray-300 p-6 mb-6 rounded-none">
          <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-5">
            <i className="fas fa-bolt"></i> How to Use
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Choose File</h4>
                <p className="text-xs text-slate-600">Select any file (Images, Video, Code) under 10MB.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Click Upload</h4>
                <p className="text-xs text-slate-600">Our system will generate a secure random ID for your file.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Share Link</h4>
                <p className="text-xs text-slate-600">Copy the unique short link and share it anywhere.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600 space-y-1">
          <p>Thx To All Users And Contributors.</p>
          <p>© 2025 BJ Cloud. All rights reserved.</p>
        </footer>
      </main>

      {/* Donate Button */}
      <button 
        onClick={() => window.open('https://t.me/bj_coder', '_blank')}
        className="fixed bottom-6 right-6 z-30 bg-slate-900 text-white py-3 px-5 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl hover:bg-slate-800 transition transform hover:scale-105"
      >
        <i className="fas fa-hand-holding-heart"></i> Donate
      </button>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    </div>
  );
}
