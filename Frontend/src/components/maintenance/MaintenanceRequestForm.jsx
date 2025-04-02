import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import maintenanceService from '../../services/maintenanceService';
import propertyService from '../../services/propertyService';
import authService from '../../services/authService';
import leaseService from '../../services/leaseService';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const MaintenanceRequestForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyId: '',
    priority: 'MEDIUM'
  });
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const navigate = useNavigate();

  // Fetch tenant's property on mount
  useEffect(() => {
    const fetchTenantLease = async () => {
      setIsLoadingProperties(true);
      try {
        // Try to get tenant's active lease
        const leaseResponse = await leaseService.getTenantLease();
        if (leaseResponse && leaseResponse.property) {
          setProperties([leaseResponse.property]);
          setFormData(prev => ({
            ...prev,
            propertyId: leaseResponse.property.id
          }));
        } else {
          // Fallback to sample data if needed
          setProperties([
            { id: 1, name: 'Sample Property', address: '123 Main St' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching tenant lease', err);
        // Fallback to sample data
        setProperties([
          { id: 1, name: 'Sample Property', address: '123 Main St' }
        ]);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    if (authService.isTenant()) {
      fetchTenantLease();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 5); // Limit to 5 images
    
    setImages(newImages);
    
    // Generate preview URLs for the images
    const newImagePreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await maintenanceService.createMaintenanceRequest(formData, images);
      setSuccess('Maintenance request submitted successfully!');
      
      // Clear form
      setFormData({
        title: '',
        description: '',
        propertyId: formData.propertyId, // Keep the same property
        priority: 'MEDIUM'
      });
      setImages([]);
      setImagePreviewUrls([]);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/tenant/maintenance-requests');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to submit maintenance request. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Submit Maintenance Request
          </Typography>
          
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Broken sink faucet"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Please describe the issue in detail..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="property-label">Property</InputLabel>
                  <Select
                    labelId="property-label"
                    id="propertyId"
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleChange}
                    label="Property"
                    disabled={isLoadingProperties}
                  >
                    {isLoadingProperties ? (
                      <MenuItem value="">
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : (
                      properties.map(property => (
                        <MenuItem key={property.id} value={property.id}>
                          {property.name || property.address}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Images (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= 5}
                  />
                </Button>
                <Typography variant="caption" display="block" gutterBottom>
                  Max 5 images. Supported formats: JPG, PNG, GIF
                </Typography>
                
                {imagePreviewUrls.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                    {imagePreviewUrls.map((url, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          position: 'relative', 
                          width: 100, 
                          height: 100,
                          flexShrink: 0
                        }}
                      >
                        <img 
                          src={url} 
                          alt={`Preview ${index}`} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }} 
                        />
                        <IconButton
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: -10, 
                            right: -10,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'error.light', color: 'white' }
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || isLoadingProperties || !formData.propertyId}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Submit Request'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MaintenanceRequestForm; 