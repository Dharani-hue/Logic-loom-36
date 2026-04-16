import json
from _db import SessionLocal, ElderlyProfileDB, assess_profile_risk
from datetime import datetime

def handler(request):
    if request.method == 'GET':
        familyContact = request.query.get('familyContact') if hasattr(request, 'query') else None
        db = SessionLocal()
        query = db.query(ElderlyProfileDB)
        if familyContact:
            query = query.filter(ElderlyProfileDB.familyContact.ilike(f'%{familyContact}%'))
        profiles = query.all()
        db.close()
        result = [{
            'id': p.id,
            'name': p.name,
            'age': p.age,
            'gender': p.gender,
            'location': p.location,
            'familyContact': p.familyContact,
            'appetite': p.appetite,
            'mood': p.mood,
            'mobility': p.mobility,
            'sleepQuality': p.sleepQuality,
            'lonelinessScore': p.lonelinessScore,
            'meals': p.meals,
            'outings': p.outings,
            'activities': p.activities,
            'interactions': p.interactions,
            'socialConnections': p.socialConnections,
            'notes': p.notes,
            'risk': p.risk,
            'createdAt': p.createdAt.isoformat() + 'Z' if p.createdAt else None
        } for p in profiles]
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(result)
        }
    elif request.method == 'POST':
        data = json.loads(request.body)
        db = SessionLocal()
        now = datetime.utcnow()
        new_id = f"{int(now.timestamp())}-{len(db.query(ElderlyProfileDB).all()) + 1}"
        risk = assess_profile_risk(type('Profile', (), data)())
        db_profile = ElderlyProfileDB(
            id=new_id,
            name=data['name'],
            age=data['age'],
            gender=data['gender'],
            location=data['location'],
            familyContact=data['familyContact'],
            appetite=data['appetite'],
            mood=data['mood'],
            mobility=data['mobility'],
            sleepQuality=data['sleepQuality'],
            lonelinessScore=data['lonelinessScore'],
            meals=data.get('meals', ''),
            outings=data.get('outings', ''),
            activities=data.get('activities', ''),
            interactions=data.get('interactions', ''),
            socialConnections=data.get('socialConnections', ''),
            notes=data['notes'],
            risk=risk,
            createdAt=now
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        db.close()
        result = {
            'id': db_profile.id,
            'name': db_profile.name,
            'age': db_profile.age,
            'gender': db_profile.gender,
            'location': db_profile.location,
            'familyContact': db_profile.familyContact,
            'appetite': db_profile.appetite,
            'mood': db_profile.mood,
            'mobility': db_profile.mobility,
            'sleepQuality': db_profile.sleepQuality,
            'lonelinessScore': db_profile.lonelinessScore,
            'meals': db_profile.meals,
            'outings': db_profile.outings,
            'activities': db_profile.activities,
            'interactions': db_profile.interactions,
            'socialConnections': db_profile.socialConnections,
            'notes': db_profile.notes,
            'risk': db_profile.risk,
            'createdAt': db_profile.createdAt.isoformat() + 'Z'
        }
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(result)
        }
    else:
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': 'Method not allowed'
        }