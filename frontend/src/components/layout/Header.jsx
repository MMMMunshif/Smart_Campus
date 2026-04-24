import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";
import { clearAuth, getAuth } from "../../utils/auth";

function Header({ title = "Dashboard", role = "ADMIN" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const displayName = auth?.name || "Account";
  const displayEmail = auth?.email || "";
  const profileImageUrl = auth?.profileImageUrl || "";
  const fallbackGooglePhotoUrl = displayEmail
    ? `https://www.google.com/s2/photos/public?sz=128&email=${encodeURIComponent(displayEmail)}`
    : "";
  const resolvedPhotoUrl = profileImageUrl || fallbackGooglePhotoUrl;
  const initials = displayName.trim().charAt(0).toUpperCase() || "A";
  const [unreadCount, setUnreadCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelItems, setPanelItems] = useState([]);
  const [panelUpdating, setPanelUpdating] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    setImageError(false);
  }, [resolvedPhotoUrl]);

  useEffect(() => {
    let active = true;

    const loadCount = async () => {
      try {
        const count = await getUnreadCount();
        if (active) {
          setUnreadCount(count);
        }
      } catch {
        if (active) {
          setUnreadCount(0);
        }
      }
    };

    loadCount();
    const timerId = window.setInterval(loadCount, 15000);
    const focusHandler = () => loadCount();
    const notificationsUpdateHandler = () => loadCount();

    window.addEventListener("focus", focusHandler);
    window.addEventListener("notifications-updated", notificationsUpdateHandler);

    return () => {
      active = false;
      window.clearInterval(timerId);
      window.removeEventListener("focus", focusHandler);
      window.removeEventListener("notifications-updated", notificationsUpdateHandler);
    };
  }, [location.pathname]);

  useEffect(() => {
    const closePanel = () => setPanelOpen(false);
    closePanel();
  }, [location.pathname]);

  useEffect(() => {
    if (!panelOpen) {
      return;
    }

    const handleDocumentClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [panelOpen]);

  const loadPanelItems = async () => {
    try {
      setPanelLoading(true);
      const notifications = await getNotifications(false);
      setPanelItems(notifications.slice(0, 6));
    } catch {
      setPanelItems([]);
    } finally {
      setPanelLoading(false);
    }
  };

  const handleBellClick = async () => {
    const nextOpen = !panelOpen;
    setPanelOpen(nextOpen);
    if (nextOpen) {
      await loadPanelItems();
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      setPanelUpdating(true);
      await markNotificationAsRead(id);
      setPanelItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      // keep panel stable even if single update fails
    } finally {
      setPanelUpdating(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setPanelUpdating(true);
      await markAllNotificationsAsRead();
      setPanelItems((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      // keep panel stable even if bulk update fails
    } finally {
      setPanelUpdating(false);
    }
  };

  const openNotificationsPage = () => {
    setPanelOpen(false);
    navigate("/notifications");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/signin", { replace: true });
  };

  return (
    <header className="flex items-center justify-between rounded-3xl bg-white px-6 py-5 shadow-lg border border-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor campus operations efficiently.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{displayName}</p>
          <p className="text-xs text-slate-500">{displayEmail}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200">
          Role: {role}
        </span>
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={handleBellClick}
            className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100 transition"
            title="Open notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {panelOpen && (
            <div className="absolute right-0 z-40 mt-3 w-[360px] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
              <div className="flex items-center justify-between px-1 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={panelUpdating || unreadCount === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {panelLoading ? (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Loading notifications...</p>
                ) : panelItems.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No notifications yet.</p>
                ) : (
                  panelItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => (item.read ? openNotificationsPage() : handleMarkOneRead(item.id))}
                      disabled={panelUpdating}
                      className={`w-full rounded-xl border p-3 text-left transition hover:bg-slate-50 ${
                        item.read ? "border-slate-200 bg-slate-50" : "border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        {!item.read && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{item.message}</p>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={openNotificationsPage}
                className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                View all notifications
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
        {resolvedPhotoUrl && !imageError ? (
          <img
            src={resolvedPhotoUrl}
            alt={displayName}
            className="h-11 w-11 rounded-full object-cover shadow-md ring-2 ring-slate-200"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
            {initials}
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
