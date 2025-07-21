import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Company {
  companyCode: string;
  companyShortName: string;
  companyName: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([
    { companyCode: "TECH", companyShortName: "TechCorp", companyName: "Technology Corporation Ltd." },
    { companyCode: "HEALTH", companyShortName: "HealthSys", companyName: "Healthcare Systems Inc." },
    { companyCode: "FIN", companyShortName: "FinServ", companyName: "Financial Services Group" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    companyCode: "",
    companyShortName: "",
    companyName: ""
  });

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyShortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingCompany(null);
    setFormData({ companyCode: "", companyShortName: "", companyName: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.companyCode || !formData.companyShortName || !formData.companyName) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (editingCompany) {
      // Update existing company
      setCompanies(prev => prev.map(company => 
        company.companyCode === editingCompany.companyCode ? formData : company
      ));
      toast({
        title: "Success",
        description: "Company updated successfully"
      });
    } else {
      // Add new company
      if (companies.some(c => c.companyCode === formData.companyCode)) {
        toast({
          title: "Error",
          description: "Company code already exists",
          variant: "destructive"
        });
        return;
      }
      setCompanies(prev => [...prev, formData]);
      toast({
        title: "Success",
        description: "Company added successfully"
      });
    }
    
    setIsDialogOpen(false);
    setFormData({ companyCode: "", companyShortName: "", companyName: "" });
  };

  const handleDelete = (companyCode: string) => {
    setCompanies(prev => prev.filter(company => company.companyCode !== companyCode));
    toast({
      title: "Success",
      description: "Company deleted successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Master</h1>
          <p className="text-muted-foreground">Manage company information</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>List of all registered companies</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
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
                <TableHead>Company Code</TableHead>
                <TableHead>Short Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.companyCode}>
                  <TableCell className="font-mono">{company.companyCode}</TableCell>
                  <TableCell>{company.companyShortName}</TableCell>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(company.companyCode)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
            <DialogDescription>
              {editingCompany ? "Update company information" : "Enter details for the new company"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyCode" className="text-right">Code</Label>
              <Input
                id="companyCode"
                value={formData.companyCode}
                onChange={(e) => setFormData(prev => ({ ...prev, companyCode: e.target.value }))}
                className="col-span-3"
                disabled={!!editingCompany}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyShortName" className="text-right">Short Name</Label>
              <Input
                id="companyShortName"
                value={formData.companyShortName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyShortName: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="col-span-3"
              />
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