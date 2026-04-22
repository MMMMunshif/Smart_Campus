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
    } catch (error) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
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
    } catch (error) {
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
    } catch (error) {
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

      if (searchType === "name") {
        data = await searchResourcesByName(searchValue);
      } else if (searchType === "type") {
        data = await searchResourcesByType(searchValue);
      } else {
        data = await searchResourcesByLocation(searchValue);
      }

      setResources(data);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AppLayout title="Manage Resources">
      <div className="max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">Campus Resource Management</h1>
          <p className="mt-3 max-w-3xl text-blue-50 text-lg leading-8">
            Create, organize, search, and maintain your university resource
            catalogue with a clean professional admin experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Resources</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {analytics.totalResources}
                </h3>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                <Building2 size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Available</p>
                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  {analytics.availableResources}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Unavailable</p>
                <h3 className="mt-2 text-3xl font-bold text-rose-600">
                  {analytics.unavailableResources}
                </h3>
              </div>
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <Layers3 size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Maintenance</p>
                <h3 className="mt-2 text-3xl font-bold text-amber-600">
                  {analytics.maintenanceResources}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <Wrench size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
          <div className="2xl:col-span-2 rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Resource" : "Add New Resource"}
              </h2>
              <p className="mt-2 text-slate-500">
                Create structured resources for halls, labs, meeting rooms, and
                equipment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="resourceName"
                value={form.resourceName}
                onChange={handleChange}
                placeholder="Resource Name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                required
              />

              <select
                name="resourceType"
                value={form.resourceType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                required
              >
                <option value="">Select Resource Type</option>
                <option value="Lecture Hall">Lecture Hall</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Meeting Room">Meeting Room</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Equipment">Equipment</option>
              </select>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                required
              />

              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="Capacity"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                required
              />

              <select
                name="availabilityStatus"
                value={form.availabilityStatus}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                required
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>

              <select
                name="allowedUserType"
                value={form.allowedUserType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                required
              >
                <option value="ALL">ALL</option>
                <option value="STUDENT">STUDENT</option>
                <option value="LECTURER">LECTURER</option>
                <option value="STAFF">STAFF</option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows="5"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  <PlusCircle size={18} />
                  {editingId ? "Update Resource" : "Add Resource"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  <RefreshCcw size={18} />
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="2xl:col-span-3 rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
            <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Resource Catalogue
                </h2>
                <p className="mt-2 text-slate-500">
                  Search and manage the available campus resource inventory.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                >
                  <option value="name">Search by Name</option>
                  <option value="type">Search by Type</option>
                  <option value="location">Search by Location</option>
                </select>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter search value"
                    className="rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
                >
                  Search
                </button>

                <button
                  onClick={loadResources}
                  className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading resources...</p>
            ) : resources.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-slate-500">
                No resources found.
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50/40 p-6 shadow-lg"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
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

                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-sky-500" />
                        <span>{resource.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-sky-500" />
                        <span>Capacity: {resource.capacity}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-sky-500" />
                        <span>Allowed for: {resource.allowedUserType}</span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {resource.description || "No description provided."}
                    </p>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Resource Usage Insights
              </h2>
              <p className="text-slate-500">
                Most frequently booked resources across the system.
              </p>
            </div>
          </div>

          {analytics.mostBookedResources.length === 0 ? (
            <p className="text-slate-500">No booking analytics available yet.</p>
          ) : (
            <div className="space-y-4 mt-6">
              {analytics.mostBookedResources.map((item, index) => (
                <div
                  key={item.resourceName}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4 border border-slate-200"
                >
                  <div>
                    <p className="text-sm text-slate-500">#{index + 1} Most Booked</p>
                    <h3 className="text-lg font-bold text-slate-800">
                      {item.resourceName}
                    </h3>
                  </div>

                  <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                    {item.bookingCount} bookings
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default ManageResourcesPage;