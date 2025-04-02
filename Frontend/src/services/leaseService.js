import { axiosInstance } from './authService';

const leaseService = {
  // Get all leases (admin)
  getAllLeases: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/leases', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get leases by property (landlord)
  getLeasesByProperty: async (propertyId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/leases/property/${propertyId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get leases for landlord
  getLandlordLeases: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/landlord/leases', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active lease for tenant
  getTenantLease: async () => {
    try {
      const response = await axiosInstance.get('/tenant/lease');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get lease by ID
  getLeaseById: async (id) => {
    try {
      const response = await axiosInstance.get(`/leases/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new lease (landlord)
  createLease: async (leaseData) => {
    try {
      const response = await axiosInstance.post('/leases', leaseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update lease (landlord)
  updateLease: async (id, leaseData) => {
    try {
      const response = await axiosInstance.put(`/leases/${id}`, leaseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update lease status (landlord)
  updateLeaseStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/leases/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Terminate lease (landlord)
  terminateLease: async (id, terminationDate, reason) => {
    try {
      const response = await axiosInstance.put(`/leases/${id}/terminate`, {
        terminationDate,
        reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Renew lease (landlord)
  renewLease: async (id, startDate, endDate, monthlyRent) => {
    try {
      const response = await axiosInstance.put(`/leases/${id}/renew`, {
        startDate,
        endDate,
        monthlyRent
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get lease documents
  getLeaseDocuments: async (leaseId) => {
    try {
      const response = await axiosInstance.get(`/leases/${leaseId}/documents`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload lease document
  uploadLeaseDocument: async (leaseId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      const response = await axiosInstance.post(`/leases/${leaseId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming lease renewals (for landlord dashboard)
  getUpcomingLeaseRenewals: async (daysThreshold = 30, limit = 5) => {
    try {
      const response = await axiosInstance.get('/landlord/leases/upcoming-renewals', {
        params: { daysThreshold, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get expiring leases (for landlord dashboard)
  getExpiringLeases: async (daysThreshold = 30, limit = 5) => {
    try {
      const response = await axiosInstance.get('/landlord/leases/expiring', {
        params: { daysThreshold, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Extract functions for named exports
const getAllLeases = leaseService.getAllLeases;
const getLeasesByProperty = leaseService.getLeasesByProperty;
const getLandlordLeases = leaseService.getLandlordLeases;
const getTenantLease = leaseService.getTenantLease;
// Add alias for backward compatibility
const getTenantLeases = leaseService.getTenantLease;
const getLeaseById = leaseService.getLeaseById;
const createLease = leaseService.createLease;
const updateLease = leaseService.updateLease;
const updateLeaseStatus = leaseService.updateLeaseStatus;
const terminateLease = leaseService.terminateLease;
const renewLease = leaseService.renewLease;
const getLeaseDocuments = leaseService.getLeaseDocuments;
const uploadLeaseDocument = leaseService.uploadLeaseDocument;
const getUpcomingLeaseRenewals = leaseService.getUpcomingLeaseRenewals;
const getExpiringLeases = leaseService.getExpiringLeases;

export default leaseService;
export {
  getAllLeases,
  getLeasesByProperty,
  getLandlordLeases,
  getTenantLease,
  getTenantLeases, // Export the alias
  getLeaseById,
  createLease,
  updateLease,
  updateLeaseStatus,
  terminateLease,
  renewLease,
  getLeaseDocuments,
  uploadLeaseDocument,
  getUpcomingLeaseRenewals,
  getExpiringLeases
}; 