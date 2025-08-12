import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Masters, createTicket } from "@/lib/store";

export default function AdminServiceRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const locations = Masters.getLocations();
  const categories = Masters.getCategories();

  const [form, setForm] = useState({
    requesterName: "",
    requesterEmail: localStorage.getItem('userEmail') || "",
    requesterDept: "",
    employeeCode: "",
    location: "",
    workCategory: "",
    description: "",
    attachment: undefined as File | undefined,
  });

  const handleSubmit = async () => {
    if (!form.requesterEmail || !form.workCategory) {
      toast({ title: "Missing info", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const t = createTicket({
        type: 'Admin',
        title: `Admin Service: ${form.workCategory}`,
        description: form.description,
        priority: 'Medium',
        reporterEmail: form.requesterEmail,
        reporterName: form.requesterName,
        department: 'Administration',
        location: form.location,
        category: form.workCategory,
        details: {
          employeeCode: form.employeeCode,
          requesterDept: form.requesterDept,
          attachmentName: form.attachment?.name,
        }
      });
      toast({ title: "Request Submitted", description: `Ticket ${t.ticketNumber} created` });
      navigate(`/ticket/${t.ticketNumber}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Service Request</h1>
        <p className="text-muted-foreground">Request Admin assistance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Fill out the form below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Requestor Name</Label>
              <Input value={form.requesterName} onChange={(e) => setForm({ ...form, requesterName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Requestor Email</Label>
              <Input type="email" value={form.requesterEmail} onChange={(e) => setForm({ ...form, requesterEmail: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Requestor Department</Label>
              <Input value={form.requesterDept} onChange={(e) => setForm({ ...form, requesterDept: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Employee Code</Label>
              <Input value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="-- select location --" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(l => (<SelectItem key={l.locationID} value={l.locationName}>{l.locationName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Work Category</Label>
              <Select value={form.workCategory} onValueChange={(v) => setForm({ ...form, workCategory: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="-- select category --" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (<SelectItem key={c.categoryID} value={c.categoryName}>{c.categoryName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Incident Description</Label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Attachment (optional)</Label>
            <Input type="file" onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0] })} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
