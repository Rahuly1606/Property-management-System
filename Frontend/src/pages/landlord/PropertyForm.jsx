import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaBuilding, FaHome, FaMapMarkerAlt, FaRulerCombined, 
  FaBed, FaBath, FaDollarSign, FaCalendarAlt, FaList,
  FaSave, FaTimes, FaCamera, FaUpload, FaTrash, FaBug
} from 'react-icons/fa';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';
import { enableMockDataMode } from '../../utils/mockData';
import './PropertyForm.css';

const PropertyForm = () => {
  const { isLandlord } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [property, setProperty] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    propertyType: '',
    totalArea: '',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    monthlyRent: '',
    securityDeposit: '',
    availableFrom: '',
    available: true,
    active: true,
    amenities: [],
    images: []
  });
  
  const [newAmenity, setNewAmenity] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
  useEffect(() => {
    // Redirect if not a landlord
    const checkLandlordStatus = typeof isLandlord === 'function' ? isLandlord() : isLandlord;
    if (!checkLandlordStatus) {
      navigate('/login');
      return;
    }
    
    // If editing, fetch the property
    const fetchProperty = async () => {
      if (isEditing) {
        try {
          setLoadingProperty(true);
          console.log(`Fetching property with ID: ${id}`);
          const data = await propertyService.getPropertyById(id);
          
          if (!data) {
            throw new Error('No property data returned from API');
          }
          
          console.log('Property data received:', data);
          setProperty({
            ...data,
            title: data.title || '',
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            propertyType: data.propertyType || '',
            availableFrom: data.availableFrom ? data.availableFrom.substring(0, 10) : '',
            totalArea: data.totalArea || '',
            numberOfBedrooms: data.numberOfBedrooms || '',
            numberOfBathrooms: data.numberOfBathrooms || '',
            securityDeposit: data.securityDeposit || '',
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            images: Array.isArray(data.images) ? data.images : []
          });
        } catch (err) {
          console.error('Error fetching property:', err);
          setError('Failed to load property. ' + (err.message || 'Please try again or enable mock mode for testing.'));
          
          // If in development mode, suggest enabling mock mode
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          if (isDevelopment) {
            console.log('Development mode detected. You can enable mock mode to test the form.');
          }
        } finally {
          setLoadingProperty(false);
        }
      }
    };
    
    fetchProperty();
  }, [id, isEditing, isLandlord, navigate]);
  
  const propertyTypes = propertyService.getPropertyTypes();
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string or numeric values
    if (value === '' || !isNaN(value)) {
      setProperty(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAmenityAdd = (e) => {
    e.preventDefault();
    if (newAmenity.trim()) {
      setProperty(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };
  
  const handleAmenityRemove = (index) => {
    setProperty(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };
  
  // Image handling
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (jpeg, png, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(`Image size should be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }
    
    try {
      setImageUploading(true);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process the image');
      setImageUploading(false);
    }
  };
  
  const handleImageUpload = async () => {
    if (!imagePreview) return;
    
    try {
      setImageUploading(true);
      setError('');
      
      // Upload the image
      const imageUrl = await propertyService.uploadPropertyImage(imagePreview);
      
      // Add to images array
      setProperty(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      
      // Reset preview
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };
  
  const handleImageRemove = (index) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleCancelImagePreview = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const validateForm = () => {
    if (!property.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!property.description.trim()) {
      setError('Description is required');
      return false;
    }
    
    if (!property.address.trim() || !property.city.trim() || !property.state.trim()) {
      setError('Address, city, and state are required');
      return false;
    }
    
    if (!property.propertyType) {
      setError('Property type is required');
      return false;
    }
    
    if (!property.monthlyRent) {
      setError('Monthly rent is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Convert numeric fields to numbers
      const propertyData = {
        ...property,
        totalArea: property.totalArea ? parseFloat(property.totalArea) : null,
        numberOfBedrooms: property.numberOfBedrooms ? parseInt(property.numberOfBedrooms, 10) : null,
        numberOfBathrooms: property.numberOfBathrooms ? parseInt(property.numberOfBathrooms, 10) : null,
        monthlyRent: parseFloat(property.monthlyRent),
        securityDeposit: property.securityDeposit ? parseFloat(property.securityDeposit) : null,
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        images: Array.isArray(property.images) ? property.images : []
      };
      
      console.log('Submitting property data:', propertyData);
      
      let response;
      if (isEditing) {
        response = await propertyService.updateProperty(id, propertyData);
        setSuccess('Property updated successfully!');
      } else {
        response = await propertyService.createProperty(propertyData);
        setSuccess('Property created successfully!');
      }
      
      // Wait a moment to show success message then redirect
      setTimeout(() => {
        navigate('/landlord/properties');
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting property:', err);
      setError(err.response?.data?.message || 'Failed to save property. Please check your internet connection and try again.');
      
      // If in development mode, enable mock mode to help testing
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment && err.response?.status === 403) {
        setError('Permission denied. You may want to enable mock mode for testing this functionality.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingProperty) {
    return (
      <div className="property-form-container">
        <div className="loading-indicator">Loading property data...</div>
      </div>
    );
  }
  
  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Function to enable mock mode
  const enableMockMode = () => {
    enableMockDataMode();
    window.location.reload();
  };
  
  return (
    <div className="property-form-container">
      <div className="property-form-header">
        <h1>{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
        {isDevelopment && (
          <div className="controls">
            <button
              onClick={enableMockMode}
              className="debug-btn"
              title="Enable Mock Mode for Testing"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: '1px dashed #ccc',
                borderRadius: '50%',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              <FaBug style={{ color: localStorage.getItem('MOCK_API') === 'true' ? '#4CAF50' : '#ccc' }} />
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {isDevelopment && (
            <button 
              onClick={enableMockMode} 
              className="mock-mode-btn"
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Enable Mock Mode for Testing
            </button>
          )}
        </div>
      )}
      {success && <div className="success-message">{success}</div>}
      
      <form className="property-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2><FaHome /> Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">
              Property Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={property.title}
              onChange={handleInputChange}
              placeholder="e.g., Cozy 2-Bedroom Apartment in Downtown"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={property.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of your property"
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="propertyType">
              Property Type <span className="required">*</span>
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={property.propertyType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select property type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ').toLowerCase()}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h2><FaMapMarkerAlt /> Location</h2>
          
          <div className="form-group">
            <label htmlFor="address">
              Address <span className="required">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={property.address}
              onChange={handleInputChange}
              placeholder="Street address"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={property.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={property.state}
                onChange={handleInputChange}
                placeholder="State"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2><FaRulerCombined /> Property Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalArea">
                Total Area (sq.ft)
              </label>
              <input
                id="totalArea"
                name="totalArea"
                type="text"
                value={property.totalArea}
                onChange={handleNumberInputChange}
                placeholder="e.g., 1200"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="numberOfBedrooms">
                Bedrooms
              </label>
              <input
                id="numberOfBedrooms"
                name="numberOfBedrooms"
                type="text"
                value={property.numberOfBedrooms}
                onChange={handleNumberInputChange}
                placeholder="e.g., 2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="numberOfBathrooms">
                Bathrooms
              </label>
              <input
                id="numberOfBathrooms"
                name="numberOfBathrooms"
                type="text"
                value={property.numberOfBathrooms}
                onChange={handleNumberInputChange}
                placeholder="e.g., 1.5"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2><FaDollarSign /> Pricing & Availability</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monthlyRent">
                Monthly Rent <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaDollarSign className="input-icon" />
                <input
                  id="monthlyRent"
                  name="monthlyRent"
                  type="text"
                  value={property.monthlyRent}
                  onChange={handleNumberInputChange}
                  placeholder="e.g., 1500"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="securityDeposit">
                Security Deposit
              </label>
              <div className="input-with-icon">
                <FaDollarSign className="input-icon" />
                <input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="text"
                  value={property.securityDeposit}
                  onChange={handleNumberInputChange}
                  placeholder="e.g., 1500"
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="availableFrom">
                Available From
              </label>
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  id="availableFrom"
                  name="availableFrom"
                  type="date"
                  value={property.availableFrom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  id="available"
                  name="available"
                  type="checkbox"
                  checked={property.available}
                  onChange={handleInputChange}
                />
                <label htmlFor="available">Available for rent</label>
              </div>
              
              <div className="checkbox-container">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={property.active}
                  onChange={handleInputChange}
                />
                <label htmlFor="active">Active listing</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2><FaList /> Amenities</h2>
          
          <div className="amenities-input">
            <div className="form-row">
              <div className="form-group amenity-add-group">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  placeholder="e.g., Swimming Pool"
                />
                <button
                  type="button"
                  className="amenity-add-btn"
                  onClick={handleAmenityAdd}
                  disabled={!newAmenity.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          {(property.amenities && property.amenities.length > 0) && (
            <div className="amenities-list">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span>{amenity}</span>
                  <button
                    type="button"
                    className="amenity-remove-btn"
                    onClick={() => handleAmenityRemove(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-section">
          <h2><FaCamera /> Property Images</h2>
          
          <div className="images-container">
            <div className="property-images">
              {property.images && property.images.map((image, index) => (
                <div key={index} className="property-image-item">
                  <img src={image} alt={`Property ${index + 1}`} />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => handleImageRemove(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="image-upload-section">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <div className="image-preview-actions">
                    <button
                      type="button"
                      className="image-action-btn upload"
                      onClick={handleImageUpload}
                      disabled={imageUploading}
                    >
                      <FaUpload /> {imageUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      type="button"
                      className="image-action-btn cancel"
                      onClick={handleCancelImagePreview}
                      disabled={imageUploading}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="image-upload-placeholder" onClick={handleImageClick}>
                  <FaCamera className="upload-icon" />
                  <p>Click to add an image</p>
                  <span className="upload-hint">Max size: 5MB</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/landlord/properties')}
            disabled={loading}
          >
            <FaTimes /> Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={loading}
          >
            <FaSave /> {loading ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm; 