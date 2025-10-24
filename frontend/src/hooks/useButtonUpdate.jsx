import axios from "axios";

const useButtonUpdate = (id, inmate, visitor) => {
  const findAndUpdate = async (updatedFields) => {
    try {
      console.log("Inmate _id:", inmate?._id);
      console.log("Visitor _id (ObjectId):", visitor?._id);
      console.log("Visitor visitor_id:", visitor?.visitor_id);
      console.log("ID used for update:", id);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/update/${id}`,
        updatedFields
      );
      console.log("Update response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Something went wrong!", err);
      throw err;
    }
  };

  return { findAndUpdate };
};

export default useButtonUpdate;
