# Hibla Filipino Hair - E-commerce Shop

## Overview

This is an e-commerce platform for synthetic and real human hair extensions (piloka), built with a modern React frontend and Express.js backend, specifically for the Philippine market. The application provides a complete online shopping experience for hair extensions with product catalog, shopping cart, order management, and customer accounts. It features a clean, professional interface using ShadCN UI components with Philippine Peso (₱) currency support and follows a full-stack TypeScript architecture.

## User Preferences

- Preferred communication style: Simple, everyday language
- Market focus: Philippine hair extensions market
- Business: Hibla Filipino Hair (Instagram: @hibla.filipinohumanhair)
- Products: Synthetic and real human hair extensions ("piloka")
- Currency: Philippine Peso (₱) instead of USD ($)
- Brand Assets: Hibla logo provided (circular design with elegant typography)
- Transformation requested: Convert spa/salon system to e-commerce shop for hair extensions

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: ShadCN UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot reload with Vite integration in development mode

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and Zod schemas
- `migrations/` - Database migration files (Drizzle)

## Key Components

### Database Schema (PostgreSQL + Drizzle)
- **Customers**: Customer accounts with order history and spending tracking
- **Categories**: Product categories with hierarchy support for hair types
- **Products**: Hair extensions with attributes (type, texture, length, color, weight)
- **Orders**: Order processing with payment and shipping management
- **Cart**: Shopping cart functionality with quantity management
- **Wishlist**: Saved products for later purchase
- **Reviews**: Product ratings and customer feedback
- **Shop Settings**: Store configuration and business information
- **Barcodes**: Dynamic barcode generation for all products using SKU or product ID

### API Structure
RESTful API with the following endpoints:
- `/api/categories` - Product category management
- `/api/products` - Product catalog with search and filtering
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order processing and tracking
- `/api/wishlist` - Wishlist management
- `/api/reviews` - Product reviews and ratings
- `/api/customers` - Customer account management

### Frontend Pages
- **Home**: Landing page with featured products and categories
- **Products**: Product catalog with filtering by type, texture, length
- **Product Details**: Individual product pages with images and reviews
- **Cart**: Shopping cart with quantity updates and checkout
- **Checkout**: Order placement with shipping and payment
- **Account**: Customer profile and order history
- **Admin**: Product and order management (staff only)

### UI Components Architecture
- **Layout**: Responsive sidebar navigation with mobile support
- **Modals**: Reusable modal components for creating/editing entities
- **Forms**: Validated forms using React Hook Form + Zod
- **Data Display**: Cards, tables, and lists with loading states
- **Theme System**: CSS custom properties for consistent theming

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Requests are handled by Express.js routes in `server/routes.ts`
3. Data operations are abstracted through storage layer (`server/storage.ts`)
4. Response data is cached and managed by TanStack Query on the client

### Form Handling
1. Forms use shared Zod schemas for validation
2. React Hook Form manages form state and client-side validation
3. Form submission triggers API calls via TanStack Query mutations
4. Success/error states are handled with toast notifications

### State Management
- **Server State**: Managed by TanStack Query with automatic caching and refetching
- **Client State**: Local component state using React hooks
- **Form State**: React Hook Form for form-specific state management

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with ShadCN customizations
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Forms**: React Hook Form, Hookform resolvers for Zod integration
- **Data Fetching**: TanStack React Query for server state management
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React icon library

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Validation**: Zod for request validation
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and error overlay
- **TypeScript**: Strict configuration with path mapping
- **Code Quality**: ESLint and Prettier (implied by project structure)

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds the React app to `dist/public/`
2. **Backend**: esbuild bundles the Express server to `dist/index.js`
3. **Database**: Drizzle handles schema migrations and database provisioning

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development vs production modes with appropriate middleware
- Vite development server integration for seamless full-stack development

### Production Deployment
- Single deployment unit with both frontend and backend
- Static assets served by Express in production
- Database migrations handled by Drizzle CLI commands
- Support for platforms like Replit with specialized configuration

The architecture prioritizes developer experience with hot reloading, type safety across the full stack, and a component-based UI system that scales well for business applications.

## Recent Changes

### E-commerce Transformation (Jan 24, 2025)
- **Complete Platform Transformation**: Converted spa/salon management system to hair extensions e-commerce shop
- **Database Schema Overhaul**: 
  - Removed spa/salon tables (appointments, services, clients, time_records, etc.)
  - Added e-commerce tables: categories, customers, products, orders, cart, wishlist, reviews
  - Products table optimized for hair extensions with fields: hairType, texture, length, color, weight
- **Backend API Updates**:
  - Replaced all spa/salon endpoints with e-commerce routes
  - Created new storage.ts with complete e-commerce CRUD operations
  - Added routes for: products, categories, cart, orders, wishlist, reviews
- **Frontend Redesign**:
  - Created new home page with Hibla branding and logo integration
  - Removed salon management interface (sidebar navigation, appointments calendar)
  - Simplified App.tsx for e-commerce routing structure
  - Added product cards with Philippine Peso pricing and discount calculations
  - Integrated provided Hibla logo (circular design with elegant typography)
- **Feature Implementation**:
  - Product search and filtering by category
  - Featured products display
  - Shopping cart with add/update/remove functionality
  - Wishlist for saving favorite products
  - Product reviews and ratings system

### Database Integration (Jan 26, 2025)
- **PostgreSQL Database Setup**: Successfully integrated Neon PostgreSQL database
  - Created and configured database connection using @neondatabase/serverless
  - Established Drizzle ORM configuration with proper schema imports
  - Pushed complete e-commerce schema to PostgreSQL database with all tables created
  - Verified API endpoints are working with database (returning empty arrays for fresh database)
- **Database Storage Implementation**: Replaced memory storage with DatabaseStorage class
  - Updated server/storage.ts with PostgreSQL operations using Drizzle ORM
  - Fixed TypeScript issues with database operations and null handling
  - All CRUD operations now persist data to PostgreSQL database
- **Environment Setup**: Database environment variables configured (DATABASE_URL, PGUSER, etc.)

### Inventory Management & POS System (Jan 26, 2025)
- **Inventory Management System**: Added comprehensive inventory tracking features
  - Created inventory management page with real-time stock monitoring
  - Low stock alerts displayed prominently for products below threshold
  - Stock adjustment interface with transaction types: Purchase, Sale, Adjustment, Return
  - Complete transaction history tracking for each product
  - Added API endpoints: `/api/inventory/low-stock`, `/api/inventory/adjust`, `/api/inventory/transactions/:productId`
- **Point of Sale (POS) System**: Built complete in-store sales solution
  - Created POS interface with product grid and shopping cart
  - Real-time product search by name, SKU, or type
  - Stock validation to prevent overselling
  - Multiple payment methods support: Cash, GCash, Bank Transfer
  - Automatic VAT (12%) calculation for Philippine market
  - Change calculation for cash payments
  - Daily sales reporting with summary statistics
  - Added API endpoints: `/api/pos/create-sale`, `/api/pos/daily-sales`
- **Product Data Import**: Parsed and imported inventory from Instagram posts
  - Imported 20+ hair extension products from provided Instagram images
  - Products include Single Drawn, Double Drawn, Korean HD Lace, and European HD Lace varieties
  - Accurate pricing and stock levels based on Instagram post data
- **Navigation Updates**: Added staff/admin navigation links
  - Added POS and Inventory links to desktop and mobile navigation
  - Separated admin functions with visual divider in navigation menu

### Authentication & Role Management (Jan 26, 2025)
- **Authentication System**: Added complete login system with role-based access control
  - Created login page with demo authentication for admin and cashier roles
  - Implemented AuthGuard component for protected routes
  - Added authentication API endpoints with JWT token simulation
- **Admin Panel**: Comprehensive admin dashboard with separated navigation
  - Created dedicated admin page with quick stats and menu grid
  - Separated POS and Inventory management in navigation
  - Added staff management, analytics, and store settings sections
- **Cashier Panel**: Streamlined cashier interface for daily operations
  - Focused on POS operations with simplified navigation
  - Today's sales statistics and transaction history
  - Quick access to product lookup and customer information
- **Staff Access Control**: Role-based routing and permissions
  - Admin users: Full access to all admin functions
  - Cashier users: Limited to POS and sales-related functions
  - Protected routes with authentication guards

### Complete Navigation & Documentation System (Jan 26, 2025)
- **Full Navigation Implementation**: All menu links now properly route to corresponding pages
  - Created comprehensive About page with company story, values, and brand features
  - Built functional Wishlist page with save/remove functionality for customer favorites
  - Fixed all navigation routing ensuring every menu link connects to existing pages
  - Updated mobile navigation with proper wishlist and staff login links
- **Comprehensive Documentation System**: Added extensive guides and tutorials platform
  - Created detailed documentation page with tabbed interface for different guide categories
  - Hair Care & Maintenance guides with daily routines, washing, and storage tips
  - Installation & Styling tutorials with professional techniques and color matching
  - Platform usage guides covering account management, orders, and POS system
  - Interactive FAQ section with expandable accordion interface
  - Video tutorial showcase with beginner to advanced content organization
  - Downloadable resource section with PDF guides and reference materials
- **Enhanced Featured Section**: Instagram-inspired product showcase
  - Premium Collection highlight featuring Korean HD Lace hair extensions (₱4,500-₱5,800)
  - Professional product descriptions with bullet point features
  - Special offers banner with promotional code HIBLA15 for 15% off
  - Visual pricing grid with different textures and lengths
  - Modern glass morphism design with neon effects maintained throughout
- **Enhanced Preloader Animation**: Sophisticated animated hair loading experience
  - Extended 7-second loading delay for immersive brand experience
  - Multiple layers of flowing hair strand animations (long, medium, short, wavy)
  - Floating hair particles around logo with complex motion patterns
  - Enhanced progress bar with hair-like background effects and flowing animations
  - Flowing text effects and layered animations throughout the loading sequence
  - Professional brand presentation with purple, cyan, and pink gradient themes

### Previous Changes
- **Database Migration (Jan 23, 2025)**: Replaced in-memory storage with PostgreSQL database using Drizzle ORM
- **AI Integration**: Added OpenRouter API integration for Philippine market research and product data generation
- **Enhanced Product Management**: Implemented AI-powered product form filling with dynamic SKU/barcode generation
- **File Upload System**: Added multer-based image upload for product photos
- **Production Database Layer**: Complete database relations and CRUD operations with proper data persistence