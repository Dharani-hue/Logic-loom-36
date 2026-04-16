# ElderGuard AI - Full Stack Setup

## Backend Setup

### 1. Install Python dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Configure OpenAI API
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your OpenAI API key
```

### 3. Run backend server
```bash
cd backend
python main.py
```
Backend will run on `http://localhost:8000`

### 4. API Documentation
Once backend is running, visit `http://localhost:8000/docs` for interactive Swagger docs

---

## Frontend Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```
Frontend will run on `http://localhost:4173`

---

## API Endpoints

### POST `/api/assess`
Analyze elder condition with AI
```json
{
  "meals": "Breakfast, lunch, dinner",
  "outings": "2 this week",
  "activities": "Reading, gardening",
  "interactions": "5",
  "mood": "Neutral",
  "moodScore": 3,
  "socialConnections": "Family, friends",
  "familyContact": "2 calls per week",
  "notes": "Additional observations"
}
```

Response:
```json
{
  "risk": "Low|Medium|High",
  "summary": "Behavioral analysis summary",
  "recommendations": ["action 1", "action 2"],
  "alert": "High risk alert message (if applicable)"
}
```

### GET `/api/trends`
Get historical trend data

### GET `/api/recommendations/{risk_level}`
Get recommendations based on risk level

### GET `/health`
Health check endpoint

---

## Features

✅ AI-powered risk assessment using OpenAI
✅ Real-time behavioral analysis
✅ Graph-based trend visualization
✅ Dynamic color alerts for high risk
✅ Comprehensive family dashboard
✅ Alarm notifications
✅ Conversational assessment form
✅ REST API with CORS enabled
