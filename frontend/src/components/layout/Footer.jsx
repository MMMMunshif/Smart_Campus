function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 rounded-2xl bg-slate-900 text-white px-8 py-8 flex flex-col gap-6">

      {/* Top */}
      <div className="flex items-start justify-between flex-wrap gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3 max-w-[220px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.4" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.4" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white tracking-tight">Smart Campus</p>
              <p className="text-xs text-slate-400">Operations Hub</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Intelligent infrastructure management for modern campuses.
          </p>
        </div>

        {/* Nav columns */}
        <div className="flex gap-12 flex-wrap">

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Navigate</p>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Analytics</a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Bookings</a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Notifications</a>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">System</p>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Support</a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Documentation</a>
          </div>

        </div>

        {/* Status card */}
        <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 min-w-[180px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">All operational</span>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">API</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Database</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Auth</span>
              <span className="text-green-400">Online</span>
            </div>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Bottom */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-slate-500">
          © {currentYear} Smart Campus Operations Hub. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-600">v2.0.1</span>
          <span className="text-xs text-slate-500">Built for modern campuses</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;