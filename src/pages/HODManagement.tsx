import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, UserCog, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface HODMapping {
  id: string;
  dept: string;
  subDept: string;
  hodID: string;
  hodName: string;
}

export default function HODManagement() {
  const [hodMappings, setHodMappings] = useState<HODMapping[]>([
    { id: "1", dept: "IT", subDept: "Network", hodID: "EMP001", hodName: "John Smith" },
    { id: "2", dept: "IT", subDept: "Software", hodID: "EMP002", hodName: "Jane Doe" },
    { id: "3", dept: "HR", subDept: "Recruitment", hodID: "EMP003", hodName: "Mike Johnson" },
    { id: "4", dept: "Finance", subDept: "Accounting", hodID: "EMP004", hodName: "Sarah Wilson" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<HODMapping | null>(null);
  const [formData, setFormData] = useState({
    dept: "",
    subDept: "",
    hodID: "",
    hodName: ""
  });

  const departments = ["IT", "HR", "Finance", "Operations", "Marketing"];
  const subDepartments = {
    "IT": ["Network", "Software", "Hardware", "Security"],
    "HR": ["Recruitment", "Payroll", "Training", "Employee Relations"],
    "Finance": ["Accounting", "Budgeting", "Audit", "Tax"],
    "Operations": ["Production", "Quality", "Logistics", "Maintenance"],
    "Marketing": ["Digital", "Content", "Events", "Analytics"]
  };

  const employees = [
    { id: "EMP001", name: "John Smith" },
    { id: "EMP002", name: "Jane Doe" },
    { id: "EMP003", name: "Mike Johnson" },
    { id: "EMP004", name: "Sarah Wilson" },
    { id: "EMP005", name: "Tom Brown" },
    { id: "EMP006", name: "Lisa Davis" },
  ];

  const filteredMappings = hodMappings.filter(mapping =>
    mapping.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.subDept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.hodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingMapping(null);
    setFormData({ dept: "", subDept: "", hodID: "", hodName: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (mapping: HODMapping) => {
    setEditingMapping(mapping);
    setFormData({
      dept: mapping.dept,
      subDept: mapping.subDept,
      hodID: mapping.hodID,
      hodName: mapping.hodName
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.dept || !formData.subDept || !formData.hodID) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    // Check if combination already exists
    const existingMapping = hodMappings.find(m => 
      m.dept === formData.dept && 
      m.subDept === formData.subDept && 
      (!editingMapping || m.id !== editingMapping.id)
    );

    if (existingMapping) {
      toast({
        title: "Error",
        description: "HOD mapping for this department and sub-department already exists",
        variant: "destructive"
      });
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === formData.hodID);
    const newMapping = {
      ...formData,
      hodName: selectedEmployee?.name || formData.hodName
    };

    if (editingMapping) {
      setHodMappings(prev => prev.map(mapping => 
        mapping.id === editingMapping.id ? { ...newMapping, id: editingMapping.id } : mapping
      ));
      toast({
        title: "Success",
        description: "HOD mapping updated successfully"
      });
    } else {
      const newId = (hodMappings.length + 1).toString();
      setHodMappings(prev => [...prev, { ...newMapping, id: newId }]);
      toast({
        title: "Success",
        description: "HOD mapping added successfully"
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setHodMappings(prev => prev.filter(mapping => mapping.id !== id));
    toast({
      title: "Success",
      description: "HOD mapping deleted successfully"
    });
  };

  const handleDepartmentChange = (dept: string) => {
    setFormData(prev => ({ ...prev, dept, subDept: "" }));
  };

  const handleEmployeeChange = (empId: string) => {
    const employee = employees.find(emp => emp.id === empId);
    setFormData(prev => ({ 
      ...prev, 
      hodID: empId, 
      hodName: employee?.name || "" 
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">HOD Management</h1>
          <p className="text-muted-foreground">Manage Head of Department assignments</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add HOD Mapping
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-warning" />
            <span>HOD Assignments</span>
          </CardTitle>
          <CardDescription>Department and sub-department head assignments</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search HOD mappings..."
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
                <TableHead>Department</TableHead>
                <TableHead>Sub Department</TableHead>
                <TableHead>HOD Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>
                    <Badge variant="outline">{mapping.dept}</Badge>
                  </TableCell>
                  <TableCell>{mapping.subDept}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{mapping.hodName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{mapping.hodID}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(mapping)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(mapping.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredMappings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No HOD mappings found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMapping ? "Edit HOD Mapping" : "Add New HOD Mapping"}</DialogTitle>
            <DialogDescription>
              Assign a Head of Department for a specific department and sub-department
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
              <Select value={formData.dept} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subDepartment" className="text-right">Sub Department</Label>
              <Select 
                value={formData.subDept} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subDept: value }))}
                disabled={!formData.dept}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select sub department" />
                </SelectTrigger>
                <SelectContent>
                  {formData.dept && subDepartments[formData.dept as keyof typeof subDepartments]?.map((subDept) => (
                    <SelectItem key={subDept} value={subDept}>{subDept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">Employee</Label>
              <Select value={formData.hodID} onValueChange={handleEmployeeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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