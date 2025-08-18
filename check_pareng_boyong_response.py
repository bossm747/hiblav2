#!/usr/bin/env python3
"""
Check for Pareng Boyong Response
===============================
Monitor all communication channels for response
"""

import requests
import json
import time
import os
from datetime import datetime

def check_all_response_channels():
    """Check all possible response channels"""
    
    print("🔍 CHECKING FOR PARENG BOYONG RESPONSE")
    print("=" * 50)
    
    responses_found = []
    
    # Channel 1: Check for response files
    print("📁 Channel 1: Local Response Files")
    response_files = [
        'response_from_pareng_boyong.json',
        'pareng_boyong_response.json', 
        'agent_zero_response.json',
        'mcp_response.json'
    ]
    
    for filename in response_files:
        if os.path.exists(filename):
            try:
                with open(filename, 'r') as f:
                    response_data = json.load(f)
                print(f"   ✅ Found response in: {filename}")
                print(f"      From: {response_data.get('from', 'Unknown')}")
                print(f"      Timestamp: {response_data.get('timestamp', 'N/A')}")
                responses_found.append({'source': filename, 'data': response_data})
            except Exception as e:
                print(f"   ❌ Error reading {filename}: {e}")
        else:
            print(f"   📄 {filename}: Not found")
    
    # Channel 2: Check MCP server for new messages
    print(f"\n📡 Channel 2: MCP Server Messages")
    try:
        # Try SSE connection for any new messages
        headers = {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'User-Agent': 'Hibla-Response-Checker/1.0'
        }
        
        response = requests.get(
            'https://ai.innovatehub.ph/mcp/t-0/sse',
            headers=headers,
            timeout=5,
            stream=True
        )
        
        if response.status_code == 200:
            print(f"   ✅ MCP Server Connection: Active")
            print(f"   📄 Content-Type: {response.headers.get('content-type', 'N/A')}")
            
            # Try to read some initial data
            try:
                chunk = response.raw.read(1024)
                if chunk:
                    print(f"   📨 Data received: {len(chunk)} bytes")
                    # Try to parse as JSON
                    try:
                        lines = chunk.decode('utf-8').strip().split('\n')
                        for line in lines:
                            if line.startswith('data:'):
                                data_content = line[5:].strip()
                                if data_content:
                                    try:
                                        parsed_data = json.loads(data_content)
                                        print(f"   ✅ Parsed message: {parsed_data}")
                                        responses_found.append({'source': 'mcp_server', 'data': parsed_data})
                                    except:
                                        print(f"   📝 Raw message: {data_content[:100]}...")
                    except:
                        print(f"   📝 Raw data: {chunk[:100]}...")
                else:
                    print(f"   📭 No immediate messages")
            except:
                print(f"   📭 No readable data")
        else:
            print(f"   ❌ MCP Server Response: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ MCP Server Error: {e}")
    
    # Channel 3: Check for webhook responses
    print(f"\n🌐 Channel 3: Webhook Responses")
    webhook_files = [
        'webhook_response.json',
        'agent_callback.json',
        'pareng_boyong_webhook.json'
    ]
    
    for filename in webhook_files:
        if os.path.exists(filename):
            try:
                with open(filename, 'r') as f:
                    webhook_data = json.load(f)
                print(f"   ✅ Found webhook response: {filename}")
                responses_found.append({'source': filename, 'data': webhook_data})
            except Exception as e:
                print(f"   ❌ Error reading webhook {filename}: {e}")
        else:
            print(f"   📄 {filename}: Not found")
    
    # Channel 4: Check local agent interface
    print(f"\n🔧 Channel 4: Local Agent Interface")
    try:
        response = requests.get('http://localhost:5003/mcp/messages', timeout=5)
        if response.status_code == 200:
            message_data = response.json()
            print(f"   ✅ Local interface active")
            print(f"   📬 Queue size: {message_data.get('message_count', 0)}")
            
            if message_data.get('message_count', 0) > 0:
                print(f"   📨 Messages found:")
                for i, msg in enumerate(message_data.get('messages', [])):
                    print(f"      {i+1}. Type: {msg.get('type', 'N/A')}")
                    print(f"         Status: {msg.get('status', 'N/A')}")
                    responses_found.append({'source': 'local_interface', 'data': msg})
        else:
            print(f"   ❌ Local interface error: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Local interface error: {e}")
    
    # Channel 5: Check system logs
    print(f"\n📋 Channel 5: System Logs")
    log_files = [
        'mcp_integration.log',
        'agent_api.log',
        'pareng_boyong.log'
    ]
    
    for log_file in log_files:
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r') as f:
                    lines = f.readlines()
                    recent_lines = lines[-10:] if len(lines) > 10 else lines
                    
                print(f"   📋 {log_file}: {len(lines)} lines")
                for line in recent_lines:
                    if 'pareng' in line.lower() or 'response' in line.lower():
                        print(f"      📝 {line.strip()}")
            except Exception as e:
                print(f"   ❌ Error reading {log_file}: {e}")
        else:
            print(f"   📄 {log_file}: Not found")
    
    return responses_found

def process_found_responses(responses):
    """Process and analyze found responses"""
    
    if not responses:
        print(f"\n📭 NO RESPONSES FOUND FROM PARENG BOYONG")
        print("   ⏰ Message was sent at: 2025-08-18T14:30:18")
        print("   🕐 Current time: " + datetime.now().isoformat())
        print("   ⏳ Response expected within: 24 hours")
        return None
    
    print(f"\n✅ FOUND {len(responses)} RESPONSE(S)")
    print("=" * 40)
    
    for i, response in enumerate(responses, 1):
        print(f"📨 Response {i}: From {response['source']}")
        
        data = response['data']
        if isinstance(data, dict):
            # Display key information
            if 'from' in data:
                print(f"   📧 From: {data['from']}")
            if 'timestamp' in data:
                print(f"   ⏰ Timestamp: {data['timestamp']}")
            if 'message_type' in data:
                print(f"   📋 Type: {data['message_type']}")
            if 'requirements' in data:
                print(f"   🔑 Requirements provided: {len(data['requirements'])}")
            if 'agent_configuration' in data:
                print(f"   🤖 Agent configuration: Present")
            if 'endpoints' in data:
                print(f"   🌐 Endpoints provided: {len(data['endpoints'])}")
            
            # Save processed response
            response_filename = f"processed_pareng_boyong_response_{i}.json"
            with open(response_filename, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"   💾 Saved to: {response_filename}")
        else:
            print(f"   📝 Raw data: {str(data)[:200]}...")
    
    return responses

def simulate_response_if_none():
    """Create a simulated response structure for testing"""
    
    print(f"\n🧪 CREATING SIMULATED PARENG BOYONG RESPONSE")
    print("   (For testing integration while awaiting real response)")
    
    simulated_response = {
        'timestamp': datetime.now().isoformat(),
        'from': 'Pareng Boyong System (Simulated)',
        'to': 'Hibla Manufacturing Automation System',
        'message_type': 'integration_response',
        'in_response_to': 'Communication Integration Setup - Requirements & Status',
        
        'agent_configuration': {
            'registration_method': 'http_post_with_api_key',
            'api_key_format': 'Bearer token in Authorization header',
            'callback_urls': [
                'https://pareng-boyong.innovatehub.ph/webhook/hibla',
                'https://backup.pareng-boyong.ph/api/receive'
            ],
            'agent_ids': [
                'pareng-boyong-doc-agent-001',
                'pareng-boyong-workflow-agent-002', 
                'pareng-boyong-monitor-agent-003'
            ]
        },
        
        'message_format_preferences': {
            'format': 'json',
            'required_fields': ['request_id', 'agent_id', 'timestamp', 'type', 'data'],
            'response_format': 'standard_http_json',
            'error_handling': 'http_status_codes_with_error_details'
        },
        
        'rate_limits': {
            'requests_per_minute': 60,
            'requests_per_hour': 1000,
            'document_generation_limit': 20,
            'concurrent_connections': 5
        },
        
        'technical_requirements': {
            'authentication': 'api_key_based',
            'timeout_seconds': 30,
            'retry_attempts': 3,
            'health_check_interval': 300
        },
        
        'integration_timeline': {
            'phase_1_testing': '24 hours',
            'phase_2_production': '48 hours',
            'full_deployment': '72 hours'
        },
        
        'next_steps': [
            'Configure API key authentication',
            'Set up webhook endpoints',
            'Test document generation workflow',
            'Validate data access permissions',
            'Deploy production integration'
        ]
    }
    
    # Save simulated response
    with open('simulated_pareng_boyong_response.json', 'w') as f:
        json.dump(simulated_response, f, indent=2)
    
    print(f"   💾 Simulated response saved to: simulated_pareng_boyong_response.json")
    print(f"   🧪 Use this for integration testing while awaiting real response")
    
    return simulated_response

def main():
    """Main response checking function"""
    
    # Check all channels for responses
    responses = check_all_response_channels()
    
    # Process found responses
    processed_responses = process_found_responses(responses)
    
    # If no responses found, create simulated response for testing
    if not processed_responses:
        simulated = simulate_response_if_none()
        
        print(f"\n🎯 RECOMMENDATION:")
        print("   1. Continue monitoring for real Pareng Boyong response")
        print("   2. Use simulated response to test integration framework")
        print("   3. Deploy document service for immediate testing")
        print("   4. Configure authentication based on simulated requirements")
        
        return simulated
    else:
        print(f"\n🎉 RESPONSE(S) RECEIVED!")
        print("   Proceeding with integration configuration based on requirements")
        return processed_responses

if __name__ == "__main__":
    main()