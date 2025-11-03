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
import { propertyService } from '@/services/propertyService';
import { leaseService } from '@/services/leaseService';
import { maintenanceService } from '@/services/maintenanceService';
import { formatCurrency } from '@/utils/formatters';
import { Home as HomeIcon, FileText, Wrench, TrendingUp, User, LogOut } from 'lucide-react';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    activeLeases: 0,
    pendingMaintenance: 0,
    monthlyIncome: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const propertiesData = await propertyService.getAll();
      const properties = Array.isArray(propertiesData) ? propertiesData : propertiesData.content || [];
      const myProperties = properties.filter((p: any) => p.ownerId === user?.id);
      const available = myProperties.filter((p: any) => p.status === 'available');

      const leasesData = await leaseService.getAll();
      const leases = Array.isArray(leasesData) ? leasesData : leasesData.content || [];
      // No need to filter by landlordId - the backend endpoint already does this
      const activeLeases = leases.filter((l: any) => l.status === 'active');

      const maintenanceData = await maintenanceService.getAll();
      const maintenance = Array.isArray(maintenanceData) ? maintenanceData : maintenanceData.content || [];
      const pendingMaintenance = maintenance.filter((m: any) => m.status === 'pending');

      const monthlyIncome = activeLeases.reduce((sum: number, lease: any) => sum + (lease.monthlyRent || 0), 0);

      setStats({
        totalProperties: myProperties.length,
        availableProperties: available.length,
        activeLeases: activeLeases.length,
        pendingMaintenance: pendingMaintenance.length,
        monthlyIncome,
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  };

  const quickActions = [
    { label: 'Manage Properties', icon: HomeIcon, path: '/landlord/properties' },
    { label: 'View Leases', icon: FileText, path: '/landlord/leases' },
    { label: 'Maintenance Requests', icon: Wrench, path: '/landlord/maintenance' },
    { label: 'Sold Properties', icon: TrendingUp, path: '/landlord/sold-properties' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Landlord Dashboard</h1>
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
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Properties</span>
              <HomeIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalProperties}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Available</span>
              <HomeIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.availableProperties}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Active Leases</span>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.activeLeases}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Pending Requests</span>
              <Wrench className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.pendingMaintenance}</p>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Monthly Income</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{formatCurrency(stats.monthlyIncome)}</p>
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

export default LandlordDashboard;
