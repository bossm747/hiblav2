#!/usr/bin/env python3
"""
Real-time MCP Client for Pareng Boyong Communication
===================================================
Proper SSE client with persistent connection and message handling
"""

import sseclient
import requests
import json
import time
import threading
from datetime import datetime
from flask import Flask, request, jsonify
from queue import Queue
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HiblaMCPClient:
    """Real-time MCP client for Pareng Boyong communication"""
    
    def __init__(self):
        self.mcp_endpoint = "https://ai.innovatehub.ph/mcp/t-0/sse"
        self.session_id = None
        self.connected = False
        self.message_queue = Queue()
        self.received_messages = []
        self.client_thread = None
        self.flask_app = None
        self.stop_flag = False
        
    def connect(self):
        """Establish SSE connection to MCP server"""
        try:
            headers = {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'User-Agent': 'Hibla-MCP-Client/1.0'
            }
            
            logger.info(f"Connecting to MCP server: {self.mcp_endpoint}")
            
            response = requests.get(
                self.mcp_endpoint,
                headers=headers,
                stream=True,
                timeout=30
            )
            
            if response.status_code == 200:
                self.connected = True
                logger.info("✅ SSE connection established")
                return response
            else:
                logger.error(f"❌ Connection failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Connection error: {e}")
            return None
    
    def start_listening(self):
        """Start listening for messages in a separate thread"""
        self.client_thread = threading.Thread(target=self._listen_loop, daemon=True)
        self.client_thread.start()
        logger.info("🎧 Started message listening thread")
        
    def _listen_loop(self):
        """Main listening loop for SSE messages"""
        while not self.stop_flag:
            try:
                response = self.connect()
                if not response:
                    logger.warning("⚠️ Connection failed, retrying in 10 seconds...")
                    time.sleep(10)
                    continue
                
                client = sseclient.SSEClient(response)
                logger.info("🎧 Listening for messages...")
                
                for event in client:
                    if self.stop_flag:
                        break
                        
                    if event.event and event.data:
                        self._handle_sse_event(event)
                    elif event.data:
                        self._handle_sse_data(event.data)
                        
            except Exception as e:
                logger.error(f"❌ Listening error: {e}")
                if not self.stop_flag:
                    logger.info("🔄 Reconnecting in 5 seconds...")
                    time.sleep(5)
    
    def _handle_sse_event(self, event):
        """Handle structured SSE events"""
        try:
            message = {
                'timestamp': datetime.now().isoformat(),
                'event_type': event.event,
                'data': event.data,
                'processed': False
            }
            
            logger.info(f"📨 SSE Event: {event.event}")
            logger.info(f"📄 Data: {event.data[:200]}...")
            
            # Extract session ID if present
            if event.event == 'endpoint' and '/messages/' in event.data:
                session_match = event.data.split('session_id=')
                if len(session_match) > 1:
                    self.session_id = session_match[1].split('&')[0]
                    logger.info(f"🔑 Session ID extracted: {self.session_id}")
            
            # Try to parse as JSON if it looks like JSON
            if event.data.strip().startswith('{'):
                try:
                    parsed_data = json.loads(event.data)
                    message['parsed_data'] = parsed_data
                    logger.info(f"✅ Parsed JSON data: {parsed_data}")
                except json.JSONDecodeError:
                    pass
            
            self.received_messages.append(message)
            self.message_queue.put(message)
            self._save_messages()
            
        except Exception as e:
            logger.error(f"❌ Event handling error: {e}")
    
    def _handle_sse_data(self, data):
        """Handle raw SSE data"""
        try:
            message = {
                'timestamp': datetime.now().isoformat(),
                'raw_data': data,
                'processed': False
            }
            
            logger.info(f"📨 Raw SSE Data: {data[:200]}...")
            
            # Try to parse as JSON
            if data.strip().startswith('{'):
                try:
                    parsed_data = json.loads(data)
                    message['parsed_data'] = parsed_data
                    logger.info(f"✅ Parsed JSON: {parsed_data}")
                    
                    # Check if this is a Pareng Boyong message
                    if self._is_pareng_boyong_message(parsed_data):
                        logger.info("🎯 Detected Pareng Boyong message!")
                        message['from_pareng_boyong'] = True
                        self._process_pareng_boyong_message(parsed_data)
                        
                except json.JSONDecodeError:
                    pass
            
            self.received_messages.append(message)
            self.message_queue.put(message)
            self._save_messages()
            
        except Exception as e:
            logger.error(f"❌ Data handling error: {e}")
    
    def _is_pareng_boyong_message(self, data):
        """Check if message is from Pareng Boyong system"""
        if not isinstance(data, dict):
            return False
            
        # Look for Pareng Boyong identifiers
        pareng_identifiers = [
            'pareng-boyong', 'pareng_boyong', 
            'ParengBoyong', 'agent-zero',
            'subordinate-agent', 'boyong'
        ]
        
        message_str = json.dumps(data).lower()
        return any(identifier.lower() in message_str for identifier in pareng_identifiers)
    
    def _process_pareng_boyong_message(self, data):
        """Process message from Pareng Boyong"""
        try:
            # Save Pareng Boyong response
            response_data = {
                'timestamp': datetime.now().isoformat(),
                'received_via': 'mcp_sse',
                'source': 'pareng_boyong',
                'message': data,
                'processing_status': 'received'
            }
            
            with open('pareng_boyong_response.json', 'w') as f:
                json.dump(response_data, f, indent=2)
            
            logger.info("💾 Pareng Boyong response saved")
            
            # Send acknowledgment back
            self._send_acknowledgment(data)
            
        except Exception as e:
            logger.error(f"❌ Pareng Boyong processing error: {e}")
    
    def _send_acknowledgment(self, original_message):
        """Send acknowledgment back to Pareng Boyong"""
        try:
            ack_message = {
                'timestamp': datetime.now().isoformat(),
                'from': 'hibla-manufacturing-system',
                'to': 'pareng-boyong',
                'type': 'acknowledgment',
                'status': 'received',
                'original_message_id': original_message.get('id', 'unknown'),
                'hibla_system_status': 'ready_for_integration'
            }
            
            # Try to send acknowledgment via POST
            try:
                response = requests.post(
                    self.mcp_endpoint,
                    json=ack_message,
                    timeout=10
                )
                logger.info(f"📤 Acknowledgment sent: {response.status_code}")
            except:
                # If POST fails, save as file
                with open('pareng_boyong_acknowledgment.json', 'w') as f:
                    json.dump(ack_message, f, indent=2)
                logger.info("📤 Acknowledgment saved to file")
                
        except Exception as e:
            logger.error(f"❌ Acknowledgment error: {e}")
    
    def _save_messages(self):
        """Save all received messages to file"""
        try:
            with open('mcp_received_messages.json', 'w') as f:
                json.dump(self.received_messages, f, indent=2)
        except Exception as e:
            logger.error(f"❌ Save error: {e}")
    
    def send_message(self, message):
        """Send message to MCP server"""
        try:
            # Add Hibla system identification
            message['from'] = 'hibla-manufacturing-system'
            message['timestamp'] = datetime.now().isoformat()
            
            response = requests.post(
                self.mcp_endpoint,
                json=message,
                timeout=15
            )
            
            logger.info(f"📤 Message sent: {response.status_code}")
            return response.status_code == 200 or response.status_code == 405
            
        except Exception as e:
            logger.error(f"❌ Send error: {e}")
            return False
    
    def get_status(self):
        """Get current client status"""
        return {
            'connected': self.connected,
            'session_id': self.session_id,
            'messages_received': len(self.received_messages),
            'listening': self.client_thread is not None and self.client_thread.is_alive(),
            'mcp_endpoint': self.mcp_endpoint
        }
    
    def stop(self):
        """Stop the MCP client"""
        self.stop_flag = True
        self.connected = False
        if self.client_thread:
            self.client_thread.join(timeout=5)
        logger.info("⏹️ MCP client stopped")

def create_api_server(mcp_client):
    """Create API server for MCP client management"""
    app = Flask(__name__)
    
    @app.route('/mcp/status', methods=['GET'])
    def get_status():
        return jsonify(mcp_client.get_status())
    
    @app.route('/mcp/messages', methods=['GET'])
    def get_messages():
        return jsonify({
            'message_count': len(mcp_client.received_messages),
            'messages': mcp_client.received_messages[-10:]  # Last 10 messages
        })
    
    @app.route('/mcp/send', methods=['POST'])
    def send_message():
        try:
            message = request.get_json()
            success = mcp_client.send_message(message)
            return jsonify({'status': 'sent' if success else 'failed'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok', 'service': 'mcp-client'})
    
    return app

def main():
    """Main MCP client execution"""
    print("🚀 Starting Real-time MCP Client for Pareng Boyong")
    print("=" * 60)
    
    # Create MCP client
    mcp_client = HiblaMCPClient()
    
    # Start listening for messages
    mcp_client.start_listening()
    
    # Send initial capabilities message
    initial_message = {
        'type': 'system_ready',
        'hibla_system': {
            'status': 'operational',
            'capabilities': [
                'manufacturing_data_access',
                'document_generation',
                'real_time_communication'
            ],
            'endpoints': {
                'main_app': 'http://localhost:5000',
                'documents': 'http://localhost:5001',
                'mcp_client': 'http://localhost:5005'
            }
        },
        'message': 'Hibla Manufacturing System ready for Pareng Boyong integration'
    }
    
    print("📤 Sending initial system ready message...")
    mcp_client.send_message(initial_message)
    
    # Create and start API server
    api_app = create_api_server(mcp_client)
    
    print("🌐 Starting MCP Client API server on port 5005...")
    print("📡 Endpoints:")
    print("   GET  /mcp/status - Client status")
    print("   GET  /mcp/messages - Received messages")
    print("   POST /mcp/send - Send message")
    print("   GET  /health - Health check")
    print("🎧 Real-time message listening active")
    print("📨 Monitoring for Pareng Boyong responses...")
    
    try:
        api_app.run(host='0.0.0.0', port=5005, debug=False)
    except KeyboardInterrupt:
        print("\n⏹️ Stopping MCP client...")
        mcp_client.stop()

if __name__ == '__main__':
    main()