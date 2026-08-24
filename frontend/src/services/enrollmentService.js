import api from "./api";

export async function enrollUser(formData) {
    const response = await api.post(
        "/enrollment/enroll",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}