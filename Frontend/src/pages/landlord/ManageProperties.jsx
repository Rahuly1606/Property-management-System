import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaEye, FaBuilding, FaBed, FaBath, FaRulerCombined, FaDollarSign, FaMapMarkerAlt, FaBug } from 'react-icons/fa';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';
import { toggleMockDataMode, isMockDataModeEnabled } from '../../utils/mockData';
import './ManageProperties.css';

const ManageProperties = () => {
  const { isLandlord, userRole, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mockModeEnabled, setMockModeEnabled] = useState(isMockDataModeEnabled());
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  useEffect(() => {
    // Debug logging to check auth state
    console.log('Auth state in ManageProperties:', {
      isLandlord: typeof isLandlord === 'function' ? isLandlord() : isLandlord,
      userRole,
      isLoggedIn: !!currentUser,
      userDetails: currentUser ? {
        id: currentUser.id,
        role: currentUser.role,
        email: currentUser.email
      } : null,
      token: localStorage.getItem('token') ? 'exists' : 'not found'
    });
    
    // Redirect if not a landlord
    const checkLandlordStatus = typeof isLandlord === 'function' ? isLandlord() : isLandlord;
    if (!checkLandlordStatus) {
      console.warn('User is not a landlord, redirecting to login');
      navigate('/login');
      return;
    }
    
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getMyProperties({
          page, 
          size
        });
        setProperties(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (err) {
        console.error('Error fetching properties:', err);
        if (err.response && err.response.status === 403) {
          setError('You do not have permission to access these properties. Please make sure you are logged in as a landlord.');
          // Redirect to login if not authenticated properly
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError('Failed to load your properties. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [isLandlord, navigate, page, size, refreshTrigger]);
  
  const handleToggleAvailability = async (propertyId) => {
    try {
      await propertyService.togglePropertyAvailability(propertyId);
      // Refresh the list
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error toggling property availability:', err);
      setError('Failed to update property availability. Please try again.');
    }
  };
  
  const handleToggleMockMode = () => {
    const isEnabled = toggleMockDataMode();
    setMockModeEnabled(isEnabled);
    
    // Reset error and reload data
    setError('');
    setRefreshTrigger(prev => prev + 1);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading && properties.length === 0) {
    return (
      <div className="manage-properties-container">
        <div className="loading-indicator">Loading your properties...</div>
      </div>
    );
  }
  
  return (
    <div className="manage-properties-container">
      <div className="manage-properties-header">
        <h1>Manage Your Properties</h1>
        <div className="flex gap-2">
          {isDevelopment && (
            <button 
              onClick={handleToggleMockMode} 
              className="debug-btn"
              title={mockModeEnabled ? "Mock Mode Enabled - Click to disable" : "Mock Mode Disabled - Click to enable"}
            >
              <FaBug className={mockModeEnabled ? "text-green-500" : "text-gray-400"} />
            </button>
          )}
          <Link to="/landlord/properties/add" className="add-property-btn">
            <FaPlus /> Add New Property
          </Link>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {properties.length === 0 ? (
        <div className="no-properties">
          <FaBuilding className="no-properties-icon" />
          <h2>No Properties Found</h2>
          <p>You haven't added any properties yet. Click the button above to add your first property.</p>
        </div>
      ) : (
        <>
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-card-header">
                  <h3>{property.title}</h3>
                  <div className="property-actions">
                    <button 
                      className="action-btn view" 
                      title="View Property Details"
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-btn edit" 
                      title="Edit Property"
                      onClick={() => navigate(`/landlord/properties/edit/${property.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={`action-btn toggle ${property.available ? 'active' : 'inactive'}`}
                      title={property.available ? 'Mark as Unavailable' : 'Mark as Available'}
                      onClick={() => handleToggleAvailability(property.id)}
                    >
                      {property.available ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                </div>
                
                <div className="property-card-image">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="property-image"
                    />
                  ) : (
                    <div className="property-image-placeholder">
                      <FaBuilding />
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="property-status">
                    <span className={`status-badge ${property.available ? 'available' : 'unavailable'}`}>
                      {property.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                
                <div className="property-card-body">
                  <div className="property-type">
                    <FaBuilding /> {property.propertyType.toLowerCase()}
                  </div>
                  
                  <div className="property-location">
                    <FaMapMarkerAlt /> {property.city}, {property.state}
                  </div>
                  
                  <div className="property-details">
                    {property.numberOfBedrooms && (
                      <span className="property-detail">
                        <FaBed /> {property.numberOfBedrooms} {property.numberOfBedrooms === 1 ? 'Bed' : 'Beds'}
                      </span>
                    )}
                    
                    {property.numberOfBathrooms && (
                      <span className="property-detail">
                        <FaBath /> {property.numberOfBathrooms} {property.numberOfBathrooms === 1 ? 'Bath' : 'Baths'}
                      </span>
                    )}
                    
                    {property.totalArea && (
                      <span className="property-detail">
                        <FaRulerCombined /> {property.totalArea} sq.ft
                      </span>
                    )}
                  </div>
                  
                  <div className="property-price">
                    <FaDollarSign /> {formatCurrency(property.monthlyRent)}/month
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={page === 0}
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {page + 1} of {totalPages}
              </span>
              
              <button 
                className="pagination-btn" 
                disabled={page >= totalPages - 1}
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageProperties; 