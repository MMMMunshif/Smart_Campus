import { Link } from "react-router-dom";

function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/20 bg-slate-950/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Smart Campus
          </h1>
          <p className="text-sm text-cyan-200">Operations Hub</p>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium">
          <a href="#features" className="hover:text-cyan-300 transition">
            Features
          </a>
          <a href="#roles" className="hover:text-cyan-300 transition">
            Roles
          </a>
          <a href="#about" className="hover:text-cyan-300 transition">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="rounded-full border border-white/30 px-5 py-2 text-white hover:bg-white/10 transition"
          >
            Login
          </a>

          <Link
            to="/dashboard"
            className="rounded-full bg-white text-slate-900 px-5 py-2 font-semibold hover:bg-slate-100 transition"
          >
            Open App
          </Link>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;