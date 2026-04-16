import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with proper conflict resolution */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format a date string to a localized display format */
export function formatDate(date: string | Date, locale: string = "en"): string {
    const d = new Date(date);
    return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** Get risk level color classes */
export function getRiskColor(risk: string): {
    text: string;
    bg: string;
    border: string;
    dot: string;
} {
    switch (risk?.toLowerCase()) {
        case "high":
            return {
                text: "text-red-600",
                bg: "bg-risk-high-bg",
                border: "border-red-200",
                dot: "bg-red-500",
            };
        case "moderate":
            return {
                text: "text-amber-600",
                bg: "bg-risk-moderate-bg",
                border: "border-amber-200",
                dot: "bg-amber-500",
            };
        case "low":
        default:
            return {
                text: "text-green-600",
                bg: "bg-risk-low-bg",
                border: "border-green-200",
                dot: "bg-green-500",
            };
    }
}
