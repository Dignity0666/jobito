import { API_BASE_URL } from "./api.js";

export const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
};

export const updateProfile = async (data: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
    }
    return res.json();
};
