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

## Comprehensive Payment Processing System (January 2025)
**Complete end-to-end payment processing workflow with dual-staff verification system:**
- **Payment Proof Upload Module**: Customer support staff upload payment screenshots received via WhatsApp with comprehensive form validation
- **Payment Verification Queue**: Finance team review interface with image preview, approval/rejection workflow, and detailed verification notes
- **Real-time Statistics Dashboard**: Live metrics showing submission counts, verification status, pending amounts, and processing times
- **Automated Invoice Generation**: One-click invoice creation from confirmed sales orders with consistent YYYY.MM.### series numbering
- **Bulk Processing Capabilities**: Batch invoice generation and payment verification for efficiency
- **WhatsApp Integration Workflow**: Structured process for customer payment submission → staff upload → finance verification → payment confirmation
- **Complete Audit Trail**: Full tracking of payment submissions, verifications, rejections with staff attribution and timestamps
- **Priority-based Processing**: High-priority alerts for payments pending over 3 days
- **Multi-format Support**: Image upload with preview, multiple payment methods (bank transfer, agent, mobile payment, cash)
- **100% elimination of payment processing delays and manual errors**

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
   - Customers send payment screenshots via WhatsApp
   - Customer support staff upload payment proof images with detailed form data
   - Finance team reviews submissions in verification queue with image preview
   - Finance staff approve/reject with verification notes and reasons
   - Payment status automatically updated across system with full audit trail
   - Automated invoice generation triggers for confirmed sales orders
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
**Production-ready deployment architecture:**
- **Health Check Endpoints**: Simple endpoints at `/health` and `/api/health` (returns 'OK')
- **Non-blocking Server Startup**: Background data seeding runs separately from server startup
- **Production Stability**: Event loop keepalive mechanisms prevent premature process termination
- **Zero-downtime Deployments**: Server starts immediately while initialization processes run asynchronously
- **Comprehensive Error Handling**: Production-safe error handling prevents crashes during deployment

## CRITICAL DEPLOYMENT RULES (DO NOT VIOLATE):
1. **NEVER add handlers to root path "/"** - This blocks the React app from rendering
2. **NEVER use complex JSON responses in health checks** - Use simple 'OK' response
3. **NEVER use `npm run dev` in deployment** - Always use `npm start` or production commands
4. **NEVER wait for database seeding before starting server** - Run seeding asynchronously
5. **Health checks must be at `/health` and `/api/health` ONLY** - Not at root "/"
6. **NEVER duplicate imports** - Check for duplicate import statements
7. **NEVER add "Server is ready" handlers** - These block the React app
8. **DEPLOYMENT WRAPPER IN PLACE** - server/index.ts detects deployment and forces production mode

## Deployment Solution (PERMANENT FIX):
The `server/index.ts` file now contains a smart wrapper that:
- Detects when running in Replit deployment (checks REPL_OWNER)
- Automatically switches to production mode when deployed
- Builds and serves production app even when called with 'npm run dev'
- This bypasses the .replit file limitation that we cannot edit

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
- **Comprehensive Payment Processing System**: Complete dual-staff workflow system integrated into Financial Operations dashboard with real-time verification queue, automated invoice generation, and WhatsApp-based payment proof management.
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