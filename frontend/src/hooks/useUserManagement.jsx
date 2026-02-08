import { useState, useEffect } from "react";
import axios from "axios";

const convertBufferToBase64 = (buffer) => {
  if (!buffer || !buffer.data) return null;
  return `data:image/webp;base64,${btoa(
    String.fromCharCode(...buffer.data)
  )}`;
};

const useUserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("inmates");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("All");

  const [inmatesList, setInmatesList] = useState([]);
  const [visitorsList, setVisitorsList] = useState([]);

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (activeTab === "inmates") {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/admin/listofinmates`,
            {
              params: { search: debouncedQuery },
            }
          );

          const inmatesWithImages = res.data.map((inmate) => ({
            ...inmate,
            mugshot_front: convertBufferToBase64(inmate.mugshot_front),
            mugshot_left: convertBufferToBase64(inmate.mugshot_left),
            mugshot_right: convertBufferToBase64(inmate.mugshot_right),
          }));

          setInmatesList(inmatesWithImages);
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/admin/visitorsLogs`,
            {
              params: { search: debouncedQuery },
            }
          );
          setVisitorsList(res.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, debouncedQuery]);

  const applyFiltering = () => {
    if (activeTab === "inmates") {
      if (filterBy === "All") return inmatesList;

      return inmatesList.filter(
        (i) => i.status && i.status.toLowerCase() === filterBy.toLowerCase()
      );
    }

    if (activeTab === "visitors") {
      if (filterBy === "All") return visitorsList;

      return visitorsList.filter(
        (v) =>
          v.visitor_info.gender &&
          v.visitor_info.gender.toLowerCase() === filterBy.toLowerCase()
      );
    }
  };

  const filteredData = applyFiltering();

  return {
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterBy,
    setFilterBy,
    filteredData,
  };
};

export default useUserManagement;
