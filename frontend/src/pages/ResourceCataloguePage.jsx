import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ResourceCataloguePage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const navigate = useNavigate();

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources();
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    let data = [...resources];

    if (search.trim()) {
      data = data.filter(
        (item) =>
          item.resourceName.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "ALL") {
      data = data.filter((item) => item.resourceType === typeFilter);
    }

    setFilteredResources(data);
  }, [search, typeFilter, resources]);

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

    switch (status) {
      case "AVAILABLE":
        return `${base} bg-emerald-100 text-emerald-700`;
      case "UNAVAILABLE":
        return `${base} bg-rose-100 text-rose-700`;
      case "MAINTENANCE":
        return `${base} bg-amber-100 text-amber-700`;
      default:
        return `${base} bg-slate-100 text-slate-700`;
    }
  };

  const goBooking = (resourceName) => {
    navigate(`/bookings/new?resource=${encodeURIComponent(resourceName)}`);
  };

  return (
    <AppLayout title="Browse Resources">
      <div className="max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">Campus Resource Catalogue</h1>
          <p className="mt-3 text-blue-50 text-lg leading-8">
            Browse lecture halls, laboratories, meeting rooms, and other campus
            facilities before booking.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resource or location"
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="ALL">All Types</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Equipment">Equipment</option>
            </select>

            <button
              onClick={loadResources}
              className="rounded-2xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading resources...</p>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow text-slate-500">
            No resources found.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                      <Building2 size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {resource.resourceName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {resource.resourceType}
                      </p>
                    </div>
                  </div>

                  <span className={getStatusBadge(resource.availabilityStatus)}>
                    {resource.availabilityStatus}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-sky-500" />
                    {resource.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-sky-500" />
                    Capacity: {resource.capacity}
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-sky-500" />
                    Allowed for: {resource.allowedUserType}
                  </div>

                  {resource.availabilityStatus === "MAINTENANCE" && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Wrench size={16} />
                      Under maintenance
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {resource.description || "No description available."}
                </p>

                <div className="mt-5">
                  {resource.availabilityStatus === "AVAILABLE" ? (
                    <button
                      onClick={() => goBooking(resource.resourceName)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-white font-semibold hover:bg-emerald-600"
                    >
                      <CalendarCheck size={18} />
                      Book Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="rounded-2xl bg-slate-200 px-5 py-3 text-slate-500 font-semibold cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default ResourceCataloguePage;