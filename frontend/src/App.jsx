import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    const fetchIframe = async () => {
      try {
        const response = await axios.get('http://localhost:4000/iframe');
        setIframeUrl(response.data.url);
      } catch (err) {
        console.error('Failed to load iframe URL', err);
      }
    };

    fetchIframe();
  }, []);

  if (!iframeUrl) return <div>Loading stream...</div>;

  return (
    <div style={{ height: '100vh', margin: 0 }}>
      <iframe
        src={iframeUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Live Stream"
      ></iframe>
    </div>
  );
}

export default App;
