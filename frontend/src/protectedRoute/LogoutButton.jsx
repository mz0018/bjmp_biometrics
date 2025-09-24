import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    navigate("/admin", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
