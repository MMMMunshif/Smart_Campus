import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api/admin/users`,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsers = async () => {
  const response = await api.get("");
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/${id}/role`, { role });
  return response.data;
};
