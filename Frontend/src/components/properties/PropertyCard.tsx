import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { BedDouble, Bath, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: any;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const statusColors: any = {
    available: 'bg-green-100 text-green-800 border-green-200',
    leased: 'bg-blue-100 text-blue-800 border-blue-200',
    for_sale: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
          alt={property.title || 'Property'}
          className="w-full h-48 object-cover"
        />
        {property.status && (
          <Badge className={`absolute top-3 right-3 ${statusColors[property.status] || ''}`}>
            {property.status.replace('_', ' ')}
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {property.address}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} Bath
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {property.sqft} sqft
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(property.monthlyRent || property.rent || 0)}/mo
          </span>
          <Button size="sm" onClick={() => navigate(`/properties/${property.id}`)}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
