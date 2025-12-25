'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function BJUploader() {
  const fileInputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const triggerToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      // Random ID logic
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
      triggerToast("Upload Successful!");
    } catch (err) {
      triggerToast("Upload failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 py-5">
        <div className="max-w-2xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-shield-alt text-slate-900"></i>
            <h1 className="text-xl font-bold text-slate-900">BJ Uploader</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://t.me/bj_Devs" target="_blank" className="text-sm text-slate-600 hover:text-slate-900">
              <i className="fab fa-telegram-plane"></i>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        
        {/* Intro */}
        <section className="text-center mb-8">
          <p className="text-slate-600 text-xs mb-2 uppercase tracking-widest">Global Powered</p>
          <h2 className="text-3xl font-bold text-slate-900">Professional File Distribution</h2>
          <p className="mt-2 text-slate-700 text-sm">Upload files to get secure, anonymous sharing links.</p>
        </section>

        {/* Encoder Style Card */}
        <div className="encoder-card p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Select Your File</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-full p-8 border border-gray-300 rounded-lg text-sm text-center cursor-pointer hover:bg-slate-50 transition dashed-border"
              >
                <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-3xl text-slate-400 mb-3`}></i>
                <p className="font-bold text-slate-700">
                  {currentFile ? currentFile.name : 'Enter your file here...'}
                </p>
                <p className="text-[10px] text-slate-400 mt-2">MAX SIZE: 10MB</p>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleUpload}
                disabled={!currentFile || loading}
                className={`flex-1 ${!currentFile || loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium`}
              >
                <i className="fas fa-lock"></i> {loading ? 'Uploading...' : 'Upload Now'}
              </button>
              <button 
                onClick={() => {setCurrentFile(null); setShowResult(false);}}
                className="flex-1 bg-white border border-gray-300 hover:border-slate-400 text-slate-900 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <i className="fas fa-trash"></i> Clear
              </div>
            </div>
          </div>
        </div>

        {/* Result Area (BJ Encoder Result Style) */}
        {showResult && (
          <div className="encoder-card p-6 mb-6 border-slate-900 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Process Completed</h3>
            <div className="bg-slate-50 p-3 border border-gray-200 rounded mb-4 overflow-hidden">
               <p className="text-[10px] text-slate-400 mb-1">DOWNLOAD URL:</p>
               <p className="text-xs truncate font-mono">{shortUrl}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {navigator.clipboard.writeText(shortUrl); triggerToast("Copied Successfully!");}}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <i className="fas fa-copy"></i> Copy Link
              </button>
              <button 
                onClick={() => window.open(shortUrl, '_blank')}
                className="flex-1 bg-white border border-gray-300 hover:border-slate-400 text-slate-900 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <i className="fas fa-external-link-alt"></i> Test / Open
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white border border-gray-300 p-6 mb-6 rounded-none">
          <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-5 uppercase">
            <i className="fas fa-bolt text-sm"></i> How to Use
          </h3>
          <div className="space-y-4">
            {[
              {s: 1, t: 'Select File', d: 'Choose any file from your device (Max 10MB).'},
              {s: 2, t: 'Upload', d: 'Click the Encode button to upload it securely.'},
              {s: 3, t: 'Share URL', d: 'Copy the generated link and share it anywhere.'},
            ].map((i) => (
              <div key={i.s} className="flex items-start gap-4">
                <div className="border-2 border-dashed border-slate-900 text-slate-900 w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {i.s}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{i.t}</h4>
                  <p className="text-xs text-slate-600">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600">
          <p>Thx To All Users And Contributors.</p>
          <p className="mt-1">© 2025 BJ TRICKS. All rights reserved.</p>
        </footer>
      </main>

      {/* Floating Support Button */}
      <button 
        onClick={() => window.open('https://t.me/bj_coder', '_blank')}
        className="fixed bottom-6 right-6 bg-slate-900 text-white py-3 px-6 rounded-full text-xs cursor-pointer flex items-center gap-2 shadow-2xl hover:bg-slate-800 transition-all z-50"
      >
        <i className="fas fa-hand-holding-heart"></i> Donate
      </button>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type === 'success' ? 'bg-[#ecfdf5] border-[#86efac] text-[#166534]' : 'bg-[#fee2e2] border-[#fca5a5] text-[#991b1b]'}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
          {toast.msg}
        </div>
      )}

      <style jsx>{`
        .dashed-border { border-style: dashed !important; }
      `}</style>
    </div>
  );
}
