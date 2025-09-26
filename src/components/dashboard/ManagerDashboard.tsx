import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  TruckIcon, 
  RotateCcw, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Users,
  BarChart3,
  Download
} from "lucide-react";

const todayStats = [
  { label: "Inbound Packages", value: "24", icon: Package, status: "normal" },
  { label: "Outbound Shipments", value: "18", icon: TruckIcon, status: "normal" },
  { label: "Returns Processed", value: "6", icon: RotateCcw, status: "normal" },
  { label: "Pending Tasks", value: "3", icon: Clock, status: "warning" }
];

const employeeActivity = [
  { name: "John Scanner", task: "Inbound Scanning", items: 45, status: "active" },
  { name: "Sarah Packer", task: "Packaging", items: 23, status: "active" },
  { name: "Mike Returns", task: "Returns Processing", items: 12, status: "break" },
  { name: "Lisa Dispatch", task: "Outbound Prep", items: 67, status: "active" }
];

const vendorSummary = [
  { name: "TechCorp Electronics", inbound: 15, outbound: 12, stock: 156 },
  { name: "Fashion Forward", inbound: 8, outbound: 6, stock: 89 },
  { name: "Home Essentials", inbound: 12, outbound: 15, stock: 234 },
  { name: "Sports Gear Pro", inbound: 5, outbound: 3, stock: 67 }
];

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manager Dashboard</h2>
          <p className="text-muted-foreground">Daily operations overview and workforce management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Detailed Analytics
          </Button>
        </div>
      </div>

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${
                stat.status === 'warning' ? 'text-warning' : 'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant={stat.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs mt-1">
                Today
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Activity</CardTitle>
            <CardDescription>Real-time workforce status and productivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employeeActivity.map((employee, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    employee.status === 'active' ? 'bg-success' : 
                    employee.status === 'break' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.task}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{employee.items}</p>
                  <p className="text-xs text-muted-foreground">items</p>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Overall Productivity</span>
                <span className="text-success font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Process Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Process Flow</CardTitle>
            <CardDescription>Current operational pipeline status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">Inbound Queue</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">12 pending</Badge>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-accent" />
                <span className="font-medium">Packaging</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">8 in progress</Badge>
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TruckIcon className="h-4 w-4 text-success" />
                <span className="font-medium">Outbound</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">15 ready</Badge>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-destructive" />
                <span className="font-medium">Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">3 urgent</Badge>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Activity Summary</CardTitle>
          <CardDescription>Today's vendor-wise operations overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Vendor</th>
                  <th className="text-center py-2">Inbound</th>
                  <th className="text-center py-2">Outbound</th>
                  <th className="text-center py-2">Current Stock</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendorSummary.map((vendor, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">{vendor.name}</td>
                    <td className="text-center">
                      <Badge variant="outline">{vendor.inbound}</Badge>
                    </td>
                    <td className="text-center">
                      <Badge variant="outline">{vendor.outbound}</Badge>
                    </td>
                    <td className="text-center font-medium">{vendor.stock}</td>
                    <td className="text-center">
                      <Badge variant="secondary" className="text-success">
                        Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}