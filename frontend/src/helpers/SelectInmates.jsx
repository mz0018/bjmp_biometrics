import { useState, useEffect } from "react";
import { PlusCircle, X, Loader2, Search } from "lucide-react";
import axios from "axios";

const SelectInmates = ({ setIsSelectInmateClicked, onAdd }) => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!isModalOpen) return;
    const fetchInmates = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/listofinmates`, {
          params: { search: debouncedSearchTerm },
        });
        setList((prev) => [
          ...prev.filter((i) => selectedIds.includes(i._id)),
          ...data.filter((i) => !selectedIds.includes(i._id)),
        ]);
        setError("");
      } catch {
        setError("Failed to fetch inmates.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInmates();
  }, [debouncedSearchTerm, isModalOpen, selectedIds]);

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const openModal = () => {
    setIsModalOpen(true);
    setSelectedIds([]);
    setIsSelectInmateClicked?.((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIds([]);
  };

  const handleAdd = () => {
    onAdd?.(list.filter((i) => selectedIds.includes(i._id)));
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition ${
          isLoading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-[#002868] hover:bg-blue-900 text-white cursor-pointer"
        }`}
      >
        <PlusCircle className="w-4 h-4" />
        {isLoading ? "Loading..." : "Add Inmate"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start px-4 py-3 border-b border-gray-200 sticky top-0 z-10 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Select Inmates</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Select the inmates you wish to add from the list below.
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow p-3 overflow-y-auto">
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search inmates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-2 py-1.5 w-full border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-gray-700"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading inmates...
                </div>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : list.length ? (
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-1 text-left w-6"></th>
                      <th className="p-1 text-left">Name</th>
                      <th className="p-1 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((inmate) => (
                      <tr
                        key={inmate._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleSelect(inmate._id)}
                      >
                        <td className="p-1">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(inmate._id)}
                            onChange={() => toggleSelect(inmate._id)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="p-1 text-gray-800 capitalize">
                          {inmate.firstname} {inmate.middleInitial ? `${inmate.middleInitial}. ` : ""}
                          {inmate.lastname}
                        </td>
                        <td className="p-1 text-gray-500">
                          {inmate.nationality || ""}{inmate.address ? ` • ${inmate.address}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 text-sm mt-4">
                  No inmates found. Try adjusting your search or filters.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-4 py-2 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-1.5 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedIds.length}
                className={`flex-1 text-white font-medium py-1.5 rounded text-sm transition ${
                  !selectedIds.length ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
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
