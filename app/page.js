// Is function ko apne component ke andar rakhein
const getShortUrl = (longUrl) => {
  // Long URL: https://98xavqwq9nylujsp.public.blob.vercel-storage.com/image.jpg
  // Short URL: https://b-jh.vercel.app/f/image.jpg
  const fileName = longUrl.split('/').pop();
  return `https://b-jh.vercel.app/f/${fileName}`;
};

// ... UI mein jahan display karwana hai:
{blob && (
  <div style={{ marginTop: '20px' }}>
    <p>Apka Short Link:</p>
    <input 
      readOnly 
      value={getShortUrl(blob.url)} 
      style={{ width: '100%', padding: '10px' }} 
    />
    <button onClick={() => {
        navigator.clipboard.writeText(getShortUrl(blob.url));
        alert("Short Link Copied!");
    }}>
      Copy Short Link
    </button>
  </div>
)}
