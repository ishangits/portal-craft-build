import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";
import { VendorDashboard } from "@/components/dashboard/VendorDashboard";

type UserRole = 'admin' | 'manager' | 'employee' | 'vendor';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Sarah Admin';
      case 'manager': return 'John Manager';
      case 'employee': return 'Mike Employee';
      case 'vendor': return 'TechCorp Rep';
      default: return 'User';
    }
  };

  const renderDashboard = () => {
    switch (currentRole) {
      case 'admin': return <AdminDashboard />;
      case 'manager': return <ManagerDashboard />;
      case 'employee': return <EmployeeDashboard />;
      case 'vendor': return <VendorDashboard />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={currentRole}
        userName={getRoleDisplayName(currentRole)}
        onRoleChange={setCurrentRole}
      />
      <main className="container mx-auto px-6 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;
