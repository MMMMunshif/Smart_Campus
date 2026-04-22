import { Link } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import PublicHeader from "../components/layout/PublicHeader";
import PublicFooter from "../components/layout/PublicFooter";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl hover:-translate-y-1 transition">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white">
        <Icon size={26} />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-blue-100 leading-7">{description}</p>
    </div>
  );
}

function RoleCard({ title, description, color }) {
  return (
    <div className={`rounded-3xl p-6 shadow-2xl ${color}`}>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-white/90 leading-7">{description}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 text-center shadow-xl">
      <h3 className="text-4xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-blue-100">{label}</p>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <PublicHeader />

      <section className="relative min-h-screen flex items-center pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-sky-600 to-cyan-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl">
              <Sparkles size={16} />
              Smart Campus Operations Hub
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight text-white">
              Modernize campus operations with one powerful platform.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-blue-100 leading-8 max-w-2xl">
              Manage facility bookings, maintenance tickets, technician updates,
              notifications, and role-based workflows through a clean, secure,
              and modern web experience.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-6 py-3 font-semibold shadow-lg hover:bg-slate-100 transition"
              >
                Continue with Google
                <ArrowRight size={18} />
              </a>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-white font-semibold hover:bg-white/10 transition"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <StatCard value="24/7" label="System Availability" />
            <StatCard value="Role-Based" label="Secure Access Control" />
            <StatCard value="Real-Time" label="Notification Updates" />
            <StatCard value="All-in-One" label="Booking & Incident Flow" />
          </div>
        </div>
      </section>

      <section id="features" className="relative bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white">
              Core platform capabilities
            </h2>
            <p className="mt-4 text-slate-300 text-lg">
              Designed for real university workflows with clarity and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <FeatureCard
              icon={CalendarCheck2}
              title="Smart Booking Workflow"
              description="Create, approve, reject, cancel, and monitor campus resource bookings with conflict prevention and clear status tracking."
            />
            <FeatureCard
              icon={Wrench}
              title="Maintenance & Incident Handling"
              description="Track faults, assign technicians, update resolutions, and manage maintenance workflows in one place."
            />
            <FeatureCard
              icon={BellRing}
              title="Real-Time Notifications"
              description="Keep users informed about approvals, rejections, comments, and operational status changes."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Google OAuth Login"
              description="Enable safe sign-in with role-based access control for users, admins, and technicians."
            />
            <FeatureCard
              icon={Building2}
              title="Facilities & Resource Catalogue"
              description="Maintain lecture halls, labs, equipment, and room metadata with fast filtering and search."
            />
            <FeatureCard
              icon={Users}
              title="Role-Based Operations"
              description="Provide tailored interfaces and permissions for different users across the campus ecosystem."
            />
          </div>
        </div>
      </section>

      <section id="roles" className="bg-gradient-to-b from-slate-950 to-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white">Built for every campus role</h2>
            <p className="mt-4 text-slate-300 text-lg">
              Different users, one connected operational platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard
              title="User"
              description="Submit bookings, track statuses, receive notifications, and monitor personal requests easily."
              color="bg-gradient-to-br from-sky-500 to-cyan-500"
            />
            <RoleCard
              title="Admin"
              description="Manage bookings, monitor system activity, review requests, and control operational workflows."
              color="bg-gradient-to-br from-indigo-600 to-violet-600"
            />
            <RoleCard
              title="Technician"
              description="Handle assigned maintenance work, update tickets, and keep issue resolution progress transparent."
              color="bg-gradient-to-br from-emerald-500 to-teal-500"
            />
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl">
            <h2 className="text-4xl font-bold text-white">
              One integrated solution for campus efficiency
            </h2>
            <p className="mt-6 text-slate-300 text-lg leading-8 max-w-4xl">
              Smart Campus Operations Hub combines resource bookings, maintenance
              ticketing, notifications, secure authentication, and role-based
              dashboards into a single platform designed to improve daily
              university operations with a modern digital experience.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="rounded-full bg-cyan-400 text-slate-950 px-6 py-3 font-bold hover:bg-cyan-300 transition"
              >
                Start with Google Login
              </a>
              <Link
                to="/admin/dashboard"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                View Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export default HomePage;