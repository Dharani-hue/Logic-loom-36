import json
import os
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except:
    client = None

def mock_assessment(assessment):
    try:
        interactions = int(assessment.get('interactions', 0)) if assessment.get('interactions', '').isdigit() else 0
    except:
        interactions = 0
    try:
        mood_score = int(assessment.get('moodScore', 3))
    except:
        mood_score = 3
    ucla_score = assessment.get('uclaLoneliness', 10)
    if ucla_score >= 16 or (assessment.get('mood') in ["Sad", "Withdrawn"] and (interactions < 3 or mood_score < 2)):
        return {
            'risk': 'High',
            'summary': f"UCLA Loneliness Scale score of {ucla_score}/20 indicates significant loneliness. Combined with other behavioral indicators, immediate intervention is recommended.",
            'recommendations': [
                "Increase frequency of family or volunteer visits",
                "Arrange for group activities or social programs",
                "Consider counseling or peer support groups",
                "Schedule regular check-ins and meaningful conversations"
            ],
            'alert': f"🚨 High loneliness alert (UCLA: {ucla_score}/20). Immediate care attention recommended."
        }
    elif ucla_score >= 10 or assessment.get('mood') == "Neutral" or (interactions < 7 and interactions >= 3):
        return {
            'risk': 'Medium',
            'summary': f"UCLA Loneliness Scale score of {ucla_score}/20 suggests moderate loneliness. Consider increasing social engagement and support.",
            'recommendations': [
                "Introduce weekly group activities or hobbies",
                "Increase family contact frequency to 2-3 times weekly",
                "Encourage participation in community events",
                "Track mood patterns and social engagement trends"
            ]
        }
    else:
        return {
            'risk': 'Low',
            'summary': f"UCLA Loneliness Scale score of {ucla_score}/20 indicates low loneliness. Positive social patterns and engagement are present.",
            'recommendations': [
                "Maintain current social routines and activities",
                "Continue regular family contact and outings",
                "Encourage hobbies and interests that bring joy",
                "Monitor for any changes in mood or social engagement"
            ]
        }

def handler(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        context = f"""
        Elder Assessment Data:
        - Meals: {data.get('meals', '')}
        - Outings this week: {data.get('outings', '')}
        - Activities: {data.get('activities', '')}
        - Social interactions: {data.get('interactions', '')}
        - Current mood: {data.get('mood', '')}
        - Mood score (1-5): {data.get('moodScore', 3)}
        - Social connections: {data.get('socialConnections', '')}
        - Family contact: {data.get('familyContact', '')}
        - Additional notes: {data.get('notes', '')}
        UCLA Loneliness Scale Score: {data.get('uclaLoneliness', 10)}/20
        Based on this data, provide risk level, summary, recommendations, alert in JSON.
        """
        if client:
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are an expert geriatric loneliness detection AI. Analyze elderly care data and provide compassionate but accurate risk assessments."},
                        {"role": "user", "content": context}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                result_text = response.choices[0].message.content
                result_text = result_text.replace("```json", "").replace("```", "").strip()
                result = json.loads(result_text)
            except:
                result = mock_assessment(data)
        else:
            result = mock_assessment(data)
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(result)
        }
    else:
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': 'Method not allowed'
        }