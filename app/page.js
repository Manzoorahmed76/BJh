'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function Home() {
  const inputFileRef = useRef(null);
  const [password, setPassword] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRandomName = (originalName) => {
    const ext = originalName.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${randomString}.${ext}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', color: '#0f172a' }}>BJDEVS Secure Cloud</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Limit: 10MB | Privacy Focused</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Select File:</label>
          <input type="file" ref={inputFileRef} style={{ width: '100%', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Set Password (Optional):</label>
          <input 
            type="password" 
            placeholder="Chhod den agar password nahi chahiye"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        
        <button
          disabled={loading}
          onClick={async () => {
            const file = inputFileRef.current.files[0];
            if (!file) return alert("Pehle file select karein!");
            
            // 10MB Limit Check (10 * 1024 * 1024 bytes)
            if (file.size > 10 * 1024 * 1024) {
              return alert("File bohot badi hai! Maximum 10MB allow hai.");
            }

            setLoading(true);
            try {
              const secureFileName = generateRandomName(file.name);
              const newBlob = await upload(secureFileName, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                clientPayload: password // Password metadata bhej rahe hain
              });
              
              const shortId = newBlob.url.split('/').pop();
              // Agar password hai to hum ek custom route par bhejenge, varna direct file
              const finalLink = password 
                ? `https://b-jh.vercel.app/view/${shortId}?p=${btoa(password)}` 
                : `https://b-jh.vercel.app/f/${shortId}`;
              
              setShortUrl(finalLink);
            } catch (err) {
              alert("Error: " + err.message);
            } finally {
              setLoading(false);
            }
          }}
          style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: loading ? '#94a3b8' : '#000', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : 'Secure Upload'}
        </button>

        {shortUrl && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '15px', textAlign: 'center' }}>
            <p style={{ color: '#334155', fontWeight: 'bold', fontSize: '13px' }}>Link Ready! ✅</p>
            <input readOnly value={shortUrl} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
            <button onClick={() => { navigator.clipboard.writeText(shortUrl); alert("Copied!"); }} style={{ marginTop: '10px', padding: '10px', width: '100%', cursor: 'pointer' }}>Copy Link</button>
          </div>
        )}
      </div>
    </div>
  );
}
