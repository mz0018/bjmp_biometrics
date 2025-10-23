import axios from "axios";

const useButtonUpdate = (id) => {
  const findAndUpdate = async (updatedFields) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/update/${id}`,
        updatedFields
      );
      console.log("Update response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Something went wrong! ", err);
      throw err;
    }
  };

  return { findAndUpdate };
};

export default useButtonUpdate;
