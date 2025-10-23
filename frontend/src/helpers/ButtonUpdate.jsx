import { useState } from "react";
import { X } from "lucide-react";
import useButtonUpdate from "../hooks/useButtonUpdate";

const ButtonUpdate = ({ id, userType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { findAndUpdate } = useButtonUpdate(id, userType);

  const handleOpen = () => {
    findAndUpdate();
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm"
        onClick={handleOpen}
      >
        Update
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Update Info</h2>
              <button onClick={handleClose}>
                <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>ID:</strong> {id}</p>
              <p><strong>User Type:</strong> {userType}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleClose}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonUpdate;
