import api from "./api";

export async function authenticateUser(formData) {
    const response = await api.post(
        "/authenticate",
        formData
    );

    return response.data;
}