import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function ProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: "",
    faculty: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <AppLayout title="My Profile" role="USER">
      <div className="max-w-4xl rounded-[2rem] bg-white shadow-2xl p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="h-20 w-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold">
            {form.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-800">{form.name}</h2>
            <p className="text-slate-500">{form.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border p-3"
            placeholder="Full Name"
          />

          <input
            name="email"
            value={form.email}
            readOnly
            className="rounded-xl border p-3 bg-slate-100"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded-xl border p-3"
            placeholder="Phone Number"
          />

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            className="rounded-xl border p-3"
            placeholder="Department"
          />

          <input
            name="faculty"
            value={form.faculty}
            onChange={handleChange}
            className="rounded-xl border p-3 md:col-span-2"
            placeholder="Faculty"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-8 rounded-xl bg-slate-900 text-white px-8 py-3 font-semibold hover:bg-slate-700 transition"
        >
          Save Profile
        </button>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;