import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";

const useVisitorsLogs = () => {
  const { value } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
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

    getLogs();
  }, [value]);
 
  return { isLoading, hasErrors, logs };
};

export default useVisitorsLogs;
