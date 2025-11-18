import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";

const LogoutButton = ({ firstName = "" }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin", { replace: true });
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className="mt-4 flex items-center justify-center font-semibold gap-2 text-red-400 px-4 py-2 rounded w-full cursor-pointer tracking-wider"
        aria-label="Logout"
        title={firstName ? `Logout, ${firstName}` : "Logout"}
      >
        <LogOut size={18} />
        <span>Sign out</span>
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="rounded-md shadow-lg w-full max-w-md flex flex-col">
            <div className="bg-white flex-grow max-h-[70vh] p-4 sm:p-6 overflow-y-auto text-gray-700 flex flex-col justify-center items-center text-center">
              <h1 className="text-2xl font-medium tracking-wider mb-2">Are you sure?</h1>
              <p className="text-sm text-gray-500">
                You will be logged out and will need to log in again if you want to continue using the app.
              </p>
            </div>

            <div className="bg-white px-4 py-3 rounded-b-md items-end justify-center text-center space-y-1">
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 rounded-sm text-red-500 border hover:bg-red-50 border-red-500 w-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-sm bg-red-500 hover:bg-red-600 text-white w-full cursor-pointer"
                >
                  Yes, Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
