'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef, useEffect } from 'react';

export default function BJUploader() {
  const fileInputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Toast notification logic
  const showToast = (msg, type = 'success') => {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'bg-[#ecfdf5] border-[#86efac] text-[#166534]' : 'bg-[#fee2e2] border-[#fca5a5] text-[#991b1b]'} p-4 rounded-lg border font-bold text-sm shadow-md slide-down`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("Error: File 10MB se badi hai!", "error");
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

      const finalUrl = `https://b-jh.vercel.app/f/${newBlob.url.split('/').pop()}`;
      setShortUrl(finalUrl);
      setShowResult(true);
      setCurrentFile(null);
      showToast("File Uploaded Successfully!");
    } catch (err) {
      showToast("Upload failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 antialiased font-mono min-h-screen">
      
      {/* External CSS Compatibility */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 py-5">
        <div className="max-w-2xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-cloud-upload-alt text-slate-900 text-xl"></i>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">BJ Uploader</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://t.me/bj_Devs" target="_blank" className="text-sm text-slate-600 hover:text-slate-900">
              <i className="fab fa-telegram-plane"></i>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        
        {/* Intro */}
        <section className="text-center mb-8">
          <p className="text-slate-600 text-xs mb-2 uppercase tracking-widest">Global CDN Powered</p>
          <h2 className="text-3xl font-bold text-slate-900">Professional File Distribution</h2>
          <p className="mt-2 text-slate-700 text-sm">Upload images, videos, or zips and get encrypted short links.</p>
        </section>

        {/* Upload Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-none shadow-sm mb-6 hover:border-gray-400 transition-all">
          <div className="space-y-5">
            
            {/* Custom File Input Area */}
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-slate-50 transition"
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-file-import'} text-4xl text-slate-400 mb-4`}></i>
              <p className="text-sm font-bold text-slate-900">
                {currentFile ? currentFile.name : 'Click to select or drag file'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Max file size: 10MB</p>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleUpload}
                disabled={!currentFile || loading}
                className={`flex-1 ${!currentFile || loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium`}
              >
                <i className="fas fa-upload"></i> {loading ? 'Uploading...' : 'Upload Now'}
              </button>
              <button 
                onClick={() => {setCurrentFile(null); setShortUrl(''); setShowResult(false);}}
                className="flex-1 bg-white border border-gray-300 hover:border-slate-400 text-slate-900 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <i className="fas fa-trash"></i> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {showResult && (
          <div className="bg-white border border-gray-200 p-6 rounded-none shadow-md slide-down">
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Link Generated Successfully</h3>
            <div className="mb-4">
              <input 
                readOnly 
                value={shortUrl} 
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded text-xs font-mono text-center focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {navigator.clipboard.writeText(shortUrl); showToast("URL Copied!");}}
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

        {/* How to Use (Step UI) */}
        <div className="bg-white border border-gray-300 p-6 my-8 rounded-none">
          <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-5 uppercase tracking-tighter">
            <i className="fas fa-info-circle"></i> Instructions
          </h3>
          <div className="space-y-4">
            {[
              {step: 1, title: 'Choose File', desc: 'Select any file under 10MB from your device.'},
              {step: 2, title: 'Upload', desc: 'Click the upload button to start distribution.'},
              {step: 3, title: 'Share', desc: 'Copy the encrypted link and share it anywhere.'},
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm rounded-none">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600 space-y-2">
          <p>Powered by BJ Cloud Infrastructure.</p>
          <p>© 2025 BJ TRICKS. All rights reserved.</p>
        </footer>
      </main>

      {/* Donate Button Floating */}
      <button 
        onClick={() => window.open('https://t.me/bj_coder', '_blank')}
        className="fixed bottom-6 right-6 z-30 bg-slate-900 text-white border-none py-3 px-6 rounded-full text-sm cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
      >
        <i className="fas fa-hand-holding-heart"></i> Support Us
      </button>

      {/* Notification Container */}
      <div id="notification-container" className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none"></div>

      <style jsx global>{`
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
        @keyframes slideDown { 
          from { opacity:0; transform:translateY(-10px); } 
          to { opacity:1; transform:translateY(0); } 
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

    </div>
  );
}
