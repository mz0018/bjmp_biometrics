import { useState } from "react";

const GenerateReports = ({ logs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleGenerate = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    const filtered = logs.filter((log) => {
      const time = new Date(log.timestamp).getTime();
      return (
        time >= new Date(fromDate).getTime() &&
        time <= new Date(toDate).getTime()
      );
    });

    console.log("Generated Report Logs:", filtered);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
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
                  className="border border-gray-300 rounded-sm px-2 py-1 mt-1 focus:ring-2 focus:ring-bjmp-yellow outline-none"
                />
              </label>

              <label className="flex flex-col text-sm text-gray-600">
                To:
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 rounded-sm px-2 py-1 mt-1 focus:ring-2 focus:ring-bjmp-yellow outline-none"
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
                onClick={handleGenerate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm text-sm transition"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateReports;
