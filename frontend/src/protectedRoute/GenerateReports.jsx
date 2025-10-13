import { useState } from "react";
import useGenerateReports from "../hooks/useGenerateReports";

const GenerateReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { loading, error, setError, generateReport } = useGenerateReports();

  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
          setError(false);
        }}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm transition"
      >
        Generate Reports
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Select Date Range
            </h2>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col text-sm text-gray-600">
                From:
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={`border rounded-sm px-2 py-1 mt-1 focus:ring-2 outline-none ${
                    error && !fromDate
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-bjmp-yellow"
                  }`}
                />
              </label>

              <label className="flex flex-col text-sm text-gray-600">
                To:
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={`border rounded-sm px-2 py-1 mt-1 focus:ring-2 outline-none ${
                    error && !toDate
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-bjmp-yellow"
                  }`}
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() =>
                  generateReport(fromDate, toDate, () => setIsModalOpen(false))
                }
                className={`${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 rounded-sm text-sm transition`}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateReports;
