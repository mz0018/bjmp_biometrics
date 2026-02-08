import { Link, useLocation } from "react-router-dom";
import {
  TableCellsSplit,
  Settings,
  ShieldUser,
  FileInput,
  ChevronLeft,
  ChevronRight,
  UserLock,
} from "lucide-react";
import LogoutButton from "../protectedRoute/LogoutButton";
import { useEffect, useState } from "react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [admin, setAdmin] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
  }, []);

  const navItems = [
    { to: "visitors-log", label: "Visitors Log", icon: TableCellsSplit },
    { to: "manage-inmate", label: "Inmate Registration", icon: ShieldUser },
    { to: "manage-visitor", label: "Visitor Registration", icon: FileInput },
    { to: "account-settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`h-full bg-[#232023] shadow-xl
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-72"}
      flex flex-col justify-between text-white`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`p-3 flex items-center gap-2 text-gray-400 cursor-pointer
        ${collapsed ? "justify-center" : "justify-start"}`}
      >
        {collapsed ? (
          <ChevronRight />
        ) : (
          <>
            <ChevronLeft />
            <span className="text-sm whitespace-nowrap">Close sidebar</span>
          </>
        )}
      </button>

      {/* Logo */}
      {admin && !collapsed && (
        <div className="flex justify-center my-6">
          <img
            src="/img/BJMP-icon.png"
            alt="Logo"
            className="h-32 object-contain"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname.includes(to);

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center rounded-md transition
              ${collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}
              ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        {!collapsed ? (
          <LogoutButton firstName={admin?.first_name ?? ""} />
        ) : (
          <div className="flex justify-center">
            <UserLock size={20} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
