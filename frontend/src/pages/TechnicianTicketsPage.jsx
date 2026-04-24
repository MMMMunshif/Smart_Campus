import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import TicketTimeline from "../components/TicketTimeline";
import { useAuth } from "../context/AuthContext";
import {
  getTicketsByTechnician,
  updateTicketStatus,
} from "../services/ticketService";
import {
  ClipboardList,
  Paperclip,
  Wrench,
  CheckCircle2,
  Lock,
  Building2,
  RefreshCcw,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

function getPriorityBadge(priority) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (priority) {
    case "HIGH":
      return `${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400`;
    case "MEDIUM":
      return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`;
    case "LOW":
      return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`;
    default:
      return `${base} bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
  }
}

function getStatusBadge(status) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "OPEN":
      return `${base} bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400`;
    case "IN_PROGRESS":
      return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`;
    case "RESOLVED":
      return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`;
    case "CLOSED":
      return `${base} bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
    default:
      return `${base} bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
  }
}

function TechnicianTicketsPage() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getTicketsByTechnician(user.email);
      setTickets(data);
    } catch {
      toast.error("Failed to load technician tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleNoteChange = (ticketId, value) => {
    setNotes((prev) => ({
      ...prev,
      [ticketId]: value,
    }));
  };

  const handleUpdate = async (id, status) => {
    const technicianNote = notes[id] || "";

    try {
      await updateTicketStatus(id, status, technicianNote);
      toast.success("Ticket updated");

      setNotes((prev) => ({
        ...prev,
        [id]: "",
      }));

      loadTickets();
    } catch {
      toast.error("Failed to update ticket");
    }
  };

  return (
    <AppLayout title="Assigned Tickets" role="TECHNICIAN">
      <div className="max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">Assigned Tickets</h1>
          <p className="mt-3 max-w-3xl text-emerald-50 text-lg">
            Review attachments, update progress notes, and resolve assigned
            maintenance tasks.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-600 dark:text-emerald-400">
                <ClipboardList size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  My Assigned Work
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} assigned
                </p>
              </div>
            </div>

            <button
              onClick={loadTickets}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading assigned tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-10 text-center text-slate-500 dark:text-slate-400">
              No tickets assigned yet.
            </div>
          ) : (
            <div className="space-y-5">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {ticket.title}
                  </h3>

                  <p className="mt-2 text-slate-600 dark:text-slate-300 leading-7">
                    {ticket.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
                      <Building2 size={12} />
                      {ticket.resourceName}
                    </span>

                    <span className={getPriorityBadge(ticket.priority)}>
                      {ticket.priority}
                    </span>

                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </span>
                  </div>

                  {ticket.attachmentUrl && (
                    <a
                      href={`${API_BASE_URL}${ticket.attachmentUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-100 dark:bg-sky-900/30 px-4 py-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50"
                    >
                      <Paperclip size={16} />
                      View Attachment
                    </a>
                  )}

                  {ticket.adminNote && (
                    <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Admin Note
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {ticket.adminNote}
                      </p>
                    </div>
                  )}

                  {ticket.technicianNote && (
                    <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 px-4 py-3">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        Last Technician Note
                      </p>
                      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                        {ticket.technicianNote}
                      </p>
                    </div>
                  )}
                  <TicketTimeline ticketId={ticket.id} />

                  <textarea
                    value={notes[ticket.id] || ""}
                    onChange={(e) => handleNoteChange(ticket.id, e.target.value)}
                    placeholder="Technician progress note"
                    rows="3"
                    className="mt-5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-emerald-400"
                  />

                  <div className="mt-4 flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleUpdate(ticket.id, "IN_PROGRESS")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-white font-semibold hover:bg-blue-600"
                    >
                      <Wrench size={17} />
                      In Progress
                    </button>

                    <button
                      onClick={() => handleUpdate(ticket.id, "RESOLVED")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-white font-semibold hover:bg-emerald-600"
                    >
                      <CheckCircle2 size={17} />
                      Resolved
                    </button>

                    <button
                      onClick={() => handleUpdate(ticket.id, "CLOSED")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-slate-700 px-5 py-3 text-white font-semibold hover:bg-slate-800 dark:hover:bg-slate-600"
                    >
                      <Lock size={17} />
                      Closed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default TechnicianTicketsPage;