import api from './api';

export const propertyPurchaseService = {
  // Create a purchase request for a property
  async createPurchaseRequest(propertyId: string) {
    const response = await api.post(`/property-purchase-requests/${propertyId}`);
    return response.data;
  },

  // Update purchase request status (landlord)
  async updateRequestStatus(requestId: string, status: string, responseNotes?: string) {
    const response = await api.put(`/property-purchase-requests/${requestId}/status`, {
      status,
      responseNotes,
    });
    return response.data;
  },

  // Initiate payment for approved purchase request
  async initiatePayment(requestId: string) {
    const response = await api.post(`/property-purchase-requests/${requestId}/initiate-payment`);
    return response.data;
  },

  // Process payment after Razorpay success
  async processPayment(requestId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const response = await api.post(`/property-purchase-requests/${requestId}/process-payment`, {
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.data;
  },

  // Cancel a purchase request
  async cancelRequest(requestId: string) {
    const response = await api.post(`/property-purchase-requests/${requestId}/cancel`);
    return response.data;
  },

  // Get tenant's purchase requests
  async getTenantRequests() {
    const response = await api.get('/property-purchase-requests/tenant');
    return response.data;
  },

  // Get landlord's purchase requests
  async getLandlordRequests() {
    const response = await api.get('/property-purchase-requests/landlord');
    return response.data;
  },

  // Get tenant's purchased properties
  async getTenantPurchasedProperties() {
    const response = await api.get('/property-purchase-requests/tenant/purchased-properties');
    return response.data;
  },

  // Get landlord's sold properties
  async getLandlordSoldProperties() {
    const response = await api.get('/property-purchase-requests/landlord/sold-properties');
    return response.data;
  },

  // Get invoice for completed purchase
  async getInvoice(requestId: string) {
    const response = await api.get(`/property-purchase-requests/${requestId}/invoice`);
    return response.data;
  },

  // Legacy methods for backward compatibility
  async create(purchaseData: any) {
    // This should use createPurchaseRequest instead
    if (purchaseData.propertyId) {
      return this.createPurchaseRequest(purchaseData.propertyId);
    }
    throw new Error('propertyId is required');
  },

  async getAll() {
    // Determine role and call appropriate endpoint
    return this.getTenantRequests();
  },

  async updateStatus(id: string, status: string) {
    return this.updateRequestStatus(id, status);
  },
};
