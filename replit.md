# Hibla Manufacturing & Supply System

## Overview
Hibla Manufacturing & Supply System is a comprehensive platform for managing the manufacturing workflow of Hibla, a premium real Filipino hair manufacturer and supplier. It covers the entire process from customer quotations and production job orders to multi-location inventory management. The system provides real-time manufacturing dashboards and detailed reports, aiming to streamline production and global distribution.

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
- **Streamlined Navigation**: Focus on manufacturing operations only (Dashboard, Quotations, Sales Orders, Job Orders, Inventory, AI Inventory Insights, Summary Reports).
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