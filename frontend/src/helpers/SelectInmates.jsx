import { useState, useEffect } from "react";
import { PlusCircle, X, Loader2, Search } from "lucide-react";
import axios from "axios";

const SelectInmates = ({ setIsSelectInmateClicked, isSelectInmateClicked, onAdd }) => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getInmates = async (query = "") => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/listofinmates`, {
        params: { search: query },
      });
      setList((prev) => {
        const existing = prev.filter((i) => selectedIds.includes(i._id));
        const merged = [...existing, ...response.data.filter((i) => !selectedIds.includes(i._id))];
        return merged;
      });
    } catch (err) {
      setHasErrors({ error: "Failed to fetch inmates." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) getInmates(debouncedSearchTerm);
  }, [isModalOpen, debouncedSearchTerm]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpen = () => {
    setIsModalOpen(true);
    setIsSelectInmateClicked((prev) => !prev);
    setSelectedIds([]);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedIds([]);
  };

  const handleAdd = () => {
    const selectedInmates = list.filter((i) => selectedIds.includes(i._id));
    if (typeof onAdd === "function") onAdd(selectedInmates);
    handleClose();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm transition ${
          isLoading
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-[#002868] hover:bg-blue-900 text-white"
        }`}
      >
        <PlusCircle className="w-4 h-4" />
        <span>{isLoading ? "Loading..." : "Add Inmate"}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="rounded-md shadow-lg w-full max-h-[90vh] max-w-md flex flex-col">
            {/* Header */}
            <div className="bg-[#232023] px-4 py-4 sm:px-6 sm:py-5 rounded-t-md shadow-md sticky top-0 z-10 flex justify-between items-center">
              <h2 className="text-left text-lg sm:text-xl font-semibold text-white">Select Inmates</h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-300 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="bg-white flex-grow max-h-[70vh] p-4 sm:p-6 overflow-y-auto">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search inmates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading inmates...</span>
                </div>
              ) : hasErrors.error ? (
                <p className="text-red-500 text-sm">{hasErrors.error}</p>
              ) : list.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <ul className="space-y-2">
                    {list.slice(0, 2).map((inmate) => (
                      <li
                        key={inmate._id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-gray-50"
                      >
                        <input
                          id={`inmate-${inmate._id}`}
                          type="checkbox"
                          checked={selectedIds.includes(inmate._id)}
                          onChange={() => toggleSelect(inmate._id)}
                          className="w-4 h-4 mt-1"
                        />
                        <label htmlFor={`inmate-${inmate._id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm text-gray-800">
                            {inmate.firstname} {inmate.middleInitial ? `${inmate.middleInitial}. ` : ""}
                            {inmate.lastname}
                          </div>
                          <div className="text-xs text-gray-500">
                            Case Number: {inmate.caseNumber}
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No inmates found.</p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#232023] px-4 py-3 rounded-b-md flex justify-end items-center space-x-2">

              <button
                onClick={handleAdd}
                disabled={selectedIds.length === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm ${
                  selectedIds.length === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#002868] hover:bg-blue-900 text-white"
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
