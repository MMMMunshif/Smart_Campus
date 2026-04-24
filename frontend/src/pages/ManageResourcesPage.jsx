import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import {
  createResource,
  deleteResource,
  getAllResources,
  getResourceAnalytics,
  searchResourcesByLocation,
  searchResourcesByName,
  searchResourcesByType,
  updateResource,
} from "../services/resourceService";
import {
  Building2, MapPin, Users, Search, RefreshCcw, Pencil, Trash2,
  PlusCircle, Layers3, ShieldCheck, Wrench, BarChart3, X,
  ChevronDown, Sparkles, Trophy, FlaskConical, Mic2, MonitorPlay,
  CheckCircle2, AlertCircle, Clock,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const initialForm = {
  resourceName: "",
  resourceType: "",
  location: "",
  capacity: "",
  availabilityStatus: "AVAILABLE",
  allowedUserType: "ALL",
  description: "",
};

const STATUS_CONFIG = {
  AVAILABLE: {
    pill: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  UNAVAILABLE: {
    pill: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
    dot: "bg-rose-500",
    icon: AlertCircle,
  },
  MAINTENANCE: {
    pill: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    dot: "bg-amber-500",
    icon: Clock,
  },
};

const TYPE_CONFIG = {
  "Lecture Hall": {
    icon: MonitorPlay,
    light: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900",
    bar: "from-blue-400 to-blue-600",
  },
  Laboratory: {
    icon: FlaskConical,
    light: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900",
    bar: "from-violet-400 to-violet-600",
  },
  "Meeting Room": {
    icon: Users,
    light: "bg-teal-50 dark:bg-teal-950/30",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-900",
    bar: "from-teal-400 to-teal-600",
  },
  Auditorium: {
    icon: Mic2,
    light: "bg-pink-50 dark:bg-pink-950/30",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-100 dark:border-pink-900",
    bar: "from-pink-400 to-pink-600",
  },
  Equipment: {
    icon: Wrench,
    light: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900",
    bar: "from-orange-400 to-orange-600",
  },
};

const DEFAULT_TYPE = {
  icon: Building2,
  light: "bg-slate-50 dark:bg-slate-800/30",
  text: "text-slate-500 dark:text-slate-400",
  border: "border-slate-100 dark:border-slate-800",
  bar: "from-slate-400 to-slate-600",
};

const FIELD =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 " +
  "text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 " +
  "placeholder-slate-400 dark:placeholder-slate-600 outline-none " +
  "focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 " +
  "focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-all duration-150";

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["UNAVAILABLE"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${cfg.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status}
    </span>
  );
}

// ─── ResourceCard ─────────────────────────────────────────────────────────────

function ResourceCard({ resource, onEdit, onDelete }) {
  const cfg = TYPE_CONFIG[resource.resourceType] ?? DEFAULT_TYPE;
  const Icon = cfg.icon;

  return (
    <div className={`relative group bg-white dark:bg-slate-800/80 rounded-2xl border ${cfg.border} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.bar}`} />
      <div className="pl-5 pr-4 pt-4 pb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl ${cfg.light} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <Icon size={17} className={cfg.text} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">{resource.resourceName}</p>
              <p className={`text-xs font-medium ${cfg.text} mt-0.5`}>{resource.resourceType}</p>
            </div>
          </div>
          <StatusBadge status={resource.availabilityStatus} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "Location", value: resource.location },
            { label: "Capacity", value: resource.capacity },
            { label: "Access", value: resource.allowedUserType },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">{label}</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{value}</p>
            </div>
          ))}
        </div>

        {resource.description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mb-3 italic">{resource.description}</p>
        )}

        <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-700/50">
          <button onClick={() => onEdit(resource)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 transition-colors">
            <Pencil size={11} /> Edit
          </button>
          <button onClick={() => onDelete(resource.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-100 dark:border-rose-800 transition-colors">
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, iconBg, iconText, valueColor }) {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={19} className={iconText} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-black tabular-nums leading-tight mt-0.5 ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ManageResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [analytics, setAnalytics] = useState({
    totalResources: 0,
    availableResources: 0,
    unavailableResources: 0,
    maintenanceResources: 0,
    mostBookedResources: [],
  });

  const loadResources = async () => {
    try {
      setLoading(true);
      const [resourceData, analyticsData] = await Promise.all([
        getAllResources(),
        getResourceAnalytics(),
      ]);
      setResources(resourceData);
      setAnalytics(analyticsData);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResources(); }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const resetForm = () => { setForm(initialForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editingId) {
        await updateResource(editingId, payload);
        toast.success("Resource updated!");
      } else {
        await createResource(payload);
        toast.success("Resource added!");
      }
      resetForm();
      loadResources();
    } catch {
      toast.error("Failed to save resource");
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      resourceName: resource.resourceName || "",
      resourceType: resource.resourceType || "",
      location: resource.location || "",
      capacity: resource.capacity || "",
      availabilityStatus: resource.availabilityStatus || "AVAILABLE",
      allowedUserType: resource.allowedUserType || "ALL",
      description: resource.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      toast.success("Deleted!");
      loadResources();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchValue.trim()) { await loadResources(); return; }
      let data = [];
      if (searchType === "name") data = await searchResourcesByName(searchValue);
      else if (searchType === "type") data = await searchResourcesByType(searchValue);
      else data = await searchResourcesByLocation(searchValue);
      setResources(data);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const maxBookings = Math.max(1, ...analytics.mostBookedResources.map((r) => r.bookingCount));
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <AppLayout title="Manage Resources">
      <div className="max-w-7xl space-y-5">

        {/* ── HERO: Dark with indigo glow ── */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 px-8 py-7 text-white">
          <div className="pointer-events-none absolute -top-24 -left-12 w-80 h-80 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-8 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute top-4 right-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-3 py-1 text-xs font-bold text-indigo-300 mb-4 tracking-wide">
                <Sparkles size={10} /> ADMIN CONTROL PANEL
              </div>
              <h1 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-none">
                Resource Management
              </h1>
              <p className="text-indigo-400 font-bold text-xl mt-1">Smart Campus</p>
              <p className="mt-3 text-sm text-slate-400 max-w-lg leading-relaxed">
                Full control over campus facilities — add, edit, monitor, and analyze resource usage in real time.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {[
                { label: "Total", value: analytics.totalResources, color: "text-white" },
                { label: "Available", value: analytics.availableResources, color: "text-emerald-400" },
                { label: "Down", value: analytics.unavailableResources, color: "text-rose-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center backdrop-blur-sm hover:bg-white/10 transition-colors min-w-[72px]">
                  <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="All Resources" value={analytics.totalResources} icon={Building2}
            iconBg="bg-indigo-100 dark:bg-indigo-900/40" iconText="text-indigo-600 dark:text-indigo-400"
            valueColor="text-slate-800 dark:text-slate-100" />
          <StatCard label="Available" value={analytics.availableResources} icon={CheckCircle2}
            iconBg="bg-emerald-100 dark:bg-emerald-900/40" iconText="text-emerald-600 dark:text-emerald-400"
            valueColor="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Unavailable" value={analytics.unavailableResources} icon={AlertCircle}
            iconBg="bg-rose-100 dark:bg-rose-900/40" iconText="text-rose-500 dark:text-rose-400"
            valueColor="text-rose-500 dark:text-rose-400" />
          <StatCard label="Maintenance" value={analytics.maintenanceResources} icon={Wrench}
            iconBg="bg-amber-100 dark:bg-amber-900/40" iconText="text-amber-600 dark:text-amber-400"
            valueColor="text-amber-600 dark:text-amber-400" />
        </div>

        {/* ── FORM + CATALOGUE ── */}
        <div className="grid grid-cols-1 2xl:grid-cols-[380px_1fr] gap-5">

          {/* Form Panel */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
            <div className={`px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-700/60 ${editingId ? "bg-amber-50/70 dark:bg-amber-900/10" : "bg-indigo-50/60 dark:bg-indigo-900/10"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${editingId ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400"}`}>
                    {editingId ? <Pencil size={8} /> : <PlusCircle size={8} />}
                    {editingId ? "Edit Mode" : "New Resource"}
                  </span>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {editingId ? "Edit Resource" : "Add Resource"}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {editingId ? "Update details and save changes." : "Fill in all fields to register."}
                  </p>
                </div>
                {editingId && (
                  <button onClick={resetForm} className="w-8 h-8 rounded-xl flex items-center justify-center bg-white dark:bg-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Resource Name</label>
                <input name="resourceName" value={form.resourceName} onChange={handleChange} placeholder="e.g. Block A — Hall 101" className={FIELD} required />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Resource Type</label>
                <div className="relative">
                  <select name="resourceType" value={form.resourceType} onChange={handleChange} className={`${FIELD} appearance-none pr-9`} required>
                    <option value="">Choose type…</option>
                    <option>Lecture Hall</option>
                    <option>Laboratory</option>
                    <option>Meeting Room</option>
                    <option>Auditorium</option>
                    <option>Equipment</option>
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Block A, L2" className={FIELD} required />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Capacity</label>
                  <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="100" className={FIELD} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                  <div className="relative">
                    <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} className={`${FIELD} appearance-none pr-9`}>
                      <option value="AVAILABLE">Available</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Allowed For</label>
                  <div className="relative">
                    <select name="allowedUserType" value={form.allowedUserType} onChange={handleChange} className={`${FIELD} appearance-none pr-9`}>
                      <option value="ALL">All Users</option>
                      <option value="STUDENT">Student</option>
                      <option value="LECTURER">Lecturer</option>
                      <option value="STAFF">Staff</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional details…" rows={3} className={`${FIELD} resize-none`} />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button type="submit"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${editingId
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-amber-900/40"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/40"
                  }`}>
                  {editingId ? <><Pencil size={14} /> Update Resource</> : <><PlusCircle size={14} /> Add Resource</>}
                </button>
                <button type="button" onClick={resetForm}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <RefreshCcw size={13} />
                </button>
              </div>
            </form>
          </div>

          {/* Catalogue Panel */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    Resource Catalogue
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
                      {resources.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All registered campus resources</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}
                      className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2 pl-3 pr-7 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-400 transition-all">
                      <option value="name">By Name</option>
                      <option value="type">By Type</option>
                      <option value="location">By Location</option>
                    </select>
                    <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative flex-1 min-w-[150px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search resources…"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2 pl-9 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 transition-all" />
                  </div>
                  <button onClick={handleSearch}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-sm">
                    Search
                  </button>
                  <button onClick={loadResources}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <RefreshCcw size={13} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/40" />
                  ))}
                </div>
              ) : resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Building2 size={22} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No resources found</p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Try different filters or add a new resource.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ANALYTICS ── */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <BarChart3 size={18} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800 dark:text-slate-100">Booking Insights</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Most frequently booked campus resources</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800 px-3 py-1 rounded-full">
              Top {analytics.mostBookedResources.length}
            </span>
          </div>

          <div className="p-6">
            {analytics.mostBookedResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Trophy size={18} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No booking data yet</p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Analytics will appear once bookings are made.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {analytics.mostBookedResources.map((item, index) => {
                  const pct = Math.round((item.bookingCount / maxBookings) * 100);
                  const bars = ["from-indigo-500 to-violet-600", "from-blue-500 to-indigo-500", "from-teal-500 to-cyan-500", "from-emerald-500 to-teal-500"];
                  return (
                    <div key={item.resourceName}
                      className="group rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 transition-all duration-200">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg flex-shrink-0">{medals[index] ?? `#${index + 1}`}</span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">#{index + 1} Most Booked</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.resourceName}</p>
                          </div>
                        </div>
                        <span className="flex-shrink-0 text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-2.5 py-1 rounded-full">
                          {item.bookingCount}×
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${bars[index % bars.length]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{item.bookingCount} bookings</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{pct}% of top</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

export default ManageResourcesPage;