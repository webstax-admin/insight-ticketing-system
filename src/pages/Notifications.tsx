import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Check, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Notifications() {
  const [notifications] = useState([
    { id: 1, title: "New ticket assigned", message: "TK-2024-001 has been assigned to you", time: "2 hours ago", read: false, type: "assignment" },
    { id: 2, title: "Ticket status updated", message: "TK-2024-002 status changed to In Progress", time: "4 hours ago", read: true, type: "status" },
    { id: 3, title: "Overdue ticket", message: "TK-2024-003 is past due date", time: "1 day ago", read: false, type: "overdue" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with ticket activities</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Recent Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-muted/30' : 'bg-background'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {notification.type === 'assignment' && <AlertCircle className="h-4 w-4 text-primary" />}
                  {notification.type === 'status' && <Check className="h-4 w-4 text-success" />}
                  {notification.type === 'overdue' && <Clock className="h-4 w-4 text-warning" />}
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.message}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}