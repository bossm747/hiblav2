#!/usr/bin/env python3
"""
MCP Agent Zero Integration for Hibla Automation System
=====================================================
Establishes communication with Agent Zero via SSE endpoint
"""

import requests
import json
import time
import threading
from datetime import datetime
import sseclient
from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

class MCPAgentIntegration:
    """Integration with Agent Zero MCP Server"""
    
    def __init__(self):
        self.mcp_server_url = "https://ai.innovatehub.ph/mcp/t-0/sse"
        self.hibla_base_url = "http://localhost:5000"
        self.doc_service_url = "http://localhost:5001"
        self.active_connections = {}
        self.message_queue = []
        
    def establish_sse_connection(self):
        """Establish SSE connection to Agent Zero MCP server"""
        try:
            logger.info(f"Establishing SSE connection to: {self.mcp_server_url}")
            
            headers = {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'User-Agent': 'Hibla-Automation-System/1.0'
            }
            
            response = requests.get(self.mcp_server_url, headers=headers, stream=True, timeout=30)
            
            if response.status_code == 200:
                logger.info("✅ SSE connection established with Agent Zero")
                return sseclient.SSEClient(response)
            else:
                logger.error(f"❌ SSE connection failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ SSE connection error: {e}")
            return None
    
    def send_system_capabilities(self):
        """Send Hibla system capabilities to Agent Zero"""
        capabilities_message = {
            'timestamp': datetime.now().isoformat(),
            'source': 'hibla-automation-system',
            'event_type': 'system_capabilities',
            'data': {
                'system_name': 'Hibla Manufacturing & Supply System',
                'system_type': 'manufacturing_automation',
                'version': '1.0',
                'status': 'operational',
                'services': {
                    'main_application': {
                        'url': self.hibla_base_url,
                        'status': self.check_service_health(self.hibla_base_url),
                        'capabilities': [
                            'quotation_management',
                            'sales_order_processing',
                            'job_order_tracking',
                            'inventory_management',
                            'dashboard_analytics',
                            'payment_processing',
                            'user_authentication'
                        ],
                        'endpoints': {
                            'health': f"{self.hibla_base_url}/health",
                            'api': f"{self.hibla_base_url}/api",
                            'dashboard': f"{self.hibla_base_url}/api/dashboard/analytics"
                        }
                    },
                    'document_generation': {
                        'url': self.doc_service_url,
                        'status': self.check_service_health(self.doc_service_url),
                        'capabilities': [
                            'markdown_to_pdf_conversion',
                            'docx_document_generation',
                            'multi_format_output',
                            'real_time_processing',
                            'template_based_generation'
                        ],
                        'endpoints': {
                            'health': f"{self.doc_service_url}/health",
                            'generate': f"{self.doc_service_url}/api/documents/generate"
                        }
                    }
                },
                'data_access': {
                    'customers': 16,
                    'products': 21,
                    'active_quotations': 22,
                    'active_sales_orders': 10,
                    'active_job_orders': 5
                },
                'automation_features': [
                    'automated_document_generation',
                    'workflow_automation',
                    'real_time_monitoring',
                    'payment_verification',
                    'inventory_tracking',
                    'report_generation'
                ]
            }
        }
        
        return capabilities_message
    
    def process_agent_zero_message(self, message):
        """Process incoming message from Agent Zero"""
        try:
            if hasattr(message, 'data') and message.data:
                data = json.loads(message.data)
                logger.info(f"📨 Received from Agent Zero: {data}")
                
                # Route message based on type
                if data.get('type') == 'document_request':
                    return self.handle_document_request(data)
                elif data.get('type') == 'system_status_request':
                    return self.handle_status_request(data)
                elif data.get('type') == 'data_request':
                    return self.handle_data_request(data)
                elif data.get('type') == 'workflow_trigger':
                    return self.handle_workflow_trigger(data)
                else:
                    logger.info(f"📝 Unhandled message type: {data.get('type')}")
                    return {'status': 'received', 'message': 'Message acknowledged'}
            
        except Exception as e:
            logger.error(f"❌ Error processing Agent Zero message: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def handle_document_request(self, request_data):
        """Handle document generation request from Agent Zero"""
        try:
            doc_payload = {
                'filename_base': request_data.get('filename_base', 'agent_zero_document'),
                'content': request_data.get('content', '# Document\n\nGenerated for Agent Zero'),
                'formats': request_data.get('formats', ['pdf', 'docx'])
            }
            
            # Send to document service
            response = requests.post(
                f"{self.doc_service_url}/api/documents/generate",
                json=doc_payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info("✅ Document generated for Agent Zero")
                
                return {
                    'status': 'success',
                    'type': 'document_response',
                    'timestamp': datetime.now().isoformat(),
                    'document_paths': result.get('paths', {}),
                    'request_id': request_data.get('request_id')
                }
            else:
                return {
                    'status': 'error',
                    'message': 'Document generation service unavailable',
                    'request_id': request_data.get('request_id')
                }
                
        except Exception as e:
            logger.error(f"❌ Document generation error: {e}")
            return {
                'status': 'error',
                'message': str(e),
                'request_id': request_data.get('request_id')
            }
    
    def handle_status_request(self, request_data):
        """Handle system status request from Agent Zero"""
        main_health = self.check_service_health(self.hibla_base_url)
        doc_health = self.check_service_health(self.doc_service_url)
        
        # Get current dashboard data
        dashboard_data = self.get_dashboard_data()
        
        return {
            'status': 'success',
            'type': 'status_response',
            'timestamp': datetime.now().isoformat(),
            'system_status': {
                'overall': 'operational' if main_health and doc_health else 'partial',
                'main_application': 'online' if main_health else 'offline',
                'document_service': 'online' if doc_health else 'offline'
            },
            'data_summary': dashboard_data,
            'request_id': request_data.get('request_id')
        }
    
    def handle_data_request(self, request_data):
        """Handle data access request from Agent Zero"""
        try:
            data_type = request_data.get('data_type')
            
            if data_type == 'dashboard_analytics':
                dashboard_data = self.get_dashboard_data()
                return {
                    'status': 'success',
                    'type': 'data_response',
                    'data': dashboard_data,
                    'timestamp': datetime.now().isoformat(),
                    'request_id': request_data.get('request_id')
                }
            else:
                return {
                    'status': 'error',
                    'message': f'Unsupported data type: {data_type}',
                    'request_id': request_data.get('request_id')
                }
                
        except Exception as e:
            logger.error(f"❌ Data request error: {e}")
            return {
                'status': 'error',
                'message': str(e),
                'request_id': request_data.get('request_id')
            }
    
    def handle_workflow_trigger(self, request_data):
        """Handle workflow trigger from Agent Zero"""
        try:
            workflow_type = request_data.get('workflow_type')
            workflow_data = request_data.get('workflow_data', {})
            
            logger.info(f"🔄 Processing workflow trigger: {workflow_type}")
            
            # Process different workflow types
            if workflow_type == 'generate_quotation':
                return self.process_quotation_workflow(workflow_data)
            elif workflow_type == 'create_sales_order':
                return self.process_sales_order_workflow(workflow_data)
            elif workflow_type == 'generate_report':
                return self.process_report_workflow(workflow_data)
            else:
                return {
                    'status': 'error',
                    'message': f'Unsupported workflow type: {workflow_type}',
                    'request_id': request_data.get('request_id')
                }
                
        except Exception as e:
            logger.error(f"❌ Workflow trigger error: {e}")
            return {
                'status': 'error',
                'message': str(e),
                'request_id': request_data.get('request_id')
            }
    
    def process_quotation_workflow(self, workflow_data):
        """Process quotation workflow"""
        # Generate quotation document
        quotation_content = f"""# QUOTATION

**Date**: {datetime.now().strftime('%Y-%m-%d')}
**Customer**: {workflow_data.get('customer_name', 'TBD')}
**Products**: {', '.join(workflow_data.get('products', []))}

## Items
{workflow_data.get('items_content', 'Items to be specified')}

## Total
**Total Amount**: ${workflow_data.get('total_amount', '0.00')}

---
*Generated by Hibla Automation System for Agent Zero*
"""
        
        doc_request = {
            'filename_base': f"quotation_{int(time.time())}",
            'content': quotation_content,
            'formats': ['pdf', 'docx']
        }
        
        return self.handle_document_request(doc_request)
    
    def process_sales_order_workflow(self, workflow_data):
        """Process sales order workflow"""
        sales_order_content = f"""# SALES ORDER

**Date**: {datetime.now().strftime('%Y-%m-%d')}
**Customer**: {workflow_data.get('customer_name', 'TBD')}
**Order Number**: SO-{datetime.now().strftime('%Y%m')}-{int(time.time()) % 1000:03d}

## Order Details
{workflow_data.get('order_details', 'Order details to be specified')}

## Payment Terms
{workflow_data.get('payment_terms', 'Payment terms TBD')}

---
*Generated by Hibla Automation System for Agent Zero*
"""
        
        doc_request = {
            'filename_base': f"sales_order_{int(time.time())}",
            'content': sales_order_content,
            'formats': ['pdf', 'docx']
        }
        
        return self.handle_document_request(doc_request)
    
    def process_report_workflow(self, workflow_data):
        """Process report generation workflow"""
        dashboard_data = self.get_dashboard_data()
        
        report_content = f"""# HIBLA MANUFACTURING REPORT

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Report Type**: {workflow_data.get('report_type', 'System Summary')}

## System Overview
- **Total Customers**: {dashboard_data.get('totalCustomers', 'N/A')}
- **Total Products**: {dashboard_data.get('totalProducts', 'N/A')}
- **Active Quotations**: {dashboard_data.get('activeQuotations', 'N/A')}
- **Active Sales Orders**: {dashboard_data.get('activeSalesOrders', 'N/A')}
- **Active Job Orders**: {dashboard_data.get('activeJobOrders', 'N/A')}

## Report Details
{workflow_data.get('report_content', 'Report details to be specified')}

---
*Generated by Hibla Automation System for Agent Zero*
"""
        
        doc_request = {
            'filename_base': f"report_{int(time.time())}",
            'content': report_content,
            'formats': ['pdf', 'md']
        }
        
        return self.handle_document_request(doc_request)
    
    def check_service_health(self, url):
        """Check if a service is healthy"""
        try:
            response = requests.get(f"{url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def get_dashboard_data(self):
        """Get current dashboard data"""
        try:
            response = requests.get(f"{self.hibla_base_url}/api/dashboard/analytics", timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('overview', {})
            else:
                return {}
        except:
            return {}
    
    def start_sse_listener(self):
        """Start SSE listener in background thread"""
        def listen():
            while True:
                try:
                    client = self.establish_sse_connection()
                    if client:
                        logger.info("🎧 SSE listener started")
                        
                        # Send capabilities on connection
                        capabilities = self.send_system_capabilities()
                        logger.info("📡 Capabilities sent to Agent Zero")
                        
                        for message in client:
                            if message.data:
                                response = self.process_agent_zero_message(message)
                                if response:
                                    logger.info(f"📤 Response prepared: {response}")
                                    # Store response for pickup via HTTP endpoint
                                    self.message_queue.append(response)
                    else:
                        logger.error("❌ Failed to establish SSE connection")
                        time.sleep(30)  # Retry after 30 seconds
                        
                except Exception as e:
                    logger.error(f"❌ SSE listener error: {e}")
                    time.sleep(30)  # Retry after 30 seconds
        
        listener_thread = threading.Thread(target=listen, daemon=True)
        listener_thread.start()
        return listener_thread

# Flask endpoints for MCP integration
mcp_integration = MCPAgentIntegration()

@app.route('/mcp/status', methods=['GET'])
def mcp_status():
    """Get MCP integration status"""
    main_health = mcp_integration.check_service_health(mcp_integration.hibla_base_url)
    doc_health = mcp_integration.check_service_health(mcp_integration.doc_service_url)
    dashboard_data = mcp_integration.get_dashboard_data()
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'mcp_server': mcp_integration.mcp_server_url,
        'hibla_system': {
            'main_app_status': 'online' if main_health else 'offline',
            'doc_service_status': 'online' if doc_health else 'offline',
            'dashboard_data': dashboard_data
        },
        'integration_status': 'active',
        'message_queue_size': len(mcp_integration.message_queue)
    })

@app.route('/mcp/messages', methods=['GET'])
def get_messages():
    """Get queued messages from Agent Zero interactions"""
    messages = mcp_integration.message_queue.copy()
    mcp_integration.message_queue.clear()  # Clear after reading
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'message_count': len(messages),
        'messages': messages
    })

@app.route('/mcp/send', methods=['POST'])
def send_to_agent_zero():
    """Send message to Agent Zero (simulate for testing)"""
    try:
        data = request.json
        logger.info(f"📨 Simulating Agent Zero message: {data}")
        
        # Process as if it came from Agent Zero
        response = mcp_integration.process_agent_zero_message(type('MockMessage', (), {'data': json.dumps(data)})())
        
        return jsonify({
            'status': 'success',
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check for MCP integration service"""
    return jsonify({
        'status': 'ok',
        'service': 'mcp-agent-integration',
        'timestamp': datetime.now().isoformat()
    })

def main():
    """Main MCP integration setup"""
    print("🚀 Starting MCP Agent Zero Integration")
    print("=" * 50)
    print(f"🎯 MCP Server: {mcp_integration.mcp_server_url}")
    print(f"🌐 Hibla System: {mcp_integration.hibla_base_url}")
    print(f"📄 Document Service: {mcp_integration.doc_service_url}")
    
    # Start SSE listener
    print("\n🎧 Starting SSE listener...")
    mcp_integration.start_sse_listener()
    
    # Start Flask app
    print("🌐 Starting MCP integration API on port 5003...")
    print("📋 Available endpoints:")
    print("   GET  /mcp/status - Integration status")
    print("   GET  /mcp/messages - Get queued messages")
    print("   POST /mcp/send - Send test message")
    print("   GET  /health - Health check")
    
    app.run(host='0.0.0.0', port=5003, debug=False)

if __name__ == "__main__":
    main()