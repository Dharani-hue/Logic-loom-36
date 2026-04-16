import json
from profiles import profiles_store, assess_risk

def handler(request):
    path_parts = request.path.split('/')
    id = path_parts[-1]
    
    if request.method == 'PUT':
        data = json.loads(request.body)
        if id not in profiles_store:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
                'body': 'Profile not found'
            }
        
        profile = profiles_store[id]
        for key in data:
            if key != 'id' and key != 'createdAt':
                profile[key] = data[key]
        profile['risk'] = assess_risk(profile)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': json.dumps(profile)
        }
    else:
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
            'body': 'Method not allowed'
        }