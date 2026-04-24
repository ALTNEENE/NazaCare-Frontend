import axios from "axios";

/** Axios instance with base URL and JWT interceptor */
const apiClient = axios.create({
    // baseURL: "https://api.nazacare.cloud/api",
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("nazacare-token") ||
            sessionStorage.getItem("nazacare-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("nazacare-token");
            localStorage.removeItem("nazacare-user");
            sessionStorage.removeItem("nazacare-token");
            sessionStorage.removeItem("nazacare-user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
