import { useState } from "react";
import toast from "react-hot-toast";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      toast.success("Account created successfully");
      navigate(`/complete-profile?email=${encodeURIComponent(form.email)}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-sky-600 to-cyan-500 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white text-center">Create Account</h1>
        <p className="mt-3 text-blue-100 text-center">
          Register to access Smart Campus Operations Hub.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-xl p-3 bg-white text-slate-900"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-xl p-3 bg-white text-slate-900"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl p-3 bg-white text-slate-900"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 text-white py-3 font-bold hover:bg-slate-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;