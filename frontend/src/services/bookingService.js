import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (bookingData) => {
  const response = await axios.post(API_BASE_URL, bookingData);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getBookingsByStatus = async (status) => {
  const response = await axios.get(`${API_BASE_URL}/status/${status}`);
  return response.data;
};

export const searchBookingsByResource = async (resourceName) => {
  const response = await axios.get(`${API_BASE_URL}/resource/${resourceName}`);
  return response.data;
};

export const searchBookingsByDate = async (date) => {
  const response = await axios.get(`${API_BASE_URL}/date/${date}`);
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/approve`);
  return response.data;
};

export const rejectBooking = async (id, note) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/reject`, null, {
    params: { note },
  });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/cancel`);
  return response.data;
};

export const getBookingsByUserEmail = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    params: { email },
  });
  return response.data;
};

export const getAdminDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/admin`);
  return response.data;
};

export const getUserDashboardStats = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/user`, {
    params: { email },
  });
  return response.data;
};

export const filterBookings = async (filters) => {
  const response = await axios.get(`${API}/filter`, {
    params: filters,
    withCredentials: true,
  });
  return response.data;
};