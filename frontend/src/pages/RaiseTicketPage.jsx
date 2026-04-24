import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { createTicketWithAttachment } from "../services/ticketService";
import { getAllResources } from "../services/resourceService";
import {
  AlertTriangle,
  Building2,
  FileUp,
  Send,
  ClipboardList,
} from "lucide-react";

function RaiseTicketPage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [resources, setResources] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch {
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setAttachment(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Attachment must be less than 5MB");
      e.target.value = "";
      setAttachment(null);
      return;
    }

    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Please enter issue title");
      return;
    }

    if (!form.resourceName) {
      toast.error("Please select related resource");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("resourceName", form.resourceName);
      formData.append("priority", form.priority);
      formData.append("createdByEmail", user.email);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await createTicketWithAttachment(formData);

      toast.success("Ticket raised successfully");

      setForm({
        title: "",
        description: "",
        resourceName: "",
        priority: "MEDIUM",
      });

      setAttachment(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorData = error?.response?.data;
      const message =
        typeof errorData === "string"
          ? errorData
          : errorData?.message || "Failed to create ticket";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Raise Ticket">
      <div className="max-w-5xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            <AlertTriangle size={16} />
            Incident Reporting
          </div>

          <h1 className="mt-5 text-4xl font-extrabold">
            Report a Campus Issue
          </h1>

          <p className="mt-3 max-w-3xl text-orange-50 text-lg">
            Submit maintenance, facility, or resource issues with optional image
            or document attachments.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 transition-colors duration-300">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-rose-100 dark:bg-rose-900/30 p-3 text-rose-600 dark:text-rose-400">
              <ClipboardList size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Ticket Details
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Add the issue information and attach evidence if available.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Issue Title"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-rose-400"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="resourceName"
                value={form.resourceName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-rose-400"
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
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-rose-400"
              >
                <option value="LOW">LOW Priority</option>
                <option value="MEDIUM">MEDIUM Priority</option>
                <option value="HIGH">HIGH Priority</option>
              </select>
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue clearly"
              rows="6"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-rose-400"
              required
            />

            <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-600 dark:text-sky-400">
                  <FileUp size={22} />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-white">
                    Attach Evidence
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Upload image, PDF, or document. Maximum file size: 5MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="mt-4 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-700 dark:text-slate-300"
                  />

                  {attachment && (
                    <p className="mt-3 text-sm font-semibold text-sky-600 dark:text-sky-400">
                      Selected: {attachment.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-rose-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-slate-800 dark:hover:bg-rose-700 disabled:opacity-60"
            >
              <Send size={20} />
              {loading ? "Submitting Ticket..." : "Submit Ticket"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default RaiseTicketPage;