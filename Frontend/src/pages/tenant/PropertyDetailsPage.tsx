import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { propertyService } from '@/services/propertyService';
import { leaseService } from '@/services/leaseService';
import { propertyPurchaseService } from '@/services/propertyPurchaseService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Shield,
  Check,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLeaseDialog, setShowLeaseDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [leaseMonths, setLeaseMonths] = useState('12');
  const [purchaseOffer, setPurchaseOffer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    loadProperty();
  }, [id]);
  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getById(id!);
      setProperty(data);
    } catch (error) {
      toast({
        title: 'Failed to load property',
        variant: 'destructive',
      });
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };
  const handleRequestLease = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const months = parseInt(leaseMonths);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);
    const rent = property.monthlyRent || property.rent || 0;
    setSubmitting(true);
    try {
      await leaseService.create({
        propertyId: property.id,
        tenantId: user.id,
        landlordId: property.landlord?.id || property.ownerId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        monthlyRent: rent,
        securityDeposit: rent * 2,
        status: 'pending',
      });
      toast({ title: 'Lease request submitted successfully!' });
      setShowLeaseDialog(false);
      navigate('/tenant/leases');
    } catch (error) {
      toast({
        title: 'Failed to submit lease request',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleRequestPurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!purchaseOffer || parseFloat(purchaseOffer) <= 0) {
      toast({
        title: 'Please enter a valid offer amount',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      await propertyPurchaseService.create({
        propertyId: property.id,
        buyerId: user.id,
        offeredPrice: parseFloat(purchaseOffer),
        status: 'pending',
      });
      toast({ title: 'Purchase request submitted successfully!' });
      setShowPurchaseDialog(false);
      setPurchaseOffer('');
    } catch (error) {
      toast({
        title: 'Failed to submit purchase request',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!property) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'}
              alt={property.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {property.address}, {property.city}
              </div>
            </div>
            {property.available && <Badge variant="default">Available</Badge>}
          </div>
          <div className="flex gap-6 mb-6 pb-6 border-b">
            {property.numberOfBedrooms && (
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                <span>{property.numberOfBedrooms} Beds</span>
              </div>
            )}
            {property.numberOfBathrooms && (
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5" />
                <span>{property.numberOfBathrooms} Baths</span>
              </div>
            )}
            {property.totalArea && (
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5" />
                <span>{property.totalArea} sqft</span>
              </div>
            )}
          </div>
          {property.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          )}
        </div>
        <div>
          <Card className="p-6">
            <Tabs defaultValue="rent">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="rent">
                  <FileText className="h-4 w-4 mr-2" />
                  Rent
                </TabsTrigger>
                <TabsTrigger value="buy">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy
                </TabsTrigger>
              </TabsList>
              <TabsContent value="rent" className="space-y-4">
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-1">Monthly Rent</div>
                  <div className="text-4xl font-bold text-primary">
                    {formatCurrency(property.monthlyRent || 0)}
                  </div>
                </div>
                {property.available && user?.role === 'tenant' && (
                  <Button className="w-full" size="lg" onClick={() => setShowLeaseDialog(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Request Lease
                  </Button>
                )}
              </TabsContent>
              <TabsContent value="buy" className="space-y-4">
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-1">Sale Price</div>
                  <div className="text-4xl font-bold text-primary">
                    {formatCurrency(property.salePrice || 0)}
                  </div>
                </div>
                {property.available && property.salePrice && user && (
                  <Button className="w-full" size="lg" onClick={() => setShowPurchaseDialog(true)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Make an Offer
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      <Dialog open={showLeaseDialog} onOpenChange={setShowLeaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Lease</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              value={leaseMonths}
              onChange={(e) => setLeaseMonths(e.target.value)}
              min="1"
              max="36"
            />
            <Button className="w-full" onClick={handleRequestLease} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Lease Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Enter your offer"
              value={purchaseOffer}
              onChange={(e) => setPurchaseOffer(e.target.value)}
            />
            <Button className="w-full" onClick={handleRequestPurchase} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PropertyDetailsPage;
