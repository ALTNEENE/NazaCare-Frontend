import apiClient from "./client";

interface DiagnosisPayload {
    symptoms: string;
    language: string;
    lastDengueCheck?: string | null;
    lastMalariaCheck?: string | null;
    selectedSymptoms?: string[];
    labData?: Record<string, any> | null;
}

export const diagnosisApi = {
    submit: (data: DiagnosisPayload) => apiClient.post("/diagnosis", data, {
        timeout: 100000,
    }),
    getHistory: () => apiClient.get("/history"),
};
