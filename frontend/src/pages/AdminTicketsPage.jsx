import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import TicketTimeline from "../components/TicketTimeline";
import { getAllTickets, assignTechnician } from "../services/ticketService";
import { getUsersByRole } from "../services/userService";
import {
  Wrench,
  AlertTriangle,
  ClipboardList,
  UserCheck,
  RefreshCcw,
  Paperclip,
  Building2,
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

function StatCard({ title, value, icon: Icon, color, iconBg }) {
  return (
    <div className="rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h3>
        </div>

        <div className={`rounded-2xl p-3 ${iconBg}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );
}

function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});

  const loadTickets = async () => {
    const data = await getAllTickets();
    setTickets(data);
  };

  const loadTechnicians = async () => {
    const data = await getUsersByRole("TECHNICIAN");
    setTechnicians(data);
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadTickets(), loadTechnicians()]);
    } catch {
      toast.error("Failed to load ticket data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleAssignmentChange = (ticketId, field, value) => {
    setAssignment((prev) => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [field]: value,
      },
    }));
  };

  const handleAssign = async (id) => {
    const technicianEmail = assignment[id]?.technicianEmail || "";
    const adminNote = assignment[id]?.adminNote || "";

    if (!technicianEmail) {
      toast.error("Please select a technician");
      return;
    }

    try {
      await assignTechnician(id, technicianEmail, adminNote);
      toast.success("Technician assigned successfully");

      setAssignment((prev) => ({
        ...prev,
        [id]: {
          technicianEmail: "",
          adminNote: "",
        },
      }));

      await loadTickets();
    } catch {
      toast.error("Failed to assign technician");
    }
  };

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const highPriorityTickets = tickets.filter((t) => t.priority === "HIGH").length;

  return (
    <AppLayout title="Manage Tickets">
      <div className="max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-violet-600 via-sky-600 to-cyan-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">Ticket Management</h1>
          <p className="mt-3 text-blue-50 text-lg max-w-3xl">
            Review reported issues, inspect attachments, assign technicians, and
            track maintenance workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Tickets" value={totalTickets} icon={ClipboardList} color="text-sky-600 dark:text-sky-400" iconBg="bg-sky-100 dark:bg-sky-900/30" />
          <StatCard title="Open" value={openTickets} icon={Wrench} color="text-cyan-600 dark:text-cyan-400" iconBg="bg-cyan-100 dark:bg-cyan-900/30" />
          <StatCard title="In Progress" value={inProgressTickets} icon={RefreshCcw} color="text-amber-600 dark:text-amber-400" iconBg="bg-amber-100 dark:bg-amber-900/30" />
          <StatCard title="High Priority" value={highPriorityTickets} icon={AlertTriangle} color="text-rose-600 dark:text-rose-400" iconBg="bg-rose-100 dark:bg-rose-900/30" />
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                All Reported Tickets
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Assign technicians and review attachments submitted by users.
              </p>
            </div>

            <button
              onClick={loadPageData}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-6 text-slate-500 dark:text-slate-400">
              No tickets found.
            </div>
          ) : (
            <div className="space-y-5">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-900 dark:to-slate-800 p-6 shadow-lg"
                >
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

                      {ticket.assignedTechnicianEmail && (
                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                          Assigned: {ticket.assignedTechnicianEmail}
                        </span>
                      )}
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
                          Technician Note
                        </p>
                        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                          {ticket.technicianNote}
                        </p>
                      </div>
                    )}

                    <TicketTimeline ticketId={ticket.id} />
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <select
                      value={assignment[ticket.id]?.technicianEmail || ""}
                      onChange={(e) =>
                        handleAssignmentChange(ticket.id, "technicianEmail", e.target.value)
                      }
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-sky-400"
                    >
                      <option value="">Select Technician</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.email}>
                          {tech.name} - {tech.email}
                        </option>
                      ))}
                    </select>

                    <input
                      value={assignment[ticket.id]?.adminNote || ""}
                      onChange={(e) =>
                        handleAssignmentChange(ticket.id, "adminNote", e.target.value)
                      }
                      placeholder="Admin Note"
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-sky-400"
                    />
                  </div>

                  <button
                    onClick={() => handleAssign(ticket.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-sky-600 px-5 py-3 text-white font-semibold transition hover:bg-slate-800 dark:hover:bg-sky-700"
                  >
                    <UserCheck size={18} />
                    Assign Technician
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminTicketsPage;