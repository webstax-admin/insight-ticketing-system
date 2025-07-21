import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "John Doe", role: "IT Admin" });
  const [notifications, setNotifications] = useState(3);

  // Check if user is authenticated
  useEffect(() => {
    const empID = localStorage.getItem('empID');
    if (!empID && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('empID');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Don't show layout on login page
  if (location.pathname === '/login') {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">
                IT Ticketing System
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-muted-foreground">{user.role}</div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};