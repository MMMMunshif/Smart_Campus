import axios from "axios";

const API = "http://localhost:8080/api/admin/pdf";

function saveFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export const exportBookingsPdf = async () => {
  const res = await axios.get(`${API}/bookings`, {
    responseType: "blob",
    withCredentials: true,
  });

  saveFile(res.data, "bookings-report.pdf");
  return true;
};

export const exportTicketsPdf = async () => {
  const res = await axios.get(`${API}/tickets`, {
    responseType: "blob",
    withCredentials: true,
  });

  saveFile(res.data, "tickets-report.pdf");
  return true;
};

export const exportResourcesPdf = async () => {
  const res = await axios.get(`${API}/resources`, {
    responseType: "blob",
    withCredentials: true,
  });

  saveFile(res.data, "resources-report.pdf");
  return true;
};