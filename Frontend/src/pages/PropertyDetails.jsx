import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaMapMarkerAlt, FaBuilding, FaBed, 
  FaBath, FaRulerCombined, FaDollarSign, FaCalendarAlt,
  FaList, FaEdit, FaToggleOn, FaToggleOff, FaShare
} from 'react-icons/fa';
import propertyService from '../services/propertyService';
import { useAuth } from '../contexts/AuthContext';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLandlord, isTenant, currentUser, getCurrentUser } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  
  // Either use getCurrentUser() function or the current user from context directly
  const user = getCurrentUser ? getCurrentUser() : currentUser;
  const isOwner = user && property?.landlordId === user.id;
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        console.log("Fetched property details:", data);
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  const handleToggleAvailability = async () => {
    try {
      await propertyService.togglePropertyAvailability(id);
      setProperty(prev => ({
        ...prev,
        available: !prev.available
      }));
    } catch (err) {
      console.error('Error toggling availability:', err);
      alert('Failed to update property availability. Please try again.');
    }
  };
  
  const handleEditProperty = () => {
    navigate(`/landlord/properties/edit/${id}`);
  };
  
  const handlePrevImage = () => {
    setCurrentImage(prev => 
      prev === 0 ? (property.images.length - 1) : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImage(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      setContactError('Please fill out all required fields.');
      return;
    }
    
    try {
      // In a real app, you would send this to your backend
      console.log('Contact form submitted:', contactFormData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContactSuccess(true);
      setContactError('');
      
      // Reset form after success
      setTimeout(() => {
        setShowContactForm(false);
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setContactSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setContactError('Failed to send your message. Please try again.');
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="property-details-container">
        <div className="loading-indicator">Loading property details...</div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="property-details-container">
        <div className="error-message">{error || 'Property not found'}</div>
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="property-details-container">
      <div className="property-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Properties
        </button>
        
        {isOwner && (
          <div className="landlord-actions">
            <button className="edit-button" onClick={handleEditProperty}>
              <FaEdit /> Edit Property
            </button>
            <button 
              className={`toggle-button ${property.available ? 'available' : 'unavailable'}`}
              onClick={handleToggleAvailability}
            >
              {property.available ? (
                <>
                  <FaToggleOn /> Available
                </>
              ) : (
                <>
                  <FaToggleOff /> Unavailable
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="property-details-content">
        <div className="property-gallery">
          {property.images && property.images.length > 0 ? (
            <>
              <div className="main-image-container">
                <img 
                  src={property.images[currentImage]} 
                  alt={`${property.title} - Image ${currentImage + 1}`} 
                  className="main-image"
                />
                {property.images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={handlePrevImage}>❮</button>
                    <button className="gallery-nav next" onClick={handleNextImage}>❯</button>
                  </>
                )}
              </div>
              
              {property.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {property.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                      onClick={() => setCurrentImage(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="placeholder-image">
              <FaBuilding />
              <p>No images available</p>
            </div>
          )}
        </div>
        
        <div className="property-info">
          <div className="property-title-section">
            <h1>{property.title}</h1>
            <div className="property-location">
              <FaMapMarkerAlt />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>
            
            <div className="property-price">
              <FaDollarSign />
              <span>{formatCurrency(property.monthlyRent)}/month</span>
            </div>
            
            {property.available ? (
              <div className="availability available">Available</div>
            ) : (
              <div className="availability unavailable">Not Available</div>
            )}
          </div>
          
          <div className="property-features">
            <div className="feature-section">
              <h2>Property Details</h2>
              <div className="features-grid">
                <div className="feature">
                  <FaBuilding />
                  <div>
                    <span className="feature-label">Type</span>
                    <span className="feature-value">
                      {property.propertyType.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                </div>
                
                {property.totalArea && (
                  <div className="feature">
                    <FaRulerCombined />
                    <div>
                      <span className="feature-label">Area</span>
                      <span className="feature-value">{property.totalArea} sq.ft</span>
                    </div>
                  </div>
                )}
                
                {property.numberOfBedrooms && (
                  <div className="feature">
                    <FaBed />
                    <div>
                      <span className="feature-label">Bedrooms</span>
                      <span className="feature-value">{property.numberOfBedrooms}</span>
                    </div>
                  </div>
                )}
                
                {property.numberOfBathrooms && (
                  <div className="feature">
                    <FaBath />
                    <div>
                      <span className="feature-label">Bathrooms</span>
                      <span className="feature-value">{property.numberOfBathrooms}</span>
                    </div>
                  </div>
                )}
                
                {property.securityDeposit && (
                  <div className="feature">
                    <FaDollarSign />
                    <div>
                      <span className="feature-label">Security Deposit</span>
                      <span className="feature-value">{formatCurrency(property.securityDeposit)}</span>
                    </div>
                  </div>
                )}
                
                {property.availableFrom && (
                  <div className="feature">
                    <FaCalendarAlt />
                    <div>
                      <span className="feature-label">Available From</span>
                      <span className="feature-value">
                        {new Date(property.availableFrom).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {property.amenities && property.amenities.length > 0 && (
              <div className="feature-section">
                <h2>Amenities</h2>
                <div className="amenities-list">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-tag">
                      <FaList />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="feature-section">
              <h2>Description</h2>
              <div className="property-description">
                <p>{property.description}</p>
              </div>
            </div>
          </div>
          
          {/* Contact Section - Show only for tenants or unauthenticated users when property is available */}
          {((typeof isTenant === 'boolean' && isTenant) || !user) && property.available && (
            <div className="contact-section">
              {showContactForm ? (
                <div className="contact-form-container">
                  {contactSuccess ? (
                    <div className="contact-success-message">
                      Your message has been sent successfully! The landlord will contact you soon.
                    </div>
                  ) : (
                    <form className="contact-form" onSubmit={handleContactSubmit}>
                      <h2>Contact Landlord</h2>
                      
                      {contactError && (
                        <div className="contact-error-message">{contactError}</div>
                      )}
                      
                      <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={contactFormData.name}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={contactFormData.email}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">Phone (optional)</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={contactFormData.phone}
                          onChange={handleContactFormChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="message">Message *</label>
                        <textarea
                          id="message"
                          name="message"
                          rows="4"
                          value={contactFormData.message}
                          onChange={handleContactFormChange}
                          placeholder="I'm interested in this property and would like to schedule a viewing..."
                          required
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="cancel-button"
                          onClick={() => setShowContactForm(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="submit-button"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="contact-buttons">
                  <button className="contact-button" onClick={() => setShowContactForm(true)}>
                    Contact Landlord
                  </button>
                  <button className="share-button">
                    <FaShare /> Share
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 