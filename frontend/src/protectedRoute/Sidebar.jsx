import { Link } from "react-router-dom";
import { FileText, UserPlus } from "lucide-react";
import LogoutButton from "../protectedRoute/LogoutButton";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  return (
    <aside
      className="w-64 bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between"
      aria-label="Admin Sidebar"
    >
      <div>
        {admin && (
          <h2 className="text-lg font-semibold mb-6 text-gray-800 capitalize">
            {admin.first_name} Admin Panel
          </h2>
        )}

        <nav aria-label="Main Navigation" className="flex flex-col gap-2">
          <Link
            to="visitors-log"
            aria-label="View Visitors Log"
            className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-100"
          >
            <FileText size={20} className="text-gray-600" aria-hidden="true" />
            <span className="text-gray-700 font-medium">Visitors Log</span>
          </Link>

          <Link
            to="register-face"
            aria-label="Register a new face"
            className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-100"
          >
            <UserPlus size={20} className="text-gray-600" aria-hidden="true" />
            <span className="text-gray-700 font-medium">Register Face</span>
          </Link>
        </nav>
      </div>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
