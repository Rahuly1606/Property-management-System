import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { leaseService } from '@/services/leaseService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowLeft, FileText, Download } from 'lucide-react';

const MyLeases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeases();
  }, []);

  const loadLeases = async () => {
    setLoading(true);
    try {
      const data = await leaseService.getAll(user?.id);
      // Handle paginated responses
      const leasesArray = Array.isArray(data) ? data : data.content || [];
      setLeases(leasesArray);
    } catch (error) {
      console.error('Failed to load leases', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: any = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    terminated: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/tenant/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">My Leases</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : leases.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No leases yet</p>
            <Button onClick={() => navigate('/properties')}>Browse Properties</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {leases.map((lease) => (
              <Card key={lease.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">Lease #{lease.id}</h3>
                      <Badge className={statusColors[lease.status]}>
                        {lease.status}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="mb-1">
                          <span className="font-medium text-foreground">Start Date:</span> {formatDate(lease.startDate)}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">End Date:</span> {formatDate(lease.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1">
                          <span className="font-medium text-foreground">Monthly Rent:</span> {formatCurrency(lease.monthlyRent)}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Security Deposit:</span> {formatCurrency(lease.securityDeposit)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {lease.documentUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(lease.documentUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeases;
