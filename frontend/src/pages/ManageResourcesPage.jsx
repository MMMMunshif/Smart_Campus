import { useEffect, useMemo, useState } from "react";
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

const ERROR_FIELD =
  "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-700 dark:bg-rose-950/20";

const RESOURCE_TYPES = [
  "Lecture Hall",
  "Laboratory",
  "Meeting Room",
  "Auditorium",
  "Equipment",
];

const STATUSES = ["AVAILABLE", "UNAVAILABLE", "MAINTENANCE"];
const USER_TYPES = ["ALL", "STUDENT", "LECTURER", "STAFF"];

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

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-rose-500">{message}</p>;
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

function ManageResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name");

  const [analytics, setAnalytics] = useState({
    totalResources: 0,
    availableResources: 0,
    unavailableResources: 0,
    maintenanceResources: 0,
    mostBookedResources: [],
  });

  const maxBookings = Math.max(
    1,
    ...analytics.mostBookedResources.map((r) => r.bookingCount)
  );

  const validateForm = () => {
    const newErrors = {};

    const resourceName = form.resourceName.trim();
    const resourceType = form.resourceType.trim();
    const location = form.location.trim();
    const capacity = Number(form.capacity);
    const description = form.description.trim();

    if (!resourceName) {
      newErrors.resourceName = "Resource name is required.";
    } else if (resourceName.length < 3) {
      newErrors.resourceName = "Resource name must be at least 3 characters.";
    } else if (resourceName.length > 80) {
      newErrors.resourceName = "Resource name cannot exceed 80 characters.";
    }

    const duplicate = resources.some(
      (r) =>
        r.resourceName?.trim().toLowerCase() === resourceName.toLowerCase() &&
        r.id !== editingId
    );

    if (duplicate) {
      newErrors.resourceName = "A resource with this name already exists.";
    }

    if (!resourceType) {
      newErrors.resourceType = "Please select a resource type.";
    } else if (!RESOURCE_TYPES.includes(resourceType)) {
      newErrors.resourceType = "Invalid resource type selected.";
    }

    if (!location) {
      newErrors.location = "Location is required.";
    } else if (location.length < 3) {
      newErrors.location = "Location must be at least 3 characters.";
    } else if (location.length > 100) {
      newErrors.location = "Location cannot exceed 100 characters.";
    }

    if (!form.capacity) {
      newErrors.capacity = "Capacity is required.";
    } else if (Number.isNaN(capacity)) {
      newErrors.capacity = "Capacity must be a valid number.";
    } else if (capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0.";
    } else if (!Number.isInteger(capacity)) {
      newErrors.capacity = "Capacity must be a whole number.";
    } else if (capacity > 10000) {
      newErrors.capacity = "Capacity cannot exceed 10,000.";
    }

    if (!STATUSES.includes(form.availabilityStatus)) {
      newErrors.availabilityStatus = "Invalid availability status.";
    }

    if (!USER_TYPES.includes(form.allowedUserType)) {
      newErrors.allowedUserType = "Invalid user type.";
    }

    if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted validation errors.");
      return false;
    }

    return true;
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const [resourceData, analyticsData] = await Promise.all([
        getAllResources(),
        getResourceAnalytics(),
      ]);

      setResources(Array.isArray(resourceData) ? resourceData : []);
      setAnalytics(analyticsData || {});
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        resourceName: form.resourceName.trim(),
        resourceType: form.resourceType.trim(),
        location: form.location.trim(),
        capacity: Number(form.capacity),
        availabilityStatus: form.availabilityStatus,
        allowedUserType: form.allowedUserType,
        description: form.description.trim(),
      };

      if (editingId) {
        await updateResource(editingId, payload);
        toast.success("Resource updated successfully");
      } else {
        await createResource(payload);
        toast.success("Resource added successfully");
      }

      resetForm();
      loadResources();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save resource");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setErrors({});

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
    const ok = window.confirm(
      "Are you sure you want to delete this resource? This action cannot be undone."
    );

    if (!ok) return;

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
      const value = searchValue.trim();

      if (!value) {
        toast.error("Please enter a search value.");
        return;
      }

      if (value.length < 2) {
        toast.error("Search value must be at least 2 characters.");
        return;
      }

      setLoading(true);

      let data = [];

      if (searchType === "name") data = await searchResourcesByName(value);
      else if (searchType === "type") data = await searchResourcesByType(value);
      else data = await searchResourcesByLocation(value);

      setResources(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Manage Resources">
      <div className="max-w-7xl space-y-7">
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
                Create, organize, search, validate, and maintain your university resource catalogue.
              </p>
            </div>

            <div className="flex gap-4 flex-shrink-0">
              <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-3xl font-extrabold">{analytics.totalResources || 0}</p>
                <p className="mt-0.5 text-xs font-medium text-blue-100">Total</p>
              </div>

              <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-3xl font-extrabold">{analytics.availableResources || 0}</p>
                <p className="mt-0.5 text-xs font-medium text-blue-100">Available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Resources"
            value={analytics.totalResources || 0}
            icon={Building2}
            iconCls="bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
            valueCls="text-slate-800 dark:text-slate-100"
          />
          <StatCard
            label="Available"
            value={analytics.availableResources || 0}
            icon={ShieldCheck}
            iconCls="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            valueCls="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Unavailable"
            value={analytics.unavailableResources || 0}
            icon={Layers3}
            iconCls="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
            valueCls="text-rose-600 dark:text-rose-400"
          />
          <StatCard
            label="Maintenance"
            value={analytics.maintenanceResources || 0}
            icon={Wrench}
            iconCls="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
            valueCls="text-amber-600 dark:text-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
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
                  Validation is applied before saving resource details.
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
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Resource Name
                </label>
                <input
                  name="resourceName"
                  value={form.resourceName}
                  onChange={handleChange}
                  placeholder="e.g. Block A Hall 101"
                  className={`${FIELD} ${errors.resourceName ? ERROR_FIELD : ""}`}
                />
                <FieldError message={errors.resourceName} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Resource Type
                </label>
                <div className="relative">
                  <select
                    name="resourceType"
                    value={form.resourceType}
                    onChange={handleChange}
                    className={`${FIELD} appearance-none pr-10 ${errors.resourceType ? ERROR_FIELD : ""}`}
                  >
                    <option value="">Select Resource Type</option>
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <FieldError message={errors.resourceType} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Block A, Level 2"
                    className={`${FIELD} ${errors.location ? ERROR_FIELD : ""}`}
                  />
                  <FieldError message={errors.location} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 80"
                    className={`${FIELD} ${errors.capacity ? ERROR_FIELD : ""}`}
                  />
                  <FieldError message={errors.capacity} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </label>
                  <select
                    name="availabilityStatus"
                    value={form.availabilityStatus}
                    onChange={handleChange}
                    className={`${FIELD} ${errors.availabilityStatus ? ERROR_FIELD : ""}`}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <FieldError message={errors.availabilityStatus} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Allowed For
                  </label>
                  <select
                    name="allowedUserType"
                    value={form.allowedUserType}
                    onChange={handleChange}
                    className={`${FIELD} ${errors.allowedUserType ? ERROR_FIELD : ""}`}
                  >
                    {USER_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <FieldError message={errors.allowedUserType} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of the resource…"
                  rows="4"
                  className={`${FIELD} ${errors.description ? ERROR_FIELD : ""}`}
                />
                <div className="flex justify-between">
                  <FieldError message={errors.description} />
                  <p className="ml-auto mt-1 text-xs text-slate-400">
                    {form.description.length}/500
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200/60 transition-all duration-200 hover:from-sky-600 hover:to-blue-600 disabled:opacity-60"
                >
                  <PlusCircle size={16} />
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Resource"
                    : "Add Resource"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <RefreshCcw size={14} /> Reset
                </button>
              </div>
            </form>
          </div>

          <div className="2xl:col-span-3 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/80">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <LayoutGrid size={11} /> Catalogue
                </div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Resource Catalogue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {resources.length} resource{resources.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                >
                  <option value="name">By Name</option>
                  <option value="type">By Type</option>
                  <option value="location">By Location</option>
                </select>

                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search resources…"
                    className="rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
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
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
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
                    className="h-56 animate-pulse rounded-[1.75rem] bg-slate-100"
                  />
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <Building2 size={28} className="mb-3 text-slate-400" />
                <p className="text-base font-semibold text-slate-600">
                  No resources found
                </p>
                <p className="mt-1 text-sm text-slate-400">
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

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Resource Usage Insights
              </h2>
              <p className="text-sm text-slate-500">
                Most frequently booked resources across the system.
              </p>
            </div>
          </div>

          {analytics.mostBookedResources?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <Trophy size={24} className="mb-3 text-slate-400" />
              <p className="text-sm font-semibold text-slate-500">
                No booking analytics available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.mostBookedResources?.map((item, index) => {
                const pct = Math.round((item.bookingCount / maxBookings) * 100);
                const medals = ["🥇", "🥈", "🥉"];

                return (
                  <div
                    key={item.resourceName}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/50"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl">{medals[index] ?? `#${index + 1}`}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            #{index + 1} Most Booked
                          </p>
                          <h3 className="truncate text-base font-bold text-slate-800">
                            {item.resourceName}
                          </h3>
                        </div>
                      </div>

                      <span className="rounded-full bg-sky-100 px-4 py-1.5 text-sm font-bold text-sky-700">
                        {item.bookingCount} bookings
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="mt-1.5 text-right text-xs font-medium text-slate-400">
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