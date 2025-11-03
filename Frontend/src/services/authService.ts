import api from './api';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string, role: string) {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
};
