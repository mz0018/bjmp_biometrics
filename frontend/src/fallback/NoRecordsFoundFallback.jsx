import { User, FileText, Phone, Settings, Database } from "lucide-react";

const NoRecordsFoundFallback = ({ activeTab }) => {
  return (
    <table className="min-w-full table-fixed border-collapse bg-white">
      <thead className="bg-white shadow-lg text-sm capitalize">
        <tr>
          {activeTab === "inmates" ? (
            <>
              <th className="px-4 py-3 text-start font-semibold tracking-wide">
                <div className="flex items-center gap-2">
                  <User size={16} /> Inmate Name
                </div>
              </th>
              <th className="px-4 py-3 text-start font-semibold tracking-wide">
                <div className="flex items-center gap-2">
                  <FileText size={16} /> Case Number
                </div>
              </th>
              <th className="px-4 py-3 w-[8%] text-center font-semibold tracking-wide">
                <div className="flex items-center justify-center gap-2">
                  <Settings size={16} /> Options
                </div>
              </th>
            </>
          ) : (
            <>
              <th className="px-4 py-3 text-start font-semibold tracking-wide">
                <div className="flex items-center gap-2">
                  <User size={16} /> Visitor Name
                </div>
              </th>
              <th className="px-4 py-3 text-start font-semibold tracking-wide">
                <div className="flex items-center gap-2">
                  <Phone size={16} /> Contact
                </div>
              </th>
              <th className="px-4 py-3 w-[8%] text-center font-semibold tracking-wide">
                <div className="flex items-center justify-center gap-2">
                  <Settings size={16} /> Options
                </div>
              </th>
            </>
          )}
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
                    <span className="text-xs text-gray-400 mt-1">
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
