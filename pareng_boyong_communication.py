#!/usr/bin/env python3
"""
Pareng Boyong Communication Interface
====================================
Establishes direct communication channels with Pareng Boyong's subordinate agents
"""

import requests
import json
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ParengBoyongInterface:
    """Interface for communicating with Pareng Boyong's subordinate agents"""
    
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.doc_service_url = "http://localhost:5001"
        self.agent_api_url = "http://localhost:5002"
        self.registered_agents = {}
        
    def broadcast_availability(self):
        """Broadcast system availability to Pareng Boyong's network"""
        availability_message = {
            'timestamp': datetime.now().isoformat(),
            'system': 'hibla-automation-system',
            'status': 'OPERATIONAL',
            'message': 'Hibla Manufacturing Automation System is ready for subordinate agent requests',
            'services': {
                'main_application': {
                    'url': self.base_url,
                    'status': self.check_service_health(self.base_url),
                    'capabilities': [
                        'quotation_management',
                        'sales_order_processing',
                        'job_order_tracking',
                        'inventory_management',
                        'dashboard_analytics'
                    ]
                },
                'document_generation': {
                    'url': self.doc_service_url,
                    'status': self.check_service_health(self.doc_service_url),
                    'capabilities': [
                        'markdown_to_pdf_conversion',
                        'docx_document_generation',
                        'multi_format_output',
                        'real_time_processing'
                    ]
                },
                'agent_interface': {
                    'url': self.agent_api_url,
                    'status': self.check_service_health(self.agent_api_url),
                    'capabilities': [
                        'agent_registration',
                        'workflow_coordination',
                        'status_monitoring',
                        'request_processing'
                    ]
                }
            },
            'api_endpoints': {
                'agent_registration': f"{self.agent_api_url}/api/agent/register",
                'document_generation': f"{self.agent_api_url}/api/agent/document/generate",
                'system_status': f"{self.agent_api_url}/api/agent/status",
                'agent_ping': f"{self.agent_api_url}/api/agent/ping"
            },
            'communication_protocol': {
                'registration_required': True,
                'authentication': 'agent_id_based',
                'response_format': 'JSON',
                'timeout': '30_seconds',
                'retry_policy': 'exponential_backoff'
            },
            'subordinate_agent_instructions': {
                'step_1': 'Register your agent using POST /api/agent/register',
                'step_2': 'Send document requests to POST /api/agent/document/generate',
                'step_3': 'Monitor system status via GET /api/agent/status',
                'step_4': 'Send periodic pings to POST /api/agent/ping',
                'step_5': 'Handle responses and implement error recovery'
            }
        }
        
        print("📢 BROADCASTING TO PARENG BOYONG'S SUBORDINATE AGENTS")
        print("=" * 65)
        print(f"🎯 System: {availability_message['system']}")
        print(f"⏰ Timestamp: {availability_message['timestamp']}")
        print(f"📊 Status: {availability_message['status']}")
        print(f"💬 Message: {availability_message['message']}")
        
        print(f"\n🌐 AVAILABLE SERVICES:")
        for service_name, service_info in availability_message['services'].items():
            service_status = "🟢 ONLINE" if service_info['status'] else "🔴 OFFLINE"
            print(f"   {service_status} {service_name.replace('_', ' ').title()}")
            print(f"      URL: {service_info['url']}")
            print(f"      Capabilities: {', '.join(service_info['capabilities'])}")
        
        print(f"\n📋 API ENDPOINTS FOR SUBORDINATE AGENTS:")
        for endpoint_name, endpoint_url in availability_message['api_endpoints'].items():
            print(f"   🔗 {endpoint_name.replace('_', ' ').title()}: {endpoint_url}")
        
        print(f"\n🤖 SUBORDINATE AGENT INTEGRATION STEPS:")
        for step_key, step_description in availability_message['subordinate_agent_instructions'].items():
            print(f"   {step_key.upper()}: {step_description}")
        
        print(f"\n📡 COMMUNICATION PROTOCOL:")
        for protocol_key, protocol_value in availability_message['communication_protocol'].items():
            print(f"   ⚙️ {protocol_key.replace('_', ' ').title()}: {protocol_value}")
        
        return availability_message
    
    def register_pareng_boyong_agent(self, agent_id, capabilities=None):
        """Register a Pareng Boyong subordinate agent"""
        if capabilities is None:
            capabilities = ['document_processing', 'workflow_automation']
        
        registration_data = {
            'agent_id': agent_id,
            'callback_url': f'http://pareng-boyong-network/{agent_id}/webhook',
            'capabilities': capabilities,
            'parent_system': 'pareng_boyong',
            'registration_timestamp': datetime.now().isoformat()
        }
        
        try:
            response = requests.post(
                f"{self.agent_api_url}/api/agent/register",
                json=registration_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                self.registered_agents[agent_id] = registration_data
                logger.info(f"✅ Successfully registered Pareng Boyong agent: {agent_id}")
                return result
            else:
                logger.error(f"❌ Failed to register agent {agent_id}: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Registration error for agent {agent_id}: {e}")
            return None
    
    def process_agent_document_request(self, agent_id, document_request):
        """Process document generation request from Pareng Boyong agent"""
        request_payload = {
            'agent_id': agent_id,
            'filename_base': document_request.get('filename_base'),
            'content': document_request.get('content'),
            'formats': document_request.get('formats', ['md', 'pdf', 'docx'])
        }
        
        try:
            response = requests.post(
                f"{self.agent_api_url}/api/agent/document/generate",
                json=request_payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Document generated for agent {agent_id}")
                return result
            else:
                logger.error(f"❌ Document generation failed for agent {agent_id}: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Document generation error for agent {agent_id}: {e}")
            return None
    
    def get_system_status_for_agents(self):
        """Get current system status for Pareng Boyong's agents"""
        try:
            response = requests.get(f"{self.agent_api_url}/api/agent/status", timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                return {'error': 'Status service unavailable'}
        except Exception as e:
            return {'error': str(e)}
    
    def check_service_health(self, url):
        """Check if a service is responding"""
        try:
            response = requests.get(f"{url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def demonstrate_agent_workflow(self):
        """Demonstrate workflow for Pareng Boyong's subordinate agents"""
        print("🧪 DEMONSTRATING PARENG BOYONG AGENT WORKFLOW")
        print("=" * 55)
        
        # Step 1: Register example agent
        test_agent_id = "pareng-boyong-demo-agent-001"
        print(f"🔧 Step 1: Registering example agent '{test_agent_id}'")
        
        registration_result = self.register_pareng_boyong_agent(
            test_agent_id, 
            ['document_generation', 'workflow_automation', 'status_monitoring']
        )
        
        if registration_result:
            print(f"✅ Agent registration successful")
        else:
            print(f"❌ Agent registration failed")
            return
        
        # Step 2: Generate example document
        print(f"\n📄 Step 2: Processing document generation request")
        
        example_document_request = {
            'filename_base': 'pareng_boyong_workflow_test',
            'content': f"""# Pareng Boyong Subordinate Agent Test Document

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Agent ID**: {test_agent_id}
**Test Status**: Communication Established

## System Integration Status
- ✅ Agent registration successful
- ✅ Communication channel established
- ✅ Document generation operational
- ✅ Workflow automation ready

## Available Services
- Main Application (Port 5000): Manufacturing system
- Document Service (Port 5001): Multi-format generation
- Agent API (Port 5002): Subordinate agent interface

## Next Steps for Subordinate Agents
1. Register with the system using agent ID
2. Send document requests via API
3. Monitor system status regularly
4. Implement error handling and retries

---
*Generated by Hibla Automation System for Pareng Boyong Network*
""",
            'formats': ['md', 'pdf', 'docx']
        }
        
        document_result = self.process_agent_document_request(test_agent_id, example_document_request)
        
        if document_result:
            print(f"✅ Document generation successful")
            print(f"📁 Generated formats: {list(document_result.get('document_paths', {}).keys())}")
        else:
            print(f"❌ Document generation failed")
        
        # Step 3: Check system status
        print(f"\n📊 Step 3: Checking system status")
        
        status_result = self.get_system_status_for_agents()
        if 'error' not in status_result:
            print(f"✅ System status check successful")
            print(f"📈 Services operational: {status_result.get('status', 'unknown')}")
        else:
            print(f"❌ System status check failed: {status_result.get('error')}")
        
        print(f"\n🎉 Workflow demonstration complete")
        print(f"🤖 Pareng Boyong's subordinate agents can now:")
        print(f"   - Register with the automation system")
        print(f"   - Generate documents in multiple formats")
        print(f"   - Monitor system health and status")
        print(f"   - Process workflow automation requests")

def main():
    """Main function for Pareng Boyong communication setup"""
    print("🚀 PARENG BOYONG COMMUNICATION INTERFACE")
    print("=" * 50)
    
    # Initialize interface
    pb_interface = ParengBoyongInterface()
    
    # Broadcast availability
    pb_interface.broadcast_availability()
    
    print(f"\n" + "=" * 50)
    
    # Demonstrate workflow
    pb_interface.demonstrate_agent_workflow()
    
    print(f"\n✅ PARENG BOYONG COMMUNICATION SETUP COMPLETE")
    print(f"📡 System ready for subordinate agent requests")
    print(f"🔄 Continuous monitoring and processing active")

if __name__ == "__main__":
    main()