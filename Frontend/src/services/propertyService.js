import { axiosInstance } from './authService';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api';

// Response interceptor to handle errors (additional to the ones in authService)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        console.error('Property service: Access forbidden. You may not have the right permissions or your session has expired.');
        console.error('Request URL:', error.config.url);
        console.error('Request method:', error.config.method);
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found. User may need to log in again.');
        } else {
          console.error('Token exists but access was denied. You may not have the right permissions.');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to sanitize deeply nested objects
const sanitizePropertyData = (data) => {
  // If it's already a proper object, just ensure fields are present
  if (typeof data === 'object' && data !== null) {
    return {
      ...data,
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      images: Array.isArray(data.images) ? data.images : []
    };
  }
  
  // If it's a string that looks like a circular object reference
  if (typeof data === 'string' && data.includes('landlord') && data.includes('properties')) {
    try {
      // Extract essential data using regex
      const titleMatch = data.match(/"title":"([^"]+)"/);
      const descriptionMatch = data.match(/"description":"([^"]+)"/);
      const addressMatch = data.match(/"address":"([^"]+)"/);
      const cityMatch = data.match(/"city":"([^"]+)"/);
      const stateMatch = data.match(/"state":"([^"]+)"/);
      const propertyTypeMatch = data.match(/"propertyType":"([^"]+)"/);
      const totalAreaMatch = data.match(/"totalArea":([^,}]+)/);
      const bedroomsMatch = data.match(/"numberOfBedrooms":([^,}]+)/);
      const bathroomsMatch = data.match(/"numberOfBathrooms":([^,}]+)/);
      const rentMatch = data.match(/"monthlyRent":([^,}]+)/);
      const depositMatch = data.match(/"securityDeposit":([^,}]+)/);
      const availableFromMatch = data.match(/"availableFrom":"([^"]+)"/);
      const availableMatch = data.match(/"available":(true|false)/);
      const idMatch = data.match(/"id":([^,}]+)/);
      
      return {
        id: idMatch ? idMatch[1] : '0',
        title: titleMatch ? titleMatch[1] : '',
        description: descriptionMatch ? descriptionMatch[1] : '',
        address: addressMatch ? addressMatch[1] : '',
        city: cityMatch ? cityMatch[1] : '',
        state: stateMatch ? stateMatch[1] : '',
        propertyType: propertyTypeMatch ? propertyTypeMatch[1] : '',
        totalArea: totalAreaMatch ? parseFloat(totalAreaMatch[1]) : 0,
        numberOfBedrooms: bedroomsMatch ? parseInt(bedroomsMatch[1]) : 0,
        numberOfBathrooms: bathroomsMatch ? parseInt(bathroomsMatch[1]) : 0,
        monthlyRent: rentMatch ? parseFloat(rentMatch[1]) : 0,
        securityDeposit: depositMatch ? parseFloat(depositMatch[1]) : 0,
        availableFrom: availableFromMatch ? availableFromMatch[1] : '',
        available: availableMatch ? availableMatch[1] === 'true' : true,
        amenities: [],
        images: []
      };
    } catch (error) {
      console.error('Error extracting property data from string:', error);
      return {
        title: 'Data parsing error',
        description: 'Could not parse property data',
        amenities: [],
        images: []
      };
    }
  }
  
  // Default fallback
  return {
    title: 'Unknown property',
    description: 'No description available',
    amenities: [],
    images: []
  };
};

const propertyService = {
  // Get all available properties (for tenants)
  getAllAvailableProperties: async (params = {}) => {
    try {
      const { page = 0, size = 10, search = '', sortBy = 'monthlyRent', sortDirection = 'asc', ...filters } = params;
      
      // For development testing - return mock data if MOCK_API is set in localStorage
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment && localStorage.getItem('MOCK_API') === 'true') {
        console.log('Using mock data for getAllAvailableProperties');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock property data
        const mockProperties = [
          {
            id: 1,
            title: 'Luxury Apartment Downtown',
            description: 'A beautiful luxury apartment with amazing city views',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            propertyType: 'APARTMENT',
            totalArea: 1200,
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            monthlyRent: 2500,
            securityDeposit: 2500,
            availableFrom: '2023-07-01',
            available: true,
            images: ['https://via.placeholder.com/800x600'],
            amenities: ['Central AC', 'In-unit Laundry', 'Gym'],
            landlord: {
              id: 1,
              firstName: 'John',
              lastName: 'Doe'
            }
          },
          {
            id: 2,
            title: 'Modern Condo with View',
            description: 'Beautiful modern condo with park views',
            address: '456 Park Ave',
            city: 'Chicago',
            state: 'IL',
            propertyType: 'CONDO',
            totalArea: 950,
            numberOfBedrooms: 1,
            numberOfBathrooms: 1,
            monthlyRent: 1800,
            securityDeposit: 1800,
            availableFrom: '2023-06-15',
            available: true,
            images: ['https://via.placeholder.com/800x600'],
            amenities: ['Balcony', 'Pool', 'Parking'],
            landlord: {
              id: 2,
              firstName: 'Jane',
              lastName: 'Smith'
            }
          },
          {
            id: 3,
            title: 'Cozy Studio in Downtown',
            description: 'Perfect studio apartment for singles or couples',
            address: '789 Broadway',
            city: 'Los Angeles',
            state: 'CA',
            propertyType: 'STUDIO',
            totalArea: 550,
            numberOfBedrooms: 0,
            numberOfBathrooms: 1,
            monthlyRent: 1400,
            securityDeposit: 1400,
            availableFrom: '2023-06-01',
            available: true,
            images: ['https://via.placeholder.com/800x600'],
            amenities: ['Pet Friendly', 'Dishwasher', 'Fitness Center'],
            landlord: {
              id: 1,
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        ];
        
        return {
          content: mockProperties,
          totalPages: 1,
          totalElements: mockProperties.length,
          size: size,
          number: page
        };
      }
      
      let queryParams = new URLSearchParams({
        page,
        size,
        sortBy,
        sortDirection
      });
      
      if (search) {
        queryParams.append('search', search);
      }
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await axiosInstance.get(`/properties/available?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available properties:', error);
      throw error;
    }
  },

  // Get properties owned by the logged-in landlord
  getMyProperties: async (params = {}) => {
    try {
      const { page = 0, size = 10, ...filters } = params;
      
      let queryParams = new URLSearchParams({
        page,
        size
      });
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await axiosInstance.get(`/properties/landlord?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
      throw error;
    }
  },

  // Get a single property by ID
  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/properties/${id}`);
      
      // Use our sanitization helper to handle any data format issues
      const processedData = sanitizePropertyData(response.data);
      console.log('Processed property data:', processedData);
      
      return processedData;
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new property (for landlords)
  createProperty: async (propertyData) => {
    try {
      console.log('Creating property with data:', propertyData);
      const response = await axiosInstance.post(`/properties/create`, propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update an existing property (for landlords)
  updateProperty: async (id, propertyData) => {
    try {
      console.log(`Updating property ${id} with data:`, propertyData);
      
      // Check if propertyData is FormData or a regular object
      if (propertyData instanceof FormData) {
        // Handle multipart form data for image uploads
        const response = await axiosInstance.put(`/properties/${id}`, propertyData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Regular JSON update
        const response = await axiosInstance.put(`/properties/${id}`, propertyData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Upload images for a property
  uploadPropertyImages: async (id, images) => {
    try {
      const formData = new FormData();
      
      // Add all images to form data
      if (Array.isArray(images)) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      } else {
        formData.append('images', images);
      }
      
      const response = await axiosInstance.post(`/properties/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading images for property with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a property image
  deletePropertyImage: async (propertyId, imageIndex) => {
    try {
      const response = await axiosInstance.delete(`/properties/${propertyId}/images/${imageIndex}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting image for property ${propertyId}:`, error);
      throw error;
    }
  },

  // Toggle property availability (for landlords)
  togglePropertyAvailability: async (id) => {
    try {
      const response = await axiosInstance.put(`/properties/${id}/availability`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling availability for property with ID ${id}:`, error);
      throw error;
    }
  },

  // Get featured properties (for home page)
  getFeaturedProperties: async () => {
    try {
      const response = await axiosInstance.get(`/properties/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  },

  // Search for properties with filters
  searchProperties: async (params = {}) => {
    try {
      const { page = 0, size = 10, ...filters } = params;
      
      let queryParams = new URLSearchParams({
        page,
        size
      });
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await axiosInstance.get(`/properties/search?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  },

  // Helper to upload property images
  uploadPropertyImage: async (base64Image) => {
    try {
      const response = await axiosInstance.post(
        '/images/upload', 
        { imageData: base64Image }
      );
      
      return response.data.secureUrl;
    } catch (error) {
      console.error('Error uploading property image:', error);
      throw error;
    }
  },
  
  // Upload image file (not base64)
  uploadPropertyImageFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosInstance.post('/images/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.secureUrl;
    } catch (error) {
      console.error('Error uploading property image file:', error);
      throw error;
    }
  },

  // Request to rent or buy a property (for tenants)
  requestProperty: async (propertyId, requestType, message) => {
    try {
      const response = await axiosInstance.post(`/properties/${propertyId}/request`, {
        requestType, // 'RENT' or 'BUY'
        message
      });
      return response.data;
    } catch (error) {
      console.error(`Error requesting property with ID ${propertyId}:`, error);
      throw error;
    }
  },

  // Get all property types for dropdown lists
  getPropertyTypes: () => {
    return [
      'APARTMENT',
      'HOUSE',
      'CONDO',
      'TOWNHOUSE',
      'STUDIO',
      'DUPLEX',
      'TRIPLEX',
      'FOURPLEX',
      'COMMERCIAL',
      'INDUSTRIAL',
      'LAND'
    ];
  }
};

export default propertyService; 