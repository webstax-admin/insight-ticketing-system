import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AssigneeMapping {
  mappingID: string;
  empLocation: string;
  department: string;
  subDept: string;
  subTask: string;
  taskLabel: string;
  ticketType: string;
  assigneeEmpID: string;
  isDisplay: boolean;
}

export default function Assignees() {
  const [mappings, setMappings] = useState<AssigneeMapping[]>([
    {
      mappingID: "MAP001",
      empLocation: "Building A",
      department: "IT",
      subDept: "Network",
      subTask: "Connectivity",
      taskLabel: "Network Setup",
      ticketType: "Hardware",
      assigneeEmpID: "EMP001",
      isDisplay: true
    },
    {
      mappingID: "MAP002",
      empLocation: "Building B", 
      department: "IT",
      subDept: "Software",
      subTask: "Installation",
      taskLabel: "Software Install",
      ticketType: "Software",
      assigneeEmpID: "EMP002",
      isDisplay: true
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<AssigneeMapping | null>(null);
  const [formData, setFormData] = useState({
    mappingID: "",
    empLocation: "",
    department: "",
    subDept: "",
    subTask: "",
    taskLabel: "",
    ticketType: "",
    assigneeEmpID: "",
    isDisplay: true
  });

  const locations = ["Building A", "Building B", "Building C", "Remote"];
  const departments = ["IT", "HR", "Finance", "Operations"];
  const subDepartments = ["Network", "Hardware", "Software", "Security"];
  const subTasks = ["Installation", "Maintenance", "Troubleshooting", "Upgrade"];
  const taskLabels = ["Network Setup", "Software Install", "Hardware Repair", "Security Audit"];
  const ticketTypes = ["Hardware", "Software", "Network", "Security"];
  const employees = [
    { id: "EMP001", name: "John Smith" },
    { id: "EMP002", name: "Jane Doe" },
    { id: "EMP003", name: "Mike Johnson" },
    { id: "EMP004", name: "Sarah Wilson" },
  ];

  const filteredMappings = mappings.filter(mapping =>
    mapping.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.assigneeEmpID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.empLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingMapping(null);
    setFormData({
      mappingID: "",
      empLocation: "",
      department: "",
      subDept: "",
      subTask: "",
      taskLabel: "",
      ticketType: "",
      assigneeEmpID: "",
      isDisplay: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (mapping: AssigneeMapping) => {
    setEditingMapping(mapping);
    setFormData(mapping);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.mappingID || !formData.department || !formData.assigneeEmpID) {
      toast({
        title: "Error",
        description: "Required fields: Mapping ID, Department, and Assignee",
        variant: "destructive"
      });
      return;
    }

    if (editingMapping) {
      setMappings(prev => prev.map(mapping => 
        mapping.mappingID === editingMapping.mappingID ? formData : mapping
      ));
      toast({
        title: "Success",
        description: "Assignee mapping updated successfully"
      });
    } else {
      if (mappings.some(m => m.mappingID === formData.mappingID)) {
        toast({
          title: "Error",
          description: "Mapping ID already exists",
          variant: "destructive"
        });
        return;
      }
      setMappings(prev => [...prev, formData]);
      toast({
        title: "Success",
        description: "Assignee mapping added successfully"
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (mappingID: string) => {
    setMappings(prev => prev.filter(mapping => mapping.mappingID !== mappingID));
    toast({
      title: "Success",
      description: "Assignee mapping deleted successfully"
    });
  };

  const getEmployeeName = (empID: string) => {
    return employees.find(emp => emp.id === empID)?.name || empID;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assignee Master</h1>
          <p className="text-muted-foreground">Manage ticket assignment mappings</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignee Mappings</CardTitle>
          <CardDescription>Configure automatic ticket assignments based on criteria</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mappings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mapping ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Sub Dept</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.mappingID}>
                  <TableCell className="font-mono">{mapping.mappingID}</TableCell>
                  <TableCell>{mapping.empLocation}</TableCell>
                  <TableCell>{mapping.department}</TableCell>
                  <TableCell>{mapping.subDept}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{mapping.taskLabel}</div>
                      <div className="text-xs text-muted-foreground">{mapping.ticketType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span>{getEmployeeName(mapping.assigneeEmpID)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mapping.isDisplay ? "default" : "secondary"}>
                      {mapping.isDisplay ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(mapping)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(mapping.mappingID)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMapping ? "Edit Assignee Mapping" : "Add New Assignee Mapping"}</DialogTitle>
            <DialogDescription>
              Configure automatic assignment rules for tickets
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mappingID">Mapping ID</Label>
                <Input
                  id="mappingID"
                  value={formData.mappingID}
                  onChange={(e) => setFormData(prev => ({ ...prev, mappingID: e.target.value }))}
                  disabled={!!editingMapping}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empLocation">Employee Location</Label>
                <Select value={formData.empLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, empLocation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subDept">Sub Department</Label>
                <Select value={formData.subDept} onValueChange={(value) => setFormData(prev => ({ ...prev, subDept: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub department" />
                  </SelectTrigger>
                  <SelectContent>
                    {subDepartments.map((subDept) => (
                      <SelectItem key={subDept} value={subDept}>{subDept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subTask">Sub Task</Label>
                <Select value={formData.subTask} onValueChange={(value) => setFormData(prev => ({ ...prev, subTask: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub task" />
                  </SelectTrigger>
                  <SelectContent>
                    {subTasks.map((task) => (
                      <SelectItem key={task} value={task}>{task}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskLabel">Task Label</Label>
                <Select value={formData.taskLabel} onValueChange={(value) => setFormData(prev => ({ ...prev, taskLabel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task label" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskLabels.map((label) => (
                      <SelectItem key={label} value={label}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketType">Ticket Type</Label>
                <Select value={formData.ticketType} onValueChange={(value) => setFormData(prev => ({ ...prev, ticketType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ticket type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigneeEmpID">Assignee</Label>
                <Select value={formData.assigneeEmpID} onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeEmpID: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}