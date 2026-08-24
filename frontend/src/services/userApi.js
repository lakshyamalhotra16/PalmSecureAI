import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const usersApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getUsers = async () => {
    const response = await usersApi.get("/users/");
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await usersApi.delete(`/users/${userId}`);
    return response.data;
};

export default usersApi;