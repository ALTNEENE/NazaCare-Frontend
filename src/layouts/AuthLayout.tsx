import { Outlet, Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/stores/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Heart } from "lucide-react";

/**
 * Auth layout for /login and /register pages.
 * Centered card with medical branding. Redirects to /diagnosis if already authenticated.
 */
export function AuthLayout() {
    const { isAuthenticated } = useAuthStore();
    const { t } = useTranslation();

    // Already logged in → go to dashboard
    if (isAuthenticated) {
        return <Navigate to="/diagnosis" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-medical-light flex flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-medical shadow-md group-hover:shadow-lg transition-shadow">
                        <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-primary-800">{t("app.name")}</span>
                </Link>
                <LanguageSwitcher />
            </header>

            {/* Main content area with centered card */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md animate-slide-up-slow">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} {t("app.name")} — {t("app.tagline")}</p>
            </footer>
        </div>
    );
}
