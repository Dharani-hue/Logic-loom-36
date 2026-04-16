from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ElderGuard AI Backend", version="1.0.0")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4173", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client (with error handling for httpx compatibility)
try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except Exception as e:
    print(f"Warning: OpenAI client initialization had issues: {e}")
    print("API responses will use mock fallback.")
    client = None

class AssessmentInput(BaseModel):
    meals: str
    outings: str
    activities: str
    interactions: str
    mood: str
    moodScore: int
    socialConnections: str
    familyContact: str
    notes: str

class AssessmentResult(BaseModel):
    risk: str
    summary: str
    recommendations: list
    alert: str = None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ElderGuard AI Backend"}

@app.post("/api/assess", response_model=AssessmentResult)
async def assess_elder(assessment: AssessmentInput):
    """
    Analyze elder's condition using AI
    Returns risk level, summary, and recommendations
    """
    try:
        # Build context for AI
        context = f"""
        Elder Assessment Data:
        - Meals: {assessment.meals}
        - Outings this week: {assessment.outings}
        - Activities: {assessment.activities}
        - Social interactions: {assessment.interactions}
        - Current mood: {assessment.mood}
        - Mood score (1-5): {assessment.moodScore}
        - Social connections: {assessment.socialConnections}
        - Family contact: {assessment.familyContact}
        - Additional notes: {assessment.notes}
        
        Based on this data, provide:
        1. A risk level (Low/Medium/High)
        2. A behavioral summary (2-3 sentences)
        3. 3-4 specific, actionable recommendations
        4. An alert message if risk is high
        
        Return ONLY valid JSON without code blocks in this format:
        {{
            "risk": "Low|Medium|High",
            "summary": "...",
            "recommendations": ["...", "...", "..."],
            "alert": "..."
        }}
        """

        # Call OpenAI if client is available
        if client is None:
            print("OpenAI client not available, using mock assessment")
            return mock_assessment(assessment)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert geriatric loneliness detection AI. Analyze elderly care data and provide compassionate but accurate risk assessments."},
                {"role": "user", "content": context}
            ],
            temperature=0.7,
            max_tokens=500
        )

        # Parse response
        result_text = response.choices[0].message.content
        
        # Remove markdown code blocks if present
        result_text = result_text.replace("```json", "").replace("```", "").strip()
        
        import json
        try:
            result_data = json.loads(result_text)
        except json.JSONDecodeError:
            # Fallback to mock if JSON parsing fails
            result_data = mock_assessment(assessment)

        return AssessmentResult(**result_data)

    except Exception as e:
        print(f"Error: {e}")
        # Fallback to mock assessment
        return mock_assessment(assessment)

def mock_assessment(assessment: AssessmentInput) -> AssessmentResult:
    """Fallback mock assessment if AI fails"""
    try:
        interactions = int(assessment.interactions) if assessment.interactions.isdigit() else 0
    except:
        interactions = 0
    
    try:
        mood_score = int(assessment.moodScore)
    except:
        mood_score = 3

    if assessment.mood in ["Sad", "Withdrawn"] or interactions < 5 or mood_score < 2:
        return AssessmentResult(
            risk="High",
            summary="Recent indicators point to heightened loneliness risk. Immediate intervention recommended.",
            recommendations=[
                "Increase family or volunteer visits",
                "Schedule meaningful conversations",
                "Monitor mood changes closely"
            ],
            alert="High risk alert: Immediate care attention recommended."
        )
    elif assessment.mood == "Neutral" or interactions < 10 or mood_score < 3:
        return AssessmentResult(
            risk="Medium",
            summary="Moderate isolation signals detected. Encourage more social routines.",
            recommendations=[
                "Introduce weekly group activities",
                "Increase family contact frequency",
                "Track daily mood patterns"
            ]
        )
    else:
        return AssessmentResult(
            risk="Low",
            summary="Positive social patterns present. Continue current support level.",
            recommendations=[
                "Maintain care routine consistency",
                "Encourage hobbies and activities",
                "Share updates with family"
            ]
        )

@app.get("/api/trends")
async def get_trends():
    """Get historical trend data"""
    return {
        "weeklyData": [
            {"day": "Mon", "riskScore": 35, "interactions": 5, "mood": 3},
            {"day": "Tue", "riskScore": 42, "interactions": 4, "mood": 2},
            {"day": "Wed", "riskScore": 55, "interactions": 3, "mood": 2},
            {"day": "Thu", "riskScore": 68, "interactions": 2, "mood": 1},
            {"day": "Fri", "riskScore": 72, "interactions": 2, "mood": 1},
            {"day": "Sat", "riskScore": 65, "interactions": 3, "mood": 2},
            {"day": "Sun", "riskScore": 78, "interactions": 1, "mood": 1},
        ]
    }

@app.get("/api/recommendations/{risk_level}")
async def get_recommendations(risk_level: str):
    """Get recommendations based on risk level"""
    if risk_level.lower() == "high":
        return {
            "urgent": True,
            "recommendations": [
                "Schedule immediate family visit",
                "Arrange professional caregiver support",
                "Increase daily check-ins to 2-3x",
                "Consider therapeutic activities"
            ]
        }
    elif risk_level.lower() == "medium":
        return {
            "urgent": False,
            "recommendations": [
                "Weekly family visits planned",
                "Daily phone calls or video chats",
                "Group activity participation",
                "Hobby engagement sessions"
            ]
        }
    else:
        return {
            "urgent": False,
            "recommendations": [
                "Maintain current social routines",
                "Continue regular family contact",
                "Encourage continued activities",
                "Monitor for any changes"
            ]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
