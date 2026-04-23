import axios from "axios";

const REPORT_API = "http://localhost:8080/api/admin/reports";

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportBookingsReport = async () => {
  const response = await axios.get(`${REPORT_API}/bookings`, {
    withCredentials: true,
    responseType: "blob",
  });
  downloadFile(response.data, "bookings-report.csv");
};

export const exportTicketsReport = async () => {
  const response = await axios.get(`${REPORT_API}/tickets`, {
    withCredentials: true,
    responseType: "blob",
  });
  downloadFile(response.data, "tickets-report.csv");
};

export const exportResourcesReport = async () => {
  const response = await axios.get(`${REPORT_API}/resources`, {
    withCredentials: true,
    responseType: "blob",
  });
  downloadFile(response.data, "resources-report.csv");
};