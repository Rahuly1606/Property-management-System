import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { paymentService } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  leaseId: string;
  amount: number;
  onSuccess: () => void;
}

export const PaymentForm = ({ leaseId, amount, onSuccess }: PaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Mock Razorpay integration
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
      
      if (!razorpayKey) {
        // Mock success if no Razorpay key
        await new Promise(resolve => setTimeout(resolve, 1000));
        await paymentService.create({
          leaseId,
          amount,
          paidDate: new Date().toISOString(),
        });
        
        toast({ title: 'Payment successful (mock)!' });
        onSuccess();
        return;
      }

      // Real Razorpay flow would go here
      toast({ title: 'Payment processing...' });
      
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Payment Amount</h3>
          <p className="text-3xl font-bold text-primary">{formatCurrency(amount)}</p>
        </div>
        <CreditCard className="h-12 w-12 text-primary" />
      </div>
      
      <Button 
        className="w-full" 
        size="lg" 
        onClick={handlePayment} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        Payments are processed securely through Razorpay
      </p>
    </Card>
  );
};
