import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/userService";
import {
  UserCircle2,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  ImagePlus,
  Save,
} from "lucide-react";

function badgeStyle(value) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  if (value === "ADMIN") return `${base} bg-rose-100 text-rose-700`;
  if (value === "TECHNICIAN") return `${base} bg-amber-100 text-amber-700`;
  if (value === "APPROVED") return `${base} bg-emerald-100 text-emerald-700`;
  if (value === "PENDING") return `${base} bg-sky-100 text-sky-700`;

  return `${base} bg-slate-100 text-slate-700`;
}

function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    phone: "",
    faculty: "",
    studentOrStaffId: "",
    userType: "",
    bio: "",
  });

  const [profileData, setProfileData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getProfile(user.email);
      setProfileData(data);
      setForm({
        phone: data.phone || "",
        faculty: data.faculty || "",
        studentOrStaffId: data.studentOrStaffId || "",
        userType: data.userType || "",
        bio: data.bio || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("phone", form.phone);
      formData.append("faculty", form.faculty);
      formData.append("studentOrStaffId", form.studentOrStaffId);
      formData.append("userType", form.userType);
      formData.append("bio", form.bio);

      if (photo) {
        formData.append("profilePhoto", photo);
      }

      await updateProfile(user.email, formData);
      await loadProfile();
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Profile">
        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8 text-slate-500">
          Loading profile...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile">
      <div className="max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">My Profile</h1>
          <p className="mt-3 text-blue-50 text-lg">
            Manage your account details, profile photo, and personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-32 w-32 overflow-hidden rounded-[2rem] bg-slate-100 flex items-center justify-center">
                {profileData?.profilePhoto ? (
                  <img
                    src={`http://localhost:8080${profileData.profilePhoto}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle2 size={72} className="text-slate-400" />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-800">
                {profileData?.name || "User"}
              </h2>

              <p className="mt-1 text-slate-500">{profileData?.email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className={badgeStyle(profileData?.role)}>
                  {profileData?.role || "USER"}
                </span>
                <span className={badgeStyle(profileData?.approvalStatus)}>
                  {profileData?.approvalStatus || "NONE"}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-sky-500" />
                <span>{profileData?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-sky-500" />
                <span>{profileData?.phone || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-sky-500" />
                <span>{profileData?.faculty || "No faculty added"}</span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCheck size={16} className="text-sky-500" />
                <span>{profileData?.studentOrStaffId || "No ID added"}</span>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
            <p className="mt-2 text-slate-500">
              Update your personal details and upload a new profile picture.
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />

                <input
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  placeholder="Faculty"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />

                <input
                  name="studentOrStaffId"
                  value={form.studentOrStaffId}
                  onChange={handleChange}
                  placeholder="Student / Staff ID"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />

                <input
                  name="userType"
                  value={form.userType}
                  onChange={handleChange}
                  placeholder="User Type"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Short Bio"
                rows="5"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />

              <div className="rounded-2xl border border-dashed border-slate-300 p-5">
                <label className="flex items-center gap-3 text-slate-700 font-semibold mb-3">
                  <ImagePlus size={18} className="text-sky-500" />
                  Upload New Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;