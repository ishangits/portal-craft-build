import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, LogOut, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userRole: 'admin' | 'manager' | 'employee' | 'vendor';
  userName: string;
  onRoleChange: (role: 'admin' | 'manager' | 'employee' | 'vendor') => void;
}

export function Header({ userRole, userName, onRoleChange }: HeaderProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'employee': return 'secondary';
      case 'vendor': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Optima WMS</h1>
              <p className="text-sm text-muted-foreground">Warehouse Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{userName}</span>
                  <Badge variant={getRoleBadgeVariant(userRole)} className="text-xs">
                    {userRole.toUpperCase()}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(['admin', 'manager', 'employee', 'vendor'] as const).map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={userRole === role ? 'bg-accent/10' : ''}
                >
                  <Badge variant={getRoleBadgeVariant(role)} className="mr-2 text-xs">
                    {role.toUpperCase()}
                  </Badge>
                  {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}