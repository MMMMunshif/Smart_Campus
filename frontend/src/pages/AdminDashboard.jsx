import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getDashboardSummary } from "../services/adminService";
import {
  exportBookingsReport,
  exportTicketsReport,
  exportResourcesReport,
} from "../services/adminReportService";
import {
  exportBookingsPdf,
  exportTicketsPdf,
  exportResourcesPdf,
} from "../services/adminPdfService";
import {
  Users,
  Building2,
  CalendarCheck,
  ClipboardList,
  ShieldCheck,
  Download,
  RefreshCcw,
  ArrowUpRight,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";

function Card({ title, value, icon: Icon, color, iconBg }) {
  return (
    <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {title}
          </p>
          <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
        </div>

        <div className={`rounded-2xl p-3 ${iconBg}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, action }) {
  return (
    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      {text}
    </div>
  );
}

function ListItem({ title, subtitle, badge }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 transition-colors duration-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-800 dark:text-white">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        {badge}
      </div>
    </div>
  );
}

function ExportMenuButton({
  label,
  colorClass,
  hoverClass,
  onCsv,
  onPdf,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-white font-semibold transition shadow-lg ${colorClass} ${hoverClass}`}
      >
        <Download size={18} />
        {label}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          <button
            onClick={async () => {
              setOpen(false);
              try {
                await onCsv();
                toast.success(`${label} CSV downloaded`);
              } catch {
                toast.error(`Failed to export ${label.toLowerCase()} CSV`);
              }
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FileSpreadsheet size={17} className="text-emerald-600" />
            Export as CSV
          </button>

          <button
            onClick={async () => {
              setOpen(false);
              try {
                await onPdf();
                toast.success(`${label} PDF downloaded`);
              } catch {
                toast.error(`Failed to export ${label.toLowerCase()} PDF`);
              }
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FileText size={17} className="text-rose-600" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await getDashboardSummary();
      setData(res);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!data) {
    return (
      <AppLayout title="Admin Dashboard">
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-slate-500 dark:text-slate-400 transition-colors duration-300">
          Loading dashboard...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Smart Campus Admin Hub
              </h1>
              <p className="mt-3 text-blue-50 text-lg max-w-3xl">
                Monitor users, resources, bookings, tickets, and campus operations
                from one professional dashboard.
              </p>
            </div>

            <button
              onClick={loadDashboard}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCcw size={16} />
              {refreshing ? "Refreshing..." : "Refresh Dashboard"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
          <Card
            title="Users"
            value={data.totalUsers}
            icon={Users}
            color="text-sky-600 dark:text-sky-400"
            iconBg="bg-sky-100 dark:bg-sky-900/30"
          />
          <Card
            title="Resources"
            value={data.totalResources}
            icon={Building2}
            color="text-cyan-600 dark:text-cyan-400"
            iconBg="bg-cyan-100 dark:bg-cyan-900/30"
          />
          <Card
            title="Bookings"
            value={data.totalBookings}
            icon={CalendarCheck}
            color="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <Card
            title="Tickets"
            value={data.totalTickets}
            icon={ClipboardList}
            color="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
          />
          <Card
            title="Pending Roles"
            value={data.pendingRoleRequests}
            icon={ShieldCheck}
            color="text-rose-600 dark:text-rose-400"
            iconBg="bg-rose-100 dark:bg-rose-900/30"
          />
        </div>

        <SectionCard
          title="Reports & Export"
          subtitle="Download real-time reports in CSV or professional PDF format."
        >
          <div className="grid md:grid-cols-3 gap-4">
            <ExportMenuButton
              label="Bookings"
              colorClass="bg-sky-500"
              hoverClass="hover:bg-sky-600"
              onCsv={exportBookingsReport}
              onPdf={exportBookingsPdf}
            />

            <ExportMenuButton
              label="Tickets"
              colorClass="bg-amber-500"
              hoverClass="hover:bg-amber-600"
              onCsv={exportTicketsReport}
              onPdf={exportTicketsPdf}
            />

            <ExportMenuButton
              label="Resources"
              colorClass="bg-emerald-500"
              hoverClass="hover:bg-emerald-600"
              onCsv={exportResourcesReport}
              onPdf={exportResourcesPdf}
            />
          </div>
        </SectionCard>

        <div className="grid xl:grid-cols-3 gap-6">
          <SectionCard
            title="Latest Users"
            subtitle="Recently active or added users in the system."
            action={
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 dark:text-sky-400">
                <ArrowUpRight size={16} />
                Recent
              </div>
            }
          >
            <div className="space-y-3">
              {data.latestUsers?.length === 0 ? (
                <EmptyState text="No users found." />
              ) : (
                data.latestUsers.map((u) => (
                  <ListItem
                    key={u.id}
                    title={u.name || "Unnamed User"}
                    subtitle={u.email || "No email"}
                    badge={
                      <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {u.role || "USER"}
                      </span>
                    }
                  />
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Latest Tickets"
            subtitle="Most recent maintenance and issue reports."
            action={
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <ArrowUpRight size={16} />
                Recent
              </div>
            }
          >
            <div className="space-y-3">
              {data.latestTickets?.length === 0 ? (
                <EmptyState text="No tickets found." />
              ) : (
                data.latestTickets.map((t) => (
                  <ListItem
                    key={t.id}
                    title={t.title || "Untitled Ticket"}
                    subtitle={t.resourceName || t.status || "No details"}
                    badge={
                      <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {t.status || "OPEN"}
                      </span>
                    }
                  />
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Latest Bookings"
            subtitle="Newest booking requests and reservations."
            action={
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight size={16} />
                Recent
              </div>
            }
          >
            <div className="space-y-3">
              {data.latestBookings?.length === 0 ? (
                <EmptyState text="No bookings found." />
              ) : (
                data.latestBookings.map((b) => (
                  <ListItem
                    key={b.id}
                    title={b.resourceName || "Unnamed Booking"}
                    subtitle={b.userName || b.userEmail || "No user"}
                    badge={
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {b.status || "PENDING"}
                      </span>
                    }
                  />
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;