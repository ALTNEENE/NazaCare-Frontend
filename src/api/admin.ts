import api from './client';

export interface AdminStats {
  users: number;
  diagnoses: number;
  doctors: number;
  rules: number;
}

export const adminApi = {
  // Stats
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  // Users
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },
  updateUserRole: async (id: string, role: 'admin' | 'user') => {
    const { data } = await api.put(`/admin/users/${id}/role`, { role });
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  // Cases
  getCases: async () => {
    const { data } = await api.get('/admin/cases');
    return data;
  },
  deleteCase: async (id: string) => {
    const { data } = await api.delete(`/admin/cases/${id}`);
    return data;
  },

  // Doctors
  getDoctors: async () => {
    const { data } = await api.get('/admin/doctors');
    return data;
  },
  createDoctor: async (doc: any) => {
    const { data } = await api.post('/admin/doctors', doc);
    return data;
  },
  updateDoctor: async (id: string, doc: any) => {
    const { data } = await api.put(`/admin/doctors/${id}`, doc);
    return data;
  },
  deleteDoctor: async (id: string) => {
    const { data } = await api.delete(`/admin/doctors/${id}`);
    return data;
  },

  // Rules
  getRules: async () => {
    const { data } = await api.get('/admin/rules');
    return data;
  },
  createRule: async (rule: any) => {
    const { data } = await api.post('/admin/rules', rule);
    return data;
  },
  updateRule: async (id: string, rule: any) => {
    const { data } = await api.put(`/admin/rules/${id}`, rule);
    return data;
  },
  deleteRule: async (id: string) => {
    const { data } = await api.delete(`/admin/rules/${id}`);
    return data;
  },
};
