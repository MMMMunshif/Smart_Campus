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
  Building2,
  MapPin,
  Users,
  Search,
  RefreshCcw,
  Pencil,
  Trash2,
  PlusCircle,
  Layers3,
  ShieldCheck,
  ClipboardList,
  Wrench,
  BarChart3,
  X,
  ChevronDown,
  Sparkles,
  LayoutGrid,
  Trophy,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

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
    badge:
      "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800",
    dot: "bg-emerald-500",
  },
  UNAVAILABLE: {
    badge:
      "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-800",
    dot: "bg-rose-500",
  },
  MAINTENANCE: {
    badge:
      "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800",
    dot: "bg-amber-500",
  },
};

const TYPE_ICONS = {
  "Lecture Hall": Layers3,
  Laboratory: ClipboardList,
  "Meeting Room": Users,
  Auditorium: Building2,
  Equipment: Wrench,
};

const FIELD =
  "w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all duration-200 " +
  "border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 " +
  "focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 " +
  "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 " +
  "dark:focus:border-sky-500 dark:focus:bg-slate-700/80 dark:focus:ring-sky-900/40";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    badge:
      "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${cfg.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, iconCls, valueCls }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-sky-50/60 to-transparent dark:from-sky-950/20" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <h3 className={`mt-2 text-4xl font-extrabold tabular-nums ${valueCls}`}>
            {value}
          </h3>
        </div>
        <div className={`rounded-2xl p-3.5 ${iconCls}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ resource, onEdit, onDelete }) {
  const TypeIcon = TYPE_ICONS[resource.resourceType] ?? Building2;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm transition-all duration-200 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-900/40 dark:text-sky-400 dark:group-hover:bg-sky-500">
              <TypeIcon size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-800 dark:text-slate-100">
                {resource.resourceName}
              </h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {resource.resourceType}
              </p>
            </div>
          </div>
          <StatusBadge status={resource.availabilityStatus} />
        </div>

        <div className="flex-1 space-y-2.5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={14} className="flex-shrink-0 text-sky-500" />
            <span className="truncate">{resource.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <Users size={14} className="flex-shrink-0 text-sky-500" />
            <span>
              Capacity:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {resource.capacity}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <ShieldCheck size={14} className="flex-shrink-0 text-sky-500" />
            <span>
              Access:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {resource.allowedUserType}
              </strong>
            </span>
          </div>
        </div>

        {resource.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {resource.description}
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            onClick={() => onEdit(resource)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-md"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-rose-600 hover:shadow-md"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
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

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editingId) {
        await updateResource(editingId, payload);
        toast.success("Resource updated successfully");
      } else {
        await createResource(payload);
        toast.success("Resource added successfully");
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
      toast.success("Resource deleted successfully");
      loadResources();
    } catch {
      toast.error("Failed to delete resource");
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchValue.trim()) {
        await loadResources();
        return;
      }
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

  const maxBookings = Math.max(
    1,
    ...analytics.mostBookedResources.map((r) => r.bookingCount)
  );

  return (
    <AppLayout title="Manage Resources">
      <div className="max-w-7xl space-y-7">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Sparkles size={12} /> Admin Panel
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight xl:text-4xl">
                Campus Resource Management
              </h1>
              <p className="mt-2 max-w-2xl text-base text-blue-100/90 leading-relaxed">
                Create, organize, search, and maintain your university resource catalogue with a clean professional admin experience.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-3xl font-extrabold">{analytics.totalResources}</p>
                <p className="mt-0.5 text-xs font-medium text-blue-100">Total</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-3xl font-extrabold">{analytics.availableResources}</p>
                <p className="mt-0.5 text-xs font-medium text-blue-100">Live</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Resources"
            value={analytics.totalResources}
            icon={Building2}
            iconCls="bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
            valueCls="text-slate-800 dark:text-slate-100"
          />
          <StatCard
            label="Available"
            value={analytics.availableResources}
            icon={ShieldCheck}
            iconCls="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            valueCls="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Unavailable"
            value={analytics.unavailableResources}
            icon={Layers3}
            iconCls="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
            valueCls="text-rose-600 dark:text-rose-400"
          />
          <StatCard
            label="Maintenance"
            value={analytics.maintenanceResources}
            icon={Wrench}
            iconCls="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
            valueCls="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* ── Form + Catalogue ── */}
        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">

          {/* Form Panel */}
          <div className="2xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-400">
                  {editingId ? <Pencil size={11} /> : <PlusCircle size={11} />}
                  {editingId ? "Edit Mode" : "New Resource"}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {editingId ? "Edit Resource" : "Add New Resource"}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {editingId
                    ? "Update the resource details below."
                    : "Fill in the details to register a new campus resource."}
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Resource Name
                </label>
                <input
                  name="resourceName"
                  value={form.resourceName}
                  onChange={handleChange}
                  placeholder="e.g. Block A Hall 101"
                  className={FIELD}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Resource Type
                </label>
                <div className="relative">
                  <select
                    name="resourceType"
                    value={form.resourceType}
                    onChange={handleChange}
                    className={`${FIELD} appearance-none pr-10`}
                    required
                  >
                    <option value="">Select Resource Type</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Block A, Level 2"
                    className={FIELD}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 80"
                    className={FIELD}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="availabilityStatus"
                      value={form.availabilityStatus}
                      onChange={handleChange}
                      className={`${FIELD} appearance-none pr-10`}
                      required
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="UNAVAILABLE">UNAVAILABLE</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Allowed For
                  </label>
                  <div className="relative">
                    <select
                      name="allowedUserType"
                      value={form.allowedUserType}
                      onChange={handleChange}
                      className={`${FIELD} appearance-none pr-10`}
                      required
                    >
                      <option value="ALL">ALL</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="LECTURER">LECTURER</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of the resource…"
                  rows="4"
                  className={FIELD}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200/60 transition-all duration-200 hover:from-sky-600 hover:to-blue-600 dark:shadow-sky-900/40"
                >
                  <PlusCircle size={16} />
                  {editingId ? "Update Resource" : "Add Resource"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <RefreshCcw size={14} /> Reset
                </button>
              </div>
            </form>
          </div>

          {/* Catalogue Panel */}
          <div className="2xl:col-span-3 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <LayoutGrid size={11} /> Catalogue
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Resource Catalogue
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {resources.length} resource{resources.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-sky-500"
                  >
                    <option value="name">By Name</option>
                    <option value="type">By Type</option>
                    <option value="location">By Location</option>
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search resources…"
                    className="rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-sky-500"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
                >
                  Search
                </button>
                <button
                  onClick={loadResources}
                  title="Refresh"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <RefreshCcw size={15} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-[1.75rem] bg-slate-100 dark:bg-slate-700/50"
                  />
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <Building2 size={24} />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                  No resources found
                </p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  Try a different search or add a new resource.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Analytics ── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Resource Usage Insights
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Most frequently booked resources across the system.
              </p>
            </div>
          </div>

          {analytics.mostBookedResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-900/30">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Trophy size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No booking analytics available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.mostBookedResources.map((item, index) => {
                const pct = Math.round((item.bookingCount / maxBookings) * 100);
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={item.resourceName}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-sky-800 dark:hover:bg-sky-950/20"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl flex-shrink-0">
                          {medals[index] ?? `#${index + 1}`}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            #{index + 1} Most Booked
                          </p>
                          <h3 className="truncate text-base font-bold text-slate-800 dark:text-slate-100">
                            {item.resourceName}
                          </h3>
                        </div>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-400">
                        {item.bookingCount} bookings
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-xs font-medium text-slate-400 dark:text-slate-500">
                      {pct}% of top
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}

export default ManageResourcesPage;