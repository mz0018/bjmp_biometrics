import useVisitorsLogs from "../hooks/useVisitorsLogs";
import { useEffect, useState } from "react";

const VisitorsLog = () => {
  const { isLoading, hasErrors, logs } = useVisitorsLogs();
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    if (logs.length > 0) {
      const interval = setInterval(() => {
        setCountdowns(() => {
          const updated = {};
          logs.forEach(log => {
            const left = new Date(log.expiresAt).getTime() - Date.now();
            updated[log._id] = Math.max(left, 0);
          });
          return updated;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [logs]);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (isLoading) return <p className="text-gray-500">Loading logs...</p>;
  if (hasErrors.error) return <p className="text-red-500">Error: {hasErrors.error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Visitors Log</h1>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Inmate</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Address</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Similarity</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Timestamp</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Time Left</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.visitor.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.visitor.inmate}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.visitor.address}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.similarity.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {formatTime(countdowns[log._id] ?? (new Date(log.expiresAt).getTime() - Date.now()))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitorsLog;
