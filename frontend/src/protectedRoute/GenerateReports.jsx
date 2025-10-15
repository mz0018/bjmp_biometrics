import { useState } from "react";
import useGenerateReports from "../hooks/useGenerateReports";
import { FileText, X, Loader2 } from "lucide-react";

const GenerateReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { loading, error, setError, generateReport } = useGenerateReports();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsModalOpen(true);
          setError(false);
        }}
        className="inline-flex items-center gap-2 bg-[#002868] hover:bg-blue-900 text-white px-4 py-2 rounded-sm transition cursor-pointer"
        aria-label="Open generate reports modal"
      >
        <FileText className="w-4 h-4" />
        <span>Generate Reports</span>
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
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-red-500 text-sm transition text-white hover:bg-red-600 cursor-pointer"
                aria-label="Cancel generate reports"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  generateReport(fromDate, toDate, () => setIsModalOpen(false))
                }
                className={`inline-flex items-center gap-2 ${
                  loading
                    ? "bg-[#002868] cursor-not-allowed"
                    : "bg-[#002868] hover:bg-blue-900"
                } text-white px-4 py-2 rounded-sm text-sm transition cursor-pointer`}
                aria-label="Generate report"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateReports;
