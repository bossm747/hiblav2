# Management Pages Implementation TODO

## ANALYSIS: Schema vs Client Requirements Gaps

### 🚨 CRITICAL SCHEMA ISSUES TO FIX:
1. **Warehouses table missing role-based access** - Client specifies Manager/Viewer permissions
2. **InventoryItems table missing** - Client needs inventory movement tracking with reference numbers
3. **Shipments table missing** - Client needs shipment tracking from Reserved warehouse
4. **Missing proper inventory movement fields** - Client specifies specific movement types
5. **Job Order calculations not automated** - Client needs auto-calculated Ready, To Produce fields

## IMPLEMENTATION PLAN (Priority Order)

### ✅ COMPLETED PAGES:
- [x] Dashboard - Manufacturing overview with real data
- [x] Quotations Management - Complete workflow
- [x] Sales Orders Management - PDF format compliance  
- [x] Job Orders Management - Production tracking
- [x] Customer Management - B2B relationships
- [x] Staff Management - Team permissions
- [x] Reports & Analytics - Business intelligence

### 🔄 IN PROGRESS: Fix Query Client Issues  
- [x] Dashboard - Fixed, showing real data (1,1,1,20,$1,087)
- [x] ReportsPage - Fixed, reduced errors from 16 to 8
- [x] InventoryPage - Fixed, reduced errors from 8 to 4
- [x] JobOrdersPage - Added type safety, 12 errors remaining
- [x] SalesOrdersPage - Added type safety, 3 errors remaining
- [x] QuotationsPage - Added type safety, 3 errors remaining

**TOTAL LSP ERRORS: 43 → 22 (48% reduction achieved)**

### 📋 TODO: NEW MANAGEMENT PAGES

#### **1. Products Management Page** ✅ COMPLETED
**Status:** Implemented with real data integration
- [x] Product catalog display (20 Filipino hair products)
- [x] Product specifications (hair type, texture, length, color, weight)
- [x] SKU management and pricing display
- [x] Stock threshold monitoring
- [x] Active/inactive status toggle
- [x] Search and filtering functionality
- [x] Statistics dashboard (Total, Active, Low Stock, Avg Price)
- [x] Added to main navigation with Boxes icon

#### **2. Categories Management Page** 🎯 HIGH PRIORITY  
**Requirements:** Product category hierarchy
- Category creation with parent/child relationships
- Display order management
- Category activation/deactivation
- Image uploads for categories

#### **3. Warehouse Management Page** 🎯 HIGH PRIORITY
**Client Requirements:**
- 6 warehouses: NG, PH, Reserved, Red, Admin, WIP
- Role-based access:
  - NG Warehouse: Manager=Custodian, Viewer=Customer+Customer Service
  - PH Warehouse: Manager=Custodian, Viewer=Customer+Customer Service  
  - Reserved/Red/Admin/WIP: Manager=Custodian only
- Warehouse configuration and permissions

#### **4. Inventory Tracking Page** 🎯 HIGH PRIORITY (REDESIGNED)
**Client Requirements:**
- Movement tracking with reference numbers
- Sales Order lookup functionality
- Reserved quantity management
- Shipped quantity tracking
- Auto-calculated fields: Ready Quantity, To Produce
- Packing list number tracking

#### **5. Price Lists Management Page** 🎯 MEDIUM PRIORITY
**Requirements:** VLOOKUP pricing structure
- A, B, C, D price list management
- Customer tier assignments (NEW +15%, REGULAR baseline, PREMIER -15%)
- Bulk price updates
- Price list activation/deactivation

#### **6. Shipments Management Page** 🎯 MEDIUM PRIORITY
**Client Requirements:**
- Shipment tracking from Reserved warehouse
- DHL, UPS, FedEx, Agent, Pick Up methods
- Batch shipment management
- Packing list generation
- Shipment status updates

#### **7. Inventory Items Management Page** 🎯 MEDIUM PRIORITY
**Client Requirements:**
- Individual inventory entries with reference numbers
- Movement types: Deposit, Withdrawal, Transfer
- Reference to Sales Orders and Job Orders
- Packing list number management

#### **8. Suppliers Management Page** 🎯 LOW PRIORITY
**Requirements:** Supplier relationship management
- Supplier contact information
- Purchase order management
- Supplier performance tracking

### 🔧 SCHEMA FIXES NEEDED (Before Implementation):

1. **Add warehouse permissions to warehouses table:**
```sql
ALTER TABLE warehouses ADD COLUMN managers text[] DEFAULT '{}';
ALTER TABLE warehouses ADD COLUMN viewers text[] DEFAULT '{}';
```

2. **Create inventory_items table:**
```sql
CREATE TABLE inventory_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL,
  product_id VARCHAR REFERENCES products(id),
  warehouse_id VARCHAR REFERENCES warehouses(id),
  movement_type TEXT NOT NULL, -- deposit, withdrawal
  quantity DECIMAL(10,2) NOT NULL,
  sales_order_id VARCHAR REFERENCES sales_orders(id),
  packing_list_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Create shipments table:**
```sql
CREATE TABLE shipments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT UNIQUE NOT NULL,
  sales_order_id VARCHAR REFERENCES sales_orders(id),
  warehouse_id VARCHAR REFERENCES warehouses(id),
  shipping_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## IMPLEMENTATION STRATEGY:
1. Fix remaining query client issues (27 errors)
2. Apply schema fixes with migrations
3. Implement Products Management (highest business value)
4. Implement Warehouse Management (role-based access)
5. Redesign Inventory Tracking (client workflow alignment)
6. Complete remaining pages in priority order

## SUCCESS CRITERIA:
- 100% test success rate with real data
- Zero mock/hardcoded data
- Client workflow compliance
- Production-ready implementation
- Type-safe TypeScript throughout