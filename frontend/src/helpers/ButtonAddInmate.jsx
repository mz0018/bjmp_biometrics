import React, { useState, useEffect } from "react";
import useButtonAddInmate from "../hooks/useButtonAddInmate";
import api from "../api";

const ButtonAddInmate = ({ visitorId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visitorData, setVisitorData] = useState(null);
  const { listOfInmates, loading } = useButtonAddInmate(search);

  console.log(visitorId);

  const handleOpenModal = async () => {
    setModalOpen(true);

    if (!visitorId) return;

    try {
      const response = await api.get(`/visitor-json/${visitorId}`);
      setVisitorData(response.data);
      console.log("Visitor JSON:", response.data);
    } catch (error) {
      console.error("Error fetching visitor JSON:", error);
      setVisitorData(null);
    }
  };

  const filteredInmates = visitorData
    ? listOfInmates.filter((inmate) =>
        visitorData.inmates.some((v) => v._id === inmate._id)
      )
    : listOfInmates;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-900 text-white px-4 py-2 rounded-sm w-full cursor-pointer"
      >
        Add Inmate
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Inmate</h2>

            <input
              type="text"
              placeholder="Search inmate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
            />

            {loading && <p>Loading…</p>}

            {!loading && filteredInmates.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {filteredInmates.map((inmate) => (
                  <div key={inmate._id} className="p-2 border-b">
                    {inmate.firstname} {inmate.lastname} - {inmate.caseNumber}
                  </div>
                ))}
              </div>
            ) : (
              !loading && <p className="text-gray-500">No inmates found for this visitor.</p>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold px-6 py-3 rounded-sm text-sm transition w-full mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonAddInmate;
