import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllBookings,
  getBookingsByStatus,
  searchBookingsByResource,
  searchBookingsByDate,
  approveBooking,
  rejectBooking,
  cancelBooking,
} from "../services/bookingService";
import AppLayout from "../components/layout/AppLayout";
import {
  CalendarCheck,
  Search,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Ban,
  Clock,
  CalendarDays,
  Building2,
  User,
  Mail,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  FileX,
} from "lucide-react";

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800",
    dot: "bg-amber-500",
    row: "dark:bg-slate-800/80",
  },
  APPROVED: {
    badge: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800",
    dot: "bg-emerald-500",
    row: "dark:bg-slate-800/80",
  },
  REJECTED: {
    badge: "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-800",
    dot: "bg-rose-500",
    row: "dark:bg-slate-800/80",
  },
  CANCELLED: {
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:ring-slate-600",
    dot: "bg-slate-400",
    row: "dark:bg-slate-800/80",
  },
};

const FIELD_CLASS =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all duration-200 " +
  "focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 " +
  "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 " +
  "dark:focus:border-sky-500 dark:focus:bg-slate-700/80 dark:focus:ring-sky-900/40";

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.CANCELLED;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, colorScheme }) {
  const schemes = {
    sky:     { icon: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",         val: "text-slate-800 dark:text-slate-100" },
    amber:   { icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400", val: "text-amber-600 dark:text-amber-400" },
    emerald: { icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400", val: "text-emerald-600 dark:text-emerald-400" },
    rose:    { icon: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",     val: "text-rose-600 dark:text-rose-400" },
  };
  const s = schemes[colorScheme] || schemes.sky;
  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-sky-50/60 to-transparent dark:from-sky-950/20" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
          <h3 className={`mt-2 text-4xl font-extrabold tabular-nums ${s.val}`}>{value}</h3>
        </div>
        <div className={`rounded-2xl p-3.5 ${s.icon}`}><Icon size={22} /></div>
      </div>
    </div>
  );
}

// ── Rejection modal ────────────────────────────────────────────────────────────
function RejectModal({ bookingId, onConfirm, onClose }) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            <XCircle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Reject Booking</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Provide a reason for rejection.</p>
          </div>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter rejection reason…"
          rows={4}
          className={`${FIELD_CLASS} w-full`}
          autoFocus
        />
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => note.trim() && onConfirm(bookingId, note)}
            disabled={!note.trim()}
            className="flex-1 rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-600 disabled:opacity-40"
          >
            Confirm Reject
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      toast.success("Booking approved");
      loadBookings();
    } catch { toast.error("Approve failed"); }
  };

  const confirmReject = async (id, note) => {
    try {
      await rejectBooking(id, note);
      toast.success("Booking rejected");
      setRejectTarget(null);
      loadBookings();
    } catch { toast.error("Reject failed"); }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      loadBookings();
    } catch { toast.error("Cancel failed"); }
  };

  const handleStatusFilter = async (value) => {
    setStatusFilter(value);
    try {
      setLoading(true);
      if (!value) { await loadBookings(); return; }
      const data = await getBookingsByStatus(value);
      setBookings(data);
    } catch { toast.error("Failed to filter by status"); }
    finally { setLoading(false); }
  };

  const handleResourceSearch = async () => {
    if (!resourceSearch.trim()) { loadBookings(); return; }
    try {
      setLoading(true);
      const data = await searchBookingsByResource(resourceSearch);
      setBookings(data);
    } catch { toast.error("Resource search failed"); }
    finally { setLoading(false); }
  };

  const handleDateFilter = async (value) => {
    setDateFilter(value);
    if (!value) { loadBookings(); return; }
    try {
      setLoading(true);
      const data = await searchBookingsByDate(value);
      setBookings(data);
    } catch { toast.error("Date filter failed"); }
    finally { setLoading(false); }
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setResourceSearch("");
    setDateFilter("");
    loadBookings();
  };

  const total     = bookings.length;
  const pending   = bookings.filter((b) => b.status === "PENDING").length;
  const approved  = bookings.filter((b) => b.status === "APPROVED").length;
  const rejected  = bookings.filter((b) => b.status === "REJECTED").length;

  return (
    <AppLayout title="Manage Bookings" role="ADMIN">
      {rejectTarget && (
        <RejectModal
          bookingId={rejectTarget}
          onConfirm={confirmReject}
          onClose={() => setRejectTarget(null)}
        />
      )}

      <div className="max-w-7xl space-y-7">

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Sparkles size={12} /> Admin Panel
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight xl:text-4xl">
                Booking Management
              </h1>
              <p className="mt-2 max-w-2xl text-base text-blue-100/90 leading-relaxed">
                Review, approve, reject, and monitor all campus resource booking requests in one place.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Total", value: total },
                { label: "Pending", value: pending },
                { label: "Approved", value: approved },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm min-w-[72px]">
                  <p className="text-3xl font-extrabold">{s.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-blue-100">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Bookings" value={total}    icon={CalendarCheck}  colorScheme="sky"     />
          <StatCard label="Pending"        value={pending}  icon={Clock}          colorScheme="amber"   />
          <StatCard label="Approved"       value={approved} icon={CheckCircle2}   colorScheme="emerald" />
          <StatCard label="Rejected"       value={rejected} icon={XCircle}        colorScheme="rose"    />
        </div>

        {/* ── Table Panel ── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">

          {/* Panel header + filters */}
          <div className="border-b border-slate-100 px-8 py-6 dark:border-slate-700/60">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <SlidersHorizontal size={11} /> Filters
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">All Bookings</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {bookings.length} result{bookings.length !== 1 ? "s" : ""} shown
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Status filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className={`${FIELD_CLASS} appearance-none pr-9`}
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Resource search */}
                <div className="relative">
                  <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResourceSearch()}
                    placeholder="Resource name…"
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>

                {/* Date filter */}
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => handleDateFilter(e.target.value)}
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>

                <button
                  onClick={handleResourceSearch}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600"
                >
                  <Search size={14} /> Search
                </button>

                <button
                  onClick={handleResetFilters}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  title="Reset filters"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Table body */}
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/50" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <FileX size={24} />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">No bookings found</p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-sm">
                  <thead>
                    <tr>
                      {["User", "Resource", "Date", "Time", "Status", "Admin Note", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="group transition-all duration-150"
                      >
                        {/* User */}
                        <td className="rounded-l-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
                              <User size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{booking.userName}</p>
                              <p className="truncate text-xs text-slate-400 dark:text-slate-500">{booking.userEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* Resource */}
                        <td className="bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Building2 size={14} className="flex-shrink-0 text-sky-500" />
                            <span className="font-medium">{booking.resourceName}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <CalendarDays size={14} className="flex-shrink-0 text-sky-500" />
                            <span>{booking.bookingDate}</span>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Clock size={14} className="flex-shrink-0 text-sky-500" />
                            <span className="whitespace-nowrap">{booking.startTime} – {booking.endTime}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors">
                          <StatusBadge status={booking.status} />
                        </td>

                        {/* Admin note */}
                        <td className="bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors max-w-[180px]">
                          {booking.adminNote ? (
                            <span className="block truncate text-xs text-slate-500 dark:text-slate-400" title={booking.adminNote}>
                              {booking.adminNote}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="rounded-r-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleApprove(booking.id)}
                              disabled={booking.status !== "PENDING"}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button
                              onClick={() => setRejectTarget(booking.id)}
                              disabled={booking.status !== "PENDING"}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={booking.status !== "APPROVED"}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                              <Ban size={12} /> Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ManageBookings;