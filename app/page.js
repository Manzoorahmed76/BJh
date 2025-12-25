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

  // Load Data
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
      const randomId = Math.random().toString(36).substring(2, 10);
      const ext = currentFile.name.split('.').pop();
      const secureName = `${randomId}.${ext}`;

      const newBlob = await upload(secureName, currentFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const finalUrl = `https://b-jh.vercel.app/f/${newBlob.url.split('/').pop()}`;

      // Update Local State & Storage
      const newStats = { ...stats, total: stats.total + 1, size: stats.size + currentFile.size };
      const newHistory = [{ name: secureName, url: finalUrl, size: currentFile.size, date: new Date() }, ...history].slice(0, 10);

      localStorage.setItem('hs_stats', JSON.stringify(newStats));
      localStorage.setItem('hs_history', JSON.stringify(newHistory));

      setStats(newStats);
      setHistory(newHistory);
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
    <div className="container">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body {
          background-color: #0f172a;
          background-image: radial-gradient(circle at top, #1e293b 0%, #0f172a 100%);
          color: #f8fafc;
          min-height: 100vh;
          padding: 15px;
        }
        .container { max-width: 1000px; margin: 0 auto; padding-bottom: 50px; }
        header { text-align: center; margin-bottom: 25px; padding-top: 10px; }
        .logo {
          font-size: 2.2rem; font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 25px; }
        .stat-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 16px; text-align: center; }
        .upload-wrapper { background: #1e293b; border-radius: 24px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
        .upload-area { border: 2px dashed rgba(255,255,255,0.15); background: rgba(0,0,0,0.2); border-radius: 16px; padding: 30px; text-align: center; cursor: pointer; }
        .btn-main { padding: 12px 25px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; color: white; background: #4f46e5; display: inline-flex; gap: 8px; align-items: center; }
        .progress-bar { height: 8px; background: linear-gradient(90deg, #4f46e5, #ec4899); width: 100%; animation: pulse 1.5s infinite; border-radius: 4px; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .recent-item { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .tag { background: rgba(255,255,255,0.05); padding: 5px 12px; border-radius: 50px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.1); }
      `}</style>

      <header>
        <div className="logo">BJDEVS Hosting</div>
        <div style={{ color: '#94a3b8' }}>Professional File Distribution</div>
      </header>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card"><h3>{stats.total}</h3><p style={{fontSize:'0.7rem', color:'#94a3b8'}}>FILES</p></div>
        <div className="stat-card"><h3>{new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</h3><p style={{fontSize:'0.7rem', color:'#94a3b8'}}>TODAY</p></div>
        <div className="stat-card"><h3>{formatSize(stats.size)}</h3><p style={{fontSize:'0.7rem', color:'#94a3b8'}}>USED</p></div>
        <div className="stat-card"><h3>Active</h3><p style={{fontSize:'0.7rem', color:'#94a3b8'}}>STATUS</p></div>
      </div>

      {/* Upload Box */}
      <div className="upload-wrapper">
        {!currentFile && !loading && (
          <div className="upload-area" onClick={() => fileInputRef.current.click()}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>☁️</div>
            <div style={{ fontWeight: '700', marginBottom: '15px' }}>Upload Your Files</div>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '20px' }}>Max 10MB • All Formats</p>
            <button className="btn-main">📂 Browse Files</button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
          </div>
        )}

        {currentFile && !loading && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', marginBottom: '15px', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{fontSize:'1.5rem'}}>📄</span>
              <div style={{textAlign:'left'}}><div style={{fontWeight:'600'}}>{currentFile.name}</div><div style={{fontSize:'0.8rem', color:'#94a3b8'}}>{formatSize(currentFile.size)}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCurrentFile(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={uploadNow} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Upload</button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>Uploading to BJDEVS Cloud...</div>
            <div className="progress-bar"></div>
          </div>
        )}
      </div>

      {/* Success Response */}
      {showResponse && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ color: '#10b981', fontWeight: '800' }}>✅ Upload Successful</span>
            <button onClick={() => setShowResponse(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✖</button>
          </div>
          <input readOnly value={shortUrl} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', marginBottom: '15px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => { navigator.clipboard.writeText(shortUrl); alert("Copied!"); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>📋 Copy URL</button>
            <a href={shortUrl} target="_blank" rel="noreferrer" style={{ background: '#10b981', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>🔗 Open File</a>
          </div>
        </div>
      )}

      {/* Recent Files */}
      {history.length > 0 && (
        <div className="upload-wrapper">
          <div style={{ marginBottom: '15px', fontWeight: '700' }}>🕒 Recent Uploads</div>
          {history.map((item, idx) => (
            <div key={idx} className="recent-item">
              <span style={{ fontSize: '1.2rem' }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatSize(item.size)}</div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(item.url); alert("Copied!"); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>📋</button>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="stat-card" style={{ textAlign: 'left' }}>
          <h4 style={{ marginBottom: '10px' }}>📖 How to Use</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.6' }}>1. Select file<br />2. Click Upload<br />3. Get your short link instantly.</p>
        </div>
        <div className="stat-card" style={{ textAlign: 'left' }}>
          <h4 style={{ marginBottom: '10px' }}>✨ Supported</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <span className="tag">Images</span><span className="tag">Videos</span><span className="tag">Zips</span><span className="tag">Code</span>
          </div>
        </div>
      </div>
    </div>
  );
}
