import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { paymentService } from '@/services/paymentService';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowLeft, FileText } from 'lucide-react';

const TenantPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingPayment, setPayingPayment] = useState<any>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAll(user?.id);
      // Handle paginated responses
      const paymentsArray = Array.isArray(data) ? data : data.content || [];
      setPayments(paymentsArray);
    } catch (error) {
      console.error('Failed to load payments', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPayingPayment(null);
    loadPayments();
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
            <h1 className="text-2xl font-bold text-foreground">My Payments</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {payingPayment && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Make Payment</h2>
            <PaymentForm
              leaseId={payingPayment.leaseId}
              amount={payingPayment.amount}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : payments.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No payment history</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Payment History</h2>
            {payments.map((payment) => (
              <Card key={payment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        Rent Payment
                      </span>
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Amount: <span className="font-semibold text-foreground">{formatCurrency(payment.amount)}</span></p>
                      <p>Due Date: {formatDate(payment.dueDate)}</p>
                      {payment.paidDate && <p>Paid: {formatDate(payment.paidDate)}</p>}
                    </div>
                  </div>
                  {payment.status === 'pending' && (
                    <Button onClick={() => setPayingPayment(payment)}>
                      Pay Now
                    </Button>
                  )}
                  {payment.receiptUrl && (
                    <Button variant="outline" onClick={() => window.open(payment.receiptUrl, '_blank')}>
                      View Receipt
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

export default TenantPayments;
