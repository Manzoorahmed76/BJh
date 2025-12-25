'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function Home() {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '50px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fafafa' 
    }}>
      <div style={{ 
        backgroundColor: '#fff', padding: '30px', borderRadius: '15px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' 
      }}>
        <h2 style={{ color: '#333' }}>BJDEVS Uploader</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Images & ZIP (Max 20MB+)</p>

        <div style={{ margin: '25px 0' }}>
          <input type="file" ref={inputFileRef} style={{ width: '100%', marginBottom: '15px' }} />
          
          <button
            disabled={loading}
            onClick={async () => {
              const file = inputFileRef.current.files[0];
              if (!file) return alert("Pehle file choose karein!");
              
              setLoading(true);
              try {
                // Client-side upload logic
                const newBlob = await upload(file.name, file, {
                  access: 'public',
                  handleUploadUrl: '/api/upload',
                });
                setBlob(newBlob);
              } catch (err) {
                console.error(err);
                alert("Upload failed: " + err.message);
              } finally {
                setLoading(false);
              }
            }}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              backgroundColor: loading ? '#ccc' : '#0070f3', color: '#fff',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {loading ? 'Uploading...' : 'Upload Now'}
          </button>
        </div>

        {blob && (
          <div style={{ marginTop: '20px', textAlign: 'left', wordBreak: 'break-all' }}>
            <p style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>Success! ✅</p>
            <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
              <strong>Link:</strong> <br />
              <a href={blob.url} target="_blank" rel="noreferrer" style={{ color: '#0070f3' }}>{blob.url}</a>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(blob.url);
                alert("Link copied!");
              }}
              style={{ marginTop: '10px', width: '100%', padding: '8px', cursor: 'pointer' }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
