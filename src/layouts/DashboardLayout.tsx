import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/stores/languageStore";
import { useToastStore } from "@/stores/toastStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Heart, Stethoscope, History, LogOut, Menu, X, Home, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getReminderData } from "@/pages/HealthProfile";

/**
 * Dashboard layout for /diagnosis and /history.
 * Header with navigation, language switcher, and logout.
 */
export function DashboardLayout() {
    const { logout, user } = useAuthStore();
    const { t, language } = useTranslation();
    const addToast = useToastStore((s) => s.addToast);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check for health profile update reminder
        const reminderData = getReminderData();
        if (reminderData && Date.now() >= reminderData.remindAt) {
            addToast({
                type: "info",
                message: language === "ar"
                    ? "حان الوقت لتحديث معلوماتك الصحية (الوزن والطول)!"
                    : "It's time to update your health profile (weight & height)!"
            });
            // Reset the reminder for the next interval so we don't spam them on every mount.
            // If they actually go edit and save, it sets a fresh date from then.
            const nextReminder = Date.now() + reminderData.intervalDays * 86400000;
            localStorage.setItem("nazacare-health-reminder", JSON.stringify({
                remindAt: nextReminder,
                intervalDays: reminderData.intervalDays
            }));
        }
    }, [addToast, language]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { to: "/home", label: t("nav.home"), icon: Home },
        { to: "/diagnosis", label: t("nav.diagnosis"), icon: Stethoscope },
        { to: "/history", label: t("nav.history"), icon: History },
        { to: "/health-profile", label: language === "ar" ? "الملف الصحي" : "Health Profile", icon: UserCircle },
    ];

    return (
        <div className="min-h-screen bg-surface-secondary flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <NavLink to="/diagnosis" className="flex items-center gap-2.5 group">
                            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-medical shadow-md group-hover:shadow-lg transition-shadow">
                                <Heart className="h-4.5 w-4.5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-primary-800">{t("app.name")}</span>
                                <p className="text-[10px] text-slate-400 leading-none -mt-0.5">{t("app.tagline")}</p>
                            </div>

                        </NavLink>

                        {/* Desktop navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary-50 text-primary-700 shadow-sm"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center gap-3">
                            {user && (
                                <span className="text-sm text-slate-600 font-medium">
                                    {user.fullName}
                                </span>
                            )}
                            {/* User info + Logout (desktop) */}
                            <div className="hidden md:flex items-center gap-3">
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                    aria-label={t("nav.logout")}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden lg:inline">{t("nav.logout")}</span>
                                </button>
                            </div>

                            <LanguageSwitcher />


                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary-50 text-primary-700"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </NavLink>
                            ))}
                            <hr className="my-2 border-slate-100" />
                            {user && (
                                <p className="px-3 py-1 text-xs text-slate-400">{user.fullName}</p>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                {t("nav.logout")}
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} {t("app.name")} — {t("app.description")}
                </div>
            </footer>
        </div>
    );
}
