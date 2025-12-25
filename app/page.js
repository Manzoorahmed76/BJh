'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef, useEffect } from 'react';

export default function Dashboard() {
  const inputFileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState({ total: 0, size: 0 });
  const [recentFiles, setRecentFiles] = useState([]);
  const [showResponse, setShowResponse] = useState(false);

  // Load stats and history on start
  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('bj_stats')) || { total: 0, size: 0 };
    const savedHistory = JSON.parse(localStorage.getItem('bj_history')) || [];
    setStats(savedStats);
    setRecentFiles(savedHistory);
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB Limit
        alert("File bohot badi hai! Maximum limit 10MB hai.");
        e.target.value = '';
        return;
      }
      setCurrentFile(file);
      setShowResponse(false);
    }
  };

  const startUpload = async () => {
    if (!currentFile) return;
    setLoading(true);

    try {
      const randomName = Math.random().toString(36).substring(2, 10) + '.' + currentFile.name.split('.').pop();
      
      const newBlob = await upload(randomName, currentFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const finalUrl = `https://b-jh.vercel.app/f/${newBlob.url.split('/').pop()}`;
      
      // Update Stats & History
      const newStats = { total: stats.total + 1, size: stats.size + currentFile.size };
      const newEntry = { name: randomName, url: finalUrl, size: currentFile.size, date: new Date().toISOString() };
      const newHistory = [newEntry, ...recentFiles].slice(0, 5);

      localStorage.setItem('bj_stats', JSON.stringify(newStats));
      localStorage.setItem('bj_history', JSON.stringify(newHistory));
      
      setStats(newStats);
      setRecentFiles(newHistory);
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
    <>
      <style jsx global>{`
        :root {
          --primary: #4f46e5;
          --bg-dark: #0f172a;
          --bg-card: #1e293b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --success: #10b981;
          --border: rgba(255, 255, 255, 0.1);
        }
        body {
          background-color: var(--bg-dark);
          background-image: radial-gradient(circle at top, #1e293b 0%, var(--bg-dark) 100%);
          color: var(--text-main);
          font-family: 'Segoe UI', sans-serif;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>BJDEVS Hosting</h1>
          <p style={{ color: 'var(--text-muted)' }}>Professional File Distribution</p>
        </header>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'Total Files', value: stats.total },
            { label: 'Space Used', value: formatSize(stats.size) },
            { label: 'Limit', value: '10 MB' },
            { label: 'Server', value: 'Global' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Upload Box */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '30px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          {!currentFile && !loading && (
            <div 
              onClick={() => inputFileRef.current.click()}
              style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>☁️</div>
              <h3 style={{ margin: '0 0 10px 0' }}>Click to Upload</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Max 10MB • All Formats Supported</p>
              <input type="file" ref={inputFileRef} onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
          )}

          {currentFile && !loading && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ fontWeight: '600' }}>{currentFile.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatSize(currentFile.size)}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setCurrentFile(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button onClick={startUpload} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--success)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Upload Now</button>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ marginBottom: '15px' }}>Uploading to Cloud...</p>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--primary)', width: '100%', animation: 'shimmer 2s infinite linear' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Success Response */}
        {showResponse && (
          <div style={{ marginTop: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '20px', padding: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✅ Upload Successful</span>
                <button onClick={() => setShowResponse(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✖</button>
             </div>
             <input readOnly value={shortUrl} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', marginBottom: '15px' }} />
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => {navigator.clipboard.writeText(shortUrl); alert("Copied!")}} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Copy URL</button>
                <a href={shortUrl} target="_blank" rel="noreferrer" style={{ padding: '10px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', background: 'var(--success)', color: 'white', fontWeight: '600' }}>Open File</a>
             </div>
          </div>
        )}

        {/* Recent Files */}
        {recentFiles.length > 0 && (
          <div style={{ marginTop: '30px', background: 'var(--bg-card)', borderRadius: '24px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>🕒 Recent Uploads</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentFiles.map((file, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', textOverflow: 'ellipsis', white-space: 'nowrap' }}>{file.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatSize(file.size)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => {navigator.clipboard.writeText(file.url); alert("Copied!")}} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>📋</button>
                    <a href={file.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '6px', textDecoration: 'none' }}>🔗</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
