#!/usr/bin/env python3
"""
Webhook Notification System for Pareng Boyong
============================================
Create webhook endpoint to receive responses from Pareng Boyong agents
"""

from flask import Flask, request, jsonify
import json
import time
from datetime import datetime
import requests
import threading

app = Flask(__name__)
received_messages = []

@app.route('/webhook/pareng-boyong', methods=['POST'])
def pareng_boyong_webhook():
    """Receive webhook notifications from Pareng Boyong agents"""
    try:
        data = request.get_json()
        
        # Log the received message
        message = {
            'timestamp': datetime.now().isoformat(),
            'source': 'pareng_boyong_webhook',
            'remote_ip': request.remote_addr,
            'headers': dict(request.headers),
            'data': data
        }
        
        received_messages.append(message)
        
        # Save to file for persistence
        with open('pareng_boyong_webhook_messages.json', 'w') as f:
            json.dump(received_messages, f, indent=2)
        
        print(f"📨 Webhook received from Pareng Boyong:")
        print(f"   IP: {request.remote_addr}")
        print(f"   Data: {json.dumps(data, indent=2)[:200]}...")
        
        # Send acknowledgment
        response = {
            'status': 'received',
            'timestamp': datetime.now().isoformat(),
            'message_id': len(received_messages),
            'hibla_system': 'operational'
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"❌ Webhook error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/webhook/status', methods=['GET'])
def webhook_status():
    """Get webhook status and received messages"""
    return jsonify({
        'status': 'active',
        'webhook_url': '/webhook/pareng-boyong',
        'messages_received': len(received_messages),
        'last_message': received_messages[-1] if received_messages else None,
        'hibla_system_status': 'operational'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check for webhook service"""
    return jsonify({
        'status': 'ok',
        'service': 'pareng-boyong-webhook',
        'timestamp': datetime.now().isoformat()
    })

def start_webhook_server():
    """Start the webhook server"""
    print("🌐 Starting Pareng Boyong webhook server...")
    print("📡 Webhook endpoint: http://localhost:5004/webhook/pareng-boyong")
    print("📊 Status endpoint: http://localhost:5004/webhook/status")
    print("🏥 Health check: http://localhost:5004/health")
    
    app.run(host='0.0.0.0', port=5004, debug=False)

def notify_pareng_boyong_webhook_ready():
    """Notify that webhook is ready to receive messages"""
    
    notification = {
        'timestamp': datetime.now().isoformat(),
        'from': 'Hibla Manufacturing System',
        'to': 'Pareng Boyong Agents',
        'message_type': 'webhook_ready_notification',
        'webhook_info': {
            'url': 'http://localhost:5004/webhook/pareng-boyong',
            'method': 'POST',
            'content_type': 'application/json',
            'status_endpoint': 'http://localhost:5004/webhook/status',
            'health_check': 'http://localhost:5004/health'
        },
        'message': 'Hibla system webhook is ready to receive responses from Pareng Boyong agents',
        'integration_status': 'awaiting_response'
    }
    
    # Save notification for reference
    with open('webhook_ready_notification.json', 'w') as f:
        json.dump(notification, f, indent=2)
    
    print("📢 Webhook ready notification created")
    return notification

if __name__ == '__main__':
    # Create notification first
    notify_pareng_boyong_webhook_ready()
    
    # Start webhook server
    start_webhook_server()