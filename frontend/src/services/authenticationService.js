import api from "./api";

export async function authenticateUser(formData) {
    const response = await api.post(
        "/authentication/authenticate",
        formData
    );

    return response.data;
}