import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const useVisitorsLogs = (search = "") => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(null);
  const [logs, setLogs] = useState([]);

  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const currentControllerRef = useRef(null);
  const loadingTimerRef = useRef(null);

  const getLogs = useCallback(async (searchParam = "", signal = undefined) => {
    if (currentControllerRef.current) {
      try {
        currentControllerRef.current.abort();
      } catch (e) {
      }
      currentControllerRef.current = null;
    }

    const controller = signal ? null : new AbortController();
    const usedSignal = signal ?? controller.signal;

    if (!signal) currentControllerRef.current = controller;

    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 150);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/visitorsLogs`,
        {
          params: { search: searchParam },
          signal: usedSignal,
        }
      );

      setLogs(res.data);
      setHasErrors(null);
    } catch (err) {
      const isCanceled =
        err?.code === "ERR_CANCELED" || err?.name === "CanceledError";
      if (isCanceled) return;
      if (err.response && err.response.data) {
        console.error("Error response:", err.response.data);
        setHasErrors(err.response.data);
      } else {
        console.error("Error fetching logs:", err.message || err);
        setHasErrors({ message: err.message || "Unknown error" });
      }
    } finally {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      setIsLoading(false);
      if (!signal) currentControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getLogs(search, controller.signal).catch(() => {});
    return () => {
      try {
        controller.abort();
      } catch (e) {
      }
    };
  }, [search, getLogs]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5001/ws");
    let pingInterval = null;

    ws.onopen = () => {
      console.log("WebSocket connected");
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
      }, 5000);
    };

    ws.onmessage = () => {
      getLogs(searchRef.current).catch(() => {});
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    ws.onclose = () => {
      if (pingInterval) clearInterval(pingInterval);
      console.log("WebSocket closed");
    };

    return () => {
      if (pingInterval) clearInterval(pingInterval);
      try {
        ws.close();
      } catch (e) {
      }
    };
  }, [getLogs]);

  return { isLoading, hasErrors, logs };
};

export default useVisitorsLogs;
