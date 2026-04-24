import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import {
  getNotificationsByEmail,
  markNotificationAsRead,
} from "../services/notificationService";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  BellOff,
  CheckCheck,
  Clock,
  Sparkles,
  MailOpen,
  Mail,
  RefreshCcw,
} from "lucide-react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationCard({ notification, onMarkRead }) {
  const isUnread = !notification.read;

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isUnread
          ? "border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50/60 shadow-sm dark:border-sky-800/60 dark:from-sky-950/40 dark:to-slate-800/80"
          : "border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/70"
      }`}
    >
      {/* Unread left accent bar */}
      {isUnread && (
        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-sky-400 to-blue-500" />
      )}

      <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          {/* Icon */}
          <div
            className={`flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-200 ${
              isUnread
                ? "bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-900/50 dark:text-sky-400 dark:group-hover:bg-sky-500"
                : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
            }`}
          >
            {isUnread ? <Mail size={18} /> : <MailOpen size={18} />}
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3
                className={`text-base font-bold ${
                  isUnread
                    ? "text-slate-800 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {notification.title}
              </h3>
              {isUnread && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  New
                </span>
              )}
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isUnread
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {notification.message}
            </p>

            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Clock size={11} />
              <span>{timeAgo(notification.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        {isUnread && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <CheckCheck size={14} />
            Mark as Read
          </button>
        )}

        {!isUnread && (
          <div className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400 dark:bg-slate-700/60 dark:text-slate-500">
            <CheckCheck size={13} />
            Read
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"

  const loadNotifications = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const data = await getNotificationsByEmail(user.email);
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      toast.success("Marked as read");
      loadNotifications();
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const FILTERS = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read", count: readCount },
  ];

  return (
    <AppLayout title="Notifications" role={user?.role || "USER"}>
      <div className="max-w-4xl space-y-6">

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-7 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Sparkles size={11} />
                Notification Center
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Your Notifications
              </h1>
              <p className="mt-1.5 text-sm text-blue-100/90">
                Stay updated with booking approvals, rejections, and system events.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-white/15 px-5 py-3.5 text-center backdrop-blur-sm">
                <p className="text-2xl font-extrabold">{unreadCount}</p>
                <p className="mt-0.5 text-xs font-medium text-blue-100">Unread</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3.5 text-center backdrop-blur-sm">
                <p className="text-2xl font-extrabold">{notifications.length}</p>
                <p className="mt-0.5 text-xs font-medium text-blue-100">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">

          {/* Panel toolbar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900/50">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    filter === f.key
                      ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      filter === f.key
                        ? f.key === "unread"
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300"
                        : "bg-transparent text-slate-400"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={loadNotifications}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCcw size={14} />
              Refresh
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-[1.5rem] bg-slate-100 dark:bg-slate-700/50"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <BellOff size={24} />
              </div>
              <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                {filter === "unread" ? "No unread notifications" : "No notifications found"}
              </p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "Notifications will appear here when triggered."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default NotificationsPage;