import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogoutButton = ({ firstName = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full cursor-pointer"
      aria-label="Logout"
      title={firstName ? `Logout, ${firstName}` : "Logout"}
    >
      <LogOut size={18} />
      <span>{firstName ? `Logout, ${firstName}` : "Logout"}</span>
    </button>
  );
};

export default LogoutButton;
