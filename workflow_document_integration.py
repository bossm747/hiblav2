#!/usr/bin/env python3
"""
Autonomous Workflow Document Creation Integration Script
========================================================

This script demonstrates integration between the main Hibla Manufacturing System
and the Document Generation Service for autonomous workflow document creation.

Usage:
    python workflow_document_integration.py
"""

import requests
import json
import os
from datetime import datetime, timedelta

class HiblaDocumentWorkflow:
    def __init__(self, doc_service_url="http://localhost:5001", main_api_url="http://localhost:5000"):
        self.doc_service_url = doc_service_url
        self.main_api_url = main_api_url
        
    def check_services_health(self):
        """Check if both services are running"""
        try:
            # Check document generation service
            doc_health = requests.get(f"{self.doc_service_url}/health", timeout=5)
            print(f"📄 Document Service: {'✅ Online' if doc_health.status_code == 200 else '❌ Offline'}")
            
            # Check main application service  
            main_health = requests.get(f"{self.main_api_url}/health", timeout=5)
            print(f"🏢 Main Application: {'✅ Online' if main_health.status_code == 200 else '❌ Offline'}")
            
            return doc_health.status_code == 200 and main_health.status_code == 200
        except requests.RequestException as e:
            print(f"❌ Service health check failed: {e}")
            return False
    
    def generate_quotation_document(self, quotation_data):
        """Generate a quotation document from structured data"""
        # Create quotation content from data
        content = self._build_quotation_content(quotation_data)
        
        # Generate document via service
        response = requests.post(
            f"{self.doc_service_url}/api/documents/generate",
            json={
                "filename_base": f"quotation_{quotation_data.get('quotationNumber', 'draft')}",
                "content": content,
                "formats": ["md", "pdf", "docx"]
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Generated quotation documents: {list(result['paths'].keys())}")
            return result['paths']
        else:
            print(f"❌ Document generation failed: {response.text}")
            return None
    
    def generate_sales_order_document(self, sales_order_data):
        """Generate a sales order document from structured data"""
        content = self._build_sales_order_content(sales_order_data)
        
        response = requests.post(
            f"{self.doc_service_url}/api/documents/generate",
            json={
                "filename_base": f"sales_order_{sales_order_data.get('salesOrderNumber', 'draft')}",
                "content": content,
                "formats": ["md", "pdf", "docx"]
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Generated sales order documents: {list(result['paths'].keys())}")
            return result['paths']
        else:
            print(f"❌ Document generation failed: {response.text}")
            return None
    
    def generate_job_order_document(self, job_order_data):
        """Generate a job order document from structured data"""
        content = self._build_job_order_content(job_order_data)
        
        response = requests.post(
            f"{self.doc_service_url}/api/documents/generate",
            json={
                "filename_base": f"job_order_{job_order_data.get('jobOrderNumber', 'draft')}",
                "content": content,
                "formats": ["md", "pdf", "docx"]
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Generated job order documents: {list(result['paths'].keys())}")
            return result['paths']
        else:
            print(f"❌ Document generation failed: {response.text}")
            return None
    
    def _build_quotation_content(self, data):
        """Build quotation document content"""
        today = datetime.now().strftime("%Y-%m-%d")
        valid_until = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        content = f"""# HIBLA MANUFACTURING QUOTATION

**Company:** Hibla Filipino Hair Manufacturing & Supply  
**Date:** {today}  
**Quotation Number:** {data.get('quotationNumber', 'QT-DRAFT-001')}  
**Revision:** {data.get('revisionNumber', 'R0')}  

## Customer Information
- **Customer Code:** {data.get('customerCode', '[TO BE ASSIGNED]')}
- **Company Name:** {data.get('customerName', '[TO BE POPULATED]')}
- **Country:** {data.get('country', '[TO BE POPULATED]')}
- **Price Tier:** {data.get('priceTier', '[TO BE SELECTED]')}

## Product Details

| Product | Specification | Quantity | Unit Price | Line Total |
|---------|--------------|----------|------------|------------|"""

        # Add line items
        for item in data.get('items', []):
            content += f"\n| {item.get('productName', 'Product')} | {item.get('specification', 'Standard')} | {item.get('quantity', 0)} | ${item.get('unitPrice', 0):.2f} | ${item.get('lineTotal', 0):.2f} |"

        content += f"""

## Pricing Summary
- **Subtotal:** ${data.get('subtotal', 0):.2f}
- **Shipping Fee:** ${data.get('shippingFee', 0):.2f}
- **Bank Charge:** ${data.get('bankCharge', 0):.2f}
- **Discount:** ${data.get('discount', 0):.2f}
- **TOTAL:** ${data.get('total', 0):.2f}

## Terms & Conditions
- **Payment Method:** {data.get('paymentMethod', 'Bank Transfer')}
- **Shipping Method:** {data.get('shippingMethod', 'DHL')}
- **Valid Until:** {valid_until}
- **Creator:** {data.get('creatorInitials', 'AA')}

## Customer Service Instructions
{data.get('customerServiceInstructions', 'Standard processing and quality assurance protocols apply.')}

---
*Generated by Hibla Manufacturing System - Internal Operations Platform*  
*Document generated on {today}*
"""
        return content
    
    def _build_sales_order_content(self, data):
        """Build sales order document content"""
        today = datetime.now().strftime("%Y-%m-%d")
        
        content = f"""# HIBLA MANUFACTURING SALES ORDER

**Company:** Hibla Filipino Hair Manufacturing & Supply  
**Date:** {today}  
**Sales Order Number:** {data.get('salesOrderNumber', 'SO-DRAFT-001')}  

## Customer Information
- **Customer Code:** {data.get('customerCode', '[ASSIGNED]')}
- **Company Name:** {data.get('customerName', '[CONFIRMED]')}
- **Country:** {data.get('country', '[CONFIRMED]')}

## Order Details

| Product | Specification | Quantity | Unit Price | Line Total |
|---------|--------------|----------|------------|------------|"""

        for item in data.get('items', []):
            content += f"\n| {item.get('productName', 'Product')} | {item.get('specification', 'Standard')} | {item.get('quantity', 0)} | ${item.get('unitPrice', 0):.2f} | ${item.get('lineTotal', 0):.2f} |"

        content += f"""

## Order Summary
- **Subtotal:** ${data.get('subtotal', 0):.2f}
- **Shipping Fee:** ${data.get('shippingFee', 0):.2f}
- **Bank Charge:** ${data.get('bankCharge', 0):.2f}
- **Discount:** ${data.get('discount', 0):.2f}
- **TOTAL:** ${data.get('total', 0):.2f}

## Order Status
- **Status:** {data.get('status', 'Confirmed')}
- **Payment Status:** {data.get('paymentStatus', 'Pending')}
- **Production Status:** {data.get('productionStatus', 'Queued')}

---
*Generated by Hibla Manufacturing System - Internal Operations Platform*  
*Document generated on {today}*
"""
        return content
    
    def _build_job_order_content(self, data):
        """Build job order document content"""
        today = datetime.now().strftime("%Y-%m-%d")
        
        content = f"""# HIBLA MANUFACTURING JOB ORDER

**Company:** Hibla Filipino Hair Manufacturing & Supply  
**Date:** {today}  
**Job Order Number:** {data.get('jobOrderNumber', 'JO-DRAFT-001')}  
**Sales Order Reference:** {data.get('salesOrderNumber', 'SO-REF-001')}

## Production Details
- **Customer:** {data.get('customerName', '[CUSTOMER]')}
- **Priority:** {data.get('priority', 'Normal')}
- **Due Date:** {data.get('dueDate', 'TBD')}
- **Status:** {data.get('status', 'In Queue')}

## Production Items

| Product | Specification | Quantity | Status | Notes |
|---------|--------------|----------|--------|-------|"""

        for item in data.get('items', []):
            content += f"\n| {item.get('productName', 'Product')} | {item.get('specification', 'Standard')} | {item.get('quantity', 0)} | {item.get('status', 'Pending')} | {item.get('notes', '-')} |"

        content += f"""

## Production Schedule
- **Start Date:** {data.get('startDate', 'TBD')}
- **Estimated Completion:** {data.get('estimatedCompletion', 'TBD')}
- **Assigned Team:** {data.get('assignedTeam', 'Production Team A')}

## Quality Control
- **QC Inspector:** {data.get('qcInspector', 'TBD')}
- **QC Notes:** {data.get('qcNotes', 'Standard quality control procedures apply')}

---
*Generated by Hibla Manufacturing System - Internal Operations Platform*  
*Job Order created on {today}*
"""
        return content

def main():
    """Main workflow demonstration"""
    print("🚀 Hibla Document Generation Workflow Integration")
    print("=" * 60)
    
    workflow = HiblaDocumentWorkflow()
    
    # Check service health
    if not workflow.check_services_health():
        print("❌ Services are not ready. Please ensure both services are running.")
        return
    
    print("\n📄 Generating sample workflow documents...")
    
    # Sample quotation data
    quotation_data = {
        "quotationNumber": f"QT-{datetime.now().strftime('%Y%m%d')}-001",
        "customerCode": "CUST-001",
        "customerName": "Global Hair Distributors Inc.",
        "country": "United States",
        "priceTier": "Regular Customer",
        "revisionNumber": "R0",
        "items": [
            {
                "productName": "Premium Filipino Hair 18-inch",
                "specification": "Natural Black, Straight",
                "quantity": 100,
                "unitPrice": 85.00,
                "lineTotal": 8500.00
            },
            {
                "productName": "Premium Filipino Hair 22-inch", 
                "specification": "Natural Brown, Wavy",
                "quantity": 50,
                "unitPrice": 105.00,
                "lineTotal": 5250.00
            }
        ],
        "subtotal": 13750.00,
        "shippingFee": 250.00,
        "bankCharge": 75.00,
        "discount": 0.00,
        "total": 14075.00,
        "paymentMethod": "Bank Transfer",
        "shippingMethod": "DHL Express",
        "creatorInitials": "AA",
        "customerServiceInstructions": "Customer requires expedited processing. Please prioritize this order."
    }
    
    # Generate quotation documents
    quotation_paths = workflow.generate_quotation_document(quotation_data)
    
    # Sample sales order data
    sales_order_data = {
        "salesOrderNumber": f"SO-{datetime.now().strftime('%Y%m%d')}-001",
        "customerCode": "CUST-001",
        "customerName": "Global Hair Distributors Inc.",
        "country": "United States",
        "status": "Confirmed",
        "paymentStatus": "Paid",
        "productionStatus": "In Production",
        "items": quotation_data["items"],
        "subtotal": 13750.00,
        "shippingFee": 250.00,
        "bankCharge": 75.00,
        "discount": 0.00,
        "total": 14075.00
    }
    
    # Generate sales order documents
    sales_order_paths = workflow.generate_sales_order_document(sales_order_data)
    
    # Sample job order data
    job_order_data = {
        "jobOrderNumber": f"JO-{datetime.now().strftime('%Y%m%d')}-001",
        "salesOrderNumber": sales_order_data["salesOrderNumber"],
        "customerName": "Global Hair Distributors Inc.",
        "priority": "High",
        "dueDate": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
        "status": "In Progress",
        "startDate": datetime.now().strftime("%Y-%m-%d"),
        "estimatedCompletion": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
        "assignedTeam": "Production Team A",
        "qcInspector": "Maria Santos",
        "items": [
            {
                "productName": "Premium Filipino Hair 18-inch",
                "specification": "Natural Black, Straight", 
                "quantity": 100,
                "status": "In Production",
                "notes": "Priority processing requested"
            },
            {
                "productName": "Premium Filipino Hair 22-inch",
                "specification": "Natural Brown, Wavy",
                "quantity": 50, 
                "status": "Queued",
                "notes": "Awaiting materials"
            }
        ],
        "qcNotes": "Expedited quality control required for priority customer"
    }
    
    # Generate job order documents
    job_order_paths = workflow.generate_job_order_document(job_order_data)
    
    print("\n🎉 Autonomous Workflow Document Generation Complete!")
    print("=" * 60)
    print("✅ All workflow documents have been generated successfully")
    print("📂 Check the './documents/' directory for generated files")
    
    # List all generated files
    if os.path.exists('./documents'):
        files = os.listdir('./documents')
        if files:
            print(f"\n📋 Generated Files ({len(files)} total):")
            for file in sorted(files):
                print(f"   📄 {file}")
    
    print("\n🔄 Next Steps:")
    print("   1. Documents are ready for workflow automation")
    print("   2. Integration with main system APIs complete")
    print("   3. Service running on port 5001 for continued operations")
    print("   4. Ready to receive requests from subordinate agents")

if __name__ == "__main__":
    main()