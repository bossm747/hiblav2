# Hibla Manufacturing & Supply System

## Overview
Hibla Manufacturing & Supply System is a comprehensive manufacturing and supplier management platform specifically designed for Hibla, a manufacturer and supplier of premium real Filipino hair. The system manages the complete manufacturing workflow from customer quotations through production job orders to inventory management across multiple warehouse locations. It provides real-time manufacturing dashboards, detailed summary reports with filtering capabilities, and supports the entire business process for efficient production and global distribution of authentic Filipino hair products.

## User Preferences
- Preferred communication style: Simple, everyday language
- Market focus: Hair manufacturing and supply chain management
- Business: Hibla Manufacturing - Real Filipino Hair Manufacturer and Supplier
- Products: Premium real Filipino hair for global distribution
- Currency: USD ($) for international business operations
- Brand Assets: Hibla logo provided (circular design with elegant typography)
- Current Focus: Complete manufacturing workflow from quotations to shipment tracking

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: ShadCN UI (built on Radix UI)
- **Styling**: Tailwind CSS with CSS custom properties
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Clean manufacturing-focused interface with streamlined navigation, real-time production metrics, order status tracking, professional business design, mobile-responsive layout, universal theme toggle (light/dark mode). The primary color scheme uses purple, cyan, and pink gradients for professional brand presentation.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas (shared with frontend)
- **Core Workflow APIs**: `/api/quotations`, `/api/sales-orders`, `/api/job-orders`, `/api/reports`, `/api/dashboard`
- **Supporting APIs**: `/api/warehouses`, `/api/shipments`, `/api/customers`, `/api/products`

### Project Structure
- `client/`: React frontend application focused on manufacturing operations
- `server/`: Express.js backend API with manufacturing-specific endpoints
- `shared/`: Shared TypeScript types and Zod schemas for manufacturing entities
- All non-manufacturing pages and components have been removed for focused business operations

### Key Manufacturing Features
- **Database Schema**: Complete manufacturing-centric design with Quotations, Sales Orders, Job Orders, Job Order Items, Warehouses, Inventory Items, Shipments, Customers, and Products.
- **Quotation Management**: Automatic quotation number generation, multi-item quotations, status tracking (pending, approved, rejected), direct conversion to sales orders.
- **Production Management**: Job order creation from approved sales orders, production item tracking, customer instruction handling, due date management, progress monitoring.
- **Multi-Warehouse Inventory**: Comprehensive inventory management across multiple warehouse locations, stock level tracking, low stock alerts, inventory transfers.
- **Manufacturing Dashboard**: Real-time production metrics, active order counts, production items status, customer satisfaction tracking, on-time delivery performance.
- **Advanced Reporting**: Summary reports with filtering by date range, customer code, and order items. Export capabilities for business analysis.
- **Streamlined Navigation**: Clean interface focused solely on manufacturing operations, removing all salon/spa/e-commerce components.

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI, ShadCN UI
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form, Hookform resolvers (Zod)
- **Data Fetching**: TanStack React Query
- **Validation**: Zod
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Validation**: Zod
- **Session Management**: Express sessions (with PostgreSQL store)
- **Development**: tsx, esbuild

### Development Tools
- **Build System**: Vite (with React plugin)
- **TypeScript**: Strict configuration
- **Code Quality**: ESLint, Prettier

### Manufacturing System Status
- **Complete Transformation**: Successfully migrated from salon/spa system to dedicated manufacturing platform
- **Removed Components**: All non-manufacturing pages eliminated (appointments, services, salon booking, e-commerce features)
- **Active Routes**: Home, Manufacturing Dashboard, Quotations, Sales Orders, Job Orders, Inventory, Summary Reports
- **Business Focus**: Pure B2B manufacturing and supply operations for Filipino hair products