import { lazy } from "react";
import { Outlet } from "react-router-dom";
import Header from "../protectedRoute/Header";

const Sidebar = lazy(() => import("./Sidebar"));

const AdminDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Outlet />
        </div>

        <footer className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-sm text-gray-600 flex justify-end items-center space-x-6">
          <span>© 2025 Bureau of Jail Management Biometric System</span>
          <span>Version 1.0</span>
        </footer>

      </main>
    </div>
  );
};

export default AdminDashboard;
