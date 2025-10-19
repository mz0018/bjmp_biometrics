import { lazy } from "react";
import { Outlet } from "react-router-dom";

const Sidebar = lazy(() => import("./Sidebar"));

const AdminDashboard = () => {
  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar />

      <main className="flex-1 min-h-[100dvh] overflow-hidden flex flex-col p-6 bg-gray-50">
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
