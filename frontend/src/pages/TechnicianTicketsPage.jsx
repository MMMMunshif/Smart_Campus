import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import {
  getTicketsByTechnician,
  updateTicketStatus,
} from "../services/ticketService";

function TechnicianTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [note, setNote] = useState("");

  const loadTickets = async () => {
    try {
      const data = await getTicketsByTechnician(user.email);
      setTickets(data);
    } catch (error) {
      toast.error("Failed to load technician tickets");
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadTickets();
    }
  }, [user]);

  const handleUpdate = async (id, status) => {
    try {
      await updateTicketStatus(id, status, note);
      toast.success("Ticket updated");
      setNote("");
      loadTickets();
    } catch (error) {
      toast.error("Failed to update ticket");
    }
  };

  return (
    <AppLayout title="Assigned Tickets" role="TECHNICIAN">
      <div className="space-y-5">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-slate-800">
              {ticket.title}
            </h3>

            <p className="mt-2 text-slate-600">
              {ticket.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                {ticket.resourceName}
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                {ticket.priority}
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                {ticket.status}
              </span>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Technician progress note"
              rows="3"
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
            />

            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                onClick={() =>
                  handleUpdate(ticket.id, "IN_PROGRESS")
                }
                className="rounded-2xl bg-blue-500 px-5 py-3 text-white font-semibold"
              >
                In Progress
              </button>

              <button
                onClick={() =>
                  handleUpdate(ticket.id, "RESOLVED")
                }
                className="rounded-2xl bg-emerald-500 px-5 py-3 text-white font-semibold"
              >
                Resolved
              </button>

              <button
                onClick={() =>
                  handleUpdate(ticket.id, "CLOSED")
                }
                className="rounded-2xl bg-slate-900 px-5 py-3 text-white font-semibold"
              >
                Closed
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default TechnicianTicketsPage;