import { useState } from "react";
import TotalVisitsExportExcel from "./TotalVisitsExportExcel";

const TotalVisits = ({ visitLogs }) => {
  const [open, setOpen] = useState(false);

  const renderInmateName = (vl) =>
    vl.selected_inmate?.inmate_name ||
    vl.visitor_info?.inmates?.[0]?.inmate_name ||
    "—";

  const renderVisitTime = (vl) =>
    vl.timestamp ? new Date(vl.timestamp).toLocaleString() : "—";

  return (
    <div className="text-sm text-gray-600">
      <div>
        Visitor Daily{" "}
        <span
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Logs
        </span>
        .
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="text-left">
                <h2 className="text-lg font-semibold">Daily Visitor Logs</h2>
                <p className="text-gray-500 text-sm">
                  Total entries: {visitLogs.length}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-black text-xl"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-700">Inmate</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Visit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visitLogs.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-gray-500 text-center">
                        No visitor logs found
                      </td>
                    </tr>
                  ) : (
                    visitLogs.map((vl) => (
                      <tr key={vl._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 truncate">{renderInmateName(vl)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                          {renderVisitTime(vl)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t border-gray-200 gap-1">
              <button
                onClick={() => setOpen(false)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-500 font-semibold px-6 py-3 rounded-sm text-sm transition w-full cursor-pointer"
              >
                Go Back
              </button>

              <TotalVisitsExportExcel visitLogs={visitLogs} />
                
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalVisits;
