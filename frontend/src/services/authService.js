import axios from "axios";

const AUTH_API = "http://localhost:8080/api/auth";

export const getCurrentUser = async () => {
  const response = await axios.get(`${AUTH_API}/me`, {
    withCredentials: true,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${AUTH_API}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

export const logoutUser = async () => {
  window.location.href = "http://localhost:8080/logout";
};

export const loginWithGoogle = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};