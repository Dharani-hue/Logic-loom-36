import json
from datetime import datetime

# In-memory storage for serverless functions
profiles_store = {}

def handler(request):
    global profiles_store
    
    if request.method == 'GET':
        familyContact = request.args.get('familyContact') if hasattr(request, 'args') else None
        result = list(profiles_store.values())
        if familyContact:
            result = [p for p in result if p['familyContact'].lower().strip() == familyContact.lower().strip()]
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(result)
        }
    elif request.method == 'POST':
        data = json.loads(request.body)
        now = datetime.utcnow()
        new_id = f"{int(now.timestamp())}-{len(profiles_store) + 1}"
        
        profile = {
            'id': new_id,
            'name': data['name'],
            'age': data['age'],
            'gender': data['gender'],
            'location': data['location'],
            'familyContact': data['familyContact'],
            'appetite': data['appetite'],
            'mood': data['mood'],
            'mobility': data['mobility'],
            'sleepQuality': data['sleepQuality'],
            'lonelinessScore': data['lonelinessScore'],
            'meals': data.get('meals', ''),
            'outings': data.get('outings', ''),
            'activities': data.get('activities', ''),
            'interactions': data.get('interactions', ''),
            'socialConnections': data.get('socialConnections', ''),
            'notes': data['notes'],
            'risk': assess_risk(data),
            'createdAt': now.isoformat() + 'Z'
        }
        profiles_store[new_id] = profile
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(profile)
        }
    else:
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': 'Method not allowed'
        }

def assess_risk(data):
    score = data.get('lonelinessScore', 10)
    if score >= 16 or data.get('mobility') == 'Limited' or data.get('appetite') == 'Poor':
        return 'High'
    if score >= 12 or data.get('mobility') == 'Reduced' or data.get('appetite') == 'Fair':
        return 'Medium'
    return 'Low'