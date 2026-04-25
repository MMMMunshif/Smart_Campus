import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api/notifications`,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNotifications = async (unreadOnly = false) => {
  const response = await api.get("", { params: { unreadOnly } });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/unread-count");
  return response.data?.unreadCount ?? 0;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/read-all");
  return response.data?.updated ?? 0;
};
