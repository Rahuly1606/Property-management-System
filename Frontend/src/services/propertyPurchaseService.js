import axios from 'axios';

const API_URL = '/api/property-purchase-requests';

export const propertyPurchaseService = {
    createPurchaseRequest: async (propertyId) => {
        const response = await axios.post(`${API_URL}/${propertyId}`);
        return response.data;
    },

    updateRequestStatus: async (requestId, status, responseNotes) => {
        const response = await axios.put(`${API_URL}/${requestId}/status`, {
            status,
            responseNotes
        });
        return response.data;
    },

    initiatePayment: async (requestId) => {
        const response = await axios.post(`${API_URL}/${requestId}/initiate-payment`);
        return response.data;
    },

    processPayment: async (requestId, razorpayPaymentId, razorpaySignature) => {
        const response = await axios.post(`${API_URL}/${requestId}/process-payment`, {
            razorpayPaymentId,
            razorpaySignature
        });
        return response.data;
    },

    cancelRequest: async (requestId) => {
        const response = await axios.post(`${API_URL}/${requestId}/cancel`);
        return response.data;
    },

    getTenantRequests: async () => {
        const response = await axios.get(`${API_URL}/tenant`);
        return response.data;
    },

    getLandlordRequests: async () => {
        const response = await axios.get(`${API_URL}/landlord`);
        return response.data;
    },

    getTenantRequestsPaged: async (page, size) => {
        const response = await axios.get(`${API_URL}/tenant/paged`, {
            params: { page, size }
        });
        return response.data;
    },

    getLandlordRequestsPaged: async (page, size) => {
        const response = await axios.get(`${API_URL}/landlord/paged`, {
            params: { page, size }
        });
        return response.data;
    }
}; 