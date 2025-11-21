import { useEffect, useState, useMemo, useCallback } from "react";
import useVisitorsLogs from "../hooks/useVisitorsLogs";
import useSaveToReports from "../hooks/useSaveToReports";
import NoLogsFoundFallback from "../fallback/NoLogsFoundFallback";
import GenerateReports from "../protectedRoute/GenerateReports";
import { Search, Loader2, AlertCircle, Settings } from "lucide-react";

const TableCell = ({ children, className = "", center }) => (
  <td
    className={`border-b border-gray-300 px-4 py-2 truncate ${center ? "text-center" : "capitalize"} ${className}`}
  >
    {children}
  </td>
);

const VisitorsLog = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [pendingLog, setPendingLog] = useState(null);

  const { isLoading, hasErrors, logs } = useVisitorsLogs(debouncedSearch);
  const { handleStop, countdowns, stopped } = useSaveToReports(logs);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const formatTime = useCallback((ms) => {
    const totalSec = Math.floor(ms / 1000);
    return `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, "0")}`;
  }, []);

  const filteredLogs = useMemo(
    () => logs.filter((log) =>
      log.visitor_info?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
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

  const tableHeaders = [
    { label: "Visitor", align: "start" },
    { label: "Inmate", align: "start" },
    { label: "Address", align: "start" },
    { label: "Date", align: "start" },
    { label: "Time Left", align: "start" },
    { label: "Actions", align: "center", icon: <Settings size={16} /> },
  ];

  return (
    <section className="p-6 min-h-[100dvh] flex flex-col overflow-hidden bg-gray-50">
      <header className="flex flex-col mb-6 gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
          <div className="relative flex-grow min-w-0 max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
              <Search className="w-4 h-4" />
              <span className="mx-2 h-5 w-px bg-gray-300"></span>
            </div>
            <input
              type="text"
              placeholder="Search visitors by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
              className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-bjmp-yellow placeholder:text-gray-400 placeholder:tracking-wider text-gray-700 transition"
            />
          </div>

          <div className="flex-shrink-0">
            <GenerateReports />
          </div>
        </div>
      </header>

      {filteredLogs.length === 0 ? (
        <NoLogsFoundFallback />
      ) : (
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
                        {h.icon ? <div className="flex items-center justify-center gap-1">{h.icon} {h.label}</div> : h.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log, index) => {
                    const timeLeft = countdowns[log._id] ?? new Date(log.expiresAt).getTime() - Date.now();
                    const isSaved = log.isSaveToLogs || stopped[log._id] || timeLeft <= 0;
                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";

                    return (
                      <tr key={log._id} className={`hover:bg-gray-100 transition ${rowBg}`}>
                        <TableCell>{log.visitor_info?.name || "Unknown"}</TableCell>
                        <TableCell>
                          {log.selected_inmate?.inmate_name
                            ? `${log.selected_inmate.inmate_name} (${log.selected_inmate.relationship})`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{log.visitor_info?.address || "N/A"}</TableCell>
                        <TableCell>
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                            : "—"}
                        </TableCell>
                        <TableCell className="font-medium text-bjmp-blue">{isSaved ? "Saved to log" : formatTime(timeLeft)}</TableCell>
                        <TableCell center>
                          {!isSaved && (
                            <button
                              onClick={() => { setPendingLog(log); setConfirmStopOpen(true); }}
                              className="px-3 py-1 text-xs font-medium text-red-500 border border-red-500 rounded hover:bg-red-50 transition cursor-pointer whitespace-nowrap"
                            >
                              Stop Time
                            </button>
                          )}
                        </TableCell>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

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
                onClick={() => { handleStop(pendingLog); setConfirmStopOpen(false); }}
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
