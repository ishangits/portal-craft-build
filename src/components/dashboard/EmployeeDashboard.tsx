import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Scan, 
  Package, 
  TruckIcon, 
  RotateCcw, 
  CheckCircle,
  Clock,
  Activity,
  Search,
  Plus
} from "lucide-react";

export function EmployeeDashboard() {
  const [scanValue, setScanValue] = useState("");
  const [lastScanned, setLastScanned] = useState<string[]>([
    "AWB123456789 - Inbound",
    "PKG987654321 - Packaging", 
    "RET456789123 - Return"
  ]);

  const handleScan = () => {
    if (scanValue.trim()) {
      const newScan = `${scanValue} - Scanned at ${new Date().toLocaleTimeString()}`;
      setLastScanned([newScan, ...lastScanned.slice(0, 9)]);
      setScanValue("");
    }
  };

  const todayStats = [
    { label: "Items Scanned", value: "67", icon: Scan },
    { label: "Inbound Processed", value: "23", icon: Package },
    { label: "Packages Ready", value: "18", icon: TruckIcon },
    { label: "Returns Handled", value: "6", icon: RotateCcw }
  ];

  const quickTasks = [
    { task: "Process inbound batch #1245", priority: "high", items: 12 },
    { task: "Package urgent shipments", priority: "high", items: 5 },
    { task: "Check return items quality", priority: "medium", items: 8 },
    { task: "Update stock levels", priority: "low", items: 15 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Employee Dashboard</h2>
          <p className="text-muted-foreground">Quick scanning and task management</p>
        </div>
        <Badge variant="outline" className="text-success border-success">
          <Activity className="mr-1 h-3 w-3" />
          Online
        </Badge>
      </div>

      {/* Quick Scanner */}
      <Card className="bg-gradient-primary text-white">
        <CardHeader>
          <CardTitle className="text-white">Quick Scanner</CardTitle>
          <CardDescription className="text-white/80">
            Scan AWB, SKU, or package labels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Scan or enter AWB/SKU number..."
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Button 
              onClick={handleScan}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Scan className="mr-2 h-4 w-4" />
              Scan
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Inbound
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Packaging
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Outbound
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Returns
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Today's total</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your last 10 scanning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lastScanned.map((scan, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">{scan}</span>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Tasks</CardTitle>
            <CardDescription>Tasks assigned to you for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    task.priority === 'high' ? 'bg-destructive' :
                    task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.items} items</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Start
                </Button>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <Button size="sm" variant="ghost" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common warehouse operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Inbound Scan</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Activity className="h-6 w-6" />
              <span className="text-sm">Package Item</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TruckIcon className="h-6 w-6" />
              <span className="text-sm">Outbound Prep</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <RotateCcw className="h-6 w-6" />
              <span className="text-sm">Process Return</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}