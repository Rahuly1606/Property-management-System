import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import PropertyListing from './pages/public/PropertyListing';
import PropertyDetail from './pages/public/PropertyDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/public/NotFound';
import Unauthorized from './pages/public/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Landlord Pages
import LandlordDashboard from './pages/landlord/Dashboard';

// Tenant Pages
import TenantDashboard from './pages/tenant/Dashboard';

// Messaging Component
import Messenger from './components/messaging/Messenger';

// Maintenance Component
import MaintenanceRequestForm from './components/maintenance/MaintenanceRequestForm';

// Payment Integration
import PaymentRoutes from './routes/PaymentRoutes';
import PaymentForm from './components/payments/PaymentForm';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="properties" element={<PropertyListing />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/users" element={<div>Users Management Page</div>} />
              <Route path="admin/properties" element={<div>Properties Management Page</div>} />
              <Route path="admin/reports" element={<div>Reports Page</div>} />
              <Route path="admin/settings" element={<div>Admin Settings Page</div>} />
            </Route>
            
            {/* Landlord Routes */}
            <Route element={<ProtectedRoute allowedRoles={['LANDLORD']} />}>
              <Route path="landlord/dashboard" element={<LandlordDashboard />} />
              <Route path="landlord/properties" element={<div>Landlord Properties Page</div>} />
              <Route path="landlord/properties/add" element={<div>Add Property Page</div>} />
              <Route path="landlord/properties/:id" element={<div>Property Management Page</div>} />
              <Route path="landlord/properties/:id/edit" element={<div>Edit Property Page</div>} />
              <Route path="landlord/leases" element={<div>Leases Management Page</div>} />
              <Route path="landlord/payments" element={<div>Payments Management Page</div>} />
              <Route path="landlord/maintenance" element={<div>Maintenance Requests Management Page</div>} />
              <Route path="landlord/tenants" element={<div>Tenants Management Page</div>} />
              <Route path="landlord/settings" element={<div>Landlord Settings Page</div>} />
            </Route>
            
            {/* Tenant Routes */}
            <Route element={<ProtectedRoute allowedRoles={['TENANT']} />}>
              <Route path="tenant/dashboard" element={<TenantDashboard />} />
              <Route path="tenant/lease" element={<div>Lease Details Page</div>} />
              <Route path="tenant/payments/*" element={<PaymentRoutes />} />
              <Route path="tenant/maintenance" element={<div>Maintenance Requests Page</div>} />
              <Route path="tenant/maintenance/new" element={<MaintenanceRequestForm />} />
              <Route path="tenant/maintenance/:id" element={<div>Maintenance Request Details Page</div>} />
              <Route path="tenant/application/new" element={<div>New Rental Application Page</div>} />
              <Route path="tenant/settings" element={<div>Tenant Settings Page</div>} />
            </Route>
            
            {/* Messaging - available to all authenticated users */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'LANDLORD', 'TENANT']} />}>
              <Route path="messages" element={<Messenger />} />
              <Route path="profile" element={<div>User Profile Page</div>} />
              <Route path="settings" element={<div>Account Settings Page</div>} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
