import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { createBooking } from "../services/bookingService";
import { getAllResources } from "../services/resourceService";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  FileText,
  Building2,
  AlertTriangle,
} from "lucide-react";

function BookingPage() {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    resourceName: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
    remarks: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userName: user.name || "",
        userEmail: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoadingResources(true);
        const data = await getAllResources();

        const currentUserType = (user?.userType || "").toUpperCase();

        const filteredResources = data.filter((item) => {
          const isAvailable = item.availabilityStatus === "AVAILABLE";
          const allowed =
            item.allowedUserType === "ALL" ||
            item.allowedUserType === currentUserType;

          return isAvailable && allowed;
        });

        setResources(filteredResources);
      } catch (error) {
        toast.error("Failed to load available resources");
      } finally {
        setLoadingResources(false);
      }
    };

    if (user) {
      loadResources();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectedResource = useMemo(
    () =>
      resources.find(
        (resource) => resource.resourceName === formData.resourceName
      ),
    [resources, formData.resourceName]
  );

  const capacityExceeded =
    selectedResource &&
    formData.expectedAttendees &&
    Number(formData.expectedAttendees) > Number(selectedResource.capacity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (capacityExceeded) {
      toast.error(
        `Expected attendees exceed the selected resource capacity of ${selectedResource.capacity}.`
      );
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        expectedAttendees: Number(formData.expectedAttendees),
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
      };

      await createBooking(payload);

      toast.success("Booking submitted successfully!");

      setFormData((prev) => ({
        ...prev,
        resourceName: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
        remarks: "",
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create booking. Check conflicts or input details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Create Booking">
      <div className="max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">Book a Campus Resource</h1>
          <p className="mt-3 text-blue-50 text-lg">
            Reserve halls, labs, meeting rooms, and other available campus
            resources through a clean and professional booking flow.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Booking Details
              </h2>
              <p className="mt-2 text-slate-500">
                Fill in the details below to submit your booking request.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="userName"
                  value={formData.userName}
                  readOnly
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                  placeholder="User Name"
                />

                <input
                  name="userEmail"
                  value={formData.userEmail}
                  readOnly
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                  placeholder="User Email"
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Resource
                  </label>
                  <select
                    name="resourceName"
                    value={formData.resourceName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                    required
                  >
                    <option value="">
                      {loadingResources
                        ? "Loading available resources..."
                        : "Choose a resource"}
                    </option>
                    {resources.map((resource) => (
                      <option key={resource.id} value={resource.resourceName}>
                        {resource.resourceName} — {resource.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Booking Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Expected Attendees
                  </label>
                  <div className="relative">
                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="number"
                      name="expectedAttendees"
                      value={formData.expectedAttendees}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border bg-white pl-11 pr-4 py-3 text-slate-800 outline-none ${
                        capacityExceeded
                          ? "border-rose-300 focus:border-rose-400"
                          : "border-slate-200 focus:border-sky-400"
                      }`}
                      placeholder="Enter attendee count"
                      required
                    />
                  </div>

                  {capacityExceeded && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                      <span>
                        Expected attendees exceed the selected resource capacity
                        of {selectedResource.capacity}.
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    End Time
                  </label>
                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Purpose
                  </label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />
                    <input
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                      placeholder="Purpose of booking"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
                  placeholder="Add any extra notes for the booking request"
                />
              </div>

              <button
                type="submit"
                disabled={loading || capacityExceeded}
                className="w-full rounded-2xl bg-slate-900 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Submitting Booking..." : "Submit Booking Request"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Resource Preview
              </h3>

              {selectedResource ? (
                <div className="space-y-4">
                  <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                    <Building2 size={52} />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-800">
                      {selectedResource.resourceName}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedResource.resourceType}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-sky-500" />
                      <span>{selectedResource.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-sky-500" />
                      <span>Capacity: {selectedResource.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-sky-500" />
                      <span>Allowed for: {selectedResource.allowedUserType}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {selectedResource.description || "No description available."}
                  </p>

                  <div className="space-y-3">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {selectedResource.availabilityStatus}
                    </span>

                    <p className="text-sm text-slate-500">
                      Maximum supported attendees: {selectedResource.capacity}
                    </p>

                    {capacityExceeded && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        This resource cannot accommodate your selected attendee
                        count.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
                  Select an available resource to preview its details here.
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Booking Tips
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li>Choose a resource suitable for your audience size.</li>
                <li>Only resources available for your user type will appear.</li>
                <li>Make sure your selected date and time are correct.</li>
                <li>Conflicting bookings are blocked automatically.</li>
                <li>Attendee count must not exceed resource capacity.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default BookingPage;