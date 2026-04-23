import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getTicketsByTechnician } from "../services/ticketService";
import {
  ClipboardList,
  CircleDashed,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

function StatCard({ title, value, icon: Icon, iconBg, iconColor, valueColor }) {
  return (
    <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</h3>
        </div>
        <div className={`rounded-2xl p-3 ${iconBg} ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function getPriorityBadge(priority) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
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
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
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

function TechnicianDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getTicketsByTechnician(user.email);
      setTickets(data);
    } catch (error) {
      toast.error("Failed to load technician dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const stats = useMemo(() => {
    const totalAssigned = tickets.length;
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
    const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
    const highPriority = tickets.filter((t) => t.priority === "HIGH").length;

    return { totalAssigned, inProgress, resolved, highPriority };
  }, [tickets]);

  const recentTickets = useMemo(() => tickets.slice(0, 5), [tickets]);

  return (
    <AppLayout title="Technician Dashboard">
      <div className="max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">
            Welcome back, {user?.name || "Technician"}
          </h1>
          <p className="mt-3 text-blue-50 text-lg leading-8 max-w-3xl">
            Track assigned maintenance tasks, update ticket progress, and resolve campus issues efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Assigned Tickets"
            value={stats.totalAssigned}
            icon={ClipboardList}
            iconBg="bg-sky-100"
            iconColor="text-sky-600"
            valueColor="text-slate-800"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={CircleDashed}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            valueColor="text-amber-600"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            valueColor="text-emerald-600"
          />
          <StatCard
            title="High Priority"
            value={stats.highPriority}
            icon={AlertTriangle}
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
            valueColor="text-rose-600"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Recent Assigned Tickets
                </h2>
                <p className="mt-2 text-slate-500">
                  The latest issues assigned to your technician account.
                </p>
              </div>

              <Link
                to="/technician/tickets"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading assigned tickets...</p>
            ) : recentTickets.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-slate-500">
                No tickets assigned yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50/40 p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {ticket.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Quick Actions
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Useful shortcuts for daily technician work.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Link
                  to="/technician/tickets"
                  className="block rounded-2xl bg-sky-50 border border-sky-100 px-4 py-4 font-semibold text-sky-700 transition hover:bg-sky-100"
                >
                  View Assigned Tickets
                </Link>

                <Link
                  to="/notifications"
                  className="block rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Check Notifications
                </Link>

                <Link
                  to="/profile"
                  className="block rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Update Profile
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Work Tips
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li>Prioritize high severity tickets first.</li>
                <li>Update progress notes whenever status changes.</li>
                <li>Resolve tickets only after confirming the issue is fixed.</li>
                <li>Keep technician notes clear and professional.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default TechnicianDashboard;