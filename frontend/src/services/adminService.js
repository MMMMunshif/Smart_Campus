import axios from "axios";

export const getDashboardSummary = async () => {
  const response = await axios.get(
    "http://localhost:8080/api/admin/dashboard-summary",
    { withCredentials: true }
  );

  return response.data;
};