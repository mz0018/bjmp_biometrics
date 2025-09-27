import { lazy } from "react";
import { Outlet } from "react-router-dom";

const Sidebar = lazy(() => import("./Sidebar"));

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
