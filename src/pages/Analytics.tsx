import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketsStore, type Ticket } from "@/lib/store";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const tickets = TicketsStore.getAll();

  const byStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1 });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const byPriority = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.filter(t => !selectedStatus || t.status === selectedStatus).forEach(t => {
      counts[t.priority] = (counts[t.priority] || 0) + 1
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets, selectedStatus]);

  const COLORS = ["hsl(var(--primary))","hsl(var(--warning))","hsl(var(--success))","hsl(var(--muted-foreground))"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Interactive charts. Click a bar to filter dependent charts.</p>
      </div>

      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="priority">Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Tickets by Status</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" onClick={(d: any) => setSelectedStatus(d?.activeLabel || null)} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tickets by Priority {selectedStatus ? `(Status: ${selectedStatus})` : ''}</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byPriority} dataKey="value" nameKey="name" outerRadius={100}>
                    {byPriority.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority">
          <Card>
            <CardHeader><CardTitle>All Tickets</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total: {tickets.length}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
