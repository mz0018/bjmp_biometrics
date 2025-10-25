import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const useUserManagement = () => {
  const [activeTab, setActiveTab] = useState("inmates");
  const [searchQuery, setSearchQuery] = useState("");

  const [inmatesList, setInmatesList] = useState([]);
  const [visitorsList, setVisitorsList] = useState([]);

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
        try {
        if (activeTab === "inmates") {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/listofinmates`, {
            params: { search: debouncedQuery },
            });
            setInmatesList(res.data);
        } else {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/visitorsLogs`, {
            params: { search: debouncedQuery },
            });
            setVisitorsList(res.data);
        }
        } catch (err) {
        console.error("Error fetching data:", err);
        }
    };

    fetchData();
    }, [activeTab, debouncedQuery]);

  const filteredData = activeTab === "inmates" ? inmatesList : visitorsList;

  return { activeTab, setActiveTab, searchQuery, setSearchQuery, filteredData };
};

export default useUserManagement;
