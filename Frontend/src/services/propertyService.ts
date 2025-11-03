import api from './api';

export const propertyService = {
  async getAll(filters?: any) {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async create(propertyData: any) {
    const response = await api.post('/properties/create', propertyData);
    return response.data;
  },

  async update(id: string, propertyData: any) {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};
