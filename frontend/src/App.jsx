import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css'; // Custom CSS for layout, styling, and responsiveness

function App() {
  // State to hold the full <iframe> HTML string from the backend
  const [iframeHtml, setIframeHtml] = useState('');

  useEffect(() => {
    // Fetch the current iframe from the backend
    const fetchIframe = async () => {
      try {
        const res = await axios.get('http://localhost:4000/iframe');
        setIframeHtml(res.data.html); // Save the iframe HTML to state
      } catch (err) {
        console.error("Error loading iframe:", err);
      }
    };

    // Fetch the iframe on initial load
    fetchIframe();

    // Setup WebSocket connection to receive live iframe updates
    const socket = io('http://localhost:4000');

    // When the backend notifies of a new iframe, re-fetch it
    socket.on('iframeUpdated', () => {
      console.log('Received iframeUpdated event from server');
      fetchIframe();
    });

    // Cleanup: disconnect socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    // Outer wrapper centers everything on the page
    <div className="page-wrapper">
      {/* Main container for content, centers it and sets max-width */}
      <div className="container">
        
        {/* Video section with 16:9 responsive iframe */}
        <div className="video-wrapper">
          {iframeHtml ? (
            // Insert the iframe HTML directly into the DOM
            <div
              className="iframe-container"
              dangerouslySetInnerHTML={{ __html: iframeHtml }}
            />
          ) : (
            // Shown while waiting for iframe to load
            <div className="loading">Loading stream...</div>
          )}
        </div>

        {/* Title and description area below the video */}
        <h1 className="video-title">Live Event Title</h1>
        <p className="video-description">
          This is a placeholder for the stream description. You can update this content to match the event.
        </p>
      </div>
    </div>
  );
}

export default App;
