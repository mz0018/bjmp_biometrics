import React, { useState, useMemo, useEffect } from "react";
import useButtonAddInmate from "../hooks/useButtonAddInmate";
import { X, Search, UserPlus } from "lucide-react";
import api from "../api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const normalize = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();

const buildFullNameFromInmate = (inmate) => {
  const parts = [
    inmate.firstname ?? "",
    inmate.middleInitial ?? "",
    inmate.lastname ?? "",
  ].filter(Boolean);
  return parts.join(" ");
};

const notyf = new Notyf({
  duration: 2500,
  position: {
  x: "right",
  y: "top",
  },
});

const relationshipOptions = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Son",
  "Daughter",
  "Spouse",
  "Friend",
  "Other",
];

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const ButtonAddInmate = ({ visitorId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visitorData, setVisitorData] = useState(null);
  const [selected, setSelected] = useState({});
  const [relationships, setRelationships] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { listOfInmates, loading } = useButtonAddInmate(debouncedSearch);

  const handleOpenModal = async () => {
    setModalOpen(true);
    setSelected({});
    setRelationships({});
    setVisitorData(null);

    if (!visitorId) return;

    try {
      const response = await api.get(`/visitor-json/${visitorId}`);
      setVisitorData(response.data);
      console.log("Visitor JSON:", response.data);
    } catch (error) {
      console.error("Error fetching visitor JSON:", error);
      setVisitorData({ inmates: [] });
    }
  };

  const toggleSelect = (inmateId) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[inmateId]) delete next[inmateId];
      else next[inmateId] = true;
      return next;
    });
  };

  const onRelationshipChange = (inmateId, value) => {
    setRelationships((prev) => ({ ...prev, [inmateId]: value }));
  };

  const visitorInmates = visitorData?.inmates ?? [];
  const visitorNamesSet = useMemo(
    () => new Set(visitorInmates.map((v) => normalize(v.inmate_name ?? ""))),
    [visitorInmates]
  );

  const filteredInmates = (listOfInmates ?? []).filter((inmate) => {
    const fullName = buildFullNameFromInmate(inmate);
    const normalized = normalize(fullName);
    return !visitorNamesSet.has(normalized);
  });

  const handleAddSelected = async () => {
    const selectedIds = Object.keys(selected).filter((id) => selected[id]);
    if (selectedIds.length === 0) {
      notyf.error("Select at least one inmate to add.");
      return;
    }

    const payloadInmates = selectedIds.map((id) => {
      const inmate = listOfInmates.find((it) => it._id === id);
      const name = buildFullNameFromInmate(inmate);
      const relationship = relationships[id] || "Relative";
      return { inmate_name: name, relationship };
    });

    setIsAdding(true);
    try {
      const res = await api.post(`/visitor-json/${visitorId}/add-inmates`, {
        inmates: payloadInmates,
      });

      const updated = res.data;
      setVisitorData(updated);

      const newSelected = { ...selected };
      payloadInmates.forEach((p) => {
        const match = listOfInmates.find(
          (it) => normalize(buildFullNameFromInmate(it)) === normalize(p.inmate_name)
        );
        if (match) delete newSelected[match._id];
      });
      setSelected(newSelected);

      notyf.success("Inmate(s) added successfully.");
    } catch (err) {
      console.error("Failed to add inmates:", err);
      notyf.error("Failed to add inmates.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-900 text-white px-4 py-2 rounded-sm w-full cursor-pointer tracking-wide text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
      >
        <UserPlus size={16} />
        Associate Inmate
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-w-[700px] sm:max-w-full overflow-x-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col text-start">
                <h2 className="text-xl font-semibold leading-tight">
                  Add Inmate
                </h2>
                <p className="text-gray-600 text-sm mt-1 leading-snug">
                  Please select the inmate(s) associated with the visitor.
                </p>
              </div>

              <button
                className="text-gray-500 hover:text-gray-800 ml-2"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
                <Search className="w-4 h-4" />
                <span className="mx-2 h-5 w-px bg-gray-300"></span>
              </div>

              <input
                type="text"
                placeholder="Search inmates by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search"
                className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-bjmp-yellow placeholder:text-gray-400 placeholder:tracking-wider text-gray-700 transition"
              />
            </div>

            {loading && <p>Loading…</p>}

            {!loading && filteredInmates.length > 0 ? (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">&nbsp;</th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">Inmate</th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">Relationship</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInmates.map((inmate) => {
                      const id = inmate._id;
                      const fullName = buildFullNameFromInmate(inmate);
                      const isChecked = !!selected[id];

                      return (
                        <tr key={id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-left">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelect(id)}
                            />
                          </td>
                          <td className="px-3 py-2 font-medium text-left">
                            {fullName} {inmate.caseNumber ? `- ${inmate.caseNumber}` : ""}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500 text-left">
                            {inmate.nationality || ""} {inmate.address ? `• ${inmate.address}` : ""}
                          </td>
                          <td className="px-3 py-2 text-left">
                            <select
                              value={relationships[id] || ""}
                              onChange={(e) => onRelationshipChange(id, e.target.value)}
                              disabled={!isChecked}
                              className="border border-gray-200 px-2 py-1 rounded text-sm"
                            >
                              <option value="">Relationship</option>
                              {relationshipOptions.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              !loading && (
                <p className="text-gray-500">
                  No inmates found to add. (All inmates are already linked or none match.)
                </p>
              )
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold px-6 py-3 rounded-sm text-sm transition w-full sm:flex-1 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleAddSelected}
                disabled={
                  isAdding ||
                  Object.keys(selected).filter((id) => selected[id]).length === 0 ||
                  Object.keys(selected)
                    .filter((id) => selected[id])
                    .some((id) => !relationships[id])
                }
                className={`bg-[#002868] text-white px-4 py-2 rounded-md 
                  transition tracking-wide text-sm w-full sm:flex-1
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  disabled:hover:bg-[#002868]
                  ${!isAdding ? "hover:bg-blue-900 cursor-pointer" : "cursor-wait"}
                `}
              >
                {isAdding ? "Adding..." : "Add Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonAddInmate;
