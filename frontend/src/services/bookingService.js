import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (bookingData) => {
  const response = await axios.post(API_BASE_URL, bookingData, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axios.get(API_BASE_URL, {
    withCredentials: true,
  });
  return response.data;
};

export const getBookingsByStatus = async (status) => {
  const response = await axios.get(`${API_BASE_URL}/status/${status}`, {
    withCredentials: true,
  });
  return response.data;
};

export const searchBookingsByResource = async (resourceName) => {
  const response = await axios.get(`${API_BASE_URL}/resource/${resourceName}`, {
    withCredentials: true,
  });
  return response.data;
};

export const searchBookingsByDate = async (date) => {
  const response = await axios.get(`${API_BASE_URL}/date/${date}`, {
    withCredentials: true,
  });
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await axios.put(
    `${API_BASE_URL}/${id}/approve`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const rejectBooking = async (id, note) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/reject`, null, {
    params: { note },
    withCredentials: true,
  });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axios.put(
    `${API_BASE_URL}/${id}/cancel`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getBookingsByUserEmail = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    params: { email },
    withCredentials: true,
  });
  return response.data;
};

export const getAdminDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/admin`, {
    withCredentials: true,
  });
  return response.data;
};

export const getUserDashboardStats = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/user`, {
    params: { email },
    withCredentials: true,
  });
  return response.data;
};