import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Location {
  locationID: string;
  companyCode: string;
  locationName: string;
}

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>(() => Masters.getLocations());

  const companies = Masters.getCompanies().map(c => ({ code: c.companyCode, name: c.companyShortName || c.companyName }));

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    locationID: "",
    companyCode: "",
    locationName: ""
  });

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.locationID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !selectedCompany || location.companyCode === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const handleAddNew = () => {
    setEditingLocation(null);
    setFormData({ locationID: "", companyCode: "", locationName: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData(location);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.locationID || !formData.companyCode || !formData.locationName) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (editingLocation) {
      const updated = locations.map(location => 
        location.locationID === editingLocation.locationID ? formData : location
      );
      setLocations(updated);
      Masters.setLocations(updated);
      toast({
        title: "Success",
        description: "Location updated successfully"
      });
    } else {
      if (locations.some(l => l.locationID === formData.locationID)) {
        toast({
          title: "Error",
          description: "Location ID already exists",
          variant: "destructive"
        });
        return;
      }
      const updated = [...locations, formData];
      setLocations(updated);
      Masters.setLocations(updated);
      toast({
        title: "Success",
        description: "Location added successfully"
      });
    }
    
    setIsDialogOpen(false);
    setFormData({ locationID: "", companyCode: "", locationName: "" });
  };

  const handleDelete = (locationID: string) => {
    const updated = locations.filter(location => location.locationID !== locationID);
    setLocations(updated);
    Masters.setLocations(updated);
    toast({
      title: "Success",
      description: "Location deleted successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Location Master</h1>
          <p className="text-muted-foreground">Manage office locations and sites</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>List of all office locations</CardDescription>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.code} value={company.code}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.locationID}>
                  <TableCell className="font-mono">{location.locationID}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{companies.find(c => c.code === location.companyCode)?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{location.locationName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(location)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(location.locationID)}>
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
            <DialogTitle>{editingLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
            <DialogDescription>
              {editingLocation ? "Update location information" : "Enter details for the new location"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationID" className="text-right">Location ID</Label>
              <Input
                id="locationID"
                value={formData.locationID}
                onChange={(e) => setFormData(prev => ({ ...prev, locationID: e.target.value }))}
                className="col-span-3"
                disabled={!!editingLocation}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyCode" className="text-right">Company</Label>
              <Select value={formData.companyCode} onValueChange={(value) => setFormData(prev => ({ ...prev, companyCode: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.code} value={company.code}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationName" className="text-right">Location Name</Label>
              <Input
                id="locationName"
                value={formData.locationName}
                onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
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