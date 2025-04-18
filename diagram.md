graph TD
  A[User Browser] -->|HTTP/HTTPS| B[Nginx]
  B -->|/ --> Static Files| C[Frontend (React)]
  B -->|/iframe /update /admin| D[Backend (Node.js)]
  D -->|WebSocket| A
  D -->|Reads and writes| E[streamConfig.json]

  subgraph Server
    B
    C
    D
  end

  subgraph GitHub
    F[Codebase Repo]
  end

  F -->|git clone / pull| Server

  