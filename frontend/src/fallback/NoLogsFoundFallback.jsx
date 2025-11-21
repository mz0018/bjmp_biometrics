import { User, Home, MapPin, Calendar, Clock, Database, Settings } from "lucide-react";

const NoLogsFoundFallback = () => {
  const tableHeaders = [
    { label: "Visitor", align: "start" },
    { label: "Inmate", align: "start" },
    { label: "Address", align: "start" },
    { label: "Date", align: "start" },
    { label: "Time Left", align: "start" },
    { label: "Actions", align: "center", icon: <Settings size={16} /> },
  ];

  return (
    <div className="shadow-lg rounded-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-[65dvh]">
          <table className="min-w-full table-fixed border-collapse border border-gray-300 text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                {tableHeaders.map((h) => (
                  <th
                    key={h.label}
                    className={`border-b border-gray-300 px-4 py-2 font-medium tracking-wide text-${h.align}`}
                  >
                    {h.icon ? (
                      <div className="flex items-center justify-center gap-1">
                        {h.icon} {h.label}
                      </div>
                    ) : (
                      h.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={tableHeaders.length} className="border-b border-gray-300 px-4 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                    <div className="relative inline-block">
                      <Database className="w-20 h-20 text-gray-200 animate-pulse" />
                      <User
                        className="w-10 h-10 text-bjmp-blue absolute bottom-0 left-0 bg-white rounded-full p-1 border border-gray-200 shadow-sm"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
                    <span className="text-xs text-gray-400">
                      There is no visitor log data to show you right now.
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
        Showing <span className="font-semibold">0</span> entries
      </div>
    </div>
  );
};

export default NoLogsFoundFallback;
