import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Package, 
  TruckIcon, 
  RotateCcw, 
  Plus, 
  Eye,
  Activity,
  BarChart3,
  Settings
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "24", icon: Users, change: "+3 this month" },
  { label: "Active Vendors", value: "8", icon: Package, change: "+2 this week" },
  { label: "Employees", value: "12", icon: Users, change: "No change" },
  { label: "Daily Transactions", value: "156", icon: Activity, change: "+12% today" }
];

const recentActivities = [
  { user: "John Manager", action: "Created employee account", time: "2 min ago", type: "user" },
  { user: "Sarah Admin", action: "Updated vendor permissions", time: "15 min ago", type: "vendor" },
  { user: "Mike Employee", action: "Processed 45 AWBs", time: "1 hour ago", type: "process" },
  { user: "System", action: "Daily backup completed", time: "2 hours ago", type: "system" }
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Complete system overview and management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all system users and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Managers</p>
                  <p className="text-sm text-muted-foreground">3 active</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Employees</p>
                  <p className="text-sm text-muted-foreground">12 active</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Vendors</p>
                  <p className="text-sm text-muted-foreground">8 active</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Database Performance</span>
                <span className="text-success font-medium">97%</span>
              </div>
              <Progress value={97} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span className="text-success font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span className="text-warning font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div className="pt-2">
              <Badge variant="outline" className="text-success border-success">
                All Systems Operational
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest system activities and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'user' ? 'bg-primary' :
                    activity.type === 'vendor' ? 'bg-accent' :
                    activity.type === 'process' ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}