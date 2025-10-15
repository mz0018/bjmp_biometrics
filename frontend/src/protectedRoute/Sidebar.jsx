import { Link, useLocation } from "react-router-dom";
import { UserPlus, TableCellsSplit, UserLock } from "lucide-react";
import LogoutButton from "../protectedRoute/LogoutButton";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [admin, setAdmin] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const navItems = [
    {
      to: "visitors-log",
      label: "Visitors Log",
      icon: TableCellsSplit,
    },
    {
      to: "register-face",
      label: "Visitor Registration",
      icon: UserPlus,
    },
    {
      to: "register-inmate",
      label: "Inmate Registration",
      icon: UserLock,
    },
  ];

  return (
    <aside
      className="w-64 min-h-[100dvh] min-h-screen flex-shrink-0 bg-[#232023] shadow-xl p-6 flex flex-col justify-between border border-gray-200 text-white overflow-y-auto"
      aria-label="Admin Sidebar"
    >
      <div>
        {admin && (
          <div className="flex flex-col items-center gap-2 mb-8">
            <img
              src="/img/BJMP-icon.png"
              alt={`${admin.first_name} avatar`}
              className="h-40 w-40 md:h-48 md:w-48 rounded-full object-cover border-2 border-white/20"
            />
            <div className="text-center">
              <div className="text-lg font-semibold capitalize">{admin.first_name}</div>
              {admin.last_name && (
                <div className="text-sm text-white/80 capitalize">{admin.last_name}</div>
              )}
            </div>
          </div>
        )}

        <nav aria-label="Main Navigation" className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.includes(to);
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 p-3 rounded-sm transition-all ${
                  isActive ? "bg-white/5 text-white shadow-md" : "text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} className="text-current" aria-hidden="true" />
                <span className={`font-medium ${isActive ? " decoration-white decoration-2 underline-offset-2" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4">
        <LogoutButton firstName={admin?.first_name ?? ""} />
      </div>
    </aside>
  );
};

export default Sidebar;
