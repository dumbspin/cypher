# SentinelURL — Phishing URL Detection Platform

> Instant phishing detection: URL analysis, domain intelligence, blacklist checks, and page content scanning — all in one scan.

---

## Architecture

```
sentinelurl/
├── backend/      (Python FastAPI — deployed on Render.com free tier)
└── frontend/     (Next.js 14 App Router — deployed on Vercel free tier)
```

**Cache:** Upstash Redis (serverless, REST API)  
**Screenshots:** ScreenshotOne API (free tier)  
**Blacklists:** PhishTank live API + OpenPhish daily feed

---

## Quick Start

### Backend

```bash
cd sentinelurl/backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys (see Environment Variables below)

# 4. Run development server
uvicorn main:app --reload --port 8000
```

Backend available at: `http://localhost:8000`  
API docs available at: `http://localhost:8000/docs`

### Frontend

```bash
cd sentinelurl/frontend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Run development server
npm run dev
```

Frontend available at: `http://localhost:3000`

---

## Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis Bearer token |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Optional | Google Safe Browsing v4 key (Stage 1 blacklist) |
| `SCREENSHOTONE_API_KEY` | Optional | ScreenshotOne API key (page preview) |
| `CACHE_TTL_SECONDS` | Optional | Cache TTL, default `3600` |
| `ALLOWED_ORIGINS` | Required | Comma-separated allowed CORS origins |
| `RATE_LIMIT` | Optional | Requests per minute per IP, default `10` |

### Frontend (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Required | Backend URL (e.g. `https://your-app.onrender.com`) |

---

## API Reference

### `POST /analyze`

Analyse a single URL.

**Request body:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "scan_id": "abc123...",
  "url": "https://example.com",
  "normalized_url": "https://example.com",
  "risk_score": 45,
  "raw_score": 45,
  "classification": "Suspicious",
  "reasons": [
    {
      "module": "URL Analysis",
      "reason": "URL length is 87 characters (>75)",
      "score": 15
    }
  ],
  "domain_info": {
    "domain": "example.com",
    "registrar": "Some Registrar Inc.",
    "creation_date": "2020-01-15",
    "expiry_date": "2025-01-15",
    "age_days": 1520
  },
  "screenshot_url": "https://api.screenshotone.com/take?...",
  "cached": false,
  "blacklisted": false
}
```

**Rate limit:** 10 requests/minute per IP

---

### `POST /bulk`

Bulk-scan up to 50 URLs from a CSV file.

**Request:** `multipart/form-data` with field `file` (CSV, one URL per line)

**Rate limit:** 2 requests/minute per IP

---

### `GET /health`

Returns `{ "status": "ok" }` — used by UptimeRobot to prevent Render cold starts.

---

## Risk Scoring

| Score | Classification |
|---|---|
| 0 – 29 | ✅ Safe |
| 30 – 59 | ⚠️ Suspicious |
| 60 – 100 | 🚨 Phishing |

### Detection Modules

| Module | Checks |
|---|---|
| **URL Analysis** | Length, IP hostname, subdomains, hyphens, `@` symbol, double-slash, HTTP, redirect chain, phishing keywords |
| **Domain Intelligence** | WHOIS age (primary), RDAP fallback, expiry date |
| **Content Scanner** | Password fields, external form actions, hidden iframes, login keywords, favicon domain, title brand mismatch, meta-refresh |
| **Blacklist Checker** | Stage 1: Google Safe Browsing v4 (MALWARE, SOCIAL_ENGINEERING, UNWANTED_SOFTWARE, POTENTIALLY_HARMFUL_APPLICATION) · Stage 2: PhishDestroy domain reputation (no key) · Stage 3: OpenPhish local feed |

---

## Security Features

- **SSRF Guard**: Blocks private/reserved IPs (RFC 1918, loopback, link-local, metadata endpoints), dangerous schemes (`javascript:`, `file:`, `ftp:`, `data:`), and validates DNS resolution.
- **Rate Limiting**: slowapi enforces 10 req/min (single) and 2 req/min (bulk) per IP.
- **CORS**: Restricted to `ALLOWED_ORIGINS` only — no wildcard `*`.
- **Input Validation**: Pydantic enforces max URL length (2048) and rejects null bytes/control characters.
- **Response Size Cap**: HTTP response bodies are limited to 2 MB.
- **Timeouts**: `connect=10s`, `read=15s` on all outbound requests.

---

## Deployment

### Backend — Render.com (Free Tier)

1. Push `sentinelurl/backend/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add all environment variables in the Render dashboard
5. Add your Render URL to `ALLOWED_ORIGINS`

**Cold-start prevention:** Point UptimeRobot to `https://your-app.onrender.com/health` with a 5-minute poll interval.

### Frontend — Vercel (Free Tier)

1. Push `sentinelurl/frontend/` to a GitHub repo
2. Import the repo on [vercel.com](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy

---

## Test URLs

| URL | Expected |
|---|---|
| `https://www.wikipedia.org` | ✅ Safe (0–10) |
| `https://secure-login-update.info/account/verify` | ⚠️ Suspicious / 🚨 Phishing (60+) |
| Any PhishTank sample URL | 🚨 Phishing — blacklisted |

---

## Free API Keys

| Service | Link | Notes |
|---|---|---|
| Google Safe Browsing | https://developers.google.com/safe-browsing | Free: enable via Google Cloud Console, no billing needed |
| PhishDestroy | https://api.destroy.tools | No key required — works out-of-the-box |
| ScreenshotOne | https://screenshotone.com | Free tier: 100 screenshots/month |

---

## License

MIT — educational and personal use.
