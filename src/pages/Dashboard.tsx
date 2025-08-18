import { useState, useEffect } from "react";
import { TicketsStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

interface Ticket {
  ticketNumber: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignee: string;
  createdDate: string;
  department: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('assignedToMe');
  const list = TicketsStore.getAll();
  const stats = {
    total: list.length,
    open: list.filter(t => t.status === 'Open').length,
    inProgress: list.filter(t => t.status === 'In Progress').length,
    resolved: list.filter(t => t.status === 'Resolved').length,
    closed: list.filter(t => t.status === 'Closed').length,
  };
  const tickets = list.slice(0, 10).map(t => ({
    ticketNumber: t.ticketNumber,
    title: t.title,
    priority: t.priority,
    status: t.status,
    assignee: t.assigneeEmpID || '-',
    createdDate: t.createdAt.slice(0,10),
    department: t.department || '-'
  }));

  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-primary text-primary-foreground';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="h-4 w-4" />;
      case 'In Progress': return <AlertCircle className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      case 'Closed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleTicketClick = (ticketNumber: string) => {
    navigate(`/ticket/${ticketNumber}`);
  };

  const statsCards = [
    { title: "Total Tickets", value: stats.total, icon: BarChart3, color: "text-primary" },
    { title: "Open", value: stats.open, icon: Clock, color: "text-warning" },
    { title: "In Progress", value: stats.inProgress, icon: AlertCircle, color: "text-primary" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tickets and system metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tickets Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignedToMe">Assigned to Me</TabsTrigger>
          <TabsTrigger value="assignedByMe">Assigned by Me</TabsTrigger>
          <TabsTrigger value="assignedToDept">Dept Assigned</TabsTrigger>
          <TabsTrigger value="assignedByDept">Dept Created</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>
                Latest tickets based on selected view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.ticketNumber}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleTicketClick(ticket.ticketNumber)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(ticket.status)}
                        <span className="font-mono text-sm">{ticket.ticketNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.department} • Assigned to {ticket.assignee}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline">{ticket.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}