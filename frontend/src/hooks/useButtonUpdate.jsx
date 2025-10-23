import { useEffect } from "react";
import axios from "axios";

const useButtonUpdate = (id, userType) => {

    const findAndUpdate = async () => {
        console.log(`${id}, ${userType}`);
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/admin/update/${id}`, { userType });
            console.log(response.data);
        } catch (err) {
            console.error('Something went wrong! ', err);
        }
    }

    return { findAndUpdate }
}

export default useButtonUpdate;