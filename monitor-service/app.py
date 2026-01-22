from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
import requests
import time
import os
from dotenv import load_dotenv
from celery import Celery

load_dotenv()

app = Flask(__name__)
CORS(app)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
celery_app = Celery('monitor', broker=REDIS_URL, backend=REDIS_URL)


class APIMonitor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'API-Monitor-Dashboard/1.0',
            'Accept': 'application/json'
        })
    
    def check_api(self, api_config):
        """Check a single API endpoint"""
        results = []
        
        for endpoint in api_config['endpoints']:
            url = f"{api_config['base_url']}{endpoint['path']}"
            
            try:
                start_time = time.time()
                try:
                    response = self.session.head(url, timeout=10, allow_redirects=True)
                    method_used = 'HEAD'
                except Exception:
                    response = self.session.get(url, timeout=10)
                    method_used = 'GET'
                response_time = (time.time() - start_time) * 1000
                
                content_type = response.headers.get('content-type', '')
                retry_after = response.headers.get('retry-after')

                result = {
                    "api_name": api_config['name'],
                    "url": url,
                    "status_code": response.status_code,
                    "response_time_ms": round(response_time, 2),
                    "success": response.status_code == 200,
                    "timestamp": datetime.utcnow().isoformat(),
                    "content_type": content_type,
                    "data_size_bytes": int(response.headers.get('content-length') or len(response.content) or 0),
                    "retry_after": retry_after,
                    "method_used": method_used
                }
                
                results.append(result)
                
            except Exception as e:
                results.append({
                    "api_name": api_config['name'],
                    "url": url,
                    "error": str(e),
                    "success": False,
                    "timestamp": datetime.utcnow().isoformat()
                })
        
        return results

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "monitor-service"
    })


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
