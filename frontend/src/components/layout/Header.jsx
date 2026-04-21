function Header({ title = "Dashboard", role = "ADMIN" }) {
  return (
    <header className="flex items-center justify-between rounded-3xl bg-white px-6 py-5 shadow-lg border border-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor campus operations efficiently.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200">
          Role: {role}
        </span>
        <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
          A
        </div>
      </div>
    </header>
  );
}

export default Header;