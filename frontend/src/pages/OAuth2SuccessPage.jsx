import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDefaultPathByRole, saveAuth } from "../utils/auth";

function OAuth2SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const tokenType = searchParams.get("tokenType") || "Bearer";
    const role = searchParams.get("role");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const profileImageUrl = searchParams.get("profileImageUrl");

    if (!token || !role || !email) {
      toast.error("Google sign-in failed");
      navigate("/signin", { replace: true });
      return;
    }

    saveAuth({ token, tokenType, role, email, name, profileImageUrl });
    toast.success("Signed in with Google");
    navigate(getDefaultPathByRole(role), { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <p className="text-slate-700 font-medium">Completing Google sign-in...</p>
      </div>
    </div>
  );
}

export default OAuth2SuccessPage;
