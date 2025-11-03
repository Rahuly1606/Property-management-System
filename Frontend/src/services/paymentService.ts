import api from './api';

const getUserRole = () => {
  const userStr = localStorage.getItem('pms_user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.role?.toLowerCase();
  } catch {
    return null;
  }
};

export const paymentService = {
  async getAll(userId?: string) {
    const role = getUserRole();
    let endpoint = '/payments';

    // Use role-specific endpoints
    if (role === 'tenant') {
      endpoint = '/tenant/payments';
    } else if (role === 'landlord') {
      endpoint = '/landlord/payments';
    }

    const response = await api.get(endpoint, { params: userId ? { userId } : {} });
    return response.data;
  },

  async create(paymentData: any) {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
};
