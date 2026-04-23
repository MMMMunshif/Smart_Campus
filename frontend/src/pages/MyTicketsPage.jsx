import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getTicketsByCreator } from "../services/ticketService";

function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    try {
      const data = await getTicketsByCreator(user.email);
      setTickets(data);
    } catch (error) {
      toast.error("Failed to load tickets");
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadTickets();
    }
  }, [user]);

  return (
    <AppLayout title="My Tickets">
      <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800">My Reported Issues</h2>
        <p className="mt-2 text-slate-500">
          Track the progress of maintenance and issue tickets you submitted.
        </p>

        <div className="mt-6 space-y-4">
          {tickets.length === 0 ? (
            <p className="text-slate-500">No tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-bold text-slate-800">{ticket.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{ticket.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                    {ticket.priority}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                    {ticket.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {ticket.resourceName}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default MyTicketsPage;