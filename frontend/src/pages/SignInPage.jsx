import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, LogIn, Globe, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { getGoogleOAuthStartUrl, getGoogleOAuthStatus, signin } from "../services/authService";
import { getDefaultPathByRole, saveAuth } from "../utils/auth";
import AuthShell from "../components/auth/AuthShell";

const oauthErrorText = (raw) => {
  if (!raw) return "Google sign-in failed.";

  const value = raw.toLowerCase();
  if (value.includes("deleted_client")) {
    return "Google OAuth client is deleted. Update Google Cloud client settings.";
  }
  if (value.includes("redirect uri mismatch") || value.includes("redirect_uri_mismatch")) {
    return "Google redirect URI mismatch. Check callback URL in Google Cloud.";
  }
  if (value.includes("token exchange failed") || value.includes("invalid_token_response")) {
    return "Google token exchange failed. Verify client ID and secret.";
  }
  if (value.includes("missing_email")) {
    return "Google account email is required for sign-in.";
  }

  return raw;
};

function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("oauthError");
    if (oauthError) {
      toast.error(oauthErrorText(decodeURIComponent(oauthError)));
      navigate("/signin", { replace: true });
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    let active = true;

    const loadGoogleStatus = async () => {
      try {
        const enabled = await getGoogleOAuthStatus();
        if (active) {
          setGoogleEnabled(enabled);
        }
      } catch {
        if (active) {
          setGoogleEnabled(false);
        }
      }
    };

    loadGoogleStatus();
    return () => {
      active = false;
    };
  }, []);

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
      const response = await signin(formData);
      saveAuth(response);
      toast.success("Signed in successfully");
      navigate(getDefaultPathByRole(response.role), { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Sign in failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Authentication"
      title="Sign In"
      subtitle="Access your Smart Campus workspace with role-based secure login."
      footerText="New here?"
      footerLinkText="Create an account"
      footerLinkTo="/signup"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Sign in role</p>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: "USER" }))}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                formData.role === "USER"
                  ? "bg-slate-900 text-white shadow"
                  : "bg-transparent text-slate-700 hover:bg-slate-200"
              }`}
            >
              USER
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: "ADMIN" }))}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                formData.role === "ADMIN"
                  ? "bg-slate-900 text-white shadow"
                  : "bg-transparent text-slate-700 hover:bg-slate-200"
              }`}
            >
              ADMIN
            </button>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
            <ShieldCheck size={13} />
            You must choose the role linked to your account.
          </p>
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Email
          <div className="relative mt-2">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="you@campus.edu"
              required
            />
          </div>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Password
          <div className="relative mt-2">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-11 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 py-3 font-semibold text-white transition hover:from-slate-800 hover:to-slate-600 disabled:opacity-60"
        >
          <LogIn size={16} />
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="relative py-1">
          <div className="h-px bg-slate-200" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            or
          </span>
        </div>

        {googleEnabled ? (
          <a
            href={getGoogleOAuthStartUrl()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <Globe size={16} />
            Continue with Google
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 font-semibold text-slate-500"
            title="Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on backend to enable Google login"
          >
            Google Sign-In Not Configured
          </button>
        )}
      </form>
    </AuthShell>
  );
}

export default SignInPage;
