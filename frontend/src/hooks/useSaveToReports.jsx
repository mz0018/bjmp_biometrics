import { useState, useEffect } from "react";
import axios from "axios";

const useSaveToReports = (logs = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [stopped, setStopped] = useState({});

  const saveReport = async (log) => {
    try {
      setIsLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/logs/${log._id}`,
        { isSaveToLogs: true }
      );
      console.log("Report updated:", res.data);
    } catch (err) {
      console.error("Something went wrong!", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleStop = (log) => {
    const start = new Date(log.timestamp).getTime();
    const end = Date.now();
    const consumedMs = end - start;

    saveReport(log);
    console.log(`Visitor ${log.visitor_info?.name} stayed for ${formatDuration(consumedMs)}`);

    setStopped((prev) => ({ ...prev, [log._id]: true }));
  };

  useEffect(() => {
    if (!logs.length) return;

    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        logs.forEach((log) => {
          if (log.isSaveToLogs) {
            updated[log._id] = 0;
            return;
          }

          const left = new Date(log.expiresAt).getTime() - Date.now();
          const newLeft = Math.max(left, 0);

          if (newLeft === 0 && (prev[log._id] ?? left) > 0) {
            saveReport(log);
            setStopped((prevStopped) => ({ ...prevStopped, [log._id]: true }));
          }
          updated[log._id] = newLeft;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [logs]);

  return { handleStop, countdowns, stopped, isLoading };
};

export default useSaveToReports;
