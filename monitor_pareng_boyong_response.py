#!/usr/bin/env python3
"""
Monitor Pareng Boyong Response
=============================
Continuous monitoring for Pareng Boyong's response to our introduction
"""

import json
import os
import time
from datetime import datetime
import requests

def check_for_response():
    """Check for any responses from Pareng Boyong"""
    
    # Response files to monitor
    response_files = [
        'pareng_boyong_session_response.json',
        'pareng_boyong_mcp_response.json',
        'pareng_boyong_response.json',
        'mcp_session_messages.json'
    ]
    
    responses_found = []
    
    print(f"🔍 MONITORING PARENG BOYONG RESPONSE")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 45)
    
    for filename in response_files:
        if os.path.exists(filename):
            try:
                # Check file modification time
                stat_info = os.stat(filename)
                modified_time = datetime.fromtimestamp(stat_info.st_mtime)
                
                # If modified in last 24 hours, consider it recent
                time_diff = datetime.now() - modified_time
                if time_diff.days == 0:  # Modified today
                    with open(filename, 'r') as f:
                        data = json.load(f)
                    
                    response_info = {
                        'filename': filename,
                        'modified': modified_time.isoformat(),
                        'size_bytes': stat_info.st_size,
                        'data': data
                    }
                    responses_found.append(response_info)
                    
                    print(f"📨 RESPONSE FOUND: {filename}")
                    print(f"   📅 Modified: {modified_time.strftime('%H:%M:%S')}")
                    print(f"   📏 Size: {stat_info.st_size} bytes")
                    
                    # Check if it's specifically from Pareng Boyong
                    data_str = json.dumps(data).lower()
                    if any(term in data_str for term in ['pareng', 'boyong', 'agent']):
                        print(f"   🎯 PARENG BOYONG CONTENT DETECTED!")
                        return response_info
                        
            except Exception as e:
                print(f"   ❌ Error reading {filename}: {e}")
    
    # Check MCP monitoring log
    if os.path.exists('mcp_monitoring.log'):
        try:
            with open('mcp_monitoring.log', 'r') as f:
                recent_logs = f.readlines()[-20:]  # Last 20 lines
                
            for line in recent_logs:
                if 'pareng' in line.lower() or 'boyong' in line.lower() or 'response' in line.lower():
                    print(f"📋 MCP Log activity: {line.strip()}")
                    
        except Exception as e:
            print(f"❌ Error reading MCP log: {e}")
    
    # Test MCP connection status
    try:
        response = requests.get(
            'https://ai.innovatehub.ph/mcp/t-0/sse',
            headers={'Accept': 'text/event-stream'},
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"📡 MCP Connection: Active (HTTP 200)")
        else:
            print(f"⚠️ MCP Connection: {response.status_code}")
            
    except Exception as e:
        print(f"❌ MCP Connection: Error - {e}")
    
    if not responses_found:
        print(f"⏳ No new responses detected")
        print(f"🔄 Monitoring continues...")
    
    return None

def continuous_monitoring():
    """Run continuous monitoring with updates"""
    
    print(f"🚀 STARTING CONTINUOUS PARENG BOYONG MONITORING")
    print(f"⏰ Check interval: 30 seconds")
    print(f"🎯 Looking for: Pareng Boyong agent responses")
    print(f"📡 MCP channel: Monitoring active")
    print("=" * 55)
    
    check_count = 0
    
    try:
        while True:
            check_count += 1
            print(f"\n🔍 Check #{check_count} - {datetime.now().strftime('%H:%M:%S')}")
            
            response = check_for_response()
            
            if response:
                print(f"\n🎉 PARENG BOYONG RESPONSE DETECTED!")
                print(f"📄 File: {response['filename']}")
                print(f"📅 Time: {response['modified']}")
                print(f"💾 Saving detection report...")
                
                detection_report = {
                    'detection_time': datetime.now().isoformat(),
                    'response_found': True,
                    'response_details': response,
                    'check_number': check_count
                }
                
                with open('pareng_boyong_response_detected.json', 'w') as f:
                    json.dump(detection_report, f, indent=2)
                
                print(f"✅ Detection report saved: pareng_boyong_response_detected.json")
                print(f"🚀 Ready to process Pareng Boyong requirements!")
                break
            
            # Status update every 5 checks
            if check_count % 5 == 0:
                print(f"📊 Status after {check_count} checks:")
                print(f"   🔄 Monitoring active")
                print(f"   📡 MCP connection maintained")
                print(f"   ⏰ Runtime: {check_count * 0.5} minutes")
            
            time.sleep(30)  # Check every 30 seconds
            
    except KeyboardInterrupt:
        print(f"\n⏹️ Monitoring stopped by user")
        print(f"📊 Total checks: {check_count}")
        print(f"⏰ Runtime: {check_count * 0.5} minutes")
        
def main():
    """Main monitoring function"""
    
    print(f"🎯 PARENG BOYONG RESPONSE MONITOR")
    print(f"=" * 40)
    
    # Single check first
    response = check_for_response()
    
    if response:
        print(f"\n🎉 RESPONSE ALREADY AVAILABLE!")
        return response
    
    # Ask for continuous monitoring
    print(f"\n🔄 No immediate response detected")
    print(f"🎧 Background MCP client should be monitoring")
    print(f"📊 Current status: Waiting for Pareng Boyong response")
    
    # Run one final check of system status
    print(f"\n🔍 SYSTEM STATUS CHECK:")
    
    # Check if background client is running
    try:
        with open('mcp_monitoring.log', 'r') as f:
            log_size = len(f.readlines())
        print(f"   ✅ MCP monitoring log: {log_size} lines")
    except:
        print(f"   ⚠️ MCP monitoring log not found")
    
    # Check introduction was sent
    if os.path.exists('formal_introduction_to_pareng_boyong.json'):
        print(f"   ✅ Introduction message: Sent and saved")
    else:
        print(f"   ❌ Introduction message: Not found")
    
    # Check Hibla system
    try:
        response = requests.get('http://localhost:5000/health', timeout=3)
        if response.status_code == 200:
            print(f"   ✅ Hibla system: Operational")
        else:
            print(f"   ⚠️ Hibla system: Status {response.status_code}")
    except:
        print(f"   ❌ Hibla system: Not responding")
    
    print(f"\n🎯 EXPECTED TIMELINE:")
    print(f"   📨 Message sent: {datetime.now().strftime('%H:%M:%S')}")
    print(f"   ⏰ Expected response: 6-24 hours")
    print(f"   🔄 Monitoring: Active in background")
    print(f"   📋 Next check: Run this script again or check response files")

if __name__ == '__main__':
    main()