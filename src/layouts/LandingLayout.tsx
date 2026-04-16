import { Outlet } from "react-router-dom";
import { useTranslation } from "@/stores/languageStore";

/**
 * Dashboard layout for /diagnosis and /history.
 * Header with navigation, language switcher, and logout.
 */
export function LandingLayout() {
    const { t } = useTranslation();


    // const navLinks = [
    //     { to: "/login", label: t("nav.login"), icon: Home },
    //     { to: "/about", label: t("nav.about"), icon: Stethoscope },
    //     { to: "/contact", label: t("nav.contact"), icon: History },
    // ];

    // const handleLogout = () => {
    //     logout();
    //     navigate("/landing");
    // };

    return (
        <div className="min-h-screen bg-surface-secondary flex flex-col">
            {/* Header */}
            {/* <header className="sticky top-0 z-40 glass border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <NavLink to="/landing" className="flex items-center gap-2.5 group">
                            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-medical shadow-md group-hover:shadow-lg transition-shadow">
                                <Heart className="h-4.5 w-4.5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-primary-800">{t("app.name")}</span>
                                <p className="text-[10px] text-slate-400 leading-none -mt-0.5">{t("app.tagline")}</p>
                            </div>

                        </NavLink>


                            <div className="hidden md:flex items-center gap-3">
                                {
                                    user && (
                                        <button
                                            onClick={() => navigate("/diagnosis")}
                                            className={`inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-400 cursor-pointer`}
                                            aria-label={t("nav.diagnosis")}
                                        >
                                            <span className="hidden lg:inline">{t("nav.diagnosis")}</span>
                                        </button>
                                    )
                                }
                                {
                                    user ? (
                                        <button
                                            onClick={handleLogout}
                                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                            aria-label={t("nav.logout")}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span className="hidden lg:inline">{t("nav.logout")}</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate("/register")}
                                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-accent-50 hover:text-accent-600 cursor-pointer"
                                            aria-label={t("nav.signup")}
                                        >
                                            <span className="hidden lg:inline">{t("nav.signup")}</span>
                                        </button>
                                    )
                                }
                            </div>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>

                            <LanguageSwitcher />

                        </div>
                    </div>
                </div>

                // mobile menu
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
            </header> */}

            {/* Main content */}
            <main className="flex-1">
                <Outlet />
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
