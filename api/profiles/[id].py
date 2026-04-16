import json
from _db import SessionLocal, ElderlyProfileDB, assess_profile_risk

def handler(request):
    path_parts = request.path.split('/')
    id = path_parts[-1]
    if request.method == 'PUT':
        data = json.loads(request.body)
        db = SessionLocal()
        profile = db.query(ElderlyProfileDB).filter(ElderlyProfileDB.id == id).first()
        if not profile:
            db.close()
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
                'body': 'Profile not found'
            }
        for key, value in data.items():
            setattr(profile, key, value)
        profile.risk = assess_profile_risk(type('Profile', (), data)())
        db.commit()
        db.refresh(profile)
        db.close()
        result = {
            'id': profile.id,
            'name': profile.name,
            'age': profile.age,
            'gender': profile.gender,
            'location': profile.location,
            'familyContact': profile.familyContact,
            'appetite': profile.appetite,
            'mood': profile.mood,
            'mobility': profile.mobility,
            'sleepQuality': profile.sleepQuality,
            'lonelinessScore': profile.lonelinessScore,
            'meals': profile.meals,
            'outings': profile.outings,
            'activities': profile.activities,
            'interactions': profile.interactions,
            'socialConnections': profile.socialConnections,
            'notes': profile.notes,
            'risk': profile.risk,
            'createdAt': profile.createdAt.isoformat() + 'Z' if profile.createdAt else None
        }
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(result)
        }
    else:
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': 'Method not allowed'
        }