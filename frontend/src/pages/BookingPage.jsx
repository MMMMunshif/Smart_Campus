import { useState } from "react";
import toast from "react-hot-toast";
import { createBooking } from "../services/bookingService";
import AppLayout from "../components/layout/AppLayout";

function BookingPage() {
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        expectedAttendees: Number(formData.expectedAttendees),
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
      };

      await createBooking(payload);
      toast.success("Booking submitted successfully!");

      setFormData({
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
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create booking. Check for time conflicts."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Create Booking" role="USER">
      <div className="rounded-3xl bg-white shadow-2xl p-8 max-w-5xl">
        <p className="text-slate-500 mb-6">
          Submit a new resource booking request.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="rounded-xl border p-3"
              placeholder="User Name"
              required
            />
            <input
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="rounded-xl border p-3"
              placeholder="User Email"
              required
            />
            <input
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              className="rounded-xl border p-3"
              placeholder="Resource Name"
              required
            />
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            />
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            />
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            />
            <input
              type="number"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              className="rounded-xl border p-3"
              placeholder="Expected Attendees"
              required
            />
            <input
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="rounded-xl border p-3"
              placeholder="Purpose"
              required
            />
          </div>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="mt-4 w-full rounded-xl border p-3"
            rows="4"
            placeholder="Remarks"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

export default BookingPage;