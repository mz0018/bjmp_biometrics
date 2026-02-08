import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useVisitorsLogs from "../hooks/useVisitorsLogs";

const Header = () => {
  const [admin, setAdmin] = useState(null);
  const location = useLocation();
  const { isWsConnected } = useVisitorsLogs();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
  }, []);

  const routeInfo = {
    "/protectedRoute/visitors-log": {
      title: "Visitors Log",
      subtitle: "Restricted visitor records encrypted and audit-logged.",
    },
    "/protectedRoute/manage-inmate": {
      title: "Inmate Registration",
      subtitle: "Register inmates in the system.",
    },
    "/protectedRoute/manage-visitor": {
      title: "Visitor Registration",
      subtitle: "Register new visitors.",
    },
    "/protectedRoute/account-settings": {
      title: "Account Settings",
    },
  };

  const matchedRoute = Object.keys(routeInfo).find((path) =>
    location.pathname.includes(path)
  );

  const { title, subtitle } =
    routeInfo[matchedRoute] || {
      title: "Dashboard",
      subtitle: "Welcome to the admin dashboard.",
    };

  return (
    <header className="sticky top-0 z-10 bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="flex items-start gap-4">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>

          <div className="mt-2 flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isWsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isWsConnected
                ? "Live Recognition Active"
                : "Live Recognition Inactive"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
