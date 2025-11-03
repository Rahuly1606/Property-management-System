import api from './api';

export const leaseService = {
  async getAll(userId?: string) {
    // Get current user to determine which endpoint to call
    const userStr = localStorage.getItem('pms_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'landlord') {
        const response = await api.get('/landlord/leases');
        return response.data;
      } else if (user.role === 'tenant') {
        const response = await api.get('/tenant/leases');
        return response.data;
      }
    }
    // Admin or fallback
    const response = await api.get('/leases', { params: { userId } });
    return response.data;
  },

  async create(leaseData: any) {
    const response = await api.post('/leases', leaseData);
    return response.data;
  },

  async update(id: string, leaseData: any) {
    const response = await api.put(`/leases/${id}`, leaseData);
    return response.data;
  },

  async terminate(id: string) {
    const response = await api.put(`/leases/${id}`, { status: 'terminated' });
    return response.data;
  },
};
