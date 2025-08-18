import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CreateTicket from "./pages/CreateTicket";
import Tickets from "./pages/Tickets";
import Companies from "./pages/Companies";
import Locations from "./pages/Locations";
import Categories from "./pages/Categories";
import Assignees from "./pages/Assignees";
import HODManagement from "./pages/HODManagement";
import Notifications from "./pages/Notifications";
import OrgChart from "./pages/OrgChart";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import VehicleRequisition from "./pages/VehicleRequisition";
import AdminServiceRequest from "./pages/AdminServiceRequest";
import STicket from "./pages/STicket";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="create-it-ticket" element={<CreateTicket />} />
            <Route path="vehicle-requisition" element={<VehicleRequisition />} />
            <Route path="admin-service-request" element={<AdminServiceRequest />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="ticket/:ticketNumber" element={<STicket />} />
            <Route path="analytics" element={<Analytics />} />
            
            {/* HOD-only routes */}
            <Route path="companies" element={<ProtectedRoute requiredRole="hod"><Companies /></ProtectedRoute>} />
            <Route path="locations" element={<ProtectedRoute requiredRole="hod"><Locations /></ProtectedRoute>} />
            <Route path="categories" element={<ProtectedRoute requiredRole="hod"><Categories /></ProtectedRoute>} />
            <Route path="assignees" element={<ProtectedRoute requiredRole="hod"><Assignees /></ProtectedRoute>} />
            <Route path="hod" element={<ProtectedRoute requiredRole="hod"><HODManagement /></ProtectedRoute>} />
            <Route path="org-chart" element={<ProtectedRoute requiredRole="hod"><OrgChart /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute requiredRole="hod"><Notifications /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
