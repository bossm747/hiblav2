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
- **Removed Components**: All non-manufacturing pages eliminated (appointments, services, salon booking, e-commerce features, role-based navigation)
- **Active Routes**: Manufacturing Dashboard (root), Quotations, Sales Orders, Job Orders, Inventory, AI Inventory Insights, Summary Reports
- **Streamlined Navigation**: Clean manufacturing-focused navigation on desktop and mobile
- **Business Focus**: Pure B2B manufacturing and supply operations for Filipino hair products with AI-powered inventory insights

### Recent Updates (January 2025)
- **Customer Portal API Completion**: Implemented missing endpoints `/api/customer-portal/orders` for order tracking and `/api/payment-proofs` for payment proof uploads with file support
- **Payment Proof System**: Added complete payment proof workflow with database storage, file upload handling, and admin email notifications
- **Email Service Enhancement**: Added sendPaymentProofNotification function for automated admin alerts when customers upload payment proof
- **Storage Service Updates**: Properly implemented createPaymentProof, getPaymentProofs, and updatePaymentProofStatus functions with full database integration
- **Complete Customer Journey**: Achieved full implementation of 18-step customer workflow from quotation through payment verification as documented in USER_JOURNEY_FLOW.md

### Previous Updates (August 2025)
- **Complete Business Cycle Implementation**: Added critical missing features including order confirmation workflow, invoice generation from sales orders, quotation time-lock service, and comprehensive Excel export functionality
- **New Service Modules**: Created invoice-service.ts, order-confirmation-service.ts, quotation-lock-service.ts, and export-service.ts for modular business logic
- **Enhanced API Endpoints**: Added endpoints for invoice generation, quotation revision validation, and Excel export for all major entities
- **Navigation Cleanup**: Removed all salon/spa navigation items and streamlined to manufacturing-only routes
- **Mobile Navigation**: Implemented dedicated ManufacturingSidebar for mobile responsive views
- **AI Integration**: Added Predictive Inventory Insights with OpenAI-powered demand forecasting
- **Root Route**: Manufacturing Dashboard is now the default landing page (/) for immediate business focus
- **Multi-Warehouse System**: Complete implementation of 6 warehouses (NG, PH, Reserved, Red, Admin, WIP) with inventory movement tracking
- **Mobile UI Fix**: Replaced all transparent/translucent backgrounds with solid colors for better mobile visibility
- **Documentation System**: Added comprehensive documentation with system overview, features, workflow, and client showcase sections
- **Quotation System Debugging**: Systematic resolution of critical API validation issues including customer password constraints, price list foreign keys, and staff references
- **VLOOKUP Implementation**: Added comprehensive VLOOKUP price functionality with database-driven product pricing across multiple price lists (A, B, C, D)
- **Advanced Quotation Features**: Implemented quotation duplication, sales order generation, and comprehensive form validation for complete manufacturing workflow
- **Comprehensive Form System**: Implemented all manufacturing forms (Quotation, Sales Order, Job Order, Inventory) with Zod validation and real-time calculations
- **Customer Management System**: Added complete CRM with customer profiles, contact management, credit limits, and business relationship tracking
- **Staff Management System**: Implemented team management with role-based access control, department organization, and permission management
- **Modern UI Transformation**: Complete ShadCN UI implementation with professional light/dark theme and manufacturing-focused design
- **Exact Sales Order Implementation**: Implemented Sales Order NO. 2025.08.001 R1 with authentic data from user's PDF document, including all 12 products with exact pricing ($947.00 subtotal, $1,087.00 total)
- **Exact Job Order Implementation**: Implemented Job Order NO. 2025.08.001 R1 matching the JO PDF format with complete shipment tracking, production status, and order instructions for ABA customer
- **Complete PDF Integration**: Both Sales Order and Job Order systems now use authentic business data from provided PDF documents with exact product specifications, pricing, and workflow matching user requirements
- **Frontend Cleanup (August 2025)**: Comprehensive cleanup of unnecessary pages and components. Removed 50+ redundant files including old salon/spa components, duplicate quotation forms, unused authentication guards, and obsolete theme components. Retained only essential manufacturing system pages: Dashboard, Quotations, Sales Orders, Job Orders, Inventory, Customer Management, Staff Management, and Summary Reports. All quotation form dropdowns verified working with real database data.
- **Navigation Streamlining**: Removed redundant "Create Quotation" menu item from main navigation since quotation creation is integrated within the Quotations page.
- **Tiered Pricing System (August 2025)**: Implemented comprehensive tiered pricing with 100% test success rate including New Customer (+15% markup), Regular Customer (baseline), Premier Customer (15% discount), and Custom Pricing tiers with full VLOOKUP backward compatibility and customer-based automatic pricing
- **Price Management Back-Office (August 2025)**: Complete administrative pricing management system with full CRUD operations, real-time statistics dashboard, modern React interface with ShadCN UI, comprehensive validation, and integration with existing pricing engine. Added to main navigation with DollarSign icon for easy admin access.
- **Pricing System Restructure (August 2025)**: Successfully restructured pricing architecture by removing individual price lists (A, B, C, D) from products table and replaced with simplified basePrice + SRP structure. Created separate Price Management module for admin control of product pricing across different customer tiers. Integrated Google Gemini 2.5 Pro AI for product enhancement with object storage for generated images. Database migration completed successfully with backward compatibility maintained.
- **Complete Pricing Management System (August 2025)**: Implemented comprehensive 4-option pricing system with 100% success rate including: Add Price List creation, Bulk Price Add/Discount (%), Custom individual product pricing, and complete Price List CRUD management modal. Removed category filter for streamlined workflow. Added backend API endpoints for price list updates and deletions with proper validation.
- **Mobile User Experience Enhancement (August 2025)**: Comprehensive mobile optimization including official Hibla logo integration as favicon and brand element, enhanced touch targets (minimum 44px), improved responsive design with mobile-first CSS, better table overflow handling, optimized form inputs for iOS (prevents zoom), enhanced modal responsiveness, and manufacturing-focused meta data for SEO. Added proper mobile navigation with improved touch interactions and visual feedback.
- **Official Hibla Branding Integration (August 2025)**: Integrated official Hibla logo throughout the system including navigation sidebars, headers, favicon, and mobile interfaces. Updated meta data with manufacturing-focused SEO tags, business type metadata, and proper Open Graph/Twitter Card integration for social media sharing. Created reusable HiblaLogo component with multiple size variants and responsive text display.
- **Brand Identity Update (August 2025)**: Updated branding from "Hibla Manufacturing" to "Hibla Filipino Hair" throughout the system including navigation, headers, logo components, and HTML meta tags. Simplified main navigation from "Manufacturing Dashboard" to "Dashboard" for cleaner user experience.
- **Enhanced Visual Design System (August 2025)**: Implemented comprehensive shadow effects system with multiple elevation levels (card-shadow, elevated-container, floating-card) applied to all cards and containers across Dashboard, Quotations, Price Management, and other major pages for a more polished and professional appearance.