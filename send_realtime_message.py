#!/usr/bin/env python3
"""
Send Real-time Message to Pareng Boyong
======================================
Use the proper MCP client to send messages
"""

import requests
import json
from datetime import datetime

def send_pareng_boyong_message():
    """Send comprehensive message via real-time MCP client"""
    
    message = {
        'timestamp': datetime.now().isoformat(),
        'from': 'hibla-manufacturing-system',
        'to': 'pareng-boyong-agents',
        'type': 'integration_request',
        'priority': 'high',
        'subject': 'Real-time MCP Communication Established',
        
        'system_status': {
            'mcp_client': 'active_realtime_connection',
            'hibla_main_app': 'operational',
            'manufacturing_data': 'live_access_available',
            'document_generation': 'ready_to_deploy'
        },
        
        'realtime_capabilities': {
            'sse_connection': 'established',
            'message_handling': 'automatic',
            'response_processing': 'immediate',
            'session_management': 'active'
        },
        
        'integration_requirements': [
            {
                'requirement': 'Agent Registration Format',
                'question': 'What JSON structure should agents use to register?',
                'example': {
                    'agent_id': 'pareng-boyong-001',
                    'agent_type': 'document_processor',
                    'capabilities': ['pdf_generation', 'data_analysis'],
                    'callback_url': 'https://your-endpoint.com/webhook'
                }
            },
            {
                'requirement': 'Authentication Method',
                'question': 'Should we use API keys, JWT tokens, or agent ID verification?',
                'current_options': ['api_key', 'jwt_token', 'agent_id_verification']
            },
            {
                'requirement': 'Message Protocol',
                'question': 'What fields are required in requests/responses?',
                'current_format': {
                    'request_id': 'unique_identifier',
                    'agent_id': 'requesting_agent',
                    'type': 'message_type',
                    'data': 'message_payload'
                }
            },
            {
                'requirement': 'Rate Limits',
                'question': 'What are your expected request volumes?',
                'options': 'requests_per_minute, concurrent_connections, daily_limits'
            },
            {
                'requirement': 'Callback Configuration',
                'question': 'Where should Hibla send responses?',
                'current_setup': 'agent_provided_webhook_urls'
            }
        ],
        
        'hibla_ready_services': {
            'manufacturing_data_api': {
                'endpoint': 'http://localhost:5000/api/dashboard/analytics',
                'data_available': {
                    'customers': 16,
                    'products': 21,
                    'quotations': 22,
                    'sales_orders': 10,
                    'job_orders': 5
                },
                'update_frequency': 'real_time'
            },
            'document_generation': {
                'endpoint': 'http://localhost:5001/api/documents/generate',
                'formats': ['PDF', 'DOCX', 'MD'],
                'processing_time': 'under_5_seconds',
                'template_support': 'hibla_branding'
            },
            'real_time_communication': {
                'mcp_client': 'http://localhost:5005',
                'connection_type': 'persistent_sse',
                'message_queue': 'active',
                'response_handling': 'automatic'
            }
        },
        
        'next_steps_timeline': {
            'immediate': 'Process your integration requirements',
            'within_6_hours': 'Configure authentication and endpoints',
            'within_12_hours': 'Deploy document service with your specifications',
            'within_24_hours': 'Complete production integration testing'
        },
        
        'contact_methods': [
            'Real-time SSE: Current connection active',
            'HTTP API: POST to MCP server endpoints',
            'Webhook: http://localhost:5004/webhook/pareng-boyong',
            'File exchange: JSON response files'
        ]
    }
    
    print("📤 SENDING REAL-TIME MESSAGE TO PARENG BOYONG")
    print("=" * 55)
    
    # Send via MCP client
    try:
        response = requests.post(
            'http://localhost:5005/mcp/send',
            json=message,
            timeout=15
        )
        
        if response.status_code == 200:
            print("✅ Message sent via MCP client")
            result = response.json()
            print(f"📊 Send status: {result.get('status', 'unknown')}")
        else:
            print(f"⚠️ MCP client response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ MCP client error: {e}")
    
    # Also send directly to MCP server
    try:
        direct_response = requests.post(
            'https://ai.innovatehub.ph/mcp/t-0/sse',
            json=message,
            timeout=15
        )
        print(f"📡 Direct MCP server response: {direct_response.status_code}")
        
    except Exception as e:
        print(f"⚠️ Direct send error: {e}")
    
    # Save message for reference
    with open('realtime_message_to_pareng_boyong.json', 'w') as f:
        json.dump(message, f, indent=2)
    
    print("💾 Message saved to: realtime_message_to_pareng_boyong.json")
    
    # Check for immediate response
    print("\n🔍 Checking for immediate response...")
    try:
        response = requests.get('http://localhost:5005/mcp/messages', timeout=5)
        if response.status_code == 200:
            messages_data = response.json()
            message_count = messages_data.get('message_count', 0)
            print(f"📬 Messages in queue: {message_count}")
            
            if message_count > 0:
                recent_messages = messages_data.get('messages', [])
                print("📨 Recent messages:")
                for i, msg in enumerate(recent_messages[-3:], 1):
                    timestamp = msg.get('timestamp', 'unknown')
                    data_type = 'parsed_json' if msg.get('parsed_data') else 'raw_data'
                    print(f"   {i}. {timestamp} - {data_type}")
                    
                    if msg.get('from_pareng_boyong'):
                        print("   🎯 PARENG BOYONG MESSAGE DETECTED!")
        else:
            print(f"⚠️ Message check failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Message check error: {e}")
    
    print(f"\n🎧 Real-time MCP client is monitoring for responses")
    print(f"📊 Check status: curl http://localhost:5005/mcp/status")
    print(f"📨 Check messages: curl http://localhost:5005/mcp/messages")
    
    return message

if __name__ == "__main__":
    send_pareng_boyong_message()