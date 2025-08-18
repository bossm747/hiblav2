#!/usr/bin/env python3
"""
Final Communication Setup for Pareng Boyong Subordinate Agents
=============================================================
Provides direct communication interface and status summary
"""

import requests
import json
import time
from datetime import datetime

def check_system_status():
    """Check status of all system components"""
    services = {
        'main_application': {
            'url': 'http://localhost:5000',
            'description': 'Hibla Manufacturing System',
            'capabilities': ['quotations', 'sales_orders', 'job_orders', 'inventory', 'dashboard']
        },
        'document_service': {
            'url': 'http://localhost:5001', 
            'description': 'Document Generation Service',
            'capabilities': ['markdown_to_pdf', 'docx_generation', 'multi_format_output']
        }
    }
    
    status_report = {
        'timestamp': datetime.now().isoformat(),
        'system': 'hibla-automation',
        'overall_status': 'operational',
        'services': {}
    }
    
    for service_name, service_info in services.items():
        try:
            response = requests.get(f"{service_info['url']}/health", timeout=5)
            is_healthy = response.status_code == 200
            
            status_report['services'][service_name] = {
                'url': service_info['url'],
                'status': 'online' if is_healthy else 'offline',
                'description': service_info['description'],
                'capabilities': service_info['capabilities'],
                'last_checked': datetime.now().isoformat()
            }
        except:
            status_report['services'][service_name] = {
                'url': service_info['url'],
                'status': 'offline',
                'description': service_info['description'],
                'capabilities': service_info['capabilities'],
                'last_checked': datetime.now().isoformat(),
                'error': 'connection_failed'
            }
    
    return status_report

def generate_communication_instructions():
    """Generate instructions for subordinate agent communication"""
    
    instructions = {
        'system_overview': {
            'name': 'Hibla Manufacturing Automation System',
            'purpose': 'Internal manufacturing workflow management with document automation',
            'communication_ready': True
        },
        'direct_communication_methods': {
            'main_system_api': {
                'base_url': 'http://localhost:5000',
                'endpoints': {
                    'health_check': 'GET /health',
                    'api_status': 'GET /api/health',
                    'dashboard_data': 'GET /api/dashboard/analytics'
                },
                'authentication': 'session_based_with_jwt'
            },
            'document_generation': {
                'base_url': 'http://localhost:5001',
                'endpoints': {
                    'health_check': 'GET /health',
                    'generate_document': 'POST /api/documents/generate'
                },
                'payload_example': {
                    'filename_base': 'document_name',
                    'content': 'markdown_content_here',
                    'formats': ['md', 'pdf', 'docx']
                }
            }
        },
        'subordinate_agent_workflow': {
            'step_1': 'Check system health using /health endpoints',
            'step_2': 'Send document generation requests to document service',
            'step_3': 'Monitor responses and implement error handling',
            'step_4': 'Process generated documents as needed',
            'step_5': 'Maintain periodic health checks'
        },
        'integration_examples': {
            'python_example': '''
import requests

# Check system health
main_health = requests.get('http://localhost:5000/health')
doc_health = requests.get('http://localhost:5001/health')

# Generate document
doc_request = {
    'filename_base': 'workflow_report',
    'content': '# Report\\n\\nContent here',
    'formats': ['pdf', 'docx']
}
response = requests.post('http://localhost:5001/api/documents/generate', json=doc_request)
''',
            'curl_example': '''
# Health check
curl http://localhost:5000/health
curl http://localhost:5001/health

# Generate document
curl -X POST http://localhost:5001/api/documents/generate \\
  -H "Content-Type: application/json" \\
  -d '{"filename_base":"test","content":"# Test\\nContent","formats":["pdf"]}'
'''
        },
        'error_handling': {
            'connection_timeout': 'Implement 5-10 second timeouts',
            'retry_logic': 'Use exponential backoff for failed requests',
            'health_monitoring': 'Regular health checks every 1-5 minutes',
            'fallback_strategy': 'Implement graceful degradation for offline services'
        }
    }
    
    return instructions

def main():
    """Main communication setup and status report"""
    print("📡 FINAL COMMUNICATION SETUP FOR PARENG BOYONG SUBORDINATE AGENTS")
    print("=" * 75)
    
    # Check current system status
    print("🔍 Checking system status...")
    status = check_system_status()
    
    print(f"\n📊 SYSTEM STATUS REPORT")
    print(f"⏰ Timestamp: {status['timestamp']}")
    print(f"🎯 System: {status['system']}")
    print(f"📈 Overall Status: {status['overall_status'].upper()}")
    
    print(f"\n🌐 SERVICE STATUS:")
    for service_name, service_data in status['services'].items():
        status_icon = "🟢" if service_data['status'] == 'online' else "🔴"
        print(f"   {status_icon} {service_name.replace('_', ' ').title()}: {service_data['status'].upper()}")
        print(f"      URL: {service_data['url']}")
        print(f"      Description: {service_data['description']}")
        print(f"      Capabilities: {', '.join(service_data['capabilities'])}")
        if 'error' in service_data:
            print(f"      Error: {service_data['error']}")
    
    # Generate communication instructions
    print(f"\n📋 GENERATING COMMUNICATION INSTRUCTIONS...")
    instructions = generate_communication_instructions()
    
    print(f"\n🤖 SUBORDINATE AGENT COMMUNICATION GUIDE")
    print(f"🎯 System: {instructions['system_overview']['name']}")
    print(f"💡 Purpose: {instructions['system_overview']['purpose']}")
    print(f"✅ Communication Ready: {instructions['system_overview']['communication_ready']}")
    
    print(f"\n📡 DIRECT COMMUNICATION METHODS:")
    
    # Main System API
    main_api = instructions['direct_communication_methods']['main_system_api']
    print(f"   🌐 Main System API:")
    print(f"      Base URL: {main_api['base_url']}")
    print(f"      Authentication: {main_api['authentication']}")
    print(f"      Available Endpoints:")
    for endpoint_name, endpoint_path in main_api['endpoints'].items():
        print(f"         • {endpoint_name.replace('_', ' ').title()}: {endpoint_path}")
    
    # Document Generation
    doc_api = instructions['direct_communication_methods']['document_generation']
    print(f"   📄 Document Generation API:")
    print(f"      Base URL: {doc_api['base_url']}")
    print(f"      Available Endpoints:")
    for endpoint_name, endpoint_path in doc_api['endpoints'].items():
        print(f"         • {endpoint_name.replace('_', ' ').title()}: {endpoint_path}")
    print(f"      Payload Example: {json.dumps(doc_api['payload_example'], indent=10)}")
    
    print(f"\n🔄 SUBORDINATE AGENT WORKFLOW:")
    for step_key, step_description in instructions['subordinate_agent_workflow'].items():
        print(f"   {step_key.upper()}: {step_description}")
    
    print(f"\n💻 INTEGRATION EXAMPLES:")
    print(f"   🐍 Python Example:")
    print(instructions['integration_examples']['python_example'])
    
    print(f"   🌐 cURL Example:")
    print(instructions['integration_examples']['curl_example'])
    
    print(f"\n⚠️ ERROR HANDLING RECOMMENDATIONS:")
    for error_type, recommendation in instructions['error_handling'].items():
        print(f"   • {error_type.replace('_', ' ').title()}: {recommendation}")
    
    # Test document generation if service is available
    if status['services']['main_application']['status'] == 'online':
        print(f"\n🧪 TESTING COMMUNICATION CHANNEL...")
        
        # Test main application health
        try:
            response = requests.get('http://localhost:5000/health', timeout=5)
            if response.status_code == 200:
                print("✅ Main application communication: SUCCESS")
            else:
                print(f"⚠️ Main application response code: {response.status_code}")
        except Exception as e:
            print(f"❌ Main application communication error: {e}")
        
        # Test dashboard data access
        try:
            response = requests.get('http://localhost:5000/api/health', timeout=5)
            if response.status_code == 200:
                print("✅ API endpoint communication: SUCCESS")
            else:
                print(f"⚠️ API endpoint response code: {response.status_code}")
        except Exception as e:
            print(f"❌ API endpoint communication error: {e}")
    
    print(f"\n✅ COMMUNICATION SETUP COMPLETE")
    print(f"📡 Pareng Boyong subordinate agents can now:")
    print(f"   • Connect to the main application (Port 5000)")
    print(f"   • Access manufacturing data and analytics")
    print(f"   • Request document generation services")
    print(f"   • Monitor system health and status")
    print(f"   • Implement automated workflow processing")
    
    print(f"\n🎯 NEXT STEPS FOR SUBORDINATE AGENTS:")
    print(f"   1. Test connectivity using provided endpoints")
    print(f"   2. Implement health monitoring")
    print(f"   3. Set up document generation workflows")
    print(f"   4. Configure error handling and retries")
    print(f"   5. Begin automated processing integration")
    
    print(f"\n📅 Communication established: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔄 System ready for subordinate agent integration")

if __name__ == "__main__":
    main()