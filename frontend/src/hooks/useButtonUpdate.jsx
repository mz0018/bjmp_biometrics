import axios from "axios";

const useButtonUpdate = (userType, inmate, visitor) => {
  const findAndUpdate = async (updatedFields) => {
    try {

      const inmateObjectId = inmate?._id;
      const visitorObjectId = visitor?._id;

      const url = 
      userType === "visitor" ?
       `${import.meta.env.VITE_API_URL}/admin/update/visitor/${visitorObjectId}`
        : `${import.meta.env.VITE_API_URL}/admin/update/inmate/${inmateObjectId}`;

        const response = await axios.patch(url, updatedFields);
        console.log(response.data);
    } catch (err) {
      console.error("Something went wrong!", err);
      throw err;
    }
  };

  return { findAndUpdate };
};

export default useButtonUpdate;
