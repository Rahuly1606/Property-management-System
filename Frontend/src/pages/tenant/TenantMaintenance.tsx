import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { maintenanceService } from '@/services/maintenanceService';
import { leaseService } from '@/services/leaseService';
import { MaintenanceRequestForm } from '@/components/maintenance/MaintenanceRequestForm';
import { formatDateTime } from '@/utils/formatters';
import { ArrowLeft, Plus, Wrench } from 'lucide-react';

const TenantMaintenance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [activeLeases, setActiveLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [maintenanceResponse, leasesResponse] = await Promise.all([
        maintenanceService.getAll({ tenantId: user?.id }),
        leaseService.getAll(user?.id),
      ]);

      // Handle paginated responses
      const maintenanceData = Array.isArray(maintenanceResponse) ? maintenanceResponse : maintenanceResponse.content || [];
      const leasesData = Array.isArray(leasesResponse) ? leasesResponse : leasesResponse.content || [];

      setRequests(maintenanceData);
      setActiveLeases(leasesData.filter((l: any) => l.status === 'active'));
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    loadData();
  };

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
  };

  const priorityColors: any = {
    low: 'border-gray-300',
    medium: 'border-orange-300',
    high: 'border-red-300',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/tenant/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Maintenance Requests</h1>
            </div>
            {activeLeases.length > 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No maintenance requests yet</p>
            {activeLeases.length > 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className={`p-6 border-l-4 ${priorityColors[request.priority]}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{request.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[request.status]}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {request.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                </div>
                {request.images && request.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {request.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Created: {formatDateTime(request.createdAt)} • Updated: {formatDateTime(request.updatedAt)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Maintenance Request</DialogTitle>
          </DialogHeader>
          {activeLeases.length > 0 && (
            <MaintenanceRequestForm
              propertyId={activeLeases[0].propertyId}
              tenantId={user!.id}
              landlordId={activeLeases[0].landlordId}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantMaintenance;
