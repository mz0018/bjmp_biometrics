import { useEffect, useState, useMemo, useCallback } from "react";
import useVisitorsLogs from "../hooks/useVisitorsLogs";
import useSaveToReports from "../hooks/useSaveToReports";
import GenerateReports from "./GenerateReports";
import {
  Search,
  Loader2,
  AlertCircle,
  User,
  Home,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";

const TableHeaderCell = ({ icon: Icon, label }) => (
  <th className="px-4 py-3 text-sm font-semibold tracking-wide">
    <div className="flex items-center gap-1">
      <Icon className="w-4 h-4" /> {label}
    </div>
  </th>
);

const VisitorsLog = () => {
  const { isLoading, hasErrors, logs } = useVisitorsLogs();
  const { handleStop, countdowns, stopped } = useSaveToReports(logs);
  const [search, setSearch] = useState("");

  const formatTime = useCallback((ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) =>
        log.visitor_info?.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      ),
    [logs, search]
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading logs...</span>
      </div>
    );

  if (hasErrors)
    return (
      <div className="flex items-center justify-center gap-2 text-red-500">
        <AlertCircle className="w-5 h-5" />
        <span>Error: {hasErrors}</span>
      </div>
    );

  return (
    <section className="p-6">
      <header className="flex flex-col mb-6 gap-3">
        <div className="w-full">
          <h1 className="text-2xl font-bold uppercase">Visitors Log</h1>

          <p className="mt-2 text-sm text-gray-500 max-w-2xl leading-relaxed">
            Restricted visitor records encrypted, access-limited, and audit-logged.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by visitor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-sm w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-bjmp-yellow"
            />
          </div>

          <GenerateReports logs={logs} />
        </div>
      </header>

      {filteredLogs.length === 0 ? (
        <p className="text-gray-500 italic">No logs found</p>
      ) : (
        <div className="shadow-lg rounded-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "min(800px, 65dvh)",
              }}
            >
              <table className="min-w-full table-fixed border-collapse bg-white">
                <thead className="bg-bjmp-blue bg-white shadow-lg text-sm uppercase sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 w-[18%] text-left font-semibold tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" /> Name
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[25%] text-left font-semibold tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" /> Inmate
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[20%] text-left font-semibold tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Address
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[20%] text-left font-semibold tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Timestamp
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[10%] text-left font-semibold tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Time Left
                      </div>
                    </th>
                    <th className="px-4 py-3 w-[7%] text-center font-semibold tracking-wide whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm leading-relaxed">
                  {filteredLogs.map((log, index) => {
                    const timeLeft =
                      countdowns[log._id] ?? new Date(log.expiresAt).getTime() - Date.now();

                    return (
                      <tr
                        key={log._id}
                        className={`hover:bg-bjmp-yellow/10 transition ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-2 w-[18%] capitalize truncate">
                          {log.visitor_info?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-2 w-[25%] capitalize truncate">
                          {log.selected_inmate?.inmate_name
                            ? `${log.selected_inmate.inmate_name} (${log.selected_inmate.relationship})`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2 w-[20%] capitalize truncate">
                          {log.visitor_info?.address || "N/A"}
                        </td>
                        <td className="px-4 py-2 w-[20%] truncate">
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-2 w-[10%] font-medium text-bjmp-blue truncate">
                          {log.isSaveToLogs || stopped[log._id] || timeLeft <= 0
                            ? "Saved to log"
                            : formatTime(timeLeft)}
                        </td>
                        <td className="px-4 py-2 w-[7%] text-center">
                          {!log.isSaveToLogs && !stopped[log._id] && timeLeft > 0 && (
                            <button
                              onClick={() => handleStop(log)}
                              className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                            >
                              Stop
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* footer outside the scroll area so it remains visible */}
          <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
            Showing <span className="font-semibold">{filteredLogs.length}</span>{" "}
            {filteredLogs.length === 1 ? "entry" : "entries"}
          </div>
        </div>
      )}
    </section>
  );
};

export default VisitorsLog;
