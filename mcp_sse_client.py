#!/usr/bin/env python3
"""
Production SSE MCP Client for Pareng Boyong Real-time Communication
=================================================================
Handles persistent SSE connection with proper event parsing and message handling
"""

import requests
import json
import time
import threading
import logging
from datetime import datetime
from urllib3.exceptions import ReadTimeoutError
import sseclient

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProductionMCPClient:
    """Production-ready MCP SSE client for real-time communication"""
    
    def __init__(self):
        self.mcp_url = "https://ai.innovatehub.ph/mcp/t-0/sse"
        self.session_id = None
        self.messages_endpoint = None
        self.connected = False
        self.running = False
        self.client_thread = None
        self.received_messages = []
        self.pareng_boyong_responses = []
        
    def start(self):
        """Start the SSE client in background thread"""
        if self.running:
            logger.warning("Client already running")
            return
            
        self.running = True
        self.client_thread = threading.Thread(target=self._connection_loop, daemon=True)
        self.client_thread.start()
        logger.info("🚀 SSE MCP Client started")
        
    def _connection_loop(self):
        """Main connection loop with auto-reconnect"""
        while self.running:
            try:
                self._establish_sse_connection()
            except Exception as e:
                logger.error(f"Connection error: {e}")
                if self.running:
                    logger.info("Reconnecting in 5 seconds...")
                    time.sleep(5)
                    
    def _establish_sse_connection(self):
        """Establish SSE connection and listen for events"""
        try:
            headers = {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'User-Agent': 'Hibla-MCP-Client/2.0'
            }
            
            logger.info(f"Connecting to {self.mcp_url}")
            
            response = requests.get(
                self.mcp_url,
                headers=headers,
                stream=True,
                timeout=(10, None)  # 10s connect, no read timeout
            )
            
            if response.status_code != 200:
                logger.error(f"HTTP {response.status_code}: {response.text}")
                return
                
            self.connected = True
            logger.info("✅ SSE connection established")
            
            # Parse SSE events
            for line in response.iter_lines(decode_unicode=True):
                if not self.running:
                    break
                    
                if line:
                    self._process_sse_line(line)
                    
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
        finally:
            self.connected = False
            
    def _process_sse_line(self, line):
        """Process individual SSE line"""
        try:
            if line.startswith('event:'):
                event_type = line[6:].strip()
                logger.info(f"📡 Event: {event_type}")
                
            elif line.startswith('data:'):
                data = line[5:].strip()
                self._handle_sse_data(data)
                
        except Exception as e:
            logger.error(f"Line processing error: {e}")
            
    def _handle_sse_data(self, data):
        """Handle SSE data payload"""
        try:
            logger.info(f"📨 Data: {data[:200]}...")
            
            # Extract session endpoint if present
            if '/messages/' in data and 'session_id=' in data:
                self.messages_endpoint = data.strip()
                session_start = data.find('session_id=') + 11
                session_end = data.find('&', session_start)
                if session_end == -1:
                    session_end = len(data)
                self.session_id = data[session_start:session_end]
                logger.info(f"🔑 Session ID: {self.session_id}")
                logger.info(f"📬 Messages endpoint: {self.messages_endpoint}")
                
                # Start monitoring messages endpoint
                self._start_message_monitoring()
                return
            
            # Try to parse as JSON message
            if data.startswith('{') and data.endswith('}'):
                try:
                    message_data = json.loads(data)
                    self._process_json_message(message_data)
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON: {data[:100]}...")
                    
            # Store all received data
            message_entry = {
                'timestamp': datetime.now().isoformat(),
                'raw_data': data,
                'processed': False
            }
            
            self.received_messages.append(message_entry)
            self._save_messages()
            
        except Exception as e:
            logger.error(f"Data handling error: {e}")
            
    def _process_json_message(self, data):
        """Process structured JSON messages"""
        try:
            logger.info(f"📋 JSON Message: {json.dumps(data, indent=2)[:300]}...")
            
            # Check if this is from Pareng Boyong
            if self._is_pareng_boyong_message(data):
                logger.info("🎯 PARENG BOYONG MESSAGE DETECTED!")
                self._handle_pareng_boyong_response(data)
                
        except Exception as e:
            logger.error(f"JSON processing error: {e}")
            
    def _is_pareng_boyong_message(self, data):
        """Detect Pareng Boyong messages"""
        if not isinstance(data, dict):
            return False
            
        # Convert to string for pattern matching
        data_str = json.dumps(data).lower()
        
        # Pareng Boyong identifiers
        identifiers = [
            'pareng-boyong', 'pareng_boyong', 'boyong',
            'subordinate', 'agent-zero', 'mcp-agent'
        ]
        
        return any(identifier in data_str for identifier in identifiers)
        
    def _handle_pareng_boyong_response(self, data):
        """Handle response from Pareng Boyong"""
        try:
            response_entry = {
                'timestamp': datetime.now().isoformat(),
                'source': 'pareng_boyong_mcp',
                'message': data,
                'session_id': self.session_id,
                'status': 'received'
            }
            
            self.pareng_boyong_responses.append(response_entry)
            
            # Save response
            with open('pareng_boyong_mcp_response.json', 'w') as f:
                json.dump(response_entry, f, indent=2)
                
            logger.info("💾 Pareng Boyong response saved")
            
            # Send acknowledgment
            self._send_acknowledgment(data)
            
        except Exception as e:
            logger.error(f"Pareng Boyong handling error: {e}")
            
    def _send_acknowledgment(self, original_data):
        """Send acknowledgment back"""
        try:
            ack = {
                'timestamp': datetime.now().isoformat(),
                'from': 'hibla-manufacturing-system',
                'to': 'pareng-boyong',
                'type': 'acknowledgment',
                'status': 'received',
                'original_message': original_data.get('id', 'unknown'),
                'hibla_ready': True
            }
            
            # Try to send via messages endpoint if available
            if self.messages_endpoint:
                full_url = f"https://ai.innovatehub.ph{self.messages_endpoint}"
                try:
                    response = requests.post(full_url, json=ack, timeout=10)
                    logger.info(f"📤 Acknowledgment sent: {response.status_code}")
                except Exception as e:
                    logger.warning(f"Ack send failed: {e}")
                    
            # Save acknowledgment
            with open('mcp_acknowledgment.json', 'w') as f:
                json.dump(ack, f, indent=2)
                
        except Exception as e:
            logger.error(f"Acknowledgment error: {e}")
            
    def _start_message_monitoring(self):
        """Start monitoring the messages endpoint"""
        if not self.messages_endpoint:
            return
            
        def monitor_messages():
            while self.running and self.messages_endpoint:
                try:
                    full_url = f"https://ai.innovatehub.ph{self.messages_endpoint}"
                    response = requests.get(full_url, timeout=10)
                    
                    if response.status_code == 200:
                        try:
                            messages = response.json()
                            if messages:
                                logger.info(f"📬 New messages: {len(messages)}")
                                for msg in messages:
                                    self._process_json_message(msg)
                        except json.JSONDecodeError:
                            pass
                            
                    time.sleep(5)  # Check every 5 seconds
                    
                except Exception as e:
                    logger.warning(f"Message monitoring error: {e}")
                    time.sleep(10)
                    
        monitor_thread = threading.Thread(target=monitor_messages, daemon=True)
        monitor_thread.start()
        logger.info("📬 Message monitoring started")
        
    def send_message(self, message):
        """Send message to MCP server"""
        try:
            message['from'] = 'hibla-manufacturing-system'
            message['timestamp'] = datetime.now().isoformat()
            
            # Try main endpoint
            response = requests.post(self.mcp_url, json=message, timeout=15)
            logger.info(f"📤 Message sent to main endpoint: {response.status_code}")
            
            # Try messages endpoint if available
            if self.messages_endpoint:
                full_url = f"https://ai.innovatehub.ph{self.messages_endpoint}"
                try:
                    response2 = requests.post(full_url, json=message, timeout=15)
                    logger.info(f"📤 Message sent to session endpoint: {response2.status_code}")
                except Exception as e:
                    logger.warning(f"Session send failed: {e}")
                    
            return True
            
        except Exception as e:
            logger.error(f"Send error: {e}")
            return False
            
    def _save_messages(self):
        """Save received messages"""
        try:
            with open('mcp_sse_messages.json', 'w') as f:
                json.dump({
                    'session_id': self.session_id,
                    'messages_endpoint': self.messages_endpoint,
                    'message_count': len(self.received_messages),
                    'messages': self.received_messages[-50:]  # Last 50 messages
                }, f, indent=2)
        except Exception as e:
            logger.error(f"Save error: {e}")
            
    def get_status(self):
        """Get client status"""
        return {
            'running': self.running,
            'connected': self.connected,
            'session_id': self.session_id,
            'messages_endpoint': self.messages_endpoint,
            'messages_received': len(self.received_messages),
            'pareng_boyong_responses': len(self.pareng_boyong_responses)
        }
        
    def stop(self):
        """Stop the client"""
        self.running = False
        self.connected = False
        if self.client_thread:
            self.client_thread.join(timeout=5)
        logger.info("⏹️ SSE MCP Client stopped")

def main():
    """Run the production MCP client"""
    print("🚀 PRODUCTION SSE MCP CLIENT FOR PARENG BOYONG")
    print("=" * 60)
    
    client = ProductionMCPClient()
    
    # Start the client
    client.start()
    
    # Wait for connection
    print("🔗 Establishing SSE connection...")
    time.sleep(3)
    
    # Send initial message
    initial_message = {
        'type': 'hibla_system_ready',
        'priority': 'high',
        'hibla_capabilities': {
            'manufacturing_data': 'real_time_access',
            'document_generation': 'multi_format_pdf_docx_md',
            'api_endpoints': 'full_rest_api',
            'integration_ready': True
        },
        'pareng_boyong_integration': {
            'status': 'awaiting_requirements',
            'sse_connection': 'established',
            'message_handling': 'automatic',
            'response_processing': 'real_time'
        },
        'message': 'Hibla Manufacturing System is ready for Pareng Boyong integration via real-time SSE'
    }
    
    print("📤 Sending initial system ready message...")
    client.send_message(initial_message)
    
    # Monitor status
    try:
        while True:
            status = client.get_status()
            print(f"\r🔄 Status: Connected={status['connected']}, Messages={status['messages_received']}, Responses={status['pareng_boyong_responses']}", end='', flush=True)
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n⏹️ Stopping MCP client...")
        client.stop()
        
        # Final status
        final_status = client.get_status()
        print(f"\n📊 Final Status:")
        print(f"   Session ID: {final_status['session_id']}")
        print(f"   Messages Received: {final_status['messages_received']}")
        print(f"   Pareng Boyong Responses: {final_status['pareng_boyong_responses']}")
        
        if final_status['pareng_boyong_responses'] > 0:
            print(f"✅ PARENG BOYONG RESPONDED!")
            print(f"📄 Check: pareng_boyong_mcp_response.json")
        else:
            print(f"⏳ No responses from Pareng Boyong yet")
            print(f"📄 Check: mcp_sse_messages.json for all received data")

if __name__ == '__main__':
    main()