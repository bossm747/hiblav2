#!/usr/bin/env python3
"""
Webhook Notification System for Subordinate Agent Communication
============================================================
Establishes communication channels for subordinate agents
"""

import requests
import json
import time
from datetime import datetime

class WebhookNotificationSystem:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.doc_service_url = "http://localhost:5001"
        self.agent_endpoints = []
        
    def register_subordinate_agent(self, agent_id, callback_url):
        """Register a subordinate agent for notifications"""
        agent_info = {
            'agent_id': agent_id,
            'callback_url': callback_url,
            'registered_at': datetime.now().isoformat(),
            'status': 'active'
        }
        self.agent_endpoints.append(agent_info)
        print(f"📡 Registered subordinate agent: {agent_id}")
        return agent_info
    
    def send_automation_status(self):
        """Send automation status to all registered agents"""
        status_payload = {
            'timestamp': datetime.now().isoformat(),
            'system': 'hibla-automation',
            'status': 'operational',
            'services': {
                'main_app': self.check_service_health(self.base_url),
                'document_service': self.check_document_service(),
            },
            'capabilities': [
                'document_generation',
                'workflow_automation',
                'real_time_processing',
                'multi_format_output'
            ],
            'endpoints': {
                'health': f"{self.base_url}/health",
                'api': f"{self.base_url}/api",
                'document_gen': f"{self.doc_service_url}/api/documents/generate"
            }
        }
        
        # Broadcast to all registered agents
        for agent in self.agent_endpoints:
            try:
                self.send_notification(agent['callback_url'], status_payload)
                print(f"✅ Status sent to agent: {agent['agent_id']}")
            except Exception as e:
                print(f"❌ Failed to notify agent {agent['agent_id']}: {e}")
    
    def send_document_ready_notification(self, document_info):
        """Notify agents when documents are generated"""
        notification = {
            'event': 'document_ready',
            'timestamp': datetime.now().isoformat(),
            'document': document_info,
            'service_url': self.doc_service_url
        }
        
        for agent in self.agent_endpoints:
            try:
                self.send_notification(agent['callback_url'], notification)
                print(f"📄 Document notification sent to: {agent['agent_id']}")
            except Exception as e:
                print(f"❌ Failed to notify agent about document: {e}")
    
    def send_workflow_trigger(self, workflow_type, data):
        """Send workflow triggers to subordinate agents"""
        trigger_payload = {
            'event': 'workflow_trigger',
            'workflow_type': workflow_type,
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'hibla-automation-system'
        }
        
        for agent in self.agent_endpoints:
            try:
                self.send_notification(agent['callback_url'], trigger_payload)
                print(f"🔄 Workflow trigger sent to: {agent['agent_id']}")
            except Exception as e:
                print(f"❌ Failed to send workflow trigger: {e}")
    
    def check_service_health(self, url):
        """Check if a service is healthy"""
        try:
            response = requests.get(f"{url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def check_document_service(self):
        """Check document generation service status"""
        try:
            response = requests.get(f"{self.doc_service_url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def send_notification(self, callback_url, payload):
        """Send notification to a specific callback URL"""
        headers = {'Content-Type': 'application/json'}
        response = requests.post(callback_url, json=payload, headers=headers, timeout=10)
        return response.status_code == 200
    
    def broadcast_system_ready(self):
        """Broadcast that the automation system is ready"""
        ready_notification = {
            'event': 'system_ready',
            'timestamp': datetime.now().isoformat(),
            'system': 'hibla-automation',
            'message': 'Automation system is operational and ready for requests',
            'api_documentation': {
                'document_generation': {
                    'endpoint': f"{self.doc_service_url}/api/documents/generate",
                    'method': 'POST',
                    'payload': {
                        'filename_base': 'document_name',
                        'content': 'markdown content',
                        'formats': ['md', 'pdf', 'docx']
                    }
                },
                'health_check': {
                    'endpoint': f"{self.doc_service_url}/health",
                    'method': 'GET'
                }
            },
            'subordinate_agent_instructions': {
                'registration': 'Register with webhook system for notifications',
                'document_requests': 'Use POST requests to document generation endpoint',
                'status_monitoring': 'Subscribe to workflow trigger notifications',
                'error_handling': 'Implement retry logic for failed requests'
            }
        }
        
        print("📢 BROADCASTING SYSTEM READY TO SUBORDINATE AGENTS")
        print("=" * 60)
        print(f"🎯 System: {ready_notification['system']}")
        print(f"⏰ Timestamp: {ready_notification['timestamp']}")
        print(f"📄 Document Service: {self.doc_service_url}")
        print(f"🌐 Main App: {self.base_url}")
        
        print("\n📋 API ENDPOINTS FOR SUBORDINATE AGENTS:")
        for endpoint_name, endpoint_data in ready_notification['api_documentation'].items():
            print(f"   🔗 {endpoint_name.replace('_', ' ').title()}")
            print(f"      URL: {endpoint_data['endpoint']}")
            print(f"      Method: {endpoint_data['method']}")
            if 'payload' in endpoint_data:
                print(f"      Payload: {json.dumps(endpoint_data['payload'], indent=8)}")
        
        print("\n🤖 SUBORDINATE AGENT INSTRUCTIONS:")
        for instruction_key, instruction_value in ready_notification['subordinate_agent_instructions'].items():
            print(f"   ✅ {instruction_key.replace('_', ' ').title()}: {instruction_value}")
        
        # If there are registered agents, broadcast to them
        if self.agent_endpoints:
            for agent in self.agent_endpoints:
                try:
                    self.send_notification(agent['callback_url'], ready_notification)
                    print(f"📡 System ready notification sent to: {agent['agent_id']}")
                except Exception as e:
                    print(f"❌ Failed to notify agent: {e}")
        else:
            print("\n📢 NO REGISTERED AGENTS - BROADCASTING TO CONSOLE")
            print("🔍 Subordinate agents can register using:")
            print("   webhook_system.register_subordinate_agent('agent_id', 'callback_url')")
        
        return ready_notification

def main():
    """Main webhook notification demonstration"""
    print("🚀 Starting Webhook Notification System...")
    
    # Initialize webhook system
    webhook_system = WebhookNotificationSystem()
    
    # Example: Register a subordinate agent (would normally be done by the agent)
    # webhook_system.register_subordinate_agent('pareng-boyong-agent-1', 'http://agent-callback-url/webhook')
    
    # Broadcast system ready status
    webhook_system.broadcast_system_ready()
    
    # Send automation status
    webhook_system.send_automation_status()
    
    # Example document notification
    example_doc = {
        'filename': 'automation_workflow_document',
        'formats': ['md', 'pdf', 'docx'],
        'status': 'generated',
        'paths': {
            'md': './documents/automation_workflow_document.md',
            'pdf': './documents/automation_workflow_document.pdf',
            'docx': './documents/automation_workflow_document.docx'
        }
    }
    webhook_system.send_document_ready_notification(example_doc)
    
    print("\n✅ Webhook notification system demonstration complete")
    print("🔄 System ready for subordinate agent communication")

if __name__ == "__main__":
    main()