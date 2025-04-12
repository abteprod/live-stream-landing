const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const PORT = process.env.PORT || 4000;
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const path = require('path');
const ADMIN_TOKEN = 'alcala';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});



//Middleware
app.use(cors());
app.use(express.json());



let config = require('./streamConfig.json');

// Ping function to check if a URL is live
const checkStreamUrl = async (url) => {
  try {
    const res = await axios.head(url);
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false;
  }
};

const updateCurrentStream = async () => {
  const mainOnline = await checkStreamUrl(config.main);
  if (mainOnline) {
    config.current = 'main';
  } else {
    const backupOnline = await checkStreamUrl(config.backup);
    config.current = backupOnline ? 'backup' : null;
  }
};

// Run check on startup, then every 30s
updateCurrentStream();
setInterval(updateCurrentStream, 30000);

app.get('/iframe', (req, res) => {
    try {
      const raw = fs.readFileSync('./streamConfig.json', 'utf8');
      const config = JSON.parse(raw);
  
      if (!config.iframe) {
        return res.status(500).json({ error: "Iframe not set." });
      }
  
      res.json({ html: config.iframe });
    } catch (err) {
      console.error('Error reading stream config:', err);
      res.status(500).json({ error: "Failed to read config." });
    }
  });
  

app.post('/update', (req, res) => {
    const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
    
    
    const { iframe } = req.body;

  
    if (!iframe || !iframe.includes('<iframe')) {
      return res.status(400).json({ error: 'Invalid iframe content.' });
    }
  
    const updatedConfig = { iframe };
  
    try {
      fs.writeFileSync('./streamConfig.json', JSON.stringify(updatedConfig, null, 2));
      io.emit('iframeUpdated'); // 🔔 Notify all clients
      res.json({ success: true, message: 'Iframe updated.' });
    } catch (err) {
      console.error('Failed to write config:', err);
      res.status(500).json({ error: 'Failed to update iframe.' });
    }
  });
  
app.get('/admin', (req, res) => {
    
    const token = req.query.token;
    if (token !== ADMIN_TOKEN) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    
    res.send(
        `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Update Stream Iframe</title>
      <style>
        body {
          font-family: sans-serif;
          padding: 2rem;
          background: #f5f5f5;
        }
        textarea {
          width: 100%;
          height: 200px;
          font-family: monospace;
        }
        button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
        }
        .message {
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <h1>Update Stream Iframe</h1>
      <textarea id="iframeInput" placeholder="Paste full <iframe> HTML here..."></textarea>
      <br/>
      <button onclick="submitIframe()">Update</button>
      <div class="message" id="message"></div>

      <script>
        async function submitIframe() {
          const iframe = document.getElementById('iframeInput').value;
          const messageBox = document.getElementById('message');
          const token = new URLSearchParams(window.location.search).get('token');

          if (!token) {
            messageBox.innerHTML = '<span style="color: red;">❌ Missing token in URL.</span>';
            return;
          }

          try {
            const res = await fetch('/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({ iframe })
            });

            const data = await res.json();
            if (res.ok) {
              messageBox.innerHTML = '<span style="color: green;">✅ ' + data.message + '</span>';
            } else {
              messageBox.innerHTML = '<span style="color: red;">❌ ' + (data.error || 'Unknown error') + '</span>';
            }
          } catch (err) {
            console.error('Fetch error:', err);
            messageBox.innerHTML = '<span style="color: red;">❌ Failed to connect to server.</span>';
          }
        }
      </script>
    </body>
    </html>
  `
    );
  });
  
  // 👇 Static middleware comes *after* custom routes
  app.use(express.static(path.join(__dirname, 'public')));
  
  server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });
