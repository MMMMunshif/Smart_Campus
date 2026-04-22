import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

function AppLayout({ children, title }) {
  const { user } = useAuth();

  const currentRole = user?.role || "USER";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar role={currentRole} />

      <main className="flex-1 p-6">
        <Header title={title} role={currentRole} />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;