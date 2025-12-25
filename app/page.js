'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function Home() {
  const inputFileRef = useRef(null);
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to convert long URL to your domain URL
  const formatShortLink = (longUrl) => {
    const fileName = longUrl.split('/').pop();
    return `https://b-jh.vercel.app/f/${fileName}`;
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '50px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f4f7f6' 
    }}>
      <div style={{ 
        backgroundColor: '#fff', padding: '30px', borderRadius: '15px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px', textAlign: 'center' 
      }}>
        <h2 style={{ color: '#1a1a1a', marginBottom: '5px' }}>BJDEVS Cloud</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>Simple & Fast File Sharing</p>

        <input type="file" ref={inputFileRef} style={{ marginBottom: '20px', fontSize: '14px' }} />
        
        <button
          disabled={loading}
          onClick={async () => {
            const file = inputFileRef.current.files[0];
            if (!file) return alert("Please select a file first!");
            
            setLoading(true);
            try {
              const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
              });
              
              const myDomainUrl = formatShortLink(newBlob.url);
              setShortUrl(myDomainUrl);
            } catch (err) {
              alert("Upload failed: " + err.message);
            } finally {
              setLoading(false);
            }
          }}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            backgroundColor: loading ? '#ddd' : '#000', color: '#fff',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: '0.3s'
          }}
        >
          {loading ? 'Uploading File...' : 'Create Share Link'}
        </button>

        {shortUrl && (
          <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
            <p style={{ color: '#0369a1', fontWeight: 'bold', fontSize: '14px', margin: '0 0 10px 0' }}>Link Created! ✅</p>
            <input 
              readOnly 
              value={shortUrl} 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '13px', textAlign: 'center' }} 
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => { navigator.clipboard.writeText(shortUrl); alert("Copied!"); }}
                style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #000', borderRadius: '5px' }}
              >
                Copy Link
              </button>
              <a 
                href={shortUrl} target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: '8px', textDecoration: 'none', backgroundColor: '#000', color: '#fff', borderRadius: '5px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                View File
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
