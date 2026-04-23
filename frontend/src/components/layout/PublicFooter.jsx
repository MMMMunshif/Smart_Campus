function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold">Smart Campus</h3>
          <p className="mt-3 text-slate-300 leading-7">
            A modern campus operations platform for bookings, maintenance,
            notifications, and role-based management.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Navigate
          </h4>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>Home</li>
            <li>Bookings</li>
            <li>Notifications</li>
            <li>Dashboard</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            System
          </h4>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>Google OAuth Login</li>
            <li>Role Management</li>
            <li>Notifications</li>
            <li>Booking Workflow</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Project
          </h4>
          <p className="mt-4 text-slate-300 leading-7">
            Programming Applications and Frameworks (IT3030) Group Project
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
          <p>© 2026 Smart Campus Operations Hub. All rights reserved.</p>
          <p>Built for modern campus management.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;