import { useEffect, useState, useMemo, useCallback } from "react";
import useVisitorsLogs from "../hooks/useVisitorsLogs";
import useSaveToReports from "../hooks/useSaveToReports";
import {
  Search,
  Loader2,
  AlertCircle,
  User,
  Home,
  MapPin,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";

// Reusable table header cell
const TableHeaderCell = ({ icon: Icon, label }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">
    <div className="flex items-center gap-1">
      <Icon className="w-4 h-4" /> {label}
    </div>
  </th>
);

const VisitorsLog = () => {
  const { isLoading, hasErrors, logs } = useVisitorsLogs();
  const { saveReport } = useSaveToReports();
  const [countdowns, setCountdowns] = useState({});
  const [search, setSearch] = useState("");

  // countdown logic
  useEffect(() => {
    if (logs.length === 0) return;

    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        logs.forEach((log) => {
          const left = new Date(log.expiresAt).getTime() - Date.now();
          const newLeft = Math.max(left, 0);

          if (newLeft === 0 && (prev[log._id] ?? left) > 0) {
            saveReport(log);
          }
          updated[log._id] = newLeft;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [logs.length, saveReport]);

  // memoized time formatter
  const formatTime = useCallback((ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }, []);

  // memoized filtering
  const filteredLogs = useMemo(
    () =>
      logs.filter((log) =>
        log.visitor.name.toLowerCase().includes(search.toLowerCase())
      ),
    [logs, search]
  );

  // loading state
  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading logs...</span>
      </div>
    );

  // error state
  if (hasErrors.error)
    return (
      <div className="flex items-center justify-center gap-2 text-red-500">
        <AlertCircle className="w-5 h-5" />
        <span>Error: {hasErrors.error}</span>
      </div>
    );

  return (
    <section className="p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold uppercase">Visitors Log</h1>

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
      </header>

      {filteredLogs.length === 0 ? (
        <p className="text-gray-500 italic">No logs found</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-sm border border-gray-200">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-bjmp-blue sticky top-0 z-10">
              <tr>
                <TableHeaderCell icon={User} label="Name" />
                <TableHeaderCell icon={Home} label="Inmate" />
                <TableHeaderCell icon={MapPin} label="Address" />
                <TableHeaderCell icon={Activity} label="Similarity" />
                <TableHeaderCell icon={Calendar} label="Timestamp" />
                <TableHeaderCell icon={Clock} label="Time Left" />
              </tr>
            </thead>
          </table>

          {/* Scrollable body */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 250px)" }}
          >
            <table className="min-w-full bg-white border-collapse">
              <tbody>
                {filteredLogs.map((log, index) => {
                  const timeLeft =
                    countdowns[log._id] ??
                    new Date(log.expiresAt).getTime() - Date.now();

                  return (
                    <tr
                      key={log._id}
                      className={`text-gray-700 italic leading-relaxed hover:bg-bjmp-yellow/10 transition ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2 text-sm">{log.visitor.name}</td>
                      <td className="px-4 py-2 text-sm">{log.visitor.inmate}</td>
                      <td className="px-4 py-2 text-sm">{log.visitor.address}</td>
                      <td className="px-4 py-2 text-sm">
                        {log.similarity.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(log.timestamp).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-bjmp-blue">
                        {formatTime(timeLeft)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer / Counter */}
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
