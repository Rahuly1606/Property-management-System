import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { maintenanceService } from '@/services/maintenanceService';
import { validateRequired } from '@/utils/validators';
import { Upload, X } from 'lucide-react';

interface MaintenanceRequestFormProps {
  propertyId: string;
  tenantId: string;
  landlordId: string;
  onSuccess: () => void;
}

export const MaintenanceRequestForm = ({ propertyId, tenantId, landlordId, onSuccess }: MaintenanceRequestFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [images, setImages] = useState<string[]>([]);
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
      await maintenanceService.create({
        ...formData,
        propertyId,
        tenantId,
        landlordId,
        images,
      });
      
      toast({ title: 'Maintenance request submitted successfully' });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Failed to submit request',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Leaking faucet"
        />
        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the issue in detail..."
          rows={4}
        />
        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Priority</label>
        <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Add Images (Optional)</label>
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
};
