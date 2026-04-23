import { Link } from "react-router-dom";

function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#1e293b_42%,_#e2e8f0_42%,_#f1f5f9_100%)] p-6 md:p-10">
      <div className="absolute -left-10 top-24 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section className="hidden rounded-[28px] border border-white/20 bg-slate-950/70 p-10 text-white shadow-2xl backdrop-blur-lg lg:block">
          <p className="inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
            Smart Campus
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Secure, role-based operations for modern campus teams.
          </h1>
          <p className="mt-4 max-w-lg text-slate-300">
            Sign in with your account or Google to manage bookings, approvals, and notifications with clear role
            boundaries.
          </p>

          <div className="mt-8 grid gap-3 text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Real-time booking and approval updates
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Role-based access for USER and ADMIN workflows
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Unified authentication with Google OAuth 2.0
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-2xl backdrop-blur md:p-10">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{title}</h2>
          <p className="mt-2 text-slate-500">{subtitle}</p>

          <div className="mt-6">{children}</div>

          <p className="mt-7 text-sm text-slate-600">
            {footerText}{" "}
            <Link to={footerLinkTo} className="font-bold text-cyan-800 hover:text-cyan-700 underline">
              {footerLinkText}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default AuthShell;
