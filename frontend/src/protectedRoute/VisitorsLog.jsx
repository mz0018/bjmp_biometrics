import { useEffect, useState, useMemo, useCallback } from "react";
import useVisitorsLogs from "../hooks/useVisitorsLogs";
import useSaveToReports from "../hooks/useSaveToReports";
import NoLogsFoundFallback from "../fallback/NoLogsFoundFallback";
import GenerateReports from "../protectedRoute/GenerateReports"
import {
  Search,
  Loader2,
  AlertCircle,
  User,
  Home,
  MapPin,
  Calendar,
  Clock,
  Settings
} from "lucide-react";

const TableHeaderCell = ({ icon: Icon, label }) => (
  <th className="px-4 py-3 text-sm font-semibold">
    <div className="flex items-start gap-1 whitespace-nowrap">
      <Icon className="w-4 h-4" /> {label}
    </div>
  </th>
);

const VisitorsLog = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [pendingLog, setPendingLog] = useState(null);

  const { isLoading, hasErrors, logs, isWsConnected } = useVisitorsLogs(debouncedSearch);
  const { handleStop, countdowns, stopped } = useSaveToReports(logs);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

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
          .includes(debouncedSearch.toLowerCase())
      ),
    [logs, debouncedSearch]
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
    <section className="p-6 min-h-[100dvh] flex flex-col overflow-hidden">
      <header className="flex flex-col mb-6 gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by visitor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-sm w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-bjmp-yellow"
            />
          </div>
          <GenerateReports />
        </div>
      </header>

      {filteredLogs.length === 0 ? (
        <NoLogsFoundFallback />
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
                <thead className="bg-bjmp-blue bg-white shadow-lg text-sm capitalize">
                  <tr>
                    <TableHeaderCell icon={User} label="Visitor" />
                    <TableHeaderCell icon={Home} label="Inmate" />
                    <TableHeaderCell icon={MapPin} label="Address" />
                    <TableHeaderCell icon={Calendar} label="Date" />
                    <TableHeaderCell icon={Clock} label="Time Left" />
                    <TableHeaderCell icon={Settings} label="Actions" />
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm leading-relaxed">
                  {filteredLogs.map((log, index) => {
                    const timeLeft =
                      countdowns[log._id] ??
                      new Date(log.expiresAt).getTime() - Date.now();

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
                              onClick={() => {
                                setPendingLog(log);
                                setConfirmStopOpen(true);
                              }}
                              className="px-3 py-1 text-xs font-medium text-red-500 border border-red-500 rounded hover:bg-red-50 transition cursor-pointer whitespace-nowrap"
                            >
                              Stop Time
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

      {confirmStopOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-3">Stop Time?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to stop the timer for this visitor?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmStopOpen(false)}
                className="px-3 py-1 text-sm border border-gray-300 text-gray-600 font-semibold rounded-md w-full cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleStop(pendingLog); 
                  setConfirmStopOpen(false);
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md w-full cursor-pointer"
              >
                Yes, Stop
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default VisitorsLog;
