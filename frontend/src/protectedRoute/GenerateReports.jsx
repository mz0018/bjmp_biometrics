import { useState } from "react";
import useGenerateReports from "../hooks/useGenerateReports";
import { Text, Loader2 } from "lucide-react";

const GenerateReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { loading, error, setError, generateReport } = useGenerateReports();

  const inputClass = (fieldValue) =>
    `border rounded-sm px-2 py-2 focus:ring-2 outline-none font-light ${error && !fieldValue ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-bjmp-yellow"}`;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsModalOpen(true);
          setError(false);
        }}
        className="flex border border-gray-300 items-center justify-center gap-2 font-semibold text-gray-500 px-4 py-2 rounded-sm transition hover:bg-gray-50 cursor-pointer text-sm tracking-wider"
        aria-label="Open generate reports modal"
      >
        <Text className="w-4 h-4" />
        <span>Generate Log Reports</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="rounded-md shadow-lg w-full max-h-[90vh] max-w-md flex flex-col">
            {/* Modal Header */}
            <div className="bg-white px-4 py-2 rounded-t-md shadow-md pt-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Generate Log Reports</h2>
              <p className="text-sm text-gray-700">Select a date range to generate the log reports.</p>
            </div>

            {/* Date Inputs Section */}
            <div className="bg-white flex-grow max-h-[20vh] p-4 sm:p-6 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="flex flex-col text-sm font-semibold text-gray-600">
                  From:
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={inputClass(fromDate)}
                    aria-label="Select start date for report"
                  />
                </label>

                <label className="flex flex-col text-sm font-semibold text-gray-600">
                  To:
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={inputClass(toDate)}
                    aria-label="Select end date for report"
                  />
                </label>

                {error && <p className="text-red-500 text-xs">Please select both dates.</p>}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white flex gap-2 px-4 py-3 rounded-b-md">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold px-4 py-2 rounded-sm text-sm transition w-full"
                aria-label="Cancel report generation"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => generateReport(fromDate, toDate, () => setIsModalOpen(false))}
                className={`inline-flex items-center gap-2 w-full justify-center font-semibold ${
                  loading ? "bg-[#002868] cursor-not-allowed" : "bg-[#002868] hover:bg-blue-900"
                } text-white px-4 py-2 rounded-sm text-sm transition`}
                aria-label="Generate report"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Text className="w-4 h-4" />
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
