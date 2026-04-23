import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import {
  getPendingRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
} from "../services/userService";

function RoleRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingRoleRequests();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load role requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveRoleRequest(id);
      toast.success("Role request approved");
      loadRequests();
    } catch (error) {
      toast.error("Failed to approve role request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRoleRequest(id);
      toast.success("Role request rejected");
      loadRequests();
    } catch (error) {
      toast.error("Failed to reject role request");
    }
  };

  return (
    <AppLayout title="Role Approval Requests" role="ADMIN">
      <div className="rounded-[2rem] bg-white shadow-2xl p-8">
        <p className="text-slate-500 mb-6">
          Review and manage user requests for elevated system roles.
        </p>

        {loading ? (
          <p className="text-slate-500">Loading role requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-500">No pending role requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">User Type</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Requested Role</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.userType || "-"}</td>
                    <td className="p-4">{user.faculty || "-"}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                        {user.requestedRole}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-sm font-medium">
                        {user.approvalStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="rounded-xl bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-500 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-500 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default RoleRequestsPage;