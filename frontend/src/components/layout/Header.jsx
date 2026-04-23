import {
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCircle2,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  User,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getNotificationsByEmail } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

function getUserTypeDisplay(userType) {
  if (!userType) return "Not Set";
  return userType;
}

function getUserTypeIcon(userType) {
  if (userType === "STUDENT") return GraduationCap;
  if (userType === "LECTURER" || userType === "STAFF") return Briefcase;
  return User;
}

function ApprovalBadge({ status }) {
  const config = {
    APPROVED: {
      label: "Approved",
      light: "bg-emerald-500 text-white shadow-emerald-200",
      dark: "dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/30",
      dot: "bg-emerald-300",
    },
    PENDING: {
      label: "Pending",
      light: "bg-amber-400 text-white shadow-amber-200",
      dark: "dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-500/30",
      dot: "bg-amber-200",
    },
    REJECTED: {
      label: "Rejected",
      light: "bg-rose-500 text-white shadow-rose-200",
      dark: "dark:bg-rose-500/20 dark:text-rose-300 dark:border dark:border-rose-500/30",
      dot: "bg-rose-300",
    },
    NONE: {
      label: "No Role",
      light: "bg-slate-400 text-white",
      dark: "dark:bg-slate-700 dark:text-slate-400 dark:border dark:border-slate-600",
      dot: "bg-slate-300",
    },
  };

  const c = config[status] || config.NONE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-md
        ${c.light} ${c.dark}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

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
        setUnreadCount(data.filter((item) => !item.read).length);
      } catch {
        console.error("Failed to load unread notifications");
      }
    };
    loadUnreadCount();
  }, [user]);

  const displayRole = useMemo(() => role || user?.role || "USER", [role, user]);
  const displayUserType = useMemo(() => getUserTypeDisplay(user?.userType), [user]);
  const approvalStatus = user?.approvalStatus || "NONE";
  const UserTypeIcon = getUserTypeIcon(user?.userType);

  return (
    <header className="relative overflow-hidden rounded-2xl transition-all duration-500
      /* Light: vivid gradient canvas */
      bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500
      shadow-[0_8px_32px_rgba(14,116,144,0.25)]
      /* Dark: deep slate */
      dark:bg-none dark:bg-slate-900
      dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      dark:border dark:border-slate-800
    ">

      {/* ── Light mode decorative blobs ── */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-blue-300/20 blur-xl" />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Dark mode decorative blobs ── */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />
      </div>

      <div className="relative px-6 py-5">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5">

          {/* ── Left: Branding + Title ── */}
          <div>
            {/* Eyebrow label */}
            <div className="inline-flex items-center gap-1.5 rounded-full
              bg-white/20 dark:bg-sky-500/10
              border border-white/30 dark:border-sky-500/20
              px-3 py-1 backdrop-blur-sm">
              <Sparkles size={11} className="text-white dark:text-sky-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-white dark:text-sky-400">
                Smart Campus Operations
              </p>
            </div>

            {/* Page title */}
            <h2 className="mt-3 text-3xl font-black tracking-tight
              text-white dark:text-slate-100
              drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              {title}
            </h2>

            <p className="mt-1.5 text-sm font-medium
              text-sky-50/80 dark:text-slate-400 max-w-lg">
              Manage and monitor campus activities with real-time access insights.
            </p>

            {/* Pending role banner */}
            {approvalStatus === "PENDING" && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl
                bg-amber-400/20 border border-amber-300/40
                dark:bg-amber-900/20 dark:border-amber-500/30
                px-4 py-2 text-sm font-semibold
                text-white dark:text-amber-300 backdrop-blur-sm">
                <ShieldCheck size={15} />
                Your role request is awaiting admin approval.
              </div>
            )}
          </div>

          {/* ── Right: Controls ── */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              title="Toggle theme"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl
                bg-white/20 hover:bg-white/30
                dark:bg-slate-800 dark:hover:bg-slate-700
                border border-white/30 dark:border-slate-700
                text-white dark:text-slate-300
                transition-all duration-200 backdrop-blur-sm
                hover:scale-105 active:scale-95"
            >
              {dark
                ? <Sun size={16} className="transition-transform group-hover:rotate-12" />
                : <Moon size={16} className="transition-transform group-hover:-rotate-12" />
              }
            </button>

            {/* Notifications bell */}
            <div className="relative">
              <button
                title="Notifications"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-xl
                  bg-white/20 hover:bg-white/30
                  dark:bg-slate-800 dark:hover:bg-slate-700
                  border border-white/30 dark:border-slate-700
                  text-white dark:text-slate-300
                  transition-all duration-200 backdrop-blur-sm
                  hover:scale-105 active:scale-95"
              >
                <Bell size={16} className="transition-transform group-hover:-rotate-12" />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-[20px] items-center
                  justify-center rounded-full bg-rose-500 px-1.5 py-0.5
                  text-[10px] font-black text-white shadow-lg shadow-rose-500/40
                  border-2 border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/25 dark:bg-slate-700" />

            {/* User Type pill */}
            <div className="flex items-center gap-2 rounded-xl
              bg-white/20 dark:bg-slate-800
              border border-white/30 dark:border-slate-700
              px-3.5 py-2 backdrop-blur-sm">
              <UserTypeIcon size={14} className="text-white dark:text-sky-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest
                  text-white/60 dark:text-slate-500 leading-none">
                  Type
                </p>
                <p className="text-xs font-bold text-white dark:text-slate-100 mt-0.5">
                  {displayUserType}
                </p>
              </div>
            </div>

            {/* Access Role pill */}
            <div className="flex items-center gap-2 rounded-xl
              bg-white/20 dark:bg-slate-800
              border border-white/30 dark:border-slate-700
              px-3.5 py-2 backdrop-blur-sm">
              <ShieldCheck size={14} className="text-white dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest
                  text-white/60 dark:text-slate-500 leading-none">
                  Role
                </p>
                <p className="text-xs font-bold text-white dark:text-slate-100 mt-0.5">
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Approval badge */}
            <ApprovalBadge status={approvalStatus} />

            {/* Divider */}
            <div className="h-8 w-px bg-white/25 dark:bg-slate-700" />

            {/* User avatar card */}
            <div className="flex items-center gap-3 rounded-xl
              bg-white/25 dark:bg-slate-800
              border border-white/35 dark:border-slate-700
              px-3 py-2 backdrop-blur-sm shadow-sm">
              <div className="h-9 w-9 overflow-hidden rounded-lg
                ring-2 ring-white/50 dark:ring-slate-600 shrink-0">
                {user?.profilePhoto ? (
                  <img
                    src={`http://localhost:8080${user.profilePhoto}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center
                    bg-white/30 dark:bg-slate-700">
                    <UserCircle2 size={22} className="text-white dark:text-slate-400" />
                  </div>
                )}
              </div>
              <div className="max-w-[160px]">
                <p className="truncate text-sm font-bold
                  text-white dark:text-slate-100 leading-tight">
                  {user?.name || "Guest User"}
                </p>
                <p className="truncate text-[11px]
                  text-white/65 dark:text-slate-500 mt-0.5">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logoutUser}
              className="inline-flex items-center gap-2 rounded-xl
                bg-white/90 hover:bg-white
                dark:bg-slate-700 dark:hover:bg-slate-600
                border border-white/50 dark:border-slate-600
                px-4 py-2.5 text-xs font-bold
                text-sky-700 dark:text-slate-200
                shadow-md shadow-black/10
                transition-all duration-200
                hover:scale-105 active:scale-95"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;