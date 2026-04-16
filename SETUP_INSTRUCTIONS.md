# ElderGuard AI - Complete Setup & Running Guide

## Overview
ElderGuard AI is a full-stack application for detecting elderly loneliness using AI-powered assessment. It consists of:
- **Frontend**: React 18.3.1 with Vite (TypeScript)
- **Backend**: FastAPI with OpenAI integration

---

## Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key (from https://platform.openai.com/api-keys)

---

## Frontend Setup & Running

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Frontend will be available at: **http://localhost:5173**

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables (Optional)
Create `.env` in the project root if you want to customize the API URL:
```
VITE_API_URL=http://localhost:8000
```

---

## Backend Setup & Running

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

**Create `.env` file in the `backend/` directory:**
```bash
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

⚠️ **SECURITY WARNING**: Never commit `.env` to Git. The `.gitignore` already excludes it.

### 5. Run the Backend Server
```bash
python main.py
```

Backend will be available at: **http://localhost:8000**

### 6. Access API Documentation
Swagger API docs: **http://localhost:8000/docs**

Available endpoints:
- `POST /api/assess` - Submit assessment data for AI analysis
- `GET /api/trends` - Get 7-day trend data
- `GET /api/recommendations/{risk_level}` - Get recommendations by risk level (High/Medium/Low)
- `GET /health` - Health check

---

## Running the Full Stack

### Terminal 1 - Start Backend
```bash
cd backend
python main.py
# Runs on http://localhost:8000
```

### Terminal 2 - Start Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

### Access the Application
Open in browser: **http://localhost:5173**

---

## Testing the Assessment Flow

1. **Login Page**
   - Select role: "Caregiver/NGO Staff" or "Family Member"
   - Click to proceed

2. **For Caregiver/NGO Staff**
   - Navigate to Input Panel
   - Fill in assessment form with elder information
   - Submit form to trigger AI analysis
   - View risk assessment, recommendations, and trends chart
   - Listen for alarm sound on HIGH risk alerts

3. **For Family Member**
   - View Family Dashboard
   - See elder profile, activities, engagement metrics, recommendations
   - Behavioral analysis and alerts

---

## Troubleshooting

### Backend Connection Issues
**Q: "Error: fetch failed" when submitting form**
- Ensure backend is running on http://localhost:8000
- Check backend console for errors
- Verify CORS is enabled (should be in main.py)

### OpenAI API Errors
**Q: "OpenAI API key invalid" in backend logs**
- Verify API key is correctly set in `backend/.env`
- Check key has not expired at https://platform.openai.com/account/api-keys
- Ensure key has sufficient credits

### Frontend Build Errors
**Q: "Module not found" errors**
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Port Already in Use
**Backend port 8000 in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Frontend port 5173 in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## Architecture Overview

### Frontend Flow
```
LoginPage → (Role Selection) → 
  ├─ Caregiver → HomePage → InputPanelPage (Assessment) → Results + Charts
  └─ Family Member → FamilyDashboardPage (View Elder Status)
```

### Backend Flow
```
POST /api/assess (Assessment Data)
  ↓
OpenAI GPT-3.5-turbo Analysis
  ↓
Parse & Return AIPrediction (risk, summary, recommendations)
```

### Key Features
- ✅ Conversational assessment form with color-coded sections
- ✅ Real-time AI analysis via OpenAI
- ✅ Risk-based alarm sound alert (High risk)
- ✅ 7-day trend visualization with Recharts
- ✅ Family dashboard for eldercare monitoring
- ✅ Graceful fallback to mock responses if API fails

---

## Development Notes

### Frontend Architecture
- **React Router 6.18**: Page-based routing with role separation
- **CSS Modules**: Component-scoped styling with pastel glassmorphism theme
- **Custom Hooks**: `useAlarmSound`, `useAssessmentAPI` for reusable logic
- **Recharts**: Line and bar chart visualization

### Backend Architecture
- **FastAPI**: Modern async Python web framework
- **Pydantic**: Data validation with response models
- **OpenAI Client**: GPT-3.5-turbo for assessment analysis
- **CORS**: Configured for local frontend development

### Styling
- **Color Palette**: Lavender, light blue, mint green, peach (pastel theme)
- **Components**: Glassmorphism effects with soft shadows
- **Responsive**: Mobile-first CSS approach

---

## Next Steps (Optional Enhancements)

1. **Database Integration**: Add MongoDB/PostgreSQL for persistent storage
2. **Authentication**: Implement JWT-based auth for production
3. **Email Alerts**: Send notifications for high-risk assessments
4. **Mobile App**: Build React Native version
5. **Advanced Analytics**: Extend FamilyDashboard with historical trends
6. **Multi-language**: Add i18n support for international use

---

## Support

For issues or questions:
1. Check backend logs: `python main.py` (console output)
2. Check frontend browser console: F12 → Console tab
3. Verify OpenAI API dashboard: https://platform.openai.com/account
4. Review API docs: http://localhost:8000/docs (Swagger)

---

**Happy Monitoring! 🏥❤️**
