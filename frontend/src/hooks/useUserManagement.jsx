import { useState, useEffect } from "react";
import axios from "axios";

const convertBufferToBase64 = (buffer) => {
  if (!buffer || !buffer.data) return null;
  return `data:image/webp;base64,${btoa(
    String.fromCharCode(...buffer.data)
  )}`;
};

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

          const inmatesWithImages = res.data.map((inmate) => ({
            ...inmate,
            mugshot_front: convertBufferToBase64(inmate.mugshot_front),
            mugshot_left: convertBufferToBase64(inmate.mugshot_left),
            mugshot_right: convertBufferToBase64(inmate.mugshot_right),
          }));

          setInmatesList(inmatesWithImages);
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
