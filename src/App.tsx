import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import {
  ProtectedRoute,
  PublicOnlyRoute,
  RoleRoute,
  RoleHomeRedirect,
} from './components/ProtectedRoute';
import { ADMIN_ROLES, POS_ROLES, RECEPTION_ROLES } from './modules/auth';
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
import { PurchasesPage } from './pages/PurchasesPage';
import { PayrollPage } from './pages/PayrollPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { DuePaymentsPage } from './pages/DuePaymentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { CashTransactionsPage } from './pages/CashTransactionsPage';
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
            {/* Root Role-Aware Redirect */}
            <Route path="/" element={<RoleHomeRedirect />} />

            {/* Dedicated POS Workspace (SuperAdmin, Admin, ShopAdmin ONLY) */}
            <Route element={<RoleRoute allowedRoles={POS_ROLES} />}>
              <Route path="/pos" element={<PosLayout />}>
                <Route index element={<PosRegisterPage />} />
                <Route path="sales" element={<PosSalesPage />} />
                <Route path="returns" element={<PosReturnsPage />} />
                <Route path="due-payments" element={<PosDuePaymentsPage />} />
              </Route>
            </Route>

            {/* Admin Management Workspace */}
            <Route element={<AdminLayout />}>
              {/* ReceptionAdmin + SuperAdmin Allowed Routes */}
              <Route element={<RoleRoute allowedRoles={RECEPTION_ROLES} />}>
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/coaches" element={<CoachesPage />} />
              </Route>

              {/* SuperAdmin / Admin Strictly Restricted Routes */}
              <Route element={<RoleRoute allowedRoles={ADMIN_ROLES} />}>
                <Route path="/dashboard" element={<DashboardOverviewPage />} />
                <Route path="/admins" element={<AdminsPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/due-payments" element={<DuePaymentsPage />} />
                <Route path="/payroll" element={<PayrollPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/cash-transactions" element={<CashTransactionsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<RoleHomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
