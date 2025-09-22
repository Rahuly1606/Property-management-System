import axiosInstance from './axiosConfig';

// Note: axiosInstance already includes /api as the base URL
// We don't need to include '/api' in our API_URL
const API_URL = '/property-purchase-requests';

export const propertyPurchaseService = {
    createPurchaseRequest: async (propertyId) => {
        try {
            console.log(`Sending POST request to ${API_URL}/${propertyId}`);

            // Check authentication before making request
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('userRole');

            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            if (userRole !== 'TENANT') {
                throw new Error('Only tenants can purchase properties.');
            }

            const response = await axiosInstance.post(`${API_URL}/${propertyId}`);
            console.log('Purchase request created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating purchase request:', error);

            // Add more detailed error logging
            if (error.response) {
                console.error('Response error data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }

            throw error;
        }
    },

    updateRequestStatus: async (requestId, status, responseNotes) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/${requestId}/status`, {
                status,
                responseNotes
            });
            return response.data;
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        }
    },

    initiatePayment: async (requestId) => {
        try {
            console.log(`Initiating payment for request ID: ${requestId}`);
            const response = await axiosInstance.post(`${API_URL}/${requestId}/initiate-payment`);
            console.log('Payment initiated:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error initiating payment:', error);
            throw error;
        }
    },

    processPayment: async (requestId, razorpayPaymentId, razorpaySignature, propertyDetails = null) => {
        try {
            console.log(`Processing payment for request ID: ${requestId}`);
            console.log('Payment details:', { razorpayPaymentId, razorpaySignature });

            const paymentData = {
                razorpayPaymentId,
                razorpaySignature
            };

            // Include property details if provided
            if (propertyDetails) {
                paymentData.propertyDetails = propertyDetails;
            }

            const response = await axiosInstance.post(`${API_URL}/${requestId}/process-payment`, paymentData);

            console.log('Payment processed:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    },

    cancelRequest: async (requestId) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/${requestId}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling request:', error);
            throw error;
        }
    },

    getTenantRequests: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/tenant`);
            return response.data;
        } catch (error) {
            console.error('Error getting tenant requests:', error);
            throw error;
        }
    },

    getLandlordRequests: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/landlord`);
            return response.data;
        } catch (error) {
            console.error('Error getting landlord requests:', error);
            throw error;
        }
    },

    getTenantRequestsPaged: async (page, size) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/tenant/paged`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting paged tenant requests:', error);
            throw error;
        }
    },

    getLandlordRequestsPaged: async (page, size) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/landlord/paged`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting paged landlord requests:', error);
            throw error;
        }
    },

    getPurchasedProperties: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/tenant/purchased-properties`);
            return response.data;
        } catch (error) {
            console.error('Error getting purchased properties:', error);
            throw error;
        }
    },

    getSoldProperties: async () => {
        try {
            // Use the properly formatted endpoint
            const response = await axiosInstance.get(`${API_URL}/landlord/sold-properties`);

            // Check if the response data is in the expected format
            if (response.data) {
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                    console.warn('Sold properties response is an object, not an array:', response.data);
                    return Object.values(response.data); // Try to convert object to array
                }
            }

            console.warn('Defaulting to empty array for sold properties response');
            return [];
        } catch (error) {
            console.error('Error getting sold properties:', error);
            return []; // Return empty array instead of throwing
        }
    },

    getInvoice: async (requestId) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/${requestId}/invoice`);
            return response.data;
        } catch (error) {
            console.error('Error getting invoice:', error);
            throw error;
        }
    }
}; 