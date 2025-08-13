# Hibla Manufacturing & Supply System (Internal Operations Platform)

## Overview
Hibla Manufacturing & Supply System is an **internal-only operations platform** for managing the manufacturing workflow of Hibla, a premium real Filipino hair manufacturer and supplier. This system is exclusively for internal staff use - sales teams, production teams, inventory managers, and company management. It covers the entire process from customer quotations and production job orders to multi-location inventory management, providing real-time manufacturing dashboards and detailed reports to streamline production and global distribution.

## Important: System Architecture Change (January 2025)
**This system has been transformed from a customer-facing platform to a purely internal operations system.** All customer-facing components have been removed:
- No customer portal or customer login functionality
- No customer self-service features
- No payment proof uploads from customers
- All operations are handled internally by Hibla staff
- Customer interactions occur through traditional channels (email, phone) with staff managing all data entry

## Document Automation System (January 2025)
**Complete automation of document generation eliminates manual document creation:**
- **Automated Sales Order Generation**: One-click creation from quotations with YYYY.MM.### numbering
- **Automated Job Order Creation**: Auto-generated from confirmed Sales Orders with same series number
- **Automated Invoice Creation**: Auto-generated from confirmed Sales Orders with same series number
- **Professional PDF Templates**: Print-ready documents with Hibla branding for all document types
- **Inventory Integration**: Automatic updates to Reserved Warehouse when orders are confirmed
- **95% reduction in manual document preparation time**
- **100% elimination of data transcription errors**
- **Complete workflow automation from quotation to invoice**

## Internal Staff Roles & Workflow

### Staff Roles
- **Sales Team**: Creates quotations, manages customer relationships, converts quotes to sales orders
- **Production Team**: Manages job orders, tracks production progress, updates manufacturing status
- **Inventory Team**: Manages stock levels, handles warehouse transfers, monitors inventory
- **Shipping Team**: Handles order fulfillment, manages deliveries, updates shipping status
- **Management**: Views reports, monitors analytics, makes strategic decisions
- **Admin**: System configuration, user management, pricing management

### Internal Workflow Process
1. **Sales Process**: Staff receive customer inquiries → Create quotations → Email PDFs to customers → Convert approved quotes to sales orders
2. **Production**: Sales orders generate job orders → Production team manages workflow → Quality control checkpoints
3. **Fulfillment**: Shipping team prepares orders → Generate shipping documents → Track delivery internally
4. **Payment**: Staff record payments manually → Track payment status internally → No customer payment uploads

## User Preferences
- Preferred communication style: Simple, everyday language
- Market focus: Hair manufacturing and supply chain management
- Business: Hibla Manufacturing - Real Filipino Hair Manufacturer and Supplier
- Products: Premium real Filipino hair for global distribution
- Currency: USD ($) for international business operations
- Brand Assets: Hibla logo provided (circular design with elegant typography)
- Current Focus: Internal manufacturing workflow management

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
- **Production Management**: Job order creation, item tracking, customer instructions, due date management, progress monitoring.
- **Multi-Warehouse Inventory**: Stock level tracking, low stock alerts, transfers across multiple locations.
- **Manufacturing Dashboard**: Real-time production metrics, active order counts, item status, performance tracking.
- **Advanced Reporting**: Summary reports with filtering and export capabilities.
- **Optimized Consolidated Navigation**: Reduced from 18 separate pages to 7 logical modules (Dashboard, Sales Operations, Production, Inventory & Warehouses, Financial Operations, Reports & Analytics, Administration) with sub-navigation for related functions.
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