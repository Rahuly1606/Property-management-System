import { axiosInstance } from './authService';

const maintenanceService = {
  // Get all maintenance requests (admin)
  getAllMaintenanceRequests: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/maintenance-requests', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get maintenance requests by property (landlord)
  getMaintenanceRequestsByProperty: async (propertyId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/maintenance-requests/property/${propertyId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get maintenance requests for landlord
  getLandlordMaintenanceRequests: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/landlord/maintenance-requests', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get maintenance requests for tenant
  getTenantMaintenanceRequests: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/tenant/maintenance-requests', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get maintenance request by ID
  getMaintenanceRequestById: async (id) => {
    try {
      const response = await axiosInstance.get(`/maintenance-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a maintenance request (tenant)
  createMaintenanceRequest: async (requestData, images = []) => {
    try {
      // Always use FormData for maintenance requests to handle potential images
      const formData = new FormData();
      
      // Append request data as JSON
      formData.append('request', JSON.stringify(requestData));
      
      // Append images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }
      
      const response = await axiosInstance.post('/tenant/maintenance-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a maintenance request
  updateMaintenanceRequest: async (id, requestData, images = []) => {
    try {
      // Always use FormData for maintenance requests to handle potential images
      const formData = new FormData();
      
      // Append request data as JSON
      formData.append('request', JSON.stringify(requestData));
      
      // Append images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }
      
      const response = await axiosInstance.put(`/maintenance-requests/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update maintenance request status (landlord/admin)
  updateMaintenanceRequestStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/maintenance-requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resolve a maintenance request (landlord/admin)
  resolveMaintenanceRequest: async (id, resolutionNotes) => {
    try {
      const response = await axiosInstance.patch(`/maintenance-requests/${id}/resolve`, { resolutionNotes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add a comment to a maintenance request
  addComment: async (requestId, content) => {
    try {
      const response = await axiosInstance.post(`/maintenance-requests/${requestId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get comments for a maintenance request
  getComments: async (requestId) => {
    try {
      const response = await axiosInstance.get(`/maintenance-requests/${requestId}/comments`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent maintenance requests (for dashboard)
  getRecentMaintenanceRequests: async (limit = 5) => {
    try {
      const response = await axiosInstance.get('/maintenance-requests/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Extract functions for named exports
const getAllMaintenanceRequests = maintenanceService.getAllMaintenanceRequests;
const getMaintenanceRequestsByProperty = maintenanceService.getMaintenanceRequestsByProperty;
const getLandlordMaintenanceRequests = maintenanceService.getLandlordMaintenanceRequests;
const getTenantMaintenanceRequests = maintenanceService.getTenantMaintenanceRequests;
const getMaintenanceRequestById = maintenanceService.getMaintenanceRequestById;
const createMaintenanceRequest = maintenanceService.createMaintenanceRequest;
const updateMaintenanceRequest = maintenanceService.updateMaintenanceRequest;
const updateMaintenanceRequestStatus = maintenanceService.updateMaintenanceRequestStatus;
const resolveMaintenanceRequest = maintenanceService.resolveMaintenanceRequest;
const addComment = maintenanceService.addComment;
const getComments = maintenanceService.getComments;
const getRecentMaintenanceRequests = maintenanceService.getRecentMaintenanceRequests;

export default maintenanceService;
export {
  getAllMaintenanceRequests,
  getMaintenanceRequestsByProperty,
  getLandlordMaintenanceRequests,
  getTenantMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  updateMaintenanceRequestStatus,
  resolveMaintenanceRequest,
  addComment,
  getComments,
  getRecentMaintenanceRequests
}; 