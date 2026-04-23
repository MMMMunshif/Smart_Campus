import axios from "axios";

const NOTIFICATION_API_URL = "http://localhost:8080/api/notifications";

export const getNotificationsByEmail = async (email) => {
  const response = await axios.get(NOTIFICATION_API_URL, {
    params: { email },
  });
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axios.put(`${NOTIFICATION_API_URL}/${id}/read`);
  return response.data;
};