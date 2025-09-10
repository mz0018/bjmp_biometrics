import { Link } from "react-router-dom";
import { FileText, UserPlus } from "lucide-react";
import LogoutButton from "../protectedRoute/LogoutButton";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="visitors-log"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <FileText size={20} />
            <span>Visitors Log</span>
          </Link>

          <Link
            to="register-face"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <UserPlus size={20} />
            <span>Register Face</span>
          </Link>
        </nav>
      </div>

      <LogoutButton />
    </aside>
  );
};

export default Sidebar;
