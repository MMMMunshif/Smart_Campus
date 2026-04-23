import axios from "axios";

const TICKET_API = "http://localhost:8080/api/tickets";

export const createTicket = async (data) => {
  const response = await axios.post(TICKET_API, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllTickets = async () => {
  const response = await axios.get(TICKET_API, {
    withCredentials: true,
  });
  return response.data;
};

export const getTicketsByCreator = async (email) => {
  const response = await axios.get(`${TICKET_API}/creator`, {
    params: { email },
    withCredentials: true,
  });
  return response.data;
};

export const getTicketsByTechnician = async (email) => {
  const response = await axios.get(`${TICKET_API}/technician`, {
    params: { email },
    withCredentials: true,
  });
  return response.data;
};

export const assignTechnician = async (id, technicianEmail, adminNote) => {
  const response = await axios.put(
    `${TICKET_API}/${id}/assign`,
    null,
    {
      params: { technicianEmail, adminNote },
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateTicketStatus = async (id, status, technicianNote) => {
  const response = await axios.put(
    `${TICKET_API}/${id}/status`,
    null,
    {
      params: { status, technicianNote },
      withCredentials: true,
    }
  );
  return response.data;
};