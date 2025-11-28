import axios from "axios";

const API_BASE = "/api/admins";

export const adminService = {
  create: async (payload: any) => {
    const res = await axios.post(`${API_BASE}`, payload);
    return res.data;
  },

  getAll: async () => {
    const res = await axios.get(API_BASE);
    return res.data.admins;
  },

  getById: async (id: string) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data.admin;
  },

  update: async (id: string, payload: any) => {
    const res = await axios.put(`${API_BASE}/${id}/update`, payload);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axios.delete(`${API_BASE}/${id}/delete`);
    return res.data;
  },
};
