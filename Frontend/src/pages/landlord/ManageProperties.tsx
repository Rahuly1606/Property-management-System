import { useEffect, useState } from 'react';
import { propertyService } from '@/services/propertyService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';

const ManageProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAll();
      const content = Array.isArray(data) ? data : data.content || [];
      setProperties(content.filter((p: any) => p.ownerId === user?.id));
    } catch (error) {
      console.error('Failed to load properties', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProperty(null);
    loadProperties();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/landlord/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-foreground">My Properties</h1>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No properties yet</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={editingProperty}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingProperty(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProperties;
