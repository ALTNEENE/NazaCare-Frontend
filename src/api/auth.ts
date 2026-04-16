import apiClient from "./client";

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    languagePreference: string;
}

interface HealthProfilePayload {
    age: number;
    gender: string;
    height: number;
    weight: number;
    bloodType: string;
}

export const authApi = {
    login: (data: LoginPayload) => apiClient.post("/auth/login", data),
    register: (data: RegisterPayload) => apiClient.post("/auth/register", data),
    updateHealthProfile: (data: HealthProfilePayload) =>
        apiClient.put("/auth/health-profile", data),
};
