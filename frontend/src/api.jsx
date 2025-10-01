import axios from "axios";

const baseURL = import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_API_URL : "/api";

const api = axios.create({
    baseURL,
});

export default api; 