import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="min-h-screen pl-80">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;