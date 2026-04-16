import json

def handler(request):
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'},
        'body': json.dumps({'status': 'healthy', 'service': 'ElderGuard AI Backend'})
    }