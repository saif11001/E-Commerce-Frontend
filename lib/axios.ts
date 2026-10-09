import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1",
    withCredentials: true,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;