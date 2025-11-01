import { User, Home, MapPin, Calendar, Clock, Database } from "lucide-react";

const TableHeaderCell = ({ icon: Icon, label }) => (
  <th className="px-4 py-3 text-sm font-semibold tracking-wide">
    <div className="flex items-center gap-1">
      <Icon className="w-4 h-4" /> {label}
    </div>
  </th>
);

const NoLogsFoundFallback = () => {
  return (
    <div className="shadow-lg rounded-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "min(800px, 65dvh)",
          }}
        >
          <table className="min-w-full table-fixed border-collapse bg-white">
            <thead className="bg-bjmp-blue bg-white shadow-lg text-sm capitalize">
              <tr>
                <TableHeaderCell icon={User} label="Visitor Name" />
                <TableHeaderCell icon={Home} label="Visited Inmate" />
                <TableHeaderCell icon={MapPin} label="Visitor Address" />
                <TableHeaderCell icon={Calendar} label="Timestamp" />
                <TableHeaderCell icon={Clock} label="Time Left" />
                <th className="px-4 py-3 w-[7%] text-center font-semibold tracking-wide whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700 text-sm leading-relaxed">
            <tr>
                <td colSpan="6" className="px-4 py-10 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="relative inline-block mb-3">
                    <Database className="w-20 h-20 text-gray-200" />
                    <User
                        className="w-10 h-10 text-bjmp-blue absolute bottom-0 left-0 bg-white rounded-full p-1 border border-gray-200 shadow-sm"
                        strokeWidth={2}
                    />
                    </div>

                    <p className="text-gray-500 text-lg font-semibold">
                    No Data Available
                    </p>
                    <span className="text-xs text-gray-400">
                    There is no data to show you right now.
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
