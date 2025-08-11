import React from 'react';
import { Switch, Route } from 'wouter';
import { DocsLayout } from '@/pages/DocsLayout';
import DocsHome from '@/pages/docs/DocsHome';
import QuickStartGuide from '@/pages/docs/QuickStartGuide';
import SystemRequirements from '@/pages/docs/SystemRequirements';
import UserRolesGuide from '@/pages/docs/UserRolesGuide';
import DashboardGuide from '@/pages/docs/DashboardGuide';
import QuotationGuide from '@/pages/docs/QuotationGuide';
import SalesOrderGuide from '@/pages/docs/SalesOrderGuide';
import JobOrderGuide from '@/pages/docs/JobOrderGuide';
import InventoryGuide from '@/pages/docs/InventoryGuide';
import CustomerGuide from '@/pages/docs/CustomerGuide';
import PricingGuide from '@/pages/docs/PricingGuide';
import AIInsightsGuide from '@/pages/docs/AIInsightsGuide';
import WarehouseGuide from '@/pages/docs/WarehouseGuide';
import ReportsGuide from '@/pages/docs/ReportsGuide';
import StaffManagementGuide from '@/pages/docs/StaffManagementGuide';
import WorkflowQuotation from '@/pages/docs/WorkflowQuotation';
import WorkflowProduction from '@/pages/docs/WorkflowProduction';
import WorkflowInventory from '@/pages/docs/WorkflowInventory';
import WorkflowCustomer from '@/pages/docs/WorkflowCustomer';
import APIOverview from '@/pages/docs/APIOverview';
import APIAuth from '@/pages/docs/APIAuth';
import APIEndpoints from '@/pages/docs/APIEndpoints';
import APIIntegration from '@/pages/docs/APIIntegration';
import Troubleshooting from '@/pages/docs/Troubleshooting';
import ErrorCodes from '@/pages/docs/ErrorCodes';
import Performance from '@/pages/docs/Performance';
import Support from '@/pages/docs/Support';

export default function DocsRouter() {
  return (
    <DocsLayout>
      <Switch>
        {/* Getting Started */}
        <Route path="/" component={DocsHome} />
        <Route path="/quick-start" component={QuickStartGuide} />
        <Route path="/requirements" component={SystemRequirements} />
        <Route path="/roles" component={UserRolesGuide} />
        
        {/* Core Modules */}
        <Route path="/dashboard" component={DashboardGuide} />
        <Route path="/quotations" component={QuotationGuide} />
        <Route path="/sales-orders" component={SalesOrderGuide} />
        <Route path="/job-orders" component={JobOrderGuide} />
        <Route path="/inventory" component={InventoryGuide} />
        <Route path="/customers" component={CustomerGuide} />
        
        {/* Advanced Features */}
        <Route path="/pricing" component={PricingGuide} />
        <Route path="/ai-insights" component={AIInsightsGuide} />
        <Route path="/warehouses" component={WarehouseGuide} />
        <Route path="/reports" component={ReportsGuide} />
        <Route path="/staff-management" component={StaffManagementGuide} />
        
        {/* Workflows */}
        <Route path="/workflow-quotation" component={WorkflowQuotation} />
        <Route path="/workflow-production" component={WorkflowProduction} />
        <Route path="/workflow-inventory" component={WorkflowInventory} />
        <Route path="/workflow-customer" component={WorkflowCustomer} />
        
        {/* API Documentation */}
        <Route path="/api" component={APIOverview} />
        <Route path="/api-auth" component={APIAuth} />
        <Route path="/api-endpoints" component={APIEndpoints} />
        <Route path="/api-integration" component={APIIntegration} />
        
        {/* Troubleshooting */}
        <Route path="/troubleshooting" component={Troubleshooting} />
        <Route path="/error-codes" component={ErrorCodes} />
        <Route path="/performance" component={Performance} />
        <Route path="/support" component={Support} />
      </Switch>
    </DocsLayout>
  );
}