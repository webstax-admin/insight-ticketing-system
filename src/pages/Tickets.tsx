import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  Filter,
  Calendar,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Ticket {
  ticketNumber: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignee: string;
  reporter: string;
  createdDate: string;
  department: string;
  location: string;
  expectedCompletion: string;
}

export default function Tickets() {
  const [activeTab, setActiveTab] = useState('all');
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      ticketNumber: "TK-2024-001",
      title: "Network connectivity issue in Building A",
      priority: "High",
      status: "In Progress",
      assignee: "John Smith",
      reporter: "Alice Johnson",
      createdDate: "2024-01-15",
      department: "IT",
      location: "Building A",
      expectedCompletion: "2024-01-20"
    },
    {
      ticketNumber: "TK-2024-002", 
      title: "Software installation request for accounting team",
      priority: "Medium",
      status: "Open",
      assignee: "Jane Doe",
      reporter: "Bob Wilson",
      createdDate: "2024-01-14",
      department: "Finance",
      location: "Building B",
      expectedCompletion: "2024-01-18"
    },
    {
      ticketNumber: "TK-2024-003",
      title: "Printer malfunction in HR department",
      priority: "Low", 
      status: "Resolved",
      assignee: "Mike Johnson",
      reporter: "Sarah Davis",
      createdDate: "2024-01-13",
      department: "HR",
      location: "Building A",
      expectedCompletion: "2024-01-17"
    },
    {
      ticketNumber: "TK-2024-004",
      title: "Security system upgrade required",
      priority: "Critical",
      status: "Open",
      assignee: "Sarah Wilson",
      reporter: "Tom Brown",
      createdDate: "2024-01-12",
      department: "Security",
      location: "Building C",
      expectedCompletion: "2024-01-19"
    }
  ]);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    department: '',
    assignee: ''
  });

  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="h-4 w-4 text-warning" />;
      case 'In Progress': return <AlertCircle className="h-4 w-4 text-primary" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Closed': return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-primary text-primary-foreground';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-warning/10 text-warning border-warning/20';
      case 'In Progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'Resolved': return 'bg-success/10 text-success border-success/20';
      case 'Closed': return 'bg-muted/10 text-muted-foreground border-muted/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const filterTickets = (filterType: string) => {
    // In a real app, this would filter based on user role and assignments
    switch (filterType) {
      case 'assigned-to-me':
        return tickets.filter(t => t.assignee === 'John Smith'); // Current user
      case 'reported-by-me':
        return tickets.filter(t => t.reporter === 'John Smith'); // Current user
      case 'my-department':
        return tickets.filter(t => t.department === 'IT'); // Current user's dept
      case 'high-priority':
        return tickets.filter(t => ['High', 'Critical'].includes(t.priority));
      default:
        return tickets;
    }
  };

  const applyFilters = (ticketList: Ticket[]) => {
    return ticketList.filter(ticket => {
      return (!filters.status || ticket.status === filters.status) &&
             (!filters.priority || ticket.priority === filters.priority) &&
             (!filters.department || ticket.department === filters.department) &&
             (!filters.assignee || ticket.assignee.toLowerCase().includes(filters.assignee.toLowerCase()));
    });
  };

  const filteredTickets = applyFilters(filterTickets(activeTab));

  const handleTicketClick = (ticketNumber: string) => {
    navigate(`/ticket/${ticketNumber}`);
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', department: '', assignee: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground">View and manage your tickets</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="assigned-to-me">Assigned to Me</TabsTrigger>
          <TabsTrigger value="reported-by-me">Reported by Me</TabsTrigger>
          <TabsTrigger value="my-department">My Department</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priorities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.department} onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Search assignee..."
                    value={filters.assignee}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                  />
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
              <CardDescription>
                {activeTab === 'all' && "All tickets in the system"}
                {activeTab === 'assigned-to-me' && "Tickets assigned to you"}
                {activeTab === 'reported-by-me' && "Tickets you have reported"}
                {activeTab === 'my-department' && "Tickets from your department"}
                {activeTab === 'high-priority' && "High and critical priority tickets"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow 
                      key={ticket.ticketNumber}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleTicketClick(ticket.ticketNumber)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <span className="font-mono text-sm">{ticket.ticketNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate font-medium">
                          {ticket.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.assignee}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{ticket.reporter}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ticket.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.createdDate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleTicketClick(ticket.ticketNumber);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTickets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tickets found matching the current filters
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}