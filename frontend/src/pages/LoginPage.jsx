import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from "lucide-react";
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await loginUser(
        form.email.trim().toLowerCase(),
        form.password
      );

      await refreshUser();

      toast.success("Login successful");
      navigate("/app");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      loginWithGoogle();
    } catch {
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-sky-600 to-cyan-500 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg">
            <LogIn size={28} />
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-blue-100 leading-7">
            Sign in to continue to Smart Campus Operations Hub.
          </p>
        </div>

        <form
          onSubmit={handleEmailLogin}
          className="mt-8 space-y-4"
        >
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full rounded-2xl border border-white/30 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none"
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-2xl border border-white/30 bg-white pl-11 pr-12 py-3 text-slate-900 outline-none"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-100">
              Use your registered credentials
            </span>

            <Link
              to="/register"
              className="font-semibold text-white underline"
            >
              Need account?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white py-4 font-bold text-lg hover:bg-slate-700 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/30" />
          <span className="text-white/80 text-sm">or</span>
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full rounded-2xl bg-white text-slate-900 py-4 font-bold text-lg hover:bg-slate-100 transition disabled:opacity-60"
        >
          {googleLoading
            ? "Redirecting..."
            : "Continue with Google"}
        </button>

        <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-100">
          Google users may be asked to complete profile
          details on first sign in.
        </div>

        <p className="mt-6 text-white/80 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-white underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;