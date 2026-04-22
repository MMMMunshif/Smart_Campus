import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import {
  getNotificationsByEmail,
  markNotificationAsRead,
} from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getNotificationsByEmail(user.email);
      setNotifications(data);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      toast.success("Notification marked as read");
      loadNotifications();
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  return (
    <AppLayout title="Notifications" role="USER">
      <div className="rounded-3xl bg-white shadow-2xl p-8">
        <p className="text-slate-500 mb-6">
          Stay updated with booking approvals, rejections, and other system events.
        </p>

        {loading ? (
          <p className="text-slate-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-slate-500">No notifications found.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-5 shadow-sm transition ${
                  notification.read
                    ? "bg-slate-50 border-slate-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="rounded-full bg-blue-600 text-white px-2 py-1 text-xs font-semibold">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600">{notification.message}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      {notification.createdAt}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="rounded-xl bg-slate-900 text-white px-4 py-2 font-medium hover:bg-slate-700 transition"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default NotificationsPage;