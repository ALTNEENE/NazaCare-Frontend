import { create } from "zustand";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageState {
    language: Language;
    direction: Direction;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => {
    // Read persisted language or default to "en"
    const stored = localStorage.getItem("nazacare-lang") as Language | null;
    const initialLang: Language = stored || "en";
    const initialDir: Direction = initialLang === "ar" ? "rtl" : "ltr";

    // Apply direction on init
    document.documentElement.setAttribute("dir", initialDir);
    document.documentElement.setAttribute("lang", initialLang);

    return {
        language: initialLang,
        direction: initialDir,
        setLanguage: (lang: Language) => {
            const dir: Direction = lang === "ar" ? "rtl" : "ltr";
            document.documentElement.setAttribute("dir", dir);
            document.documentElement.setAttribute("lang", lang);
            localStorage.setItem("nazacare-lang", lang);
            set({ language: lang, direction: dir });
        },
    };
});

// Translation map
const translations: Record<Language, typeof en> = { en, ar };

/**
 * Get a nested value from an object using a dot-separated path.
 * e.g. getNestedValue(obj, "auth.loginTitle") => obj.auth.loginTitle
 */
function getNestedValue(obj: Record<string, unknown>, path: string): any {
    const keys = path.split(".");
    let current: any = obj;
    for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }
    return current;
}

/** Simple translation function */
export function useTranslation() {
    const { language, direction } = useLanguageStore();
    const t = (key: string, _options?: any): any => {
        const value = getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
        return value !== undefined ? value : key;
    };
    return { t, language, direction };
}
