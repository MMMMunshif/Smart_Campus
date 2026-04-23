import axios from "axios";

const RESOURCE_API = "http://localhost:8080/api/resources";

export const createResource = async (data) => {
  const response = await axios.post(RESOURCE_API, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllResources = async () => {
  const response = await axios.get(RESOURCE_API, {
    withCredentials: true,
  });
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await axios.put(`${RESOURCE_API}/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axios.delete(`${RESOURCE_API}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const searchResourcesByName = async (value) => {
  const response = await axios.get(`${RESOURCE_API}/search/name`, {
    params: { value },
    withCredentials: true,
  });
  return response.data;
};

export const searchResourcesByType = async (value) => {
  const response = await axios.get(`${RESOURCE_API}/search/type`, {
    params: { value },
    withCredentials: true,
  });
  return response.data;
};

export const searchResourcesByLocation = async (value) => {
  const response = await axios.get(`${RESOURCE_API}/search/location`, {
    params: { value },
    withCredentials: true,
  });
  return response.data;
};

export const getResourceAnalytics = async () => {
  const response = await axios.get(`${RESOURCE_API}/analytics`, {
    withCredentials: true,
  });
  return response.data;
};