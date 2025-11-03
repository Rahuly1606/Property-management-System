import api from './api';

export const maintenanceService = {
  async getAll(filters?: any) {
    // Get current user to determine which endpoint to call
    const userStr = localStorage.getItem('pms_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'landlord') {
        const response = await api.get('/landlord/maintenance-requests', { params: filters });
        return response.data;
      } else if (user.role === 'tenant') {
        const response = await api.get('/tenant/maintenance-requests', { params: filters });
        return response.data;
      }
    }
    // Admin or fallback
    const response = await api.get('/maintenance-requests', { params: filters });
    return response.data;
  },

  async create(requestData: any) {
    const response = await api.post('/maintenance-requests', requestData);
    return response.data;
  },

  async update(id: string, requestData: any) {
    const response = await api.put(`/maintenance-requests/${id}`, requestData);
    return response.data;
  },
};
