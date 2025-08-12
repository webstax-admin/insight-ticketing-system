import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
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
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-it-ticket" element={<CreateTicket />} />
            <Route path="vehicle-requisition" element={<VehicleRequisition />} />
            <Route path="admin-service-request" element={<AdminServiceRequest />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="ticket/:ticketNumber" element={<STicket />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="companies" element={<Companies />} />
            <Route path="locations" element={<Locations />} />
            <Route path="categories" element={<Categories />} />
            <Route path="assignees" element={<Assignees />} />
            <Route path="hod" element={<HODManagement />} />
            <Route path="org-chart" element={<OrgChart />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
