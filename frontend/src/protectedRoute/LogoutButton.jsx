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
  };

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className="mt-4 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full cursor-pointer"
        aria-label="Logout"
        title={firstName ? `Logout, ${firstName}` : "Logout"}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="rounded-md shadow-lg w-full max-w-md flex flex-col">
            <div className="bg-[#232023] px-4 py-4 sm:px-6 sm:py-5 rounded-t-md shadow-md flex justify-between items-center">
              <h2 className="text-left text-lg sm:text-xl font-semibold text-white">
                Confirm Logout
              </h2>
              <button
                onClick={() => setConfirmOpen(false)}
                className="text-white hover:text-gray-300 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white flex-grow max-h-[70vh] p-4 sm:p-6 overflow-y-auto text-gray-700">
              <p>
                {`Are you sure you want to logout${firstName ? `, ${firstName}` : ""}?`}
              </p>
            </div>

            <div className="bg-[#232023] px-4 py-3 rounded-b-md flex flex-col items-end justify-center text-center space-y-1">
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 rounded-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
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
