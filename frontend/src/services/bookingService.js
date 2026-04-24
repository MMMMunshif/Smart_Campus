import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const getBookingsByStatus = async (status) => {
  const response = await api.get(`/bookings/status/${status}`);
  return response.data;
};

export const searchBookingsByResource = async (resourceName) => {
  const response = await api.get(`/bookings/resource/${resourceName}`);
  return response.data;
};

export const searchBookingsByDate = async (date) => {
  const response = await api.get(`/bookings/date/${date}`);
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/approve`);
  return response.data;
};

export const rejectBooking = async (id, note) => {
  const response = await api.put(`/bookings/${id}/reject`, null, {
    params: { note },
  });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

export const getBookingsByUserEmail = async (email) => {
  const response = await api.get("/bookings/user", {
    params: email ? { email } : {},
  });
  return response.data;
};

export const getAdminDashboardStats = async () => {
  const response = await api.get("/bookings/dashboard/admin");
  return response.data;
};

export const getUserDashboardStats = async (email) => {
  const response = await api.get("/bookings/dashboard/user", {
    params: email ? { email } : {},
  });
  return response.data;
};
