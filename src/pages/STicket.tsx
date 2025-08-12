import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { TicketsStore, updateTicket, TicketsStore as Store, addHistory, autoCloseResolvedTickets, type Ticket } from "@/lib/store";

export default function STicket() {
  const { ticketNumber } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  const [comment, setComment] = useState("");

  const priorities: Ticket["priority"][] = ["Low","Medium","High","Critical"];
  const statuses: Ticket["status"][]   = ["Open","In Progress","Resolved","Closed"];

  useEffect(() => {
    autoCloseResolvedTickets();
    const t = TicketsStore.getAll().find(t => t.ticketNumber === ticketNumber);
    setTicket(t);
  }, [ticketNumber]);

  const history = useMemo(() => (ticketNumber ? Store.getHistory(ticketNumber) : []), [ticketNumber, ticket?.status]);

  if (!ticket) {
    return <div className="text-center text-muted-foreground">Ticket not found</div>;
  }

  const userEmail = localStorage.getItem('userEmail') || 'user@spot';

  const handleSave = () => {
    updateTicket(ticket.ticketNumber, {
      priority: ticket.priority,
      status: ticket.status,
      expectedCompletion: ticket.expectedCompletion,
      assigneeEmpID: ticket.assigneeEmpID,
    }, userEmail, comment || undefined);
    toast({ title: "Saved", description: "Ticket updated" });
    setComment("");
    setTicket(TicketsStore.getAll().find(t => t.ticketNumber === ticket.ticketNumber));
  };

  const handleAcceptResolution = () => {
    updateTicket(ticket.ticketNumber, { status: 'Closed' }, userEmail, 'Reporter accepted resolution');
    setTicket(TicketsStore.getAll().find(t => t.ticketNumber === ticket.ticketNumber));
  };

  const handleReopen = () => {
    updateTicket(ticket.ticketNumber, { status: 'In Progress' }, userEmail, 'Reporter reopened ticket');
    setTicket(TicketsStore.getAll().find(t => t.ticketNumber === ticket.ticketNumber));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{ticket.title}</h1>
          <p className="text-muted-foreground font-mono">{ticket.ticketNumber} • {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <Badge variant="outline">{ticket.type}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={ticket.priority} onValueChange={(v) => setTicket({ ...ticket!, priority: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {priorities.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={ticket.status} onValueChange={(v) => setTicket({ ...ticket!, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expected Completion</Label>
                <Input type="date" value={ticket.expectedCompletion || ''} onChange={(e) => setTicket({ ...ticket!, expectedCompletion: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Assignee (EmpID)</Label>
                <Input value={ticket.assigneeEmpID || ''} onChange={(e) => setTicket({ ...ticket!, assigneeEmpID: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Comment (optional)</Label>
              <Textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporter Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ticket.status === 'Resolved' ? (
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={handleAcceptResolution}>Accept Resolution (Close)</Button>
                <Button variant="outline" onClick={handleReopen}>Reopen Ticket</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Actions appear once the ticket is marked Resolved.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map(h => (
              <div key={h.id} className="p-3 rounded-md border">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{h.actionType}{h.field ? `: ${h.field}` : ''}</div>
                  <div className="text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</div>
                </div>
                {h.comment && <div className="text-sm mt-1">{h.comment}</div>}
                {(h.before !== undefined || h.after !== undefined) && (
                  <div className="text-xs text-muted-foreground mt-1">{String(h.before)} → {String(h.after)}</div>
                )}
                <div className="text-xs text-muted-foreground mt-1">by {h.userEmail}</div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center text-muted-foreground py-4">No history yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
