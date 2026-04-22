import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle, loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(form.email, form.password);
      await refreshUser();
      toast.success("Login successful");
      navigate("/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-sky-600 to-cyan-500 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white text-center">Welcome Back</h1>
        <p className="mt-3 text-blue-100 leading-7 text-center">
          Sign in to continue to Smart Campus Operations Hub.
        </p>

        <form onSubmit={handleEmailLogin} className="mt-8 space-y-4">
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
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 text-white py-4 font-bold text-lg hover:bg-slate-700 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/30" />
          <span className="text-white/80 text-sm">or</span>
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full rounded-2xl bg-white text-slate-900 py-4 font-bold text-lg hover:bg-slate-100 transition"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-white/80 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="font-bold text-white underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;