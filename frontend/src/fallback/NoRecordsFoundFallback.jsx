import { Settings } from "lucide-react";

const NoRecordsFoundFallback = ({ activeTab }) => {
  const tableHeaders =
    activeTab === "inmates"
      ? [
          { label: "Inmate Name", align: "left" },
          { label: "Case Number", align: "left" },
          { label: "Status", align: "left" },
          { label: "", align: "center", icon: null },
        ]
      : [
          { label: "Visitor Name", align: "left" },
          { label: "Contact", align: "left" },
          { label: "", align: "center", icon: null },
        ];

  return (
    <table className="min-w-full table-fixed border-collapse border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          {tableHeaders.map((h) => (
            <th
              key={h.label}
              className={`border-b border-gray-300 px-4 py-2 text-${h.align} font-medium`}
            >
              {h.icon ? (
                <div className="flex items-center justify-center gap-1">
                  {h.icon}
                  {h.label}
                </div>
              ) : (
                h.label
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="animate-pulse">
        {[...Array(3)].map((_, rowIdx) => (
          <tr key={rowIdx}>
            {tableHeaders.map((_, colIdx) => (
              <td
                key={colIdx}
                className="border-b border-gray-200 px-4 py-4"
              >
                <div className="h-4 w-full rounded bg-gray-200" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NoRecordsFoundFallback;
