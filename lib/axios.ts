import axios from "axios";

const api = axios.create({
    baseURL: "https://ecommerce-api-dd5z.onrender.com/api/v1",
    withCredentials: true,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;