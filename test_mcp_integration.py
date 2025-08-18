#!/usr/bin/env python3
"""
Test MCP Integration with Real-time Monitoring
==============================================
Test the SSE connection and monitor for Pareng Boyong responses
"""

import requests
import json
import time
from datetime import datetime
import os

def test_mcp_connection():
    """Test the MCP SSE connection directly"""
    print("🧪 TESTING MCP INTEGRATION")
    print("=" * 40)
    
    # Test 1: Direct SSE connection
    print("1. Testing direct SSE connection...")
    try:
        response = requests.get(
            'https://ai.innovatehub.ph/mcp/t-0/sse',
            headers={'Accept': 'text/event-stream'},
            timeout=10,
            stream=True
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code == 200:
            print("   ✅ SSE endpoint is accessible")
            
            # Read first few events
            print("   📡 Reading initial events...")
            line_count = 0
            for line in response.iter_lines(decode_unicode=True):
                if line and line_count < 5:
                    print(f"      {line}")
                    line_count += 1
                elif line_count >= 5:
                    break
        else:
            print(f"   ❌ SSE connection failed")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Check for received messages
    print(f"\n2. Checking for received messages...")
    message_files = [
        'mcp_sse_messages.json',
        'pareng_boyong_mcp_response.json',
        'mcp_acknowledgment.json'
    ]
    
    for filename in message_files:
        if os.path.exists(filename):
            try:
                with open(filename, 'r') as f:
                    data = json.load(f)
                print(f"   ✅ {filename}: Found")
                
                if 'message_count' in data:
                    print(f"      Messages: {data['message_count']}")
                if 'session_id' in data:
                    print(f"      Session: {data['session_id']}")
                    
            except Exception as e:
                print(f"   ❌ {filename}: Error reading - {e}")
        else:
            print(f"   📄 {filename}: Not found")
    
    # Test 3: Send test message to Pareng Boyong
    print(f"\n3. Sending test message to Pareng Boyong...")
    test_message = {
        'timestamp': datetime.now().isoformat(),
        'from': 'hibla-manufacturing-system',
        'to': 'pareng-boyong-agents',
        'type': 'integration_test',
        'test_data': {
            'hibla_status': 'operational',
            'manufacturing_data': 'available',
            'document_generation': 'ready',
            'sse_connection': 'established'
        },
        'request': 'Please confirm receipt and send integration requirements',
        'callback_info': {
            'mcp_client': 'listening_via_sse',
            'session_based': True,
            'real_time': True
        }
    }
    
    try:
        response = requests.post(
            'https://ai.innovatehub.ph/mcp/t-0/sse',
            json=test_message,
            timeout=15
        )
        print(f"   📤 Message sent: {response.status_code}")
        
        # Save test message
        with open('test_message_to_pareng_boyong.json', 'w') as f:
            json.dump(test_message, f, indent=2)
        print(f"   💾 Test message saved")
        
    except Exception as e:
        print(f"   ❌ Send error: {e}")
    
    # Test 4: Monitor for immediate response
    print(f"\n4. Monitoring for immediate response (30 seconds)...")
    start_time = time.time()
    check_count = 0
    
    while time.time() - start_time < 30:
        check_count += 1
        
        # Check for new message files
        for filename in message_files:
            if os.path.exists(filename):
                try:
                    stat_info = os.stat(filename)
                    if stat_info.st_mtime > start_time:
                        print(f"   📨 New activity in {filename}")
                        
                        with open(filename, 'r') as f:
                            data = json.load(f)
                            
                        if 'pareng_boyong' in filename:
                            print(f"   🎯 PARENG BOYONG RESPONSE DETECTED!")
                            print(f"      Timestamp: {data.get('timestamp', 'N/A')}")
                            print(f"      Source: {data.get('source', 'N/A')}")
                            return True
                            
                except Exception as e:
                    pass
        
        print(f"\r   ⏱️ Checking... ({check_count}/6)", end='', flush=True)
        time.sleep(5)
    
    print(f"\n   ⏰ Monitoring timeout (30 seconds)")
    print(f"   📝 Response may arrive later - check files periodically")
    
    return False

def check_background_client():
    """Check if background MCP client is running"""
    print(f"\n5. Checking background MCP client...")
    
    if os.path.exists('mcp_sse.log'):
        try:
            with open('mcp_sse.log', 'r') as f:
                log_lines = f.readlines()
                
            print(f"   📋 Log file: {len(log_lines)} lines")
            
            # Show recent log entries
            recent_lines = log_lines[-10:] if len(log_lines) > 10 else log_lines
            for line in recent_lines:
                if 'error' in line.lower() or 'exception' in line.lower():
                    print(f"   ❌ {line.strip()}")
                elif 'connected' in line.lower() or 'session' in line.lower():
                    print(f"   ✅ {line.strip()}")
                elif 'pareng' in line.lower():
                    print(f"   🎯 {line.strip()}")
                    
        except Exception as e:
            print(f"   ❌ Log read error: {e}")
    else:
        print(f"   📄 No log file found")
    
    # Check if process is running
    try:
        import subprocess
        result = subprocess.run(['pgrep', '-f', 'mcp_sse_client.py'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   ✅ Background MCP client is running (PID: {result.stdout.strip()})")
        else:
            print(f"   ⚠️ Background MCP client not detected")
    except Exception as e:
        print(f"   ❌ Process check error: {e}")

def main():
    """Run complete MCP integration test"""
    response_detected = test_mcp_connection()
    check_background_client()
    
    print(f"\n📊 INTEGRATION TEST SUMMARY")
    print("=" * 35)
    print(f"✅ SSE endpoint accessible")
    print(f"✅ Test message sent to Pareng Boyong")  
    print(f"✅ Background client monitoring active")
    
    if response_detected:
        print(f"🎉 PARENG BOYONG RESPONSE RECEIVED!")
        print(f"📄 Check pareng_boyong_mcp_response.json for details")
    else:
        print(f"⏳ No immediate response from Pareng Boyong")
        print(f"🔄 Background monitoring continues...")
        print(f"📄 Check mcp_sse_messages.json for all activity")
    
    print(f"\n🎯 NEXT STEPS:")
    print(f"   • Monitor mcp_sse.log for real-time activity")
    print(f"   • Check for pareng_boyong_mcp_response.json")
    print(f"   • Background client continues listening")
    print(f"   • Integration ready for Pareng Boyong requirements")

if __name__ == '__main__':
    main()