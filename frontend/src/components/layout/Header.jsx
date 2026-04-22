import { Bell, Sun, Moon, LogOut, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotificationsByEmail } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

function Header({ title = "Dashboard", role = "USER" }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user?.email) return;
      try {
        const data = await getNotificationsByEmail(user.email);
        const unread = data.filter((item) => !item.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to load unread notifications");
      }
    };
    loadUnreadCount();
  }, [user]);

  return (
    <header className="
      rounded-[2rem] px-6 py-5
      bg-white border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.05)]
      dark:bg-slate-900 dark:border-slate-700/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
      transition-colors duration-300
    ">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

        {/* Title block */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Smart Campus Operations
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage and monitor campus activities with a clean professional workflow.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="
              inline-flex h-12 w-12 items-center justify-center rounded-2xl transition
              border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100
              dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
            "
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="
                inline-flex h-12 w-12 items-center justify-center rounded-2xl transition
                border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100
                dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
              "
              title="Notifications"
            >
              <Bell size={18} />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex min-w-[24px] items-center justify-center rounded-full bg-rose-500 px-2 py-1 text-xs font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Role badge */}
          <div className="
            rounded-2xl px-4 py-3
            border border-sky-100 bg-sky-50
            dark:border-sky-900/50 dark:bg-slate-800
          ">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              Role
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {role}
            </p>
          </div>

          {/* User profile pill */}
          <div className="
            flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm
            border border-slate-200 bg-white
            dark:border-slate-700 dark:bg-slate-800
          ">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700">
              {user?.profilePhoto ? (
                <img
                  src={`http://localhost:8080${user.profilePhoto}`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircle2 size={28} className="text-slate-500 dark:text-slate-400" />
              )}
            </div>
            <div className="max-w-[220px]">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {user?.name || "Guest User"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logoutUser}
            className="
              inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition
              bg-slate-900 text-white hover:bg-slate-800
              dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600
            "
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;