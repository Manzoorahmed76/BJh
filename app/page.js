'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function Home() {
  const inputFileRef = useRef(null);
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Random ID generator for the filename
  const generateRandomName = (originalName) => {
    const ext = originalName.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${randomString}.${ext}`;
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '50px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' 
    }}>
      <div style={{ 
        backgroundColor: '#fff', padding: '40px', borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px', textAlign: 'center' 
      }}>
        <h2 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>BJDEVS Multi-Uploader</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Support: MP4, ZIP, HTML, JS, CSS, PDF, Images</p>

        <input 
          type="file" 
          ref={inputFileRef} 
          style={{ marginBottom: '25px', width: '100%', cursor: 'pointer' }} 
        />
        
        <button
          disabled={loading}
          onClick={async () => {
            const file = inputFileRef.current.files[0];
            if (!file) return alert("Pehle file select karein!");
            
            setLoading(true);
            try {
              // Yahan hum file ka naam pehle hi change kar rahe hain
              const secureFileName = generateRandomName(file.name);
              
              const newBlob = await upload(secureFileName, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
              });
              
              const shortId = newBlob.url.split('/').pop();
              setShortUrl(`https://b-jh.vercel.app/f/${shortId}`);

            } catch (err) {
              alert("Error: " + err.message);
            } finally {
              setLoading(false);
            }
          }}
          style={{
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
            backgroundColor: loading ? '#94a3b8' : '#2563eb', color: '#fff',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          {loading ? 'Uploading & Hiding Name...' : 'Upload & Get Link'}
        </button>

        {shortUrl && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '15px' }}>
            <p style={{ color: '#334155', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>Anonymous Link Generated! ✅</p>
            <input 
              readOnly value={shortUrl} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '13px' }} 
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                onClick={() => { navigator.clipboard.writeText(shortUrl); alert("Copied!"); }}
                style={{ flex: 1, padding: '10px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #2563eb', color: '#2563eb', backgroundColor: 'transparent' }}
              >
                Copy
              </button>
              <a href={shortUrl} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', textDecoration: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Open
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
