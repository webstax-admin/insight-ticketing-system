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

export default function VehicleRequisition() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const companies = Masters.getCompanies();
  const locations = Masters.getLocations();

  const [form, setForm] = useState({
    requesterName: "",
    requesterEmail: localStorage.getItem('userEmail') || "",
    requesterDept: "",
    employeeCode: "",
    vehicleFor: "",
    pickupDateTime: "",
    dropDateTime: "",
    pickupLocation: "",
    dropLocation: "",
    people: 1,
    purpose: "",
  });

  const handleSubmit = async () => {
    if (!form.requesterEmail || !form.vehicleFor || !form.pickupDateTime || !form.dropDateTime) {
      toast({ title: "Missing info", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const t = createTicket({
        type: 'Vehicle',
        title: `Vehicle Request for ${form.vehicleFor}`,
        description: form.purpose,
        priority: 'Medium',
        reporterEmail: form.requesterEmail,
        reporterName: form.requesterName,
        department: 'Administration',
        location: form.pickupLocation,
        details: {
          employeeCode: form.employeeCode,
          requesterDept: form.requesterDept,
          pickupDateTime: form.pickupDateTime,
          dropDateTime: form.dropDateTime,
          pickupLocation: form.pickupLocation,
          dropLocation: form.dropLocation,
          people: form.people,
        },
      });
      toast({ title: "Vehicle Request Submitted", description: `Ticket ${t.ticketNumber} created` });
      navigate(`/ticket/${t.ticketNumber}`);
    } finally {
      setLoading(false);
    }
  };

  const vehicleForOptions = ["Self", "Team", "Visitor", "Management"];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Request Form</h1>
        <p className="text-muted-foreground">Arrange a company vehicle</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Fill in the details below</CardDescription>
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
              <Label>Requestor Dept</Label>
              <Input value={form.requesterDept} onChange={(e) => setForm({ ...form, requesterDept: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Employee Code</Label>
              <Input value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Vehicle For</Label>
              <Select value={form.vehicleFor} onValueChange={(v) => setForm({ ...form, vehicleFor: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="-- select --" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleForOptions.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>No. of People</Label>
              <Input type="number" min={1} value={form.people} onChange={(e) => setForm({ ...form, people: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Pickup Date & Time</Label>
              <Input type="datetime-local" value={form.pickupDateTime} onChange={(e) => setForm({ ...form, pickupDateTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Drop Date & Time</Label>
              <Input type="datetime-local" value={form.dropDateTime} onChange={(e) => setForm({ ...form, dropDateTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <Select value={form.pickupLocation} onValueChange={(v) => setForm({ ...form, pickupLocation: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="-- select --" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(l => (<SelectItem key={l.locationID} value={l.locationName}>{l.locationName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Drop Location</Label>
              <Select value={form.dropLocation} onValueChange={(v) => setForm({ ...form, dropLocation: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="-- select --" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(l => (<SelectItem key={l.locationID} value={l.locationName}>{l.locationName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Purpose of Visit</Label>
            <Textarea rows={4} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Vehicle Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
