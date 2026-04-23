import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarCheck,
  CalendarDays,
  Building2,
  Wrench,
  Bell,
  Users,
  ClipboardList,
  UserCircle2,
  ShieldCheck,
  Layers3,
  Ticket,
} from "lucide-react";

const navigationByRole = {
  USER: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Browse Resources", path: "/resources", icon: Layers3 },
    { label: "New Booking", path: "/bookings/new", icon: CalendarPlus },
    { label: "My Bookings", path: "/bookings/my", icon: CalendarCheck },
    { label: "Raise Ticket", path: "/tickets/new", icon: Ticket },
    { label: "My Tickets", path: "/tickets/my", icon: ClipboardList },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/profile", icon: UserCircle2 },
    { label: "Booking Calendar", path: "/bookings/calendar", icon: CalendarDays },
  ],

  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Resources", path: "/admin/resources", icon: Building2 },
    { label: "Manage Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { label: "Manage Tickets", path: "/admin/tickets", icon: Wrench },
    { label: "Role Requests", path: "/admin/role-requests", icon: ShieldCheck },
    { label: "Users & Roles", path: "/admin/users", icon: Users },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/profile", icon: UserCircle2 },
  ],

  TECHNICIAN: [
    { label: "Dashboard", path: "/technician/dashboard", icon: LayoutDashboard },
    { label: "Assigned Tickets", path: "/technician/tickets", icon: ClipboardList },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/profile", icon: UserCircle2 },
  ],
};

function Sidebar({ role = "USER" }) {
  const navItems = navigationByRole[role] || [];

  return (
    <aside className="w-80 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[0_10px_40px_rgba(15,23,42,0.06)] flex flex-col transition-colors duration-300">
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="rounded-[1.75rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-5 text-white shadow-lg">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Smart Campus
          </h1>
          <p className="mt-1 text-sm text-blue-50">Operations Hub</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={`${role}-${item.path}`}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 pb-5">
        <div className="rounded-[1.75rem] border border-sky-100 dark:border-slate-700 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 p-5 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm transition-colors duration-300">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                Active Role
              </p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                {role}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Access menus and features based on the permissions assigned to your account.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;