import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getAllResources } from "../services/resourceService";
import { createBooking } from "../services/bookingService";

function BookingPage() {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    resourceId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
    remarks: "",
  });

  const loadResources = async () => {
    try {
      setLoadingResources(true);
      const data = await getAllResources();

      console.log("Resources API response:", data);
      console.log("Logged in user:", user);

      if (!Array.isArray(data)) {
        setResources([]);
        toast.error("Invalid resources response");
        return;
      }

      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
      setResources([]);
      toast.error("Failed to load available resources");
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    const currentUserType = (user?.userType || "").toUpperCase();
    const currentRole = (user?.role || "").toUpperCase();

    return resources.filter((resource) => {
      const availabilityStatus = (
        resource.availabilityStatus || ""
      ).toUpperCase();
      const allowedUserType = (resource.allowedUserType || "ALL").toUpperCase();

      const isAvailable = availabilityStatus === "AVAILABLE";

      const isAllowed =
        currentRole === "ADMIN" ||
        allowedUserType === "ALL" ||
        allowedUserType === currentUserType;

      return isAvailable && isAllowed;
    });
  }, [resources, user]);

  const selectedResource = filteredResources.find(
    (resource) => String(resource.id) === String(formData.resourceId)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resourceId) {
      toast.error("Please select a resource");
      return;
    }

    if (!formData.bookingDate) {
      toast.error("Please select a booking date");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error("Please select start and end time");
      return;
    }

    if (!formData.purpose.trim()) {
      toast.error("Please enter booking purpose");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        resourceId: Number(formData.resourceId),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        expectedAttendees: Number(formData.expectedAttendees || 0),
        remarks: formData.remarks,
        userEmail: user?.email,
        userName: user?.name,
      };

      console.log("Booking payload:", payload);

      await createBooking(payload);

      toast.success("Booking submitted successfully");

      setFormData({
        resourceId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Failed to submit booking:", error);
      toast.error(
        error?.response?.data?.message || "Failed to submit booking"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="New Booking" role="USER">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            Booking Details
          </h2>
          <p className="mb-6 text-slate-500">
            Fill in the details below to submit your booking request.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none"
                placeholder="Your name"
              />

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select Resource
              </label>
              <select
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
              >
                <option value="">
                  {loadingResources
                    ? "Loading available resources..."
                    : filteredResources.length === 0
                    ? "No available resources for your account"
                    : "Choose a resource"}
                </option>

                {filteredResources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.resourceName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Booking Date
                </label>
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  name="expectedAttendees"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                  placeholder="Enter attendee count"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Purpose
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                placeholder="Enter booking purpose"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                placeholder="Optional remarks"
              />
            </div>

            <button
              type="submit"
              disabled={
                submitting || loadingResources || filteredResources.length === 0
              }
              className="rounded-2xl bg-sky-600 px-6 py-4 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Resource Preview
            </h3>

            {selectedResource ? (
              <div className="space-y-3 rounded-2xl bg-slate-50 p-5 text-slate-700">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedResource.resourceName}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {selectedResource.resourceType || "-"}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {selectedResource.location || "-"}
                </p>
                <p>
                  <span className="font-semibold">Capacity:</span>{" "}
                  {selectedResource.capacity || "-"}
                </p>
                <p>
                  <span className="font-semibold">Allowed User Type:</span>{" "}
                  {selectedResource.allowedUserType || "-"}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
                Select an available resource to preview its details here.
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Debug Info
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold">User role:</span>{" "}
                {user?.role || "-"}
              </p>
              <p>
                <span className="font-semibold">User type:</span>{" "}
                {user?.userType || "-"}
              </p>
              <p>
                <span className="font-semibold">Total resources from API:</span>{" "}
                {resources.length}
              </p>
              <p>
                <span className="font-semibold">Visible resources:</span>{" "}
                {filteredResources.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default BookingPage;