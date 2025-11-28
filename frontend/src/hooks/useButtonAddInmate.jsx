import { useEffect, useState } from "react";
import axios from "axios";

const useButtonAddInmate = (searchQuery = "") => {
  const [listOfInmates, setListOfInmates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchInmates = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/admin/listofinmates`,
            { params: { search: searchQuery } }
          );
          setListOfInmates(response.data);
        } catch (error) {
          console.error("Error fetching inmates:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchInmates();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return { listOfInmates, loading };
};

export default useButtonAddInmate;
