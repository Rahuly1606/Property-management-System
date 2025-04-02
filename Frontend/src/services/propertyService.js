import { axiosInstance } from './authService';

const propertyService = {
  // Get all properties with optional filters
  getAllProperties: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/properties', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new property (landlord)
  createProperty: async (propertyData, images = []) => {
    try {
      // If there are images, use FormData
      if (images.length > 0) {
        const formData = new FormData();
        
        // Append property data as JSON
        formData.append('property', JSON.stringify(propertyData));
        
        // Append images
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
        
        const response = await axiosInstance.post('/landlord/properties', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // If no images, just send JSON
        const response = await axiosInstance.post('/landlord/properties', propertyData);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Update property (landlord)
  updateProperty: async (id, propertyData, images = []) => {
    try {
      // If there are images, use FormData
      if (images.length > 0) {
        const formData = new FormData();
        
        // Append property data as JSON
        formData.append('property', JSON.stringify(propertyData));
        
        // Append images
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
        
        const response = await axiosInstance.put(`/landlord/properties/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // If no images, just send JSON
        const response = await axiosInstance.put(`/landlord/properties/${id}`, propertyData);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // Delete property (landlord)
  deleteProperty: async (id) => {
    try {
      const response = await axiosInstance.delete(`/landlord/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get properties for landlord
  getLandlordProperties: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/landlord/properties', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add property image
  addPropertyImage: async (propertyId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axiosInstance.post(`/landlord/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete property image
  deletePropertyImage: async (propertyId, imageId) => {
    try {
      const response = await axiosInstance.delete(`/landlord/properties/${propertyId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get available properties for rent
  getAvailableProperties: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/properties/available', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search properties
  searchProperties: async (searchParams) => {
    try {
      const response = await axiosInstance.get('/properties/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get property types
  getPropertyTypes: async () => {
    try {
      const response = await axiosInstance.get('/properties/types');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Extract functions for named exports
const getAllProperties = propertyService.getAllProperties;
const getPropertyById = propertyService.getPropertyById;
const createProperty = propertyService.createProperty;
const updateProperty = propertyService.updateProperty;
const deleteProperty = propertyService.deleteProperty;
const getLandlordProperties = propertyService.getLandlordProperties;
const addPropertyImage = propertyService.addPropertyImage;
const deletePropertyImage = propertyService.deletePropertyImage;
const getAvailableProperties = propertyService.getAvailableProperties;
const searchProperties = propertyService.searchProperties;
const getPropertyTypes = propertyService.getPropertyTypes;

export default propertyService;
export {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordProperties,
  addPropertyImage,
  deletePropertyImage,
  getAvailableProperties,
  searchProperties,
  getPropertyTypes
}; 