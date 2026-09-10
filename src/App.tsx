import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { AuthLandingPage } from './pages/auth/AuthLandingPage';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { StaffLayout } from './components/layout/StaffLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

// Customer Pages
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { CakeDesignerPage } from './pages/customer/CakeDesignerPage';
import { SavedDesignsPage } from './pages/customer/SavedDesignsPage';
import { OrderRequestPage } from './pages/customer/OrderRequestPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';
import { CustomerOrderDetailPage } from './pages/customer/CustomerOrderDetailPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerAddressesPage } from './pages/customer/CustomerAddressesPage';

// Staff Pages
import { StaffDashboardPage } from './pages/staff/StaffDashboardPage';
import { StaffOrdersPage } from './pages/staff/StaffOrdersPage';
import { StaffOrderDetailPage } from './pages/staff/StaffOrderDetailPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage';
import { AdminPricingPage } from './pages/admin/AdminPricingPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

// Route Guards
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'staff' | 'admin')[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-rose-600 border-t-transparent animate-spin" />
          <span className="font-serif text-sm font-bold text-chocolate-900">Entering Dream Cake AI...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

const AuthLandingGuard: React.FC = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (user) {
    if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/customer/home" replace />;
  }

  return <AuthLandingPage />;
};

export const App: React.FC = () => {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Auth Entry */}
        <Route path="/" element={<AuthLandingGuard />} />

        {/* Customer Portal */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<CustomerHomePage />} />
          <Route path="design" element={<CakeDesignerPage />} />
          <Route path="designs" element={<SavedDesignsPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="orders/request" element={<OrderRequestPage />} />
          <Route path="orders/:id" element={<CustomerOrderDetailPage />} />
          <Route path="favorites" element={<SavedDesignsPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="addresses" element={<CustomerAddressesPage />} />
          <Route index element={<Navigate to="home" replace />} />
        </Route>

        {/* Staff Portal */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StaffDashboardPage />} />
          <Route path="orders" element={<StaffOrdersPage />} />
          <Route path="orders/:id" element={<StaffOrderDetailPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="orders" element={<StaffOrdersPage />} />
          <Route path="categories" element={<AdminCatalogPage />} />
          <Route path="flavors" element={<AdminCatalogPage />} />
          <Route path="frostings" element={<AdminCatalogPage />} />
          <Route path="sizes" element={<AdminCatalogPage />} />
          <Route path="decorations" element={<AdminCatalogPage />} />
          <Route path="pricing" element={<AdminPricingPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Access Denied */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
