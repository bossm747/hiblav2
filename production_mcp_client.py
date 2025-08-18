#!/usr/bin/env python3
"""
Production MCP Client - Session-based Real-time Communication
============================================================
Uses the session endpoint discovered from SSE for proper real-time messaging
"""

import requests
import json
import time
import threading
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SessionBasedMCPClient:
    """Production MCP client using session-based messaging"""
    
    def __init__(self):
        self.base_url = "https://ai.innovatehub.ph"
        self.sse_endpoint = f"{self.base_url}/mcp/t-0/sse"
        self.session_id = None
        self.messages_endpoint = None
        self.running = False
        self.received_messages = []
        self.pareng_boyong_responses = []
        
    def discover_session(self):
        """Discover session ID and messages endpoint from SSE"""
        try:
            logger.info("Discovering session from SSE endpoint...")
            
            response = requests.get(
                self.sse_endpoint,
                headers={'Accept': 'text/event-stream'},
                timeout=10,
                stream=True
            )
            
            if response.status_code != 200:
                logger.error(f"SSE connection failed: {response.status_code}")
                return False
                
            # Read the first event to get session info
            for line in response.iter_lines(decode_unicode=True):
                if line and line.startswith('data:'):
                    data = line[5:].strip()
                    logger.info(f"SSE Data: {data}")
                    
                    if '/messages/' in data and 'session_id=' in data:
                        self.messages_endpoint = data
                        # Extract session ID
                        session_start = data.find('session_id=') + 11
                        session_end = data.find('&', session_start)
                        if session_end == -1:
                            session_end = len(data)
                        self.session_id = data[session_start:session_end]
                        
                        logger.info(f"✅ Session discovered: {self.session_id}")
                        logger.info(f"📬 Messages endpoint: {self.messages_endpoint}")
                        return True
                        
            logger.warning("No session info found in SSE stream")
            return False
            
        except Exception as e:
            logger.error(f"Session discovery error: {e}")
            return False
    
    def start_monitoring(self):
        """Start monitoring for messages"""
        if not self.session_id:
            logger.error("No session ID - run discover_session() first")
            return False
            
        self.running = True
        monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        monitor_thread.start()
        logger.info("🎧 Message monitoring started")
        return True
        
    def _monitor_loop(self):
        """Main monitoring loop"""
        while self.running:
            try:
                self._check_messages()
                time.sleep(3)  # Check every 3 seconds
            except Exception as e:
                logger.error(f"Monitor loop error: {e}")
                time.sleep(5)
                
    def _check_messages(self):
        """Check for new messages"""
        try:
            full_url = f"{self.base_url}{self.messages_endpoint}"
            
            response = requests.get(full_url, timeout=10)
            
            if response.status_code == 200:
                try:
                    messages = response.json()
                    if messages and isinstance(messages, list):
                        new_messages = len(messages) - len(self.received_messages)
                        if new_messages > 0:
                            logger.info(f"📨 {new_messages} new messages received")
                            
                            for msg in messages[len(self.received_messages):]:
                                self._process_message(msg)
                                self.received_messages.append({
                                    'timestamp': datetime.now().isoformat(),
                                    'message': msg
                                })
                                
                except json.JSONDecodeError:
                    # Response might be plain text
                    if response.text.strip():
                        logger.info(f"📝 Text response: {response.text[:200]}")
                        
            elif response.status_code == 400:
                logger.debug("No new messages (400 response)")
            else:
                logger.warning(f"Messages check failed: {response.status_code}")
                
        except Exception as e:
            logger.warning(f"Message check error: {e}")
            
    def _process_message(self, message):
        """Process received message"""
        try:
            logger.info(f"📋 Processing message: {json.dumps(message, indent=2)[:300]}...")
            
            # Check if this is from Pareng Boyong
            if self._is_pareng_boyong_message(message):
                logger.info("🎯 PARENG BOYONG MESSAGE DETECTED!")
                self._handle_pareng_boyong_message(message)
                
            # Save all messages
            self._save_messages()
            
        except Exception as e:
            logger.error(f"Message processing error: {e}")
            
    def _is_pareng_boyong_message(self, message):
        """Check if message is from Pareng Boyong"""
        if not isinstance(message, dict):
            return False
            
        message_str = json.dumps(message).lower()
        identifiers = [
            'pareng-boyong', 'pareng_boyong', 'boyong',
            'subordinate', 'agent-zero', 'mcp-agent'
        ]
        
        return any(identifier in message_str for identifier in identifiers)
        
    def _handle_pareng_boyong_message(self, message):
        """Handle Pareng Boyong response"""
        try:
            response_data = {
                'timestamp': datetime.now().isoformat(),
                'session_id': self.session_id,
                'source': 'pareng_boyong_mcp_session',
                'message': message,
                'status': 'received'
            }
            
            self.pareng_boyong_responses.append(response_data)
            
            # Save response immediately
            with open('pareng_boyong_session_response.json', 'w') as f:
                json.dump(response_data, f, indent=2)
                
            logger.info("💾 Pareng Boyong response saved to pareng_boyong_session_response.json")
            
            # Send acknowledgment
            self._send_acknowledgment(message)
            
        except Exception as e:
            logger.error(f"Pareng Boyong handling error: {e}")
            
    def _send_acknowledgment(self, original_message):
        """Send acknowledgment via session endpoint"""
        try:
            ack_message = {
                'timestamp': datetime.now().isoformat(),
                'from': 'hibla-manufacturing-system',
                'to': 'pareng-boyong',
                'type': 'acknowledgment',
                'status': 'message_received',
                'original_message_id': original_message.get('id', 'unknown'),
                'session_id': self.session_id,
                'hibla_integration_status': 'ready'
            }
            
            # Send via session endpoint
            full_url = f"{self.base_url}{self.messages_endpoint}"
            response = requests.post(full_url, json=ack_message, timeout=15)
            
            logger.info(f"📤 Acknowledgment sent: {response.status_code}")
            
            # Also save acknowledgment
            with open('session_acknowledgment.json', 'w') as f:
                json.dump(ack_message, f, indent=2)
                
        except Exception as e:
            logger.error(f"Acknowledgment error: {e}")
            
    def send_message(self, message):
        """Send message via session endpoint"""
        try:
            if not self.session_id:
                logger.error("No active session")
                return False
                
            message['from'] = 'hibla-manufacturing-system'
            message['timestamp'] = datetime.now().isoformat()
            message['session_id'] = self.session_id
            
            full_url = f"{self.base_url}{self.messages_endpoint}"
            response = requests.post(full_url, json=message, timeout=15)
            
            logger.info(f"📤 Message sent via session: {response.status_code}")
            return response.status_code in [200, 201, 202]
            
        except Exception as e:
            logger.error(f"Send error: {e}")
            return False
            
    def _save_messages(self):
        """Save all received messages"""
        try:
            data = {
                'session_id': self.session_id,
                'messages_endpoint': self.messages_endpoint,
                'total_messages': len(self.received_messages),
                'pareng_boyong_responses': len(self.pareng_boyong_responses),
                'last_updated': datetime.now().isoformat(),
                'recent_messages': self.received_messages[-10:]  # Last 10
            }
            
            with open('mcp_session_messages.json', 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            logger.error(f"Save error: {e}")
            
    def get_status(self):
        """Get client status"""
        return {
            'session_id': self.session_id,
            'messages_endpoint': self.messages_endpoint,
            'running': self.running,
            'total_messages': len(self.received_messages),
            'pareng_boyong_responses': len(self.pareng_boyong_responses)
        }
        
    def stop(self):
        """Stop monitoring"""
        self.running = False
        logger.info("⏹️ MCP client stopped")

def main():
    """Run production MCP client"""
    print("🚀 PRODUCTION SESSION-BASED MCP CLIENT")
    print("=" * 50)
    
    client = SessionBasedMCPClient()
    
    # Step 1: Discover session
    print("🔍 Discovering session from SSE...")
    if not client.discover_session():
        print("❌ Failed to discover session")
        return
        
    print(f"✅ Session discovered: {client.session_id}")
    
    # Step 2: Start monitoring
    print("🎧 Starting message monitoring...")
    client.start_monitoring()
    
    # Step 3: Send initial message to Pareng Boyong
    print("📤 Sending initial message to Pareng Boyong...")
    
    initial_message = {
        'type': 'hibla_system_ready_session_based',
        'priority': 'high',
        'to': 'pareng-boyong-agents',
        'subject': 'Session-based MCP Communication Established',
        'hibla_system': {
            'status': 'operational',
            'session_communication': 'active',
            'manufacturing_data': {
                'customers': 16,
                'products': 21,
                'quotations': 22,
                'sales_orders': 10,
                'job_orders': 5,
                'real_time_access': True
            },
            'document_generation': 'ready_to_deploy',
            'api_endpoints': 'full_rest_access'
        },
        'integration_request': {
            'agent_registration': 'How should agents register?',
            'authentication': 'What auth method do you prefer?',
            'message_format': 'What JSON structure do you need?',
            'callback_urls': 'Where should we send responses?',
            'rate_limits': 'What are your expected usage patterns?'
        },
        'immediate_capabilities': [
            'Real-time manufacturing data access',
            'Professional document generation (PDF, DOCX, MD)',
            'Session-based persistent communication',
            'Automatic response processing',
            'Complete API integration'
        ]
    }
    
    success = client.send_message(initial_message)
    if success:
        print("✅ Initial message sent successfully")
    else:
        print("⚠️ Message send had issues")
    
    # Step 4: Monitor for responses
    print("👁️ Monitoring for Pareng Boyong responses...")
    print("   Press Ctrl+C to stop")
    
    try:
        while True:
            status = client.get_status()
            print(f"\r📊 Messages: {status['total_messages']}, Pareng Boyong: {status['pareng_boyong_responses']}", end='', flush=True)
            
            if status['pareng_boyong_responses'] > 0:
                print(f"\n🎉 PARENG BOYONG RESPONDED!")
                print(f"📄 Check: pareng_boyong_session_response.json")
                break
                
            time.sleep(5)
            
    except KeyboardInterrupt:
        print(f"\n⏹️ Stopping client...")
        client.stop()
        
        final_status = client.get_status()
        print(f"📊 Final Status:")
        print(f"   Session: {final_status['session_id']}")
        print(f"   Total Messages: {final_status['total_messages']}")
        print(f"   Pareng Boyong Responses: {final_status['pareng_boyong_responses']}")
        
        if final_status['pareng_boyong_responses'] > 0:
            print(f"✅ Integration successful - Pareng Boyong responded!")
        else:
            print(f"⏳ No response yet - monitoring can continue")

if __name__ == '__main__':
    main()