import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";

import Home from "./pages/Home";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";

// Tenant pages
import PropertyListing from "./pages/tenant/PropertyListing";
import PropertyDetailsPage from "./pages/tenant/PropertyDetailsPage";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import MyLeases from "./pages/tenant/MyLeases";
import TenantPayments from "./pages/tenant/TenantPayments";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";

// Landlord pages
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import ManageProperties from "./pages/landlord/ManageProperties";
import ManageLeases from "./pages/landlord/ManageLeases";
import ManageMaintenance from "./pages/landlord/ManageMaintenance";
import SoldProperties from "./pages/landlord/SoldProperties";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />

            {/* Profile Route - Available to all authenticated users */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Tenant Routes */}
            <Route
              path="/tenant/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['tenant']}>
                    <TenantDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/leases"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['tenant']}>
                    <MyLeases />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/payments"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['tenant']}>
                    <TenantPayments />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/maintenance"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['tenant']}>
                    <TenantMaintenance />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Landlord Routes */}
            <Route
              path="/landlord/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['landlord']}>
                    <LandlordDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord/properties"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['landlord']}>
                    <ManageProperties />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord/leases"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['landlord']}>
                    <ManageLeases />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord/maintenance"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['landlord']}>
                    <ManageMaintenance />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord/sold-properties"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['landlord']}>
                    <SoldProperties />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
