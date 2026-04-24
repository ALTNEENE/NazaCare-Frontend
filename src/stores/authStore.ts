import { create } from "zustand";
import { authApi } from "@/api/auth";

interface User {
    id: string;
    fullName: string;
    email: string;
    languagePreference?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    bloodType?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (data: {
        fullName: string;
        email: string;
        password: string;
        languagePreference: string;
    }) => Promise<void>;
    updateHealthProfile: (data: {
        age: number;
        gender: string;
        height: number;
        weight: number;
        bloodType: string;
    }) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
    // Restore session from storage
    const storedToken =
        localStorage.getItem("nazacare-token") ||
        sessionStorage.getItem("nazacare-token");
    const storedUser = localStorage.getItem("nazacare-user") ||
        sessionStorage.getItem("nazacare-user");
    // const regError = useTranslation().t("auth.regError");
    return {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        isAuthenticated: !!storedToken,
        isLoading: false,
        error: null,

        login: async (email, password, rememberMe = false) => {
            set({ isLoading: true, error: null });
            try {
                const response = await authApi.login({ email, password });
                const { token, user } = response.data;
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem("nazacare-token", token);
                storage.setItem("nazacare-user", JSON.stringify(user));
                set({ user, token, isAuthenticated: true, isLoading: false });
            } catch (err: unknown) {
                const message =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    "Login failed. Please check your credentials.";
                set({ error: message })
                set({ error: message, isLoading: false });
                throw new Error(message);
            }
        },

        register: async (data) => {
            set({ isLoading: true, error: null });
            try {
                // Backend now returns { token, user } for auto-login
                const response = await authApi.register(data);
                const { token, user } = response.data;
                // Store in sessionStorage (not rememberMe yet — user hasn't confirmed that)
                sessionStorage.setItem("nazacare-token", token);
                sessionStorage.setItem("nazacare-user", JSON.stringify(user));
                set({ user, token, isAuthenticated: true, isLoading: false });
            } catch (err: unknown) {
                const message =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    "Registration failed. Please try again.";
                set({ error: message, isLoading: false });
                throw new Error(message);
            }
        },

        updateHealthProfile: async (data) => {
            set({ isLoading: true, error: null });
            try {
                const response = await authApi.updateHealthProfile(data);
                const updatedUser = response.data;
                // Merge updated fields into stored user
                const currentUser = get().user!;
                const mergedUser = { ...currentUser, ...updatedUser };
                // Update in whichever storage the token is in
                if (localStorage.getItem("nazacare-token")) {
                    localStorage.setItem("nazacare-user", JSON.stringify(mergedUser));
                } else {
                    sessionStorage.setItem("nazacare-user", JSON.stringify(mergedUser));
                }
                set({ user: mergedUser, isLoading: false });
            } catch (err: unknown) {
                const message =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    "Failed to update health profile.";
                set({ error: message, isLoading: false });
                throw new Error(message);
            }
        },

        logout: () => {
            localStorage.removeItem("nazacare-token");
            localStorage.removeItem("nazacare-user");
            sessionStorage.removeItem("nazacare-token");
            sessionStorage.removeItem("nazacare-user");
            set({ user: null, token: null, isAuthenticated: false });
        },

        clearError: () => set({ error: null }),
        setUser: (user) => set({ user }),
    };
});
