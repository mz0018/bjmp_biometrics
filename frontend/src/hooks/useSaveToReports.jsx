const useSaveToReports = () => {
  const saveReport = (log) => {
    console.log(`Save the log to reports ${log.visitor.visitor_id}`);
  };

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleStop = (log, setStopped) => {
    const start = new Date(log.timestamp).getTime();
    const end = Date.now();
    const consumedMs = end - start;

    saveReport(log);

    console.log(
      `Visitor ${log.visitor.name} stayed for ${formatDuration(consumedMs)}`
    );

    setStopped((prev) => ({ ...prev, [log._id]: true }));
  };

  return { handleStop, saveReport, formatDuration };
};

export default useSaveToReports;
