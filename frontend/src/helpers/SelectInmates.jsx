// SelectInmates.jsx
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import axios from "axios";

const SelectInmates = ({
  setIsSelectInmateClicked,
  isSelectInmateClicked,
  onAdd, // <-- accept callback
}) => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState([]); // track selected inmate ids

  const getInmates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/listofinmates`
      );
      setList(response.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setHasErrors(err.response.data);
      } else {
        console.error("Error fetching inmates: ", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpen = () => {
    setIsModalOpen(true);
    setIsSelectInmateClicked((prev) => !prev);
    setSelectedIds([]); // clear previous selection when opening
    getInmates();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedIds([]); // clear selection when closing
  };

  const handleAdd = () => {
    const selectedInmates = list.filter((i) => selectedIds.includes(i._id));
    // send selected inmates to parent if callback provided
    if (typeof onAdd === "function") onAdd(selectedInmates);
    console.log("Selected inmates:", selectedInmates);
    handleClose();
  };

  return (
    <>
      <button
        disabled={isLoading}
        type="button"
        className={`mt-2 px-4 py-2 rounded-sm flex items-center gap-2 transition 
        ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-[#002868] text-white hover:bg-blue-900"
        }`}
        onClick={handleOpen}
      >
        <PlusCircle size={18} />
        <span>{isLoading ? "Loading..." : "Add Inmate"}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add New Inmate</h2>
              <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <p className="text-gray-500">Loading inmates...</p>
              ) : hasErrors.error ? (
                <p className="text-red-500">{hasErrors.error}</p>
              ) : list.length > 0 ? (
                <ul className="space-y-1">
                  {list.map((inmate) => (
                    <li key={inmate._id} className="border-b py-1 text-sm text-gray-700">
                      <label className="flex items-center justify-between w-full cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(inmate._id)}
                            onChange={() => toggleSelect(inmate._id)}
                            className="w-4 h-4"
                            aria-label={`Select ${inmate.firstname} ${inmate.lastname}`}
                          />
                          <div>
                            <div className="font-medium">
                              {inmate.firstname}{" "}
                              {inmate.middleInitial ? `${inmate.middleInitial}. ` : ""}{inmate.lastname}
                            </div>
                            <div className="text-xs text-gray-500">Case: {inmate.caseNumber}</div>
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No inmates found.</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleAdd}
                disabled={selectedIds.length === 0}
                className={`px-4 py-2 rounded-sm transition text-white ${
                  selectedIds.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#002868] hover:bg-blue-900"
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectInmates;
