import { useLanguageStore, useTranslation } from "@/stores/languageStore";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguageStore();
    const { t } = useTranslation();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-primary-300 hover:text-primary-600 cursor-pointer active:scale-95"
            aria-label={`${t("common.language")}: ${language === "en" ? t("common.arabic") : t("common.english")}`}
        >
            <Globe className="h-4 w-4" />
            <span>{language === "en" ? "العربية" : "English"}</span>
        </button>
    );
}
