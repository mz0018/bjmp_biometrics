import { Link, useLocation } from "react-router-dom";
import { FileText, UserPlus } from "lucide-react";
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
      icon: FileText,
    },
    {
      to: "register-face",
      label: "Register New Visitor",
      icon: UserPlus,
    },
  ];

  return (
    <aside
    className="w-64 h-screen bg-white shadow-xl p-6 flex flex-col justify-between border border-gray-200"
    aria-label="Admin Sidebar"
  >
      <div>
        {admin && (
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-8 text-bjmp-blue capitalize">
            <img src="/img/BJMP-icon.png" className="h-12 w-12" />
            {admin.first_name}
          </h2>
        )}

        <nav aria-label="Main Navigation" className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.includes(to);
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={`flex items-center gap-3 p-3 rounded-sm transition-all ${
                  isActive
                    ? "bg-bjmp-blue text-black shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-black" : "text-gray-600"}
                  aria-hidden="true"
                />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
