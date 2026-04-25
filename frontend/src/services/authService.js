import axios from "axios";
import { getAuthToken } from "../utils/auth";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
const authApi = axios.create({ baseURL: `${BACKEND_BASE_URL}/api/auth` });

export const signup = async (payload) => {
  const response = await authApi.post("/signup", payload);
  return response.data;
};

export const signin = async (payload) => {
  const response = await authApi.post("/signin", payload);
  return response.data;
};

export const getGoogleOAuthStartUrl = () => `${BACKEND_BASE_URL}/oauth2/authorization/google`;

export const getGoogleOAuthStatus = async () => {
  const response = await authApi.get("/google/enabled");
  return response.data?.enabled === true;
};

export const getAuthProfile = async () => {
  const token = getAuthToken();
  const response = await authApi.get("/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};
