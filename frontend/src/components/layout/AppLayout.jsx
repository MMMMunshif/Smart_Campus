import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

function AppLayout({ children, title, role = "ADMIN" }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar role={role} />
      <main className="flex-1 flex flex-col min-h-screen p-6">
        <Header title={title} role={role} />
        <div className="mt-6 flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}

export default AppLayout;