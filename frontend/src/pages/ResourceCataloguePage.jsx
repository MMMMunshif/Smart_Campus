import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getAllResources } from "../services/resourceService";
import toast from "react-hot-toast";
import {
  Building2,
  MapPin,
  Users,
  Search,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  RefreshCcw,
  Filter,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ResourceCataloguePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources();
      setResources(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    let data = [...resources];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.resourceName?.toLowerCase().includes(keyword) ||
          item.location?.toLowerCase().includes(keyword) ||
          item.resourceType?.toLowerCase().includes(keyword)
      );
    }

    if (typeFilter !== "ALL") {
      data = data.filter((item) => item.resourceType === typeFilter);
    }

    if (statusFilter !== "ALL") {
      data = data.filter((item) => item.availabilityStatus === statusFilter);
    }

    return data;
  }, [search, typeFilter, statusFilter, resources]);

  const resourceTypes = useMemo(() => {
    const types = resources
      .map((item) => item.resourceType)
      .filter(Boolean);

    return ["ALL", ...new Set(types)];
  }, [resources]);

  const stats = useMemo(() => {
    return {
      total: resources.length,
      available: resources.filter((r) => r.availabilityStatus === "AVAILABLE").length,
      maintenance: resources.filter((r) => r.availabilityStatus === "MAINTENANCE").length,
      unavailable: resources.filter((r) => r.availabilityStatus === "UNAVAILABLE").length,
    };
  }, [resources]);

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold";

    switch (status) {
      case "AVAILABLE":
        return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`;
      case "UNAVAILABLE":
        return `${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400`;
      case "MAINTENANCE":
        return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`;
      default:
        return `${base} bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
    }
  };

  const goBooking = (resourceName) => {
    navigate(`/bookings/new?resource=${encodeURIComponent(resourceName)}`);
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <AppLayout title="Browse Resources">
      <div className="max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 p-8 text-white shadow-2xl">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Layers size={16} />
              Campus Facilities
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Campus Resource Catalogue
            </h1>

            <p className="mt-3 max-w-3xl text-blue-50 text-lg leading-8">
              Browse lecture halls, laboratories, meeting rooms, auditoriums,
              and campus equipment before placing a booking request.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Resources
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {stats.total}
            </h3>
          </div>

          <div className="rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Available
            </p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.available}
            </h3>
          </div>

          <div className="rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Maintenance
            </p>
            <h3 className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.maintenance}
            </h3>
          </div>

          <div className="rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unavailable
            </p>
            <h3 className="mt-2 text-3xl font-bold text-rose-600 dark:text-rose-400">
              {stats.unavailable}
            </h3>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-600 dark:text-sky-400">
              <Filter size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Search & Filter
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Quickly find the right resource for your booking.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resource, type, or location"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-11 pr-4 py-3 text-slate-800 dark:text-white outline-none focus:border-sky-400"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-sky-400"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? "All Types" : type}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-sky-400"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={loadResources}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:hover:bg-sky-700"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>

            <button
              onClick={clearFilters}
              className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-slate-500 dark:text-slate-400">
            Loading resources...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-10 text-center">
            <Building2 size={44} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
              No Resources Found
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try changing the search keyword or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredResources.map((resource) => {
              const available = resource.availabilityStatus === "AVAILABLE";

              return (
                <div
                  key={resource.id}
                  className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-sky-100/70 dark:bg-sky-900/20 blur-2xl" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-600 dark:text-sky-400">
                        <Building2 size={26} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                          {resource.resourceName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {resource.resourceType}
                        </p>
                      </div>
                    </div>

                    <span className={getStatusBadge(resource.availabilityStatus)}>
                      {resource.availabilityStatus}
                    </span>
                  </div>

                  <div className="relative mt-5 grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-sky-500" />
                        <span>{resource.location || "No location"}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-sky-500" />
                        <span>Capacity: {resource.capacity || 0}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-sky-500" />
                        <span>Allowed: {resource.allowedUserType || "ALL"}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
                      {available ? (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={16} />
                          Ready for booking
                        </div>
                      ) : resource.availabilityStatus === "MAINTENANCE" ? (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <Wrench size={16} />
                          Under maintenance
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <XCircle size={16} />
                          Currently unavailable
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="relative mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {resource.description || "No description available."}
                  </p>

                  <div className="relative mt-6">
                    {available ? (
                      <button
                        onClick={() => goBooking(resource.resourceName)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-white font-semibold shadow-lg transition hover:bg-emerald-600"
                      >
                        <CalendarCheck size={18} />
                        Book Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="rounded-2xl bg-slate-200 dark:bg-slate-800 px-5 py-3 text-slate-500 dark:text-slate-500 font-semibold cursor-not-allowed"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default ResourceCataloguePage;