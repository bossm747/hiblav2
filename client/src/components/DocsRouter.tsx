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
import ProjectStatus from '@/pages/docs/ProjectStatus';

export default function DocsRouter() {
  return (
    <DocsLayout>
      <Switch>
        {/* Getting Started */}
        <Route path="/docs" component={DocsHome} />
        <Route path="/docs/project-status" component={ProjectStatus} />
        <Route path="/docs/quick-start" component={QuickStartGuide} />
        <Route path="/docs/requirements" component={SystemRequirements} />
        <Route path="/docs/roles" component={UserRolesGuide} />
        
        {/* Core Modules */}
        <Route path="/docs/dashboard" component={DashboardGuide} />
        <Route path="/docs/quotations" component={QuotationGuide} />
        <Route path="/docs/sales-orders" component={SalesOrderGuide} />
        <Route path="/docs/job-orders" component={JobOrderGuide} />
        <Route path="/docs/inventory" component={InventoryGuide} />
        <Route path="/docs/customers" component={CustomerGuide} />
        
        {/* Advanced Features */}
        <Route path="/docs/pricing" component={PricingGuide} />
        <Route path="/docs/ai-insights" component={AIInsightsGuide} />
        <Route path="/docs/warehouses" component={WarehouseGuide} />
        <Route path="/docs/reports" component={ReportsGuide} />
        <Route path="/docs/staff-management" component={StaffManagementGuide} />
        
        {/* Workflows */}
        <Route path="/docs/workflow-quotation" component={WorkflowQuotation} />
        <Route path="/docs/workflow-production" component={WorkflowProduction} />
        <Route path="/docs/workflow-inventory" component={WorkflowInventory} />
        <Route path="/docs/workflow-customer" component={WorkflowCustomer} />
        
        {/* API Documentation */}
        <Route path="/docs/api" component={APIOverview} />
        <Route path="/docs/api-auth" component={APIAuth} />
        <Route path="/docs/api-endpoints" component={APIEndpoints} />
        <Route path="/docs/api-integration" component={APIIntegration} />
        
        {/* Troubleshooting */}
        <Route path="/docs/troubleshooting" component={Troubleshooting} />
        <Route path="/docs/error-codes" component={ErrorCodes} />
        <Route path="/docs/performance" component={Performance} />
        <Route path="/docs/support" component={Support} />
      </Switch>
    </DocsLayout>
  );
}