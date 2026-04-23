import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";
import { getAuth } from "../utils/auth";

function typeBadge(type) {
  switch (type) {
    case "BOOKING_CREATED":
      return "bg-blue-100 text-blue-700";
    case "BOOKING_UPDATED":
      return "bg-amber-100 text-amber-700";
    case "ROLE_UPDATED":
      return "bg-purple-100 text-purple-700";
    case "SECURITY":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function NotificationsPage() {
  const auth = getAuth();
  const role = auth?.role || "USER";

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = async (showError = true) => {
    try {
      setLoading(true);
      const data = await getNotifications(unreadOnly);
      setNotifications(data);
    } catch {
      if (showError) {
        toast.error("Failed to load notifications");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      const updated = await markAllNotificationsAsRead();
      if (updated > 0) {
        toast.success(`${updated} notification(s) marked as read`);
      }
      await loadNotifications(false);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <AppLayout title="Notifications" role={role}>
      <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-slate-500">
            Stay updated on booking decisions, security events, and role changes.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Show unread only
            </label>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={markingAll}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition disabled:opacity-50"
            >
              {markingAll ? "Updating..." : "Mark All Read"}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-slate-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-slate-500">No notifications found.</p>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-2xl border p-4 transition ${
                  notification.read
                    ? "border-slate-200 bg-slate-50"
                    : "border-slate-300 bg-white shadow-sm"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{notification.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge(
                          notification.type
                        )}`}
                      >
                        {notification.type.replaceAll("_", " ")}
                      </span>
                      {!notification.read && (
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-700">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-slate-600">{notification.message}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default NotificationsPage;
