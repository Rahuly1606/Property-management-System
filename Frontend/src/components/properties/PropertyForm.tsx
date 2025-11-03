import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { propertyService } from '@/services/propertyService';
import { validateRequired, validateNumber } from '@/utils/validators';
import { Upload, X } from 'lucide-react';

interface PropertyFormProps {
  property?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const PropertyForm = ({ property, onSuccess, onCancel }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    address: property?.address || '',
    city: property?.city || '',
    rent: property?.rent || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    sqft: property?.sqft || '',
    description: property?.description || '',
    status: property?.status || 'available',
  });
  const [images, setImages] = useState<string[]>(property?.images || []);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddImage = () => {
    if (imageUrl && imageUrl.trim()) {
      setImages(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: any = {};
    newErrors.title = validateRequired(formData.title, 'Title');
    newErrors.address = validateRequired(formData.address, 'Address');
    newErrors.city = validateRequired(formData.city, 'City');
    newErrors.rent = validateNumber(formData.rent, 'Rent');
    newErrors.bedrooms = validateNumber(formData.bedrooms, 'Bedrooms');
    newErrors.bathrooms = validateNumber(formData.bathrooms, 'Bathrooms');
    newErrors.sqft = validateNumber(formData.sqft, 'Square feet');
    newErrors.description = validateRequired(formData.description, 'Description');

    const hasErrors = Object.values(newErrors).some(error => error !== null);
    if (hasErrors) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
        images,
      };

      if (property) {
        await propertyService.update(property.id, data);
        toast({ title: 'Property updated successfully' });
      } else {
        await propertyService.create(data);
        toast({ title: 'Property created successfully' });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Operation failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Property Title</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Modern 2BHK Apartment"
          />
          {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Address</label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Full address"
          />
          {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <Input
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
          {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Monthly Rent (₹)</label>
          <Input
            type="number"
            value={formData.rent}
            onChange={(e) => handleChange('rent', e.target.value)}
            placeholder="35000"
          />
          {errors.rent && <p className="text-destructive text-sm mt-1">{errors.rent}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bedrooms</label>
          <Input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
            placeholder="2"
          />
          {errors.bedrooms && <p className="text-destructive text-sm mt-1">{errors.bedrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bathrooms</label>
          <Input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => handleChange('bathrooms', e.target.value)}
            placeholder="2"
          />
          {errors.bathrooms && <p className="text-destructive text-sm mt-1">{errors.bathrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Square Feet</label>
          <Input
            type="number"
            value={formData.sqft}
            onChange={(e) => handleChange('sqft', e.target.value)}
            placeholder="1200"
          />
          {errors.sqft && <p className="text-destructive text-sm mt-1">{errors.sqft}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="leased">Leased</SelectItem>
              <SelectItem value="for_sale">For Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the property..."
            rows={4}
          />
          {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Property Images</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            <Button type="button" onClick={handleAddImage} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img src={img} alt="" className="w-full h-24 object-cover rounded border border-border" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
};
