import { lazy, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../protectedRoute/Header";

const Sidebar = lazy(() => import("./Sidebar"));

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Outlet />
        </div>

        <footer className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-sm text-gray-600 text-right">
          © 2025 Bureau of Jail Management Biometric System
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
