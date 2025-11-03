import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { leaseService } from '@/services/leaseService';
import { maintenanceService } from '@/services/maintenanceService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Home as HomeIcon, FileText, Wrench, CreditCard, User, LogOut } from 'lucide-react';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeLeases: 0,
    pendingMaintenance: 0,
    nextPaymentAmount: 0,
    nextPaymentDate: '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const leasesData = await leaseService.getAll(user?.id);
      const maintenanceData = await maintenanceService.getAll({ tenantId: user?.id });

      // Handle paginated responses
      const leases = Array.isArray(leasesData) ? leasesData : leasesData.content || [];
      const maintenance = Array.isArray(maintenanceData) ? maintenanceData : maintenanceData.content || [];

      const activeLeases = leases.filter((l: any) => l.status === 'active');
      const pendingMaintenance = maintenance.filter((m: any) => m.status === 'pending');

      setStats({
        activeLeases: activeLeases.length,
        pendingMaintenance: pendingMaintenance.length,
        nextPaymentAmount: activeLeases[0]?.monthlyRent || 0,
        nextPaymentDate: activeLeases[0] ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString() : '',
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  };

  const quickActions = [
    { label: 'Browse Properties', icon: HomeIcon, path: '/properties' },
    { label: 'My Leases', icon: FileText, path: '/tenant/leases' },
    { label: 'Payments', icon: CreditCard, path: '/tenant/payments' },
    { label: 'Maintenance', icon: Wrench, path: '/tenant/maintenance' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tenant Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary hover:border-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <Avatar className="h-full w-full">
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Active Leases</span>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.activeLeases}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Next Payment</span>
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.nextPaymentAmount)}</p>
            {stats.nextPaymentDate && (
              <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(stats.nextPaymentDate)}</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Pending Requests</span>
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.pendingMaintenance}</p>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Account Status</span>
            </div>
            <p className="text-xl font-bold text-primary">Active</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigate(action.path)}
            >
              <action.icon className="h-8 w-8" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
