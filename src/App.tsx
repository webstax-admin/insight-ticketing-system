import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CreateTicket from "./pages/CreateTicket";
import NotFound from "./pages/NotFound";

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
            <Route path="create-ticket" element={<CreateTicket />} />
            <Route path="tickets" element={<Dashboard />} />
            <Route path="analytics" element={<Dashboard />} />
            <Route path="companies" element={<Dashboard />} />
            <Route path="locations" element={<Dashboard />} />
            <Route path="categories" element={<Dashboard />} />
            <Route path="assignees" element={<Dashboard />} />
            <Route path="hod" element={<Dashboard />} />
            <Route path="org-chart" element={<Dashboard />} />
            <Route path="notifications" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
