import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, Tag, FolderOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Category {
  categoryID: string;
  categoryName: string;
}

interface Subcategory {
  subcategoryID: string;
  categoryID: string;
  subcategoryName: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([
    { categoryID: "CAT001", categoryName: "Hardware Issues" },
    { categoryID: "CAT002", categoryName: "Software Problems" },
    { categoryID: "CAT003", categoryName: "Network Issues" },
    { categoryID: "CAT004", categoryName: "Security Incidents" },
  ]);

  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { subcategoryID: "SUB001", categoryID: "CAT001", subcategoryName: "Computer Hardware" },
    { subcategoryID: "SUB002", categoryID: "CAT001", subcategoryName: "Printer Issues" },
    { subcategoryID: "SUB003", categoryID: "CAT002", subcategoryName: "Application Errors" },
    { subcategoryID: "SUB004", categoryID: "CAT002", subcategoryName: "Operating System" },
    { subcategoryID: "SUB005", categoryID: "CAT003", subcategoryName: "Connectivity" },
    { subcategoryID: "SUB006", categoryID: "CAT003", subcategoryName: "WiFi Problems" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ categoryID: "", categoryName: "" });
  const [subcategoryFormData, setSubcategoryFormData] = useState({ subcategoryID: "", categoryID: "", subcategoryName: "" });

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubcategories = selectedCategory 
    ? subcategories.filter(sub => sub.categoryID === selectedCategory)
    : [];

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ categoryID: "", categoryName: "" });
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData(category);
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryFormData.categoryID || !categoryFormData.categoryName) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.categoryID === editingCategory.categoryID ? categoryFormData : cat
      ));
      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      if (categories.some(c => c.categoryID === categoryFormData.categoryID)) {
        toast({
          title: "Error",
          description: "Category ID already exists",
          variant: "destructive"
        });
        return;
      }
      setCategories(prev => [...prev, categoryFormData]);
      toast({ title: "Success", description: "Category added successfully" });
    }
    
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (categoryID: string) => {
    // Check if category has subcategories
    const hasSubcategories = subcategories.some(sub => sub.categoryID === categoryID);
    if (hasSubcategories) {
      toast({
        title: "Error",
        description: "Cannot delete category with existing subcategories",
        variant: "destructive"
      });
      return;
    }
    
    setCategories(prev => prev.filter(cat => cat.categoryID !== categoryID));
    toast({ title: "Success", description: "Category deleted successfully" });
  };

  const handleAddSubcategory = () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive"
      });
      return;
    }
    setEditingSubcategory(null);
    setSubcategoryFormData({ subcategoryID: "", categoryID: selectedCategory, subcategoryName: "" });
    setIsSubcategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormData(subcategory);
    setIsSubcategoryDialogOpen(true);
  };

  const handleSaveSubcategory = () => {
    if (!subcategoryFormData.subcategoryID || !subcategoryFormData.subcategoryName) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (editingSubcategory) {
      setSubcategories(prev => prev.map(sub => 
        sub.subcategoryID === editingSubcategory.subcategoryID ? subcategoryFormData : sub
      ));
      toast({ title: "Success", description: "Subcategory updated successfully" });
    } else {
      if (subcategories.some(s => s.subcategoryID === subcategoryFormData.subcategoryID)) {
        toast({
          title: "Error",
          description: "Subcategory ID already exists",
          variant: "destructive"
        });
        return;
      }
      setSubcategories(prev => [...prev, subcategoryFormData]);
      toast({ title: "Success", description: "Subcategory added successfully" });
    }
    
    setIsSubcategoryDialogOpen(false);
  };

  const handleDeleteSubcategory = (subcategoryID: string) => {
    setSubcategories(prev => prev.filter(sub => sub.subcategoryID !== subcategoryID));
    toast({ title: "Success", description: "Subcategory deleted successfully" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category & Subcategory Master</h1>
        <p className="text-muted-foreground">Manage ticket categories and subcategories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Panel */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5" />
                  <span>Categories</span>
                </CardTitle>
                <CardDescription>Manage main categories</CardDescription>
              </div>
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
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
                  <TableHead>ID</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow 
                    key={category.categoryID}
                    className={selectedCategory === category.categoryID ? "bg-muted/50" : "cursor-pointer"}
                    onClick={() => setSelectedCategory(category.categoryID)}
                  >
                    <TableCell className="font-mono">{category.categoryID}</TableCell>
                    <TableCell>{category.categoryName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.categoryID);
                        }}>
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

        {/* Subcategories Panel */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Subcategories</span>
                </CardTitle>
                <CardDescription>
                  {selectedCategory 
                    ? `Subcategories for ${categories.find(c => c.categoryID === selectedCategory)?.categoryName}`
                    : "Select a category to view subcategories"
                  }
                </CardDescription>
              </div>
              <Button onClick={handleAddSubcategory} size="sm" disabled={!selectedCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Subcategory Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubcategories.map((subcategory) => (
                    <TableRow key={subcategory.subcategoryID}>
                      <TableCell className="font-mono">{subcategory.subcategoryID}</TableCell>
                      <TableCell>{subcategory.subcategoryName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSubcategory(subcategory)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteSubcategory(subcategory.subcategoryID)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a category from the left panel to view its subcategories
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category information" : "Enter details for the new category"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryID" className="text-right">Category ID</Label>
              <Input
                id="categoryID"
                value={categoryFormData.categoryID}
                onChange={(e) => setCategoryFormData(prev => ({ ...prev, categoryID: e.target.value }))}
                className="col-span-3"
                disabled={!!editingCategory}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryFormData.categoryName}
                onChange={(e) => setCategoryFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}</DialogTitle>
            <DialogDescription>
              {editingSubcategory ? "Update subcategory information" : "Enter details for the new subcategory"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategoryID" className="text-right">Subcategory ID</Label>
              <Input
                id="subcategoryID"
                value={subcategoryFormData.subcategoryID}
                onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, subcategoryID: e.target.value }))}
                className="col-span-3"
                disabled={!!editingSubcategory}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategoryName" className="text-right">Subcategory Name</Label>
              <Input
                id="subcategoryName"
                value={subcategoryFormData.subcategoryName}
                onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, subcategoryName: e.target.value }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSubcategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}