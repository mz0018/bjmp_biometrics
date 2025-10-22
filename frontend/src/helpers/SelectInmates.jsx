import { useState, useEffect } from "react";
import { PlusCircle, X, Loader2, Search } from "lucide-react";
import axios from "axios";

const SelectInmates = ({
  setIsSelectInmateClicked,
  isSelectInmateClicked,
  onAdd,
}) => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getInmates = async (query = "") => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/listofinmates`,
        { params: { search: query } }
      );
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
    if (isModalOpen) {
      getInmates(debouncedSearchTerm);
    }
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
    <>a
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Select Inmates
            </h2>

            {/* 🔍 Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search inmates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Inmates List */}
            <div className="flex flex-col gap-3">
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
                    {list.slice(0, 2).map((inmate) => ( // 🧩 show only 2
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
                        <label
                          htmlFor={`inmate-${inmate._id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium text-sm">
                            {inmate.firstname}{" "}
                            {inmate.middleInitial
                              ? `${inmate.middleInitial}. `
                              : ""}
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
                <p className="text-gray-500">No inmates found.</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-red-500 text-sm text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>

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
