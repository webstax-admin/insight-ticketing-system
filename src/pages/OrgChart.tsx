import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building } from "lucide-react";

export default function OrgChart() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">IT Organization Chart</h1>
        <p className="text-muted-foreground">View IT department structure</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>IT Department</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>IT Director - John Smith (EMP001)</span>
              </div>
              <div className="ml-6 mt-2 space-y-2">
                <div>Network Team - Jane Doe (EMP002)</div>
                <div>Software Team - Mike Johnson (EMP003)</div>
                <div>Security Team - Sarah Wilson (EMP004)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}