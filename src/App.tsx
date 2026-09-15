import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SystemProvider } from './context/SystemContext';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { EventManagementPage } from './pages/EventManagementPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { OrderMonitoringPage } from './pages/OrderMonitoringPage';
import { MaintenanceControlPage } from './pages/MaintenanceControlPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SystemProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardOverviewPage />} />
                <Route path="events" element={<EventManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="orders" element={<OrderMonitoringPage />} />
                <Route path="maintenance" element={<MaintenanceControlPage />} />
              </Route>
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SystemProvider>
    </AuthProvider>
  );
};

export default App;
