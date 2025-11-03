import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { maintenanceService } from '@/services/maintenanceService';
import { formatDateTime } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const ManageMaintenance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await maintenanceService.getAll();
      const requests = Array.isArray(data) ? data : data.content || [];
      setRequests(requests);
    } catch (error) {
      console.error('Failed to load requests', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      await maintenanceService.update(requestId, { status: newStatus });
      toast({ title: 'Status updated successfully' });
      loadRequests();
    } catch (error) {
      toast({
        title: 'Failed to update status',
        variant: 'destructive',
      });
    }
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/landlord/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Maintenance Requests</h1>
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
            <p className="text-muted-foreground text-lg">No maintenance requests</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className={`p-6 border-l-4 ${priorityColors[request.priority]}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{request.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[request.status]}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {request.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                    {request.images && request.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {request.images.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Created: {formatDateTime(request.createdAt)} • Updated: {formatDateTime(request.updatedAt)}
                    </div>
                  </div>
                  <div className="ml-4 min-w-[200px]">
                    <label className="block text-sm font-medium mb-2">Update Status</label>
                    <Select
                      value={request.status}
                      onValueChange={(value) => handleStatusChange(request.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMaintenance;
