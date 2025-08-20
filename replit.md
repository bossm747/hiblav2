# Hibla Manufacturing & Supply System

## Overview
The Hibla Manufacturing & Supply System is an **internal-only operations platform** designed to manage the manufacturing workflow for Hibla, a premium real Filipino hair manufacturer and supplier. Its primary purpose is to streamline production and global distribution by covering the entire process from customer quotations and production job orders to multi-location inventory management, providing real-time manufacturing dashboards and detailed reports. The system aims to eliminate bottlenecks and delays from manual systems, focusing on comprehensive job order monitoring. All customer-facing components have been removed; operations are handled internally by Hibla staff.

## User Preferences
- Preferred communication style: Simple, everyday language
- Market focus: Hair manufacturing and supply chain management
- Business: Hibla Manufacturing - Real Filipino Hair Manufacturer and Supplier
- Products: Premium real Filipino hair for global distribution
- Currency: USD ($) for international business operations
- Brand Assets: Hibla logo provided (circular design with elegant typography)
- Current Focus: Internal manufacturing workflow management

## System Architecture

### UI/UX Decisions
The system features a clean, manufacturing-focused interface with real-time production metrics, order status tracking, and a mobile-responsive design. It includes a universal theme toggle (light/dark mode) and a primary color scheme utilizing purple, cyan, and pink gradients. Premium UI elements such as gradient backgrounds, advanced shadows, and professional styling are used, particularly in dashboards. Navigation is consolidated and simplified for ease of use across mobile and desktop.

### Technical Implementations
- **Frontend**: React 18 with TypeScript and Vite, Wouter for routing, TanStack Query for state management, ShadCN UI (built on Radix UI) for UI components, Tailwind CSS for styling, and React Hook Form with Zod for form handling and validation.
- **Backend**: Node.js with Express.js, TypeScript with ES modules.
- **Database**: PostgreSQL with Drizzle ORM. Zod schemas are shared between frontend and backend for validation.
- **Core Workflow APIs**: Quotations, Sales Orders, Job Orders, Reports, Dashboard.
- **Supporting APIs**: Warehouses, Shipments, Customers, Products.
- **Authentication**: Production-ready, multi-role access control system with department-based permissions and JWT tokens.
- **Document Automation**: Automated generation of Sales Orders, Job Orders, and Invoices from quotations with consistent numbering and professional PDF templates.
- **Payment Processing**: End-to-end workflow with dual-staff verification, payment proof upload, verification queue, real-time statistics, and automated invoice generation.
- **Project Structure**: Organized into `client/` (React frontend), `server/` (Express.js backend), and `shared/` (shared TypeScript types and Zod schemas).

### Feature Specifications
- **Database Schema**: Designed for manufacturing entities: Quotations, Sales Orders, Job Orders, Warehouses, Inventory, Shipments, Customers, Products.
- **Key Features**: Quotation management (auto-numbering, status tracking, conversion), comprehensive Job Order monitoring (real-time status, delay alerts), Multi-Warehouse Inventory (stock levels, transfers across 6 locations), Manufacturing Dashboard (real-time metrics, performance tracking), Advanced Reporting (filtering, export).
- **Consolidated Navigation**: Simplified into 6 main management dashboards: Sales Operations Management, Production Management, Inventory & Warehouse Management, Financial Operations Management, Reports & Analytics, and Administration.
- **Pricing System**: Tiered pricing (New Customer, Regular, Premier, Custom) with VLOOKUP functionality and an administrative Price Management back-office.
- **AI Integration**: OpenAI-powered predictive inventory insights for demand forecasting.
- **Deployment**: Production-ready architecture with health check endpoints (`/health`, `/api/health`), non-blocking server startup, zero-downtime deployments, and comprehensive error handling. A smart wrapper in `server/index.ts` detects Replit deployment and forces production mode, building via `./build.sh` and serving from `dist/index.js`.

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

### AI
- **Predictive Insights**: OpenAI