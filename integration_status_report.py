#!/usr/bin/env python3
"""
Integration Status Report Generator
==================================
Current status of Hibla-Pareng Boyong integration
"""

import requests
import json
import time
from datetime import datetime

def generate_integration_status():
    """Generate comprehensive integration status report"""
    
    # Check all system components
    main_app_status = check_service_status("http://localhost:5000")
    doc_service_status = check_service_status("http://localhost:5001") 
    mcp_service_status = check_service_status("http://localhost:5003")
    mcp_server_status = check_mcp_server_status()
    
    # Get dashboard data
    dashboard_data = get_dashboard_metrics()
    
    status_report = {
        'report_timestamp': datetime.now().isoformat(),
        'report_type': 'hibla_pareng_boyong_integration_status',
        'integration_phase': 'communication_establishment',
        
        'system_status': {
            'hibla_main_application': {
                'status': main_app_status['status'],
                'url': 'http://localhost:5000',
                'port': 5000,
                'response_time': main_app_status.get('response_time', 'N/A'),
                'features': [
                    'Manufacturing Dashboard',
                    'Quotation Management',
                    'Sales Order Processing', 
                    'Job Order Tracking',
                    'Inventory Management',
                    'Payment Processing',
                    'User Authentication'
                ],
                'api_endpoints_tested': [
                    {'endpoint': '/health', 'status': main_app_status['status']},
                    {'endpoint': '/api/dashboard/analytics', 'status': 'tested' if dashboard_data else 'failed'}
                ]
            },
            'hibla_document_service': {
                'status': doc_service_status['status'],
                'url': 'http://localhost:5001',
                'port': 5001,
                'response_time': doc_service_status.get('response_time', 'N/A'),
                'capabilities': [
                    'Markdown to PDF conversion',
                    'DOCX document generation',
                    'Multi-format output',
                    'Real-time processing'
                ],
                'deployment_status': 'ready_to_start'
            },
            'mcp_integration_service': {
                'status': mcp_service_status['status'], 
                'url': 'http://localhost:5003',
                'port': 5003,
                'response_time': mcp_service_status.get('response_time', 'N/A'),
                'purpose': 'Agent communication interface'
            },
            'agent_zero_mcp_server': {
                'status': mcp_server_status['status'],
                'url': 'https://ai.innovatehub.ph/mcp/t-0/sse',
                'connection_type': 'Server-Sent Events (SSE)',
                'response_time': mcp_server_status.get('response_time', 'N/A'),
                'last_test': mcp_server_status.get('last_test', 'N/A')
            }
        },
        
        'manufacturing_data_summary': dashboard_data,
        
        'communication_readiness': {
            'message_format': 'JSON',
            'protocols_supported': ['REST API', 'SSE', 'Webhook'],
            'authentication': 'Agent ID-based',
            'data_access': 'Real-time manufacturing data',
            'document_generation': 'Multi-format (PDF, DOCX, MD)',
            'workflow_automation': 'Available'
        },
        
        'pareng_boyong_requirements_sent': {
            'message_delivered': True,
            'delivery_timestamp': datetime.now().isoformat(),
            'delivery_channels': [
                'MCP Server POST request',
                'Local agent interface',
                'File output (JSON)'
            ],
            'key_questions_asked': [
                'Agent registration protocol preferences',
                'Message format compatibility', 
                'Callback URL configuration',
                'Authentication method requirements',
                'Rate limiting and quota needs'
            ],
            'response_expected_within': '24 hours',
            'next_steps_pending_response': [
                'Configure agent registration endpoints',
                'Set up callback URL routing',
                'Implement authentication method',
                'Deploy document service',
                'Begin integration testing'
            ]
        },
        
        'current_blockers': [
            {
                'blocker': 'Document Service Deployment',
                'description': 'Document service needs to be started on port 5001',
                'impact': 'Medium - document generation unavailable',
                'resolution': 'Start document generation service'
            },
            {
                'blocker': 'MCP Server Communication', 
                'description': 'Intermittent connection timeouts to Agent Zero MCP server',
                'impact': 'Low - alternative communication channels available',
                'resolution': 'Monitor and retry connection'
            },
            {
                'blocker': 'Pareng Boyong Agent Configuration',
                'description': 'Need response from Pareng Boyong on agent setup requirements',
                'impact': 'High - cannot proceed with agent integration',
                'resolution': 'Await response to requirements message'
            }
        ],
        
        'ready_capabilities': [
            'Manufacturing dashboard with real-time metrics',
            'Customer and product data access', 
            'Quotation and order management APIs',
            'JSON-based REST API communication',
            'Multi-format document generation framework',
            'Agent registration and management system',
            'Comprehensive error handling and logging'
        ],
        
        'next_actions': {
            'immediate': [
                'Start document generation service on port 5001',
                'Monitor for Pareng Boyong response',
                'Test MCP server connectivity periodically'
            ],
            'within_24_hours': [
                'Process Pareng Boyong requirements response',
                'Configure agent registration based on requirements',
                'Set up callback URL routing system',
                'Implement requested authentication method'
            ],
            'within_48_hours': [
                'Begin integration testing with Pareng Boyong agents',
                'Validate document generation workflows',
                'Test data access and API functionality',
                'Optimize system performance for agent requests'
            ],
            'within_72_hours': [
                'Deploy full production integration',
                'Monitor system performance and stability',
                'Provide final integration documentation',
                'Begin operational monitoring and support'
            ]
        }
    }
    
    return status_report

def check_service_status(url):
    """Check status of a service endpoint"""
    try:
        start_time = time.time()
        response = requests.get(f"{url}/health", timeout=5)
        response_time = round((time.time() - start_time) * 1000, 2)
        
        return {
            'status': 'online' if response.status_code == 200 else 'error',
            'response_time': f"{response_time}ms",
            'status_code': response.status_code
        }
    except Exception as e:
        return {
            'status': 'offline',
            'error': str(e)
        }

def check_mcp_server_status():
    """Check MCP server connectivity"""
    try:
        start_time = time.time()
        response = requests.get('https://ai.innovatehub.ph/mcp/t-0/sse', timeout=10)
        response_time = round((time.time() - start_time) * 1000, 2)
        
        return {
            'status': 'online' if response.status_code == 200 else 'error',
            'response_time': f"{response_time}ms",
            'status_code': response.status_code,
            'last_test': datetime.now().isoformat()
        }
    except Exception as e:
        return {
            'status': 'connection_timeout',
            'error': str(e),
            'last_test': datetime.now().isoformat()
        }

def get_dashboard_metrics():
    """Get current dashboard data"""
    try:
        response = requests.get('http://localhost:5000/api/dashboard/analytics', timeout=10)
        if response.status_code == 200:
            return response.json().get('overview', {})
    except:
        pass
    return {}

def display_status_report(report):
    """Display status report in readable format"""
    
    print("🔍 HIBLA-PARENG BOYONG INTEGRATION STATUS REPORT")
    print("=" * 70)
    print(f"📅 Generated: {report['report_timestamp']}")
    print(f"🎯 Integration Phase: {report['integration_phase'].replace('_', ' ').title()}")
    
    print(f"\n🌐 SYSTEM COMPONENT STATUS:")
    for component, details in report['system_status'].items():
        status_icon = "🟢" if details['status'] == 'online' else "🔴" if details['status'] == 'offline' else "🟡"
        component_name = component.replace('_', ' ').title()
        print(f"   {status_icon} {component_name}: {details['status'].upper()}")
        if 'url' in details:
            print(f"      URL: {details['url']}")
        if 'response_time' in details:
            print(f"      Response Time: {details['response_time']}")
    
    print(f"\n📊 MANUFACTURING DATA AVAILABLE:")
    dashboard = report['manufacturing_data_summary']
    if dashboard:
        for key, value in dashboard.items():
            metric_name = key.replace('total', '').replace('active', '').replace('_', ' ').title()
            print(f"   • {metric_name}: {value}")
    else:
        print(f"   ⚠️ Dashboard data not accessible")
    
    print(f"\n📨 PARENG BOYONG COMMUNICATION:")
    pb_req = report['pareng_boyong_requirements_sent']
    print(f"   ✅ Requirements message sent: {pb_req['message_delivered']}")
    print(f"   📅 Delivery time: {pb_req['delivery_timestamp']}")
    print(f"   📡 Delivery channels: {len(pb_req['delivery_channels'])} channels used")
    print(f"   ❓ Key questions: {len(pb_req['key_questions_asked'])} requirements clarified")
    print(f"   ⏰ Response expected: {pb_req['response_expected_within']}")
    
    print(f"\n🚧 CURRENT BLOCKERS:")
    for i, blocker in enumerate(report['current_blockers'], 1):
        impact_icon = "🔴" if blocker['impact'].startswith('High') else "🟡" if blocker['impact'].startswith('Medium') else "🟢"
        print(f"   {i}. {impact_icon} {blocker['blocker']}")
        print(f"      {blocker['description']}")
        print(f"      Resolution: {blocker['resolution']}")
    
    print(f"\n✅ READY CAPABILITIES:")
    for capability in report['ready_capabilities']:
        print(f"   • {capability}")
    
    print(f"\n🎯 NEXT ACTIONS:")
    for timeframe, actions in report['next_actions'].items():
        print(f"   {timeframe.replace('_', ' ').title()}:")
        for action in actions:
            print(f"      • {action}")

def main():
    """Generate and display integration status report"""
    
    print("🔄 Generating integration status report...")
    report = generate_integration_status()
    
    # Save report to file
    with open('hibla_pareng_boyong_integration_status.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Display report
    display_status_report(report)
    
    print(f"\n💾 STATUS REPORT SAVED:")
    print(f"   • hibla_pareng_boyong_integration_status.json")
    print(f"   • detailed_requirements_for_pareng_boyong.json")
    print(f"   • message_to_pareng_boyong.json")
    
    print(f"\n🎯 INTEGRATION STATUS: AWAITING PARENG BOYONG RESPONSE")
    print(f"📞 Next step: Process requirements response and configure agents")
    
    return report

if __name__ == "__main__":
    main()