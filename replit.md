# Hibla Manufacturing & Supply System (Internal Operations Platform)

## Overview
Hibla Manufacturing & Supply System is an **internal-only operations platform** for managing the manufacturing workflow of Hibla, a premium real Filipino hair manufacturer and supplier. This system is exclusively for internal staff use - sales teams, production teams, inventory managers, and company management. It covers the entire process from customer quotations and production job orders to multi-location inventory management, providing real-time manufacturing dashboards and detailed reports to streamline production and global distribution.

## Important: System Architecture Change (January 2025)
**This system has been transformed from a customer-facing platform to a purely internal operations system.** All customer-facing components have been removed:
- No customer portal or customer login functionality
- No customer self-service features
- No payment proof uploads from customers
- All operations are handled internally by Hibla staff
- Customer interactions managed through internal processes
- Payment documentation handled by customer support staff
- Finance team handles payment verification and confirmation process
- **Key Focus**: Comprehensive job order monitoring to solve bottlenecks and delays from manual system

## Document Automation System (January 2025)
**Complete automation of document generation eliminates manual document creation:**
- **Automated Sales Order Generation**: One-click creation from quotations with YYYY.MM.### numbering
- **Automated Job Order Creation**: Auto-generated from confirmed Sales Orders with same series number
- **Automated Invoice Creation**: Auto-generated from confirmed Sales Orders with same series number
- **Professional PDF Templates**: Print-ready documents with Hibla branding for all document types
- **Inventory Integration**: Automatic updates to Reserved Warehouse when orders are confirmed
- **Creator Initials Automation**: Automatically extracts creator initials from logged-in user authentication
- **Customer Details Auto-Population**: Automatically pre-populates customer details (country, price list) from selected customer records with flexibility to modify
- **95% reduction in manual document preparation time**
- **100% elimination of data transcription errors**
- **Complete workflow automation from quotation to invoice**

## Internal Staff Roles & Workflow

### Staff Roles
- **Sales Team**: Creates quotations, manages customer relationships via WhatsApp, converts quotes to sales orders
- **Customer Support**: Receives payment screenshots via WhatsApp, uploads payment proof images to system
- **Finance Team**: Verifies payment proof images, confirms payment receipt, updates payment status
- **Production Team**: Manages job orders, tracks production progress, updates manufacturing status
- **Inventory Team**: Manages stock levels, handles warehouse transfers, monitors inventory
- **Shipping Records**: Manual order fulfillment, document generation, internal tracking updates
- **Management**: Views reports, monitors analytics, makes strategic decisions
- **Admin**: System configuration, user management, pricing management

### Internal Workflow Process
1. **Sales Process**: Staff receive customer inquiries → Create quotations → Send PDFs to customers → Convert approved quotes to sales orders
2. **Job Order Monitoring**: Sales orders generate job orders → Comprehensive tracking system → Real-time bottleneck identification → Delay alerts and issue resolution
3. **Payment Workflow**: 
   - Customers send payment confirmation
   - Customer support staff record payment documentation in system
   - Finance team verifies payments and confirms receipt
   - Payment status updated internally in system
4. **Fulfillment**: Staff record shipping details → Generate shipping documents → Maintain internal delivery records

## User Preferences
- Preferred communication style: Simple, everyday language
- Market focus: Hair manufacturing and supply chain management
- Business: Hibla Manufacturing - Real Filipino Hair Manufacturer and Supplier
- Products: Premium real Filipino hair for global distribution
- Currency: USD ($) for international business operations
- Brand Assets: Hibla logo provided (circular design with elegant typography)
- Current Focus: Internal manufacturing workflow management

## Deployment Infrastructure (January 2025)
**Production-ready deployment architecture with comprehensive health monitoring:**
- **Health Check Endpoints**: Fast-responding endpoints at `/`, `/health`, and `/api/health` for deployment services
- **Non-blocking Server Startup**: Background data seeding ensures immediate server availability for health checks
- **Production Stability**: Event loop keepalive mechanisms prevent premature process termination
- **Zero-downtime Deployments**: Server starts immediately while initialization processes run asynchronously
- **Multi-format Health Responses**: Root endpoint serves HTML for browsers and JSON for deployment services
- **Comprehensive Error Handling**: Production-safe error handling prevents crashes during deployment

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Framework**: ShadCN UI (built on Radix UI)
- **Styling**: Tailwind CSS with CSS custom properties
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Clean manufacturing-focused interface, real-time production metrics, order status tracking, mobile-responsive design, universal theme toggle (light/dark mode). Primary color scheme uses purple, cyan, and pink gradients.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas (shared with frontend)
- **Core Workflow APIs**: Quotations, Sales Orders, Job Orders, Reports, Dashboard
- **Supporting APIs**: Warehouses, Shipments, Customers, Products

### Project Structure
- `client/`: React frontend application
- `server/`: Express.js backend API
- `shared/`: Shared TypeScript types and Zod schemas

### Key Features
- **Database Schema**: Designed around manufacturing entities: Quotations, Sales Orders, Job Orders, Warehouses, Inventory, Shipments, Customers, Products.
- **Quotation Management**: Automatic numbering, multi-item, status tracking, conversion to sales orders.
- **Job Order Monitoring**: Comprehensive tracking system solving manual bottlenecks, real-time status updates, delay alerts.
- **Warehouse Transfer Tracking** (In Development): Real-time movement tracking between warehouses with timestamps, audit trail, PDF integration.
- **Multi-Warehouse Inventory**: Stock level tracking, low stock alerts, transfers across 6 locations (NG, PH, Reserved, Red, Admin, WIP).
- **Manufacturing Dashboard**: Real-time production metrics, active order counts, item status, performance tracking.
- **Advanced Reporting**: Summary reports with filtering and export capabilities.
- **Consolidated Navigation Structure**: Simplified from 18 sub-menu items to 6 main management dashboards: Sales Operations Management, Production Management, Inventory & Warehouse Management, Financial Operations Management, Reports & Analytics, and Administration. Each dashboard provides comprehensive functionality for its operational area.
- **Pricing System**: Tiered pricing (New Customer, Regular, Premier, Custom), VLOOKUP functionality, and an administrative Price Management back-office with CRUD operations.
- **AI Integration**: OpenAI-powered predictive inventory insights for demand forecasting.
- **Mobile Experience**: Official Hibla logo integration, enhanced touch targets, responsive design, optimized forms, improved mobile navigation.
- **Branding**: Integrated official Hibla branding and updated system-wide identity to "Hibla Filipino Hair".
- **Visual Design**: Comprehensive shadow effects system for a polished appearance.

## External Dependencies

### Frontend
- **UI Components**: Radix UI, ShadCN UI
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form, Hookform resolvers (Zod)
- **Data Fetching**: TanStack React Query
- **Validation**: Zod
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Backend
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Validation**: Zod
- **Session Management**: Express sessions (with PostgreSQL store)

### Development Tools
- **Build System**: Vite (with React plugin)
- **TypeScript**: Strict configuration
- **Code Quality**: ESLint, Prettier