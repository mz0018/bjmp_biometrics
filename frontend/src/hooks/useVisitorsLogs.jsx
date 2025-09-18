import { useState, useEffect } from "react";
import axios from "axios";

const useVisitorsLogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({});
  const [logs, setLogs] = useState([]);

  const getLogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/visitorsLogs`);
      setLogs(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        console.error("Error response:", err.response.data);
        setHasErrors(err.response.data);
      } else {
        console.error("Error fetching logs:", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5001/ws");

    ws.onopen = () => {
      console.log("WebSocket connected");

      const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, 5000);

      ws.onclose = () => {
        clearInterval(interval);
        console.log("WebSocket closed");
      };
    };

    ws.onmessage = () => {
      getLogs();
    };

    return () => ws.close();
  }, []);

  return { isLoading, hasErrors, logs };
};

export default useVisitorsLogs;
