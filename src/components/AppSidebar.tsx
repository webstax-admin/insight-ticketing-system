import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Ticket, 
  Plus, 
  BarChart3, 
  Users, 
  MapPin, 
  Building, 
  Tag, 
  UserCheck, 
  Bell,
  Settings,
  Car,
  ClipboardList
} from "lucide-react";

// Navigation based on user roles
const getNavigationForRole = (userRole: string) => {
  const commonNav = [
    {
      title: "Dashboard",
      items: [
        { title: "Overview", url: "/", icon: Home },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ]
    },
    {
      title: "Requests",
      items: [
        { title: "Create IT Ticket", url: "/create-it-ticket", icon: Plus },
        { title: "Vehicle Requisition", url: "/vehicle-requisition", icon: Car },
        { title: "Admin Service Request", url: "/admin-service-request", icon: ClipboardList },
        { title: "My Tickets", url: "/tickets", icon: Ticket },
      ]
    }
  ];

  const masterDataNav = {
    title: "Master Data",
    items: [
      { title: "Companies", url: "/companies", icon: Building },
      { title: "Locations", url: "/locations", icon: MapPin },
      { title: "Categories", url: "/categories", icon: Tag },
      { title: "Assignees", url: "/assignees", icon: UserCheck },
      { title: "HOD Management", url: "/hod", icon: Settings },
    ]
  };

  const organizationNav = {
    title: "Organization",
    items: [
      { title: "IT Org Chart", url: "/org-chart", icon: Users },
      { title: "Notifications", url: "/notifications", icon: Bell },
    ]
  };

  if (userRole === 'hod') {
    // HODs see everything
    return [...commonNav, masterDataNav, organizationNav];
  } else {
    // Common users see only dashboard and requests
    return commonNav;
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string>('user');
  const [navigation, setNavigation] = useState(getNavigationForRole('user'));

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
    setNavigation(getNavigationForRole(role));
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          isActive 
                            ? "bg-accent text-accent-foreground font-medium" 
                            : "hover:bg-muted/50"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}