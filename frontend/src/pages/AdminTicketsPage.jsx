import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getAllTickets, assignTechnician } from "../services/ticketService";
import { getUsersByRole } from "../services/userService";
import {
  Wrench,
  AlertTriangle,
  ClipboardList,
  UserCheck,
  RefreshCcw,
} from "lucide-react";

function getPriorityBadge(priority) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (priority) {
    case "HIGH":
      return `${base} bg-rose-100 text-rose-700`;
    case "MEDIUM":
      return `${base} bg-amber-100 text-amber-700`;
    case "LOW":
      return `${base} bg-emerald-100 text-emerald-700`;
    default:
      return `${base} bg-slate-100 text-slate-700`;
  }
}

function getStatusBadge(status) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "OPEN":
      return `${base} bg-sky-100 text-sky-700`;
    case "IN_PROGRESS":
      return `${base} bg-amber-100 text-amber-700`;
    case "RESOLVED":
      return `${base} bg-emerald-100 text-emerald-700`;
    case "CLOSED":
      return `${base} bg-slate-200 text-slate-700`;
    default:
      return `${base} bg-slate-100 text-slate-700`;
  }
}

function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState({});

  const loadTickets = async () => {
    try {
      const data = await getAllTickets();
      setTickets(data);
    } catch (error) {
      toast.error("Failed to load tickets");
    }
  };

  const loadTechnicians = async () => {
    try {
      const data = await getUsersByRole("TECHNICIAN");
      setTechnicians(data);
    } catch (error) {
      toast.error("Failed to load technicians");
    }
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadTickets(), loadTechnicians()]);
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

      loadTickets();
    } catch (error) {
      toast.error("Failed to assign technician");
    }
  };

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const highPriorityTickets = tickets.filter(
    (t) => t.priority === "HIGH"
  ).length;

  return (
    <AppLayout title="Manage Tickets">
      <div className="max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">Ticket Management</h1>
          <p className="mt-3 text-blue-50 text-lg leading-8 max-w-3xl">
            Review reported issues, assign technicians, and track the progress
            of campus maintenance requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Tickets</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {totalTickets}
                </h3>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                <ClipboardList size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Open</p>
                <h3 className="mt-2 text-3xl font-bold text-sky-600">
                  {openTickets}
                </h3>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                <Wrench size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">In Progress</p>
                <h3 className="mt-2 text-3xl font-bold text-amber-600">
                  {inProgressTickets}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <RefreshCcw size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">High Priority</p>
                <h3 className="mt-2 text-3xl font-bold text-rose-600">
                  {highPriorityTickets}
                </h3>
              </div>
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                All Reported Tickets
              </h2>
              <p className="mt-2 text-slate-500">
                Assign technicians to open issues and manage campus maintenance workflow.
              </p>
            </div>

            <button
              onClick={loadPageData}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-slate-500">
              No tickets found.
            </div>
          ) : (
            <div className="space-y-5">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50/40 p-6 shadow-lg"
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">
                        {ticket.title}
                      </h3>

                      <p className="mt-2 text-slate-600 leading-7">
                        {ticket.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                          {ticket.resourceName}
                        </span>
                        <span className={getPriorityBadge(ticket.priority)}>
                          {ticket.priority}
                        </span>
                        <span className={getStatusBadge(ticket.status)}>
                          {ticket.status}
                        </span>
                        {ticket.assignedTechnicianEmail && (
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                            Assigned: {ticket.assignedTechnicianEmail}
                          </span>
                        )}
                      </div>

                      {ticket.adminNote && (
                        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
                          <p className="text-sm font-semibold text-slate-700">
                            Admin Note
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {ticket.adminNote}
                          </p>
                        </div>
                      )}

                      {ticket.technicianNote && (
                        <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                          <p className="text-sm font-semibold text-emerald-700">
                            Technician Note
                          </p>
                          <p className="mt-1 text-sm text-emerald-700">
                            {ticket.technicianNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <select
                      value={assignment[ticket.id]?.technicianEmail || ""}
                      onChange={(e) =>
                        handleAssignmentChange(
                          ticket.id,
                          "technicianEmail",
                          e.target.value
                        )
                      }
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
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
                        handleAssignmentChange(
                          ticket.id,
                          "adminNote",
                          e.target.value
                        )
                      }
                      placeholder="Admin Note"
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                    />
                  </div>

                  <button
                    onClick={() => handleAssign(ticket.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-white font-semibold transition hover:bg-slate-800"
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