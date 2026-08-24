import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const employeesApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getEmployees = async () => {
    const response = await employeesApi.get("/users/");
    return response.data;
};

export const getEmployee = async (userId) => {
    const response = await employeesApi.get(`/users/${userId}`);
    return response.data;
};

export const createEmployee = async (employeeData) => {
    const response = await employeesApi.post(
        "/users/",
        employeeData
    );

    return response.data;
};

export const deleteEmployee = async (userId) => {
    const response = await employeesApi.delete(
        `/users/${userId}`
    );

    return response.data;
};

export default employeesApi;