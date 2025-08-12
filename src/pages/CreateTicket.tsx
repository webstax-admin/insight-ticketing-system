import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Masters, createTicket } from "@/lib/store";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    department: '',
    subDepartment: '',
    taskLabel: '',
    location: '',
    incidentDate: undefined as Date | undefined,
    incidentTime: '',
    attachment: null as File | null
  });

  const departments = ['IT'];
  const subDepartments = ['Network', 'Hardware', 'Software', 'Security'];
  const taskLabels = Masters.getCategories().map(c => c.categoryName);
  const locations = Masters.getLocations().map(l => l.locationName);
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const t = createTicket({
        type: 'IT',
        title: formData.title,
        description: formData.description,
        priority: formData.priority as any,
        reporterEmail: localStorage.getItem('userEmail') || 'user@spot',
        reporterName: 'User',
        department: formData.department,
        subDepartment: formData.subDepartment,
        category: formData.taskLabel,
        location: formData.location,
        details: {
          incidentDate: formData.incidentDate?.toISOString(),
          incidentTime: formData.incidentTime,
          attachmentName: formData.attachment?.name,
        },
      })

      toast({
        title: "Ticket Created",
        description: `Ticket ${t.ticketNumber} successfully created`,
      });
      
      navigate(`/ticket/${t.ticketNumber}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create IT Ticket</h1>
        <p className="text-muted-foreground">Submit a new IT support request</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
          <CardDescription>Please provide details about your IT support request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue or request"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="subDepartment">Sub Department</Label>
              <Select value={formData.subDepartment} onValueChange={(value) => setFormData(prev => ({ ...prev, subDepartment: value }))}>
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

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Incident Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.incidentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.incidentDate ? format(formData.incidentDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.incidentDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, incidentDate: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentTime">Incident Time</Label>
              <Input
                id="incidentTime"
                type="time"
                value={formData.incidentTime}
                onChange={(e) => setFormData(prev => ({ ...prev, incidentTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment</Label>
            <div className="flex items-center gap-4">
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            {formData.attachment && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.attachment.name}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}