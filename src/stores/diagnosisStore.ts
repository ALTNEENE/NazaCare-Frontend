import { create } from "zustand";
import { diagnosisApi } from "@/api/diagnosis";

export interface DiagnosisResult {
    id?: string;
    risk: string;
    confidence: number;
    message: {
        en: string;
        ar: string;
    };
    recommendations: [
        {
            en: string;
            ar: string;
        }
    ];
    treatment: {
        en: string;
        ar: string;
    };
    narrativeResponse?: {
        en: string;
        ar: string;
    };
    symptoms?: string;
    createdAt?: string;
}

interface DiagnosisState {
    currentResult: DiagnosisResult | null;
    history: DiagnosisResult[];
    isLoading: boolean;
    isHistoryLoading: boolean;
    error: string | null;
    submitDiagnosis: (
        symptoms: string,
        language: string,
        lastDengueCheck?: string | null,
        lastMalariaCheck?: string | null,
        selectedSymptoms?: string[]
    ) => Promise<void>;
    fetchHistory: () => Promise<void>;
    clearResult: () => void;
    clearError: () => void;
}

export const useDiagnosisStore = create<DiagnosisState>((set) => ({
    currentResult: null,
    history: [],
    isLoading: false,
    isHistoryLoading: false,
    error: null,

    submitDiagnosis: async (symptoms, language, lastDengueCheck, lastMalariaCheck, selectedSymptoms) => {
        set({ isLoading: true, error: null, currentResult: null });
        try {
            const response = await diagnosisApi.submit({
                symptoms,
                language,
                lastDengueCheck: lastDengueCheck || null,
                lastMalariaCheck: lastMalariaCheck || null,
                selectedSymptoms: selectedSymptoms || [],
            });
            const result: DiagnosisResult = response.data;
            set({ currentResult: result, isLoading: false });
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Diagnosis request failed. Please try again.";
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    fetchHistory: async () => {
        set({ isHistoryLoading: true, error: null });
        try {
            const response = await diagnosisApi.getHistory();
            set({ history: response.data, isHistoryLoading: false });
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Failed to fetch history.";
            set({ error: message, isHistoryLoading: false });
        }
    },

    clearResult: () => set({ currentResult: null }),
    clearError: () => set({ error: null }),
}));
