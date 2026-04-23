import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { createTicket } from "../services/ticketService";
import { getAllResources } from "../services/resourceService";

function RaiseTicketPage() {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    resourceName: "",
    priority: "MEDIUM",
  });

  const loadResources = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (error) {
      toast.error("Failed to load resources");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTicket({
        ...form,
        createdByEmail: user.email,
      });

      toast.success("Ticket raised successfully");
      setForm({
        title: "",
        description: "",
        resourceName: "",
        priority: "MEDIUM",
      });
    } catch (error) {
      toast.error("Failed to create ticket");
    }
  };

  return (
    <AppLayout title="Raise Ticket">
      <div className="max-w-4xl rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800">Report an Issue</h2>
        <p className="mt-2 text-slate-500">
          Submit a maintenance or facility issue related to a campus resource.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Issue Title"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            required
          />

          <select
            name="resourceName"
            value={form.resourceName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            required
          >
            <option value="">Select Related Resource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.resourceName}>
                {resource.resourceName}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue"
            rows="5"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            required
          />

          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

export default RaiseTicketPage;