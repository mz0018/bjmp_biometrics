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
      </main>
    </div>
    
  );
};

export default AdminDashboard;
