import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  TruckIcon, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Bell
} from "lucide-react";

const stockData = [
  { sku: "SKU001", product: "Wireless Headphones", current: 45, inbound: 12, outbound: 8, status: "normal" },
  { sku: "SKU002", product: "Phone Case", current: 23, inbound: 0, outbound: 15, status: "low" },
  { sku: "SKU003", product: "Charging Cable", current: 67, inbound: 20, outbound: 5, status: "normal" },
  { sku: "SKU004", product: "Screen Protector", current: 8, inbound: 5, outbound: 12, status: "critical" }
];

const recentAWBs = [
  { awb: "AWB123456789", date: "2024-01-15", status: "delivered", items: 5 },
  { awb: "AWB987654321", date: "2024-01-15", status: "in-transit", items: 3 },
  { awb: "AWB456789123", date: "2024-01-14", status: "delivered", items: 8 },
  { awb: "AWB789123456", date: "2024-01-14", status: "processing", items: 2 },
  { awb: "AWB321654987", date: "2024-01-13", status: "delivered", items: 6 }
];

const returns = [
  { awb: "RET001", reason: "Damaged in transit", date: "2024-01-15", status: "processing" },
  { awb: "RET002", reason: "Wrong item shipped", date: "2024-01-14", status: "resolved" },
  { awb: "RET003", reason: "Customer return", date: "2024-01-13", status: "resolved" }
];

export function VendorDashboard() {
  const totalStock = stockData.reduce((sum, item) => sum + item.current, 0);
  const lowStockCount = stockData.filter(item => item.status === 'low' || item.status === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Vendor Dashboard</h2>
          <p className="text-muted-foreground">TechCorp Electronics - Stock and shipment overview</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Units in warehouse</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Management */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
          <CardDescription>Current inventory levels and movement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">SKU</th>
                  <th className="text-left py-3">Product</th>
                  <th className="text-center py-3">Current Stock</th>
                  <th className="text-center py-3">Inbound</th>
                  <th className="text-center py-3">Outbound</th>
                  <th className="text-center py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">{item.sku}</td>
                    <td className="py-3">{item.product}</td>
                    <td className="text-center py-3 font-medium">{item.current}</td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-success">+{item.inbound}</Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-destructive">-{item.outbound}</Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge 
                        variant={
                          item.status === 'critical' ? 'destructive' :
                          item.status === 'low' ? 'secondary' : 'outline'
                        }
                        className={
                          item.status === 'normal' ? 'text-success border-success' : ''
                        }
                      >
                        {item.status === 'critical' ? 'Critical' :
                         item.status === 'low' ? 'Low Stock' : 'Normal'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AWBs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Your latest processed AWBs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAWBs.map((awb, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${
                      awb.status === 'delivered' ? 'bg-success' :
                      awb.status === 'in-transit' ? 'bg-primary' : 'bg-warning'
                    }`} />
                    <div>
                      <p className="font-medium">{awb.awb}</p>
                      <p className="text-sm text-muted-foreground">
                        {awb.items} items • {awb.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        awb.status === 'delivered' ? 'outline' :
                        awb.status === 'in-transit' ? 'default' : 'secondary'
                      }
                      className={
                        awb.status === 'delivered' ? 'text-success border-success' : ''
                      }
                    >
                      {awb.status === 'delivered' ? 'Delivered' :
                       awb.status === 'in-transit' ? 'In Transit' : 'Processing'}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Returns & Damages */}
        <Card>
          <CardHeader>
            <CardTitle>Returns & Damages</CardTitle>
            <CardDescription>Return requests and damage reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returns.map((returnItem, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className={`h-4 w-4 ${
                      returnItem.status === 'resolved' ? 'text-success' : 'text-warning'
                    }`} />
                    <div>
                      <p className="font-medium">{returnItem.awb}</p>
                      <p className="text-sm text-muted-foreground">{returnItem.reason}</p>
                      <p className="text-xs text-muted-foreground">{returnItem.date}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={returnItem.status === 'resolved' ? 'outline' : 'secondary'}
                    className={returnItem.status === 'resolved' ? 'text-success border-success' : ''}
                  >
                    {returnItem.status === 'resolved' ? 'Resolved' : 'Processing'}
                  </Badge>
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Resolution Rate</span>
                  <span className="text-success font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}