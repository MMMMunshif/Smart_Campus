import { useState } from "react";
import toast from "react-hot-toast";
import { completeProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const faculties = [
  "Faculty of Computing",
  "Faculty of Engineering",
  "Faculty of Business",
  "Faculty of Humanities & Sciences",
  "Faculty of Architecture",
  "Faculty of Graduate Studies",
  "Other",
];

function CompleteProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailFromQuery = searchParams.get("email");
  const email = user?.email || emailFromQuery || "";

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [form, setForm] = useState({
    phone: "",
    faculty: "",
    studentOrStaffId: "",
    userType: "",
    bio: "",
    requestedRole: "USER",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setPhotoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("phone", form.phone);
      formData.append("faculty", form.faculty);
      formData.append("studentOrStaffId", form.studentOrStaffId);
      formData.append("userType", form.userType);
      formData.append("bio", form.bio);
      formData.append("requestedRole", form.requestedRole);

      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }

      await completeProfile(email, formData);
      await refreshUser();

      toast.success("Profile completed successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to complete profile"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-sky-600 to-cyan-500 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center">
                1
              </div>
              <span className="text-white font-semibold">Account</span>
            </div>

            <div className="h-1 w-16 bg-white/40 rounded-full" />

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-cyan-300 text-slate-900 font-bold flex items-center justify-center">
                2
              </div>
              <span className="text-white font-semibold">Complete Profile</span>
            </div>

            <div className="h-1 w-16 bg-white/20 rounded-full" />

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white/30 text-white font-bold flex items-center justify-center">
                3
              </div>
              <span className="text-white/80 font-semibold">Dashboard</span>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white text-center">
            Complete Your Profile
          </h1>
          <p className="mt-3 text-blue-100 text-center">
            Please finish your onboarding before entering the dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2 flex flex-col items-center gap-3">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center text-5xl border-4 border-white/50 text-white select-none">
                👤
              </div>
            )}

            <label className="cursor-pointer bg-white text-slate-900 font-semibold px-5 py-2 rounded-xl hover:bg-slate-100 transition text-sm">
              {photoPreview ? "Change Photo" : "Upload Profile Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            value={email}
            readOnly
            className="rounded-xl p-3 bg-slate-100 text-slate-500 md:col-span-2"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="rounded-xl p-3 bg-white text-slate-900"
            required
          />

          <select
            name="faculty"
            value={form.faculty}
            onChange={handleChange}
            className="rounded-xl p-3 bg-white text-slate-900"
            required
          >
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>

          <input
            name="studentOrStaffId"
            value={form.studentOrStaffId}
            onChange={handleChange}
            placeholder="Student / Staff ID"
            className="rounded-xl p-3 bg-white text-slate-900"
            required
          />

          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            className="rounded-xl p-3 bg-white text-slate-900"
            required
          >
            <option value="">Select User Type</option>
            <option value="Student">Student</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Staff">Staff</option>
          </select>

          <select
            name="requestedRole"
            value={form.requestedRole}
            onChange={handleChange}
            className="rounded-xl p-3 bg-white text-slate-900 md:col-span-2"
          >
            <option value="USER">Normal User</option>
            <option value="TECHNICIAN">Request Technician Access</option>
            <option value="ADMIN">Request Admin Access</option>
          </select>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio (Optional)"
            className="rounded-xl p-3 bg-white text-slate-900 md:col-span-2"
            rows="4"
          />

          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-slate-900 text-white py-3 font-bold hover:bg-slate-700 transition"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfilePage;