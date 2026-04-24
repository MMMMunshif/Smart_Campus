import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import TicketTimeline from "../components/TicketTimeline";
import { useAuth } from "../context/AuthContext";
import { getTicketsByCreator } from "../services/ticketService";

import {
  ClipboardList,
  Paperclip,
  Building2,
  Clock3,
  FileText,
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

function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getTicketsByCreator(user.email);
      setTickets(data);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  return (
    <AppLayout title="My Tickets">
      <div className="max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">My Reported Issues</h1>
          <p className="mt-3 text-blue-100 text-lg">
            Track your submitted tickets, progress status, technician notes, and attachments.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-600 dark:text-sky-400">
              <ClipboardList size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Ticket History
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-10 text-center text-slate-500 dark:text-slate-400">
              No tickets found.
            </div>
          ) : (
            <div className="space-y-5">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
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

                      {ticket.adminNote && (
                        <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Admin Note
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {ticket.adminNote}
                          </p>
                        </div>
                      )}

                      {ticket.technicianNote && (
                        <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 p-4">
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            Technician Update
                          </p>
                          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                            {ticket.technicianNote}
                          </p>
                        </div>
                      )}

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

                      <TicketTimeline ticketId={ticket.id} />
                    </div>

                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      <Clock3 size={14} className="inline mr-1" />
                      {ticket.updatedAt?.replace("T", " ").slice(0, 16)}
                    </div>
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

export default MyTicketsPage;