# 🏏 IPL NRR & Runs Calculator

Calculate **required Net Run Rate (NRR)** and **runs to score/restrict** so a team can reach a desired position in the **IPL Points Table**.

---

## ✨ Summary

The tool helps teams estimate:
- The **range of NRR** needed, and
- The **runs to score or restrict the opposition to**

…so they can meet a target on the points table.

---

## 🧰 Tech Stack

- **Backend:** Node.js (v22.11.0), Express
- **Frontend:** React (Vite)
- **Testing:** Jest (if configured)
- **Dev Tools:**  
  - Linux (Ubuntu 22.04) – Dev environment  
  - VS Code – Editor  
  - ChatGPT – Error solving / algorithm understanding / testing ideas  
  - Google – Research, library docs, bug solving  
  - Figma – Design reference  
  - GitHub – Version control & collaboration

> **Node.js Version:** `v22.11.0` (use this for local development unless you run via Docker)

---

## 🚀 Quick Start

### Backend

1. Create `.env` in `backend/`
   ```bash
   cp backend/example.env backend/.env
   ```
2. Install & run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Backend runs at **http://localhost:5000**

---

### Frontend

1. Create `.env` in `frontend/`
   ```bash
   cp frontend/example.env frontend/.env
   ```
2. Install & run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Frontend runs at **http://localhost:5173/**

---

## 🐳 Run with Docker

1. Install Docker Desktop:
   - **Windows:** https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64  
   - **macOS (ARM64):** https://desktop.docker.com/mac/main/arm64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-arm64  
   - **Linux (Ubuntu):** https://desktop.docker.com/linux/main/amd64/docker-desktop-amd64.deb?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-linux-amd64
2. From the project root:
   ```bash
   docker compose up --build
   ```

This will start both **frontend** and **backend** containers.

---

## 📂 Project Structure

```
.
├── backend/
│   ├── example.env
│   ├── src/
│   └── ...
├── frontend/
│   ├── example.env
│   ├── src/
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## 🧪 NPM Scripts (common)

> **Backend** (`/backend`)
- `npm run dev` — start dev server (nodemon if configured)
- `npm test` — run tests (if configured)

> **Frontend** (`/frontend`)
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

---

## 🗝️ Environment Variables

Create and update these from the provided examples:

- **Backend:** `backend/.env` (copy from `backend/example.env`)
- **Frontend:** `frontend/.env` (copy from `frontend/example.env`)

> Fill in values like API base URLs, keys, and any feature flags required by your setup.

---

## 🛠️ Troubleshooting

- **Port already in use**
  - Backend: change port in `backend/.env` (default `5000`)
  - Frontend: change Vite port using `--port` or `.env` (default `5173`)
- **Wrong Node version**
  - Use `v22.11.0` (or run via Docker to avoid local version issues)
- **CORS errors**
  - Ensure frontend `VITE_API_BASE_URL` points to the backend URL
  - Confirm backend CORS middleware allows the frontend origin

---

## 📜 License

Add your license here (e.g., MIT).

---

## 🙌 Contributing

Issues and PRs are welcome. Please open an issue for discussion before large changes.
