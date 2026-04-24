import { Outlet, NavLink } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import {
    LayoutDashboard,
    Users,
    FileText,
    Stethoscope,
    BrainCog,
    LogOut
} from "lucide-react";

export function AdminLayout() {
    const { logout } = useAuthStore();

    const navItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
        { path: "/admin/users", icon: Users, label: "Users & Records" },
        { path: "/admin/cases", icon: FileText, label: "Diagnoses" },
        { path: "/admin/doctors", icon: Stethoscope, label: "Doctors" },
        { path: "/admin/rules", icon: BrainCog, label: "NLP Rules" },
    ];

    return (
        <div className="flex h-screen bg-neutral-900 text-neutral-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col transition-all duration-300">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        NazaCare Admin
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 " + (
                                    isActive
                                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                                )
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-neutral-800">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 p-6 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Admin Workspace</h2>
                        <div className="text-sm text-neutral-400">Authenticated as Admin</div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
