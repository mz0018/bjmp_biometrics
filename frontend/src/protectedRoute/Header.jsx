import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useVisitorsLogs from "../hooks/useVisitorsLogs";
import GenerateReports from "./GenerateReports";

const Header = () => {
  const [admin, setAdmin] = useState(null);
  const location = useLocation();
  const { isWsConnected } = useVisitorsLogs();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
  }, []);

  const routeInfo = {
    "/protectedRoute/register-face": {
      title: "Visitor Registration",
      subtitle: "Please provide the required details to register a new visitor.",
    },
    "/protectedRoute/visitors-log": {
      title: "Visitors Log",
      subtitle:
        "Restricted visitor records encrypted, access-limited, and audit-logged.",
    },
    "/protectedRoute/register-inmate": {
      title: "Inmate Registration",
      subtitle:
        "Please fill out the necessary information to register a new inmate in the system.",
    },
    "/protectedRoute/manage-user": {
      title: "User Management",
      subtitle:
        "Access and manage records of registered inmates and visitors.",
    },
  };

  const matchedRoute = Object.keys(routeInfo).find((path) =>
    location.pathname.includes(path)
  );

  const { title, subtitle } =
    routeInfo[matchedRoute] || {
      title: "Dashboard",
      subtitle: "Welcome to the admin dashboard overview.",
    };

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-lg px-6 py-4 flex justify-between items-center">
      {admin && (
        <>
        <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        <div className="mt-2 flex items-center gap-2">
        <div
            className={`w-3 h-3 rounded-full ${
            isWsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
            title={isWsConnected ? "Connected to server" : "Disconnected from server"}
        />
        <span className="text-xs text-gray-500">
            {isWsConnected ? "Live Recognition Active" : "Live Recognition Inactive"}
        </span>
        </div>
        </div>
        {/* <div className="text-sm text-gray-600">
          <GenerateReports />
        </div> */}
        </>
      )}
    </header>
  );
};

export default Header;
