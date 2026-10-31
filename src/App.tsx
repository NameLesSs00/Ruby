import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import { ProtectedRoute, PublicOnlyRoute, RoleRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { PosLayout } from './layouts/PosLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { AdminsPage } from './pages/AdminsPage';
import { ClientsPage } from './pages/ClientsPage';
import { CoachesPage } from './pages/CoachesPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { ProductsPage } from './pages/ProductsPage';
import { InventoryPage } from './pages/InventoryPage';
import { PayrollPage } from './pages/PayrollPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { PosRegisterPage } from './pages/pos/PosRegisterPage';
import { PosSalesPage } from './pages/pos/PosSalesPage';
import { PosReturnsPage } from './pages/pos/PosReturnsPage';
import { PosDuePaymentsPage } from './pages/pos/PosDuePaymentsPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        dir="rtl"
        position="top-center"
        richColors
        closeButton
      />

      <BrowserRouter>
        <Routes>
          {/* Public Login Route (Guest Only) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Dedicated POS Workspace */}
            <Route element={<RoleRoute allowedRoles={['SuperAdmin', 'ShopAdmin']} />}>
              <Route path="/pos" element={<PosLayout />}>
                <Route index element={<PosRegisterPage />} />
                <Route path="sales" element={<PosSalesPage />} />
                <Route path="returns" element={<PosReturnsPage />} />
                <Route path="due-payments" element={<PosDuePaymentsPage />} />
              </Route>
            </Route>

            {/* Admin Management Dashboard */}
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardOverviewPage />} />
              <Route element={<RoleRoute allowedRoles={['SuperAdmin']} />}>
                <Route path="/admins" element={<AdminsPage />} />
              </Route>
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/coaches" element={<CoachesPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route element={<RoleRoute allowedRoles={['SuperAdmin', 'ShopAdmin']} />}>
                <Route path="/inventory" element={<InventoryPage />} />
              </Route>
              <Route path="/payroll" element={<PayrollPage />} />
            </Route>
          </Route>

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
