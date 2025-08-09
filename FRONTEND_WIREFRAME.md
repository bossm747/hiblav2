# Hibla Manufacturing Frontend Wireframe & Design System

## Design Philosophy
- **Professional Manufacturing Focus**: Clean, data-driven interface optimized for business operations
- **ShadCN UI Components**: Modern, accessible, and consistent design system
- **Light/Dark Mode**: Universal theme support for different working conditions
- **Mobile-First Responsive**: Optimized for tablets and mobile devices used in manufacturing
- **Data Density**: Efficient display of complex manufacturing data

## Color Palette & Branding
```css
:root {
  /* Primary Brand Colors */
  --primary: 262 83% 58%;        /* Purple gradient start */
  --primary-foreground: 210 40% 98%;
  
  /* Accent Colors */
  --accent-cyan: 184 81% 29%;    /* Manufacturing accent */
  --accent-pink: 332 81% 60%;    /* Alert/highlight color */
  
  /* Status Colors */
  --success: 142 76% 36%;        /* Completed orders */
  --warning: 48 96% 53%;         /* Pending items */
  --destructive: 0 84% 60%;      /* Critical alerts */
  
  /* Neutral Palette */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --border: 214.3 31.8% 91.4%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --border: 217.2 32.6% 17.5%;
}
```

## Layout Structure

### 1. Header Navigation
```
┌─────────────────────────────────────────────────────────────────┐
│ [🏭] Hibla Manufacturing    [🌙] Theme  [👤] User  [🔔] Alerts │
│                                                                 │
│ Real Filipino Hair Manufacturer & Global Supplier              │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Sidebar Navigation (Collapsible)
```
┌─────────────────┐
│ 📊 Dashboard    │
│ 📄 Quotations   │
│ 🛒 Sales Orders │
│ 🏭 Job Orders   │
│ 📦 Inventory    │
│ 🧠 AI Insights  │
│ 📈 Reports      │
│ 📚 Docs         │
│ ⚙️  Settings    │
└─────────────────┘
```

### 3. Main Content Areas

#### Manufacturing Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ HIBLA MANUFACTURING DASHBOARD                           │
├─────────────────────────────────────────────────────────┤
│ [📊 Metrics Cards Row]                                  │
│ Active Orders: 12  |  Production: 8  |  Shipped: 24    │
│ Revenue: $45.2K   |  Efficiency: 94% |  On-Time: 98%   │
├─────────────────────────────────────────────────────────┤
│ [📈 Real-Time Charts]                                   │
│ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Production Vol. │ │ Order Pipeline  │                │
│ │     📊         │ │      📈         │                │
│ └─────────────────┘ └─────────────────┘                │
├─────────────────────────────────────────────────────────┤
│ [⚡ Quick Actions]                                       │
│ [+ New Quotation] [📊 View Reports] [🏭 Job Orders]    │
└─────────────────────────────────────────────────────────┘
```

#### Quotations Page
```
┌─────────────────────────────────────────────────────────┐
│ QUOTATIONS MANAGEMENT                                   │
├─────────────────────────────────────────────────────────┤
│ [🔍 Search] [🎛️ Filters] [+ New Quotation] [📤 Export] │
├─────────────────────────────────────────────────────────┤
│ ┌─────┬─────────┬──────────┬────────┬─────────┬────────┐ │
│ │ ID  │ Client  │   Date   │ Total  │ Status  │ Action │ │
│ ├─────┼─────────┼──────────┼────────┼─────────┼────────┤ │
│ │Q001 │ ABA     │ 08/01/25 │ $1,087 │ 🟢 App │ [...]  │ │
│ │Q002 │ GLOBAL  │ 08/02/25 │ $2,156 │ 🟡 Pen │ [...]  │ │
│ └─────┴─────────┴──────────┴────────┴─────────┴────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### VLOOKUP Quotation Form
```
┌─────────────────────────────────────────────────────────┐
│ CREATE QUOTATION - VLOOKUP PRICING                     │
├─────────────────────────────────────────────────────────┤
│ Customer: [ABA Hair International ▼]                   │
│ Price List: [A - Premium ▼]  Date: [08/09/2025]       │
├─────────────────────────────────────────────────────────┤
│ PRODUCT SELECTION                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Product: [8" Machine Weft Straight ▼]              │ │
│ │ Auto Price: $120.00  Qty: [2.5] = $300.00         │ │
│ │ [➕ Add Item]                                       │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ QUOTATION SUMMARY                                       │
│ Subtotal: $947.00    Shipping: $35.00                  │
│ Discount: -$15.00    Total: $1,087.00                  │
│                                                         │
│ [💾 Save Draft] [📧 Send Quote] [📊 Generate SO]       │
└─────────────────────────────────────────────────────────┘
```

## Key Components to Build

### 1. Manufacturing Metrics Cards
```jsx
<Card className="border-l-4 border-l-primary">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm text-muted-foreground">Active Orders</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">24</div>
    <Badge variant="secondary">+12% this week</Badge>
  </CardContent>
</Card>
```

### 2. Data Tables with Actions
- Server-side pagination
- Advanced filtering
- Export functionality
- Row actions (Edit, Delete, Duplicate, Convert)

### 3. Forms with Validation
- Real-time VLOOKUP pricing
- Dynamic product selection
- Auto-calculation of totals
- Progress indicators

### 4. Status Indicators
```jsx
<Badge variant="outline" className="border-green-500 text-green-700">
  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
  Confirmed
</Badge>
```

## Theme Implementation

### Light Mode
- Clean white backgrounds
- Subtle gray borders
- Professional blue accents
- High contrast for data readability

### Dark Mode  
- Dark gray backgrounds
- Subtle border highlights
- Consistent accent colors
- Optimized for low-light manufacturing environments

## Mobile Responsiveness

### Tablet (768px+)
- Sidebar becomes overlay
- Cards stack vertically
- Tables become horizontally scrollable

### Mobile (< 768px)
- Bottom navigation
- Full-width cards
- Simplified table views
- Touch-friendly buttons

## Page-Specific Features

### Dashboard
- Real-time metrics
- Interactive charts
- Quick action buttons
- Recent activity feed

### Quotations
- Advanced VLOOKUP form
- Quotation preview
- PDF generation
- Email integration

### Sales Orders
- Order tracking
- Payment status
- Shipping information
- Customer communication

### Job Orders
- Production tracking
- Resource allocation
- Progress monitoring
- Quality control

### Inventory
- Multi-warehouse views
- Stock level alerts
- Movement history
- Transfer requests

### AI Insights
- Demand forecasting
- Inventory optimization
- Market trends
- Predictive analytics

## Accessibility Features
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Semantic HTML structure

## Performance Optimizations
- Code splitting by page
- Lazy loading of heavy components
- Optimized images and assets
- Caching strategy for API calls