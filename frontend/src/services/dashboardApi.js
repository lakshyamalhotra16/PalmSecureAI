import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const dashboardApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getDashboard = async () => {
    const response = await dashboardApi.get("/dashboard");
    return response.data;
};

export default dashboardApi;