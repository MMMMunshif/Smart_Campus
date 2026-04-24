import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getAllUsers, updateUserRole } from "../services/userManagementService";
import { getAuth } from "../utils/auth";

const roleOptions = ["USER", "ADMIN"];

function UserRoleManagementPage() {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const updated = await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: updated.role } : user))
      );
      toast.success("User role updated");
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to update role";
      toast.error(message);
      await loadUsers();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AppLayout title="Users & Roles" role="ADMIN">
      <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">
        <p className="text-slate-500 mb-6">
          Manage account roles with role-based access control. Changes are logged and notified.
        </p>

        {loading ? (
          <p className="text-slate-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.email === auth?.email;
                  return (
                    <tr key={user.id} className="border-b border-slate-200">
                      <td className="p-4 font-medium text-slate-900">{user.name}</td>
                      <td className="p-4 text-slate-600">{user.username}</td>
                      <td className="p-4 text-slate-600">{user.email}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updatingId === user.id || isSelf}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
                          title={
                            isSelf
                              ? "You cannot change your own role from this screen."
                              : "Select a role"
                          }
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default UserRoleManagementPage;
