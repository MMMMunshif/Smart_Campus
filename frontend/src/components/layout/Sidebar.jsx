import { NavLink } from "react-router-dom";
import { navigationByRole } from "../../data/navigation";

function Sidebar({ role = "ADMIN" }) {
  const navItems = navigationByRole[role] || [];

  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white flex flex-col shadow-2xl">
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide">Smart Campus</h1>
        <p className="text-sm text-slate-400 mt-1">Operations Hub</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="rounded-2xl bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active Role</p>
          <p className="mt-1 text-lg font-semibold">{role}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;