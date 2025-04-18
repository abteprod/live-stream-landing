
# Live Stream Landing App 🎥

A simple, real-time landing page for livestream events. Built with Docker, Node.js, React, and WebSockets.

## 🚀 System Architecture

See: `diagram.md`

## 🧩 Stack

- **Frontend**: React + Vite (served statically via Nginx)
- **Backend**: Node.js + WebSocket (Socket.IO)
- **Reverse Proxy**: Nginx
- **Deployment**: Docker Compose on AWS Lightsail
- **Live Stream Control**: Admin panel via `/admin`

## 🔧 Features

- Iframe manually updated via backend
- Real-time iframe switching without client refresh
- WebSocket-based updates
- Token-protected admin panel
- Dockerized stack for easy deployment

## 📦 Endpoints

- `GET /iframe` → Get current iframe
- `POST /update` → Update iframe (requires token)
- `GET /admin` → Admin UI
- WebSocket connects automatically to receive iframe updates

## 🔐 Admin Token

The token is defined in `backend/index.js` (or optionally via `.env`).
To update:
1. Edit the token
2. Rebuild and redeploy

## 🛠 To Deploy

```bash
git clone https://github.com/abteprod/live-stream-landing.git
cd live-stream-landing
sudo docker compose build
sudo docker compose up -d
```

## 📄 License

MIT

## 🔁 Deployment Update Script

You can automate the full update and redeploy process with the `update-deploy.sh` script.

### 📄 What it does:
- Stops running containers
- Pulls latest code from GitHub
- Prunes Docker cache and unused volumes
- Rebuilds all containers with `--no-cache`
- Restarts everything

### ▶️ To use:

1. Upload it to your server, or clone from this repo
2. Make it executable:
   ```bash
   chmod +x update-deploy.sh
   ```
3. Run the script:
   ```bash
   ./update-deploy.sh
   ```

Or move it to a system path for global use:

```bash
sudo mv update-deploy.sh /usr/local/bin/update-landing
update-landing
```


# trigger build
