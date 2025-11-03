import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { propertyService } from '@/services/propertyService';
import { formatCurrency } from '@/utils/formatters';
import { ArrowLeft, TrendingUp } from 'lucide-react';

const SoldProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAll();
      const content = Array.isArray(data) ? data : data.content || [];
      const soldProperties = content.filter(
        (p: any) => p.ownerId === user?.id && p.status === 'for_sale'
      );
      setProperties(soldProperties);
    } catch (error) {
      console.error('Failed to load properties', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-foreground">Properties for Sale</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : properties.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No properties for sale</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{property.address}</p>
                  {property.salePrice && (
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(property.salePrice)}
                    </div>
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

export default SoldProperties;
