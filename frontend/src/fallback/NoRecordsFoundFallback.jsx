import { Settings, Database } from "lucide-react";

const NoRecordsFoundFallback = ({ activeTab }) => {
  const tableHeaders = activeTab === "inmates"
    ? [
        { label: "Inmate Name", align: "start" },
        { label: "Case Number", align: "start" },
        { label: "Status", align: "start" },
        { label: "Options", align: "center", icon: <Settings size={16} /> },
      ]
    : [
        { label: "Visitor Name", align: "start" },
        { label: "Contact", align: "start" },
        { label: "Options", align: "center", icon: <Settings size={16} /> },
      ];

  return (
    <table className="min-w-full table-fixed border-collapse border border-gray-300 text-sm text-gray-700">
      <thead className="bg-gray-100">
        <tr>
          {tableHeaders.map((h) => (
            <th
              key={h.label}
              className={`border-b border-gray-300 px-4 py-2 text-${h.align} font-medium tracking-wide`}
            >
              {h.icon ? <div className="flex items-center justify-center gap-1">{h.icon} {h.label}</div> : h.label}
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
              </div>
              <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
              <span className="text-xs text-gray-400">
                {activeTab === "inmates"
                  ? "There is no inmate data to show you right now."
                  : "There is no visitor data to show you right now."}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NoRecordsFoundFallback;
