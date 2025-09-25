const useSaveToReports = () => {
  const saveReport = (log) => {
    console.log(`Save the log to reports ${log.visitor.visitor_id}`);
  };

  const handleStop = (log, timeLeft) => {
    console.log(
      `Stopped log for visitor ${log.visitor.name}. Time consumed: ${Math.floor(
        (new Date(log.expiresAt).getTime() - Date.now() - timeLeft) / 1000
      )} seconds`
    );
  };

  return { handleStop, saveReport };
};

export default useSaveToReports;
