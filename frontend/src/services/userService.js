import axios from "axios";

const USER_API = "http://localhost:8080/api/users";

export const registerUser = async (data) => {
  const response = await axios.post(`${USER_API}/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const completeProfile = async (email, data) => {
  const response = await axios.put(`${USER_API}/complete-profile`, data, {
    params: { email },
    withCredentials: true,
  });
  return response.data;
};

export const getProfile = async (email) => {
  const response = await axios.get(`${USER_API}/profile`, {
    params: { email },
    withCredentials: true,
  });
  return response.data;
};

export const getPendingRoleRequests = async () => {
  const response = await axios.get(`${USER_API}/pending-role-requests`, {
    withCredentials: true,
  });
  return response.data;
};

export const approveRoleRequest = async (id) => {
  const response = await axios.put(`${USER_API}/${id}/approve-role`, null, {
    withCredentials: true,
  });
  return response.data;
};

export const rejectRoleRequest = async (id) => {
  const response = await axios.put(`${USER_API}/${id}/reject-role`, null, {
    withCredentials: true,
  });
  return response.data;
};

export const getUsersByRole = async (role) => {
  const response = await axios.get(`${USER_API}/by-role`, {
    params: { role },
    withCredentials: true,
  });
  return response.data;
};

export const updateProfile = async (email, formData) => {
  const response = await axios.put(`${USER_API}/update-profile`, formData, {
    params: { email },
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};