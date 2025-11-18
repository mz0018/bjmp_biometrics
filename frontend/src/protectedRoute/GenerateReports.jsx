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
        className="flex w-full items-center justify-center gap-2 bg-[#002868] hover:bg-blue-900 text-white px-4 py-2 rounded-sm transition cursor-pointer"
        aria-label="Open generate reports modal"
      >
        <FileText className="w-4 h-4" />
        <span>Generate Log Reports</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="rounded-md shadow-lg w-full max-h-[90vh] max-w-md flex flex-col">
            <div className="bg-[#232023] px-4 py-4 sm:px-6 sm:py-5 rounded-t-md shadow-md flex justify-between items-center">
              <h2 className="text-left text-lg sm:text-xl font-semibold text-white">Select Date Range</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white flex-grow max-h-[70vh] p-4 sm:p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex flex-col gap-1 text-sm text-gray-700">
                  <label className="flex flex-col text-sm text-gray-600">
                    From:
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className={`border rounded-sm px-2 py-2 mt-1 focus:ring-2 outline-none ${
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
                      className={`border rounded-sm px-2 py-2 mt-1 focus:ring-2 outline-none ${
                        error && !toDate
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-bjmp-yellow"
                      }`}
                    />
                  </label>

                  {error && (
                    <p className="text-red-500 text-xs mt-1">Please select both dates.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#232023] px-4 py-3 rounded-b-md flex flex-col items-end justify-center text-center space-y-1">
              <div className="flex gap-2">

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
        </div>
      )}
    </>
  );
};

export default GenerateReports;
