import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";
const pyApiURL = import.meta.env.VITE_PY_API_URL || "http://localhost:5001/api";

const api = axios.create({
    baseURL,
});

export const pyApi = axios.create({
    baseURL: pyApiURL,
});

export default api; 