import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="h-24 w-24 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <Button onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
