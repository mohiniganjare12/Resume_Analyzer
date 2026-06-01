# ResumeIQ — Python FastAPI + React + Llama 3

AI-powered resume analyzer with:
- **Python FastAPI** backend (async, production-ready)
- **React + Tailwind + Recharts** frontend
- **Ollama Llama 3** for AI suggestions (runs locally)
- **ML keyword scoring** engine (pure Python, no API needed)
- **JWT authentication** (register / login / protected routes)
- **SQLite** database via SQLAlchemy async
- **Circular score rings + Radar chart** visualizations

---

## Prerequisites

| Tool      | Install |
|-----------|---------|
| Python 3.11+ | https://python.org |
| Node.js 18+  | https://nodejs.org |
| Ollama       | https://ollama.com |

---

## Setup — 3 terminals

### Terminal 1 — Ollama
```bash
ollama pull llama3
ollama run llama3
# Keep running (or use: ollama serve)
```

### Terminal 2 — Python Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

### Terminal 3 — React Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Project Structure

```
resumeiq/
├── backend/
│   ├── main.py             # FastAPI app entry point
│   ├── config.py           # Settings / environment vars
│   ├── database.py         # SQLAlchemy models + async DB
│   ├── schemas.py          # Pydantic request/response models
│   ├── auth_utils.py       # JWT + bcrypt helpers
│   ├── ml_scorer.py        # ML keyword + section scoring
│   ├── ollama_service.py   # Async Ollama Llama 3 client
│   ├── file_utils.py       # PDF / DOCX / TXT extraction
│   ├── requirements.txt
│   ├── .env
│   └── routes/
│       ├── auth.py         # /api/auth/register, login, me
│       └── analyze.py      # /api/analyze/ POST + history + get
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js      # Proxies /api to :8000
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx             # Routes + protected routes
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── Layout.jsx      # Sidebar navigation
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            ├── AnalyzePage.jsx
            └── ResultPage.jsx
```

---

## Environment Variables (backend/.env)

| Variable | Default | Notes |
|----------|---------|-------|
| `SECRET_KEY` | — | **Change this!** Long random string |
| `ALGORITHM` | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_DAYS` | 7 | Token lifetime |
| `OLLAMA_BASE_URL` | http://localhost:11434 | Ollama server |
| `OLLAMA_MODEL` | llama3 | Model name |
| `DATABASE_URL` | sqlite+aiosqlite:///./resumeiq.db | DB path |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Get JWT token |
| GET  | /api/auth/me | Yes | Current user |
| POST | /api/analyze/ | Yes | Analyze resume |
| GET  | /api/analyze/history | Yes | Past analyses |
| GET  | /api/analyze/{id} | Yes | Single result |
| GET  | /api/health | No | Health check |

Interactive docs: **http://localhost:8000/docs**

---

## Troubleshooting

**"Analysis failed"**
- Ensure backend is running: `curl http://localhost:8000/api/health`
- Check terminal for Python errors

**"Could not extract text"**
- Use `.txt` or `.docx` for best results
- Some PDFs are image-only — convert to text first

**Ollama slow / timeout**
- First run downloads ~4 GB model weights
- Try `phi3` for faster results on lower-end hardware: set `OLLAMA_MODEL=phi3` in `.env`

**CORS error**
- Vite proxies `/api` → `localhost:8000` automatically
- Only run frontend via `npm run dev`, not by opening index.html directly
