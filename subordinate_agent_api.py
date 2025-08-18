#!/usr/bin/env python3
"""
Subordinate Agent API Interface
==============================
Provides API endpoints for subordinate agents to communicate with the system
"""

from flask import Flask, request, jsonify
import requests
import json
import time
from datetime import datetime
import threading

app = Flask(__name__)

class SubordinateAgentInterface:
    def __init__(self):
        self.registered_agents = {}
        self.main_app_url = "http://localhost:5000"
        self.doc_service_url = "http://localhost:5001"
        
    def register_agent(self, agent_id, callback_url, capabilities):
        """Register a subordinate agent"""
        agent_info = {
            'agent_id': agent_id,
            'callback_url': callback_url,
            'capabilities': capabilities,
            'registered_at': datetime.now().isoformat(),
            'last_ping': datetime.now().isoformat(),
            'status': 'active'
        }
        
        self.registered_agents[agent_id] = agent_info
        return agent_info
    
    def process_document_request(self, agent_id, request_data):
        """Process document generation request from subordinate agent"""
        try:
            # Validate request
            required_fields = ['filename_base', 'content', 'formats']
            if not all(field in request_data for field in required_fields):
                return {'error': 'Missing required fields', 'required': required_fields}
            
            # Forward to document service
            doc_response = requests.post(
                f"{self.doc_service_url}/api/documents/generate",
                json=request_data,
                timeout=30
            )
            
            if doc_response.status_code == 200:
                result = doc_response.json()
                
                # Log the request
                self.log_agent_activity(agent_id, 'document_generation', request_data)
                
                return {
                    'success': True,
                    'agent_id': agent_id,
                    'request_processed': True,
                    'document_paths': result.get('paths', {}),
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return {'error': 'Document service unavailable', 'status': doc_response.status_code}
                
        except Exception as e:
            return {'error': str(e), 'agent_id': agent_id}
    
    def get_system_status(self):
        """Get current system status for subordinate agents"""
        main_app_healthy = self.check_service_health(self.main_app_url)
        doc_service_healthy = self.check_service_health(self.doc_service_url)
        
        return {
            'timestamp': datetime.now().isoformat(),
            'system': 'hibla-automation',
            'status': 'operational' if main_app_healthy and doc_service_healthy else 'partial',
            'services': {
                'main_application': {
                    'url': self.main_app_url,
                    'status': 'online' if main_app_healthy else 'offline'
                },
                'document_service': {
                    'url': self.doc_service_url,
                    'status': 'online' if doc_service_healthy else 'offline'
                }
            },
            'registered_agents': len(self.registered_agents),
            'available_endpoints': [
                '/api/agent/register',
                '/api/agent/document/generate',
                '/api/agent/status',
                '/api/agent/ping'
            ]
        }
    
    def check_service_health(self, url):
        """Check if a service is responding"""
        try:
            response = requests.get(f"{url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def log_agent_activity(self, agent_id, activity_type, data):
        """Log subordinate agent activity"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'agent_id': agent_id,
            'activity': activity_type,
            'data': data
        }
        print(f"📝 Agent Activity: {json.dumps(log_entry, indent=2)}")
    
    def ping_agent(self, agent_id):
        """Update agent last ping time"""
        if agent_id in self.registered_agents:
            self.registered_agents[agent_id]['last_ping'] = datetime.now().isoformat()
            return True
        return False

# Initialize interface
agent_interface = SubordinateAgentInterface()

# API Endpoints for Subordinate Agents

@app.route('/api/agent/register', methods=['POST'])
def register_agent():
    """Register a subordinate agent"""
    try:
        data = request.json
        agent_id = data.get('agent_id')
        callback_url = data.get('callback_url')
        capabilities = data.get('capabilities', [])
        
        if not agent_id:
            return jsonify({'error': 'agent_id is required'}), 400
        
        agent_info = agent_interface.register_agent(agent_id, callback_url, capabilities)
        
        return jsonify({
            'success': True,
            'message': f'Agent {agent_id} registered successfully',
            'agent_info': agent_info,
            'system_endpoints': {
                'document_generation': '/api/agent/document/generate',
                'status_check': '/api/agent/status',
                'ping': '/api/agent/ping'
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/agent/document/generate', methods=['POST'])
def generate_document_for_agent():
    """Generate document for subordinate agent"""
    try:
        data = request.json
        agent_id = data.get('agent_id')
        
        if not agent_id:
            return jsonify({'error': 'agent_id is required'}), 400
        
        if agent_id not in agent_interface.registered_agents:
            return jsonify({'error': 'Agent not registered'}), 403
        
        # Process the document request
        result = agent_interface.process_document_request(agent_id, data)
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/agent/status', methods=['GET'])
def get_status_for_agents():
    """Get system status for subordinate agents"""
    return jsonify(agent_interface.get_system_status())

@app.route('/api/agent/ping', methods=['POST'])
def ping_agent():
    """Agent ping endpoint"""
    try:
        data = request.json
        agent_id = data.get('agent_id')
        
        if not agent_id:
            return jsonify({'error': 'agent_id is required'}), 400
        
        success = agent_interface.ping_agent(agent_id)
        
        if success:
            return jsonify({'success': True, 'message': f'Ping received from {agent_id}'})
        else:
            return jsonify({'error': 'Agent not registered'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/agent/list', methods=['GET'])
def list_registered_agents():
    """List all registered agents"""
    return jsonify({
        'registered_agents': agent_interface.registered_agents,
        'total_count': len(agent_interface.registered_agents)
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check for agent interface"""
    return jsonify({'status': 'ok', 'service': 'subordinate-agent-api'})

def run_agent_api():
    """Run the subordinate agent API"""
    print("🤖 Starting Subordinate Agent API Interface...")
    print("📡 Available endpoints:")
    print("   POST /api/agent/register - Register an agent")
    print("   POST /api/agent/document/generate - Generate documents")
    print("   GET  /api/agent/status - Get system status")
    print("   POST /api/agent/ping - Agent ping")
    print("   GET  /api/agent/list - List registered agents")
    print("   GET  /health - Health check")
    
    app.run(host='0.0.0.0', port=5002, debug=False)

if __name__ == "__main__":
    run_agent_api()