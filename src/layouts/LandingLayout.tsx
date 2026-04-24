import { Outlet } from "react-router-dom";

/**
 * Minimal layout for the Landing page.
 * Keeps structural integrity without adding conflicting styles like duplicate footers or backgrounds.
 */
export function LandingLayout() {
    return (
        <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
            <main className="flex-1 flex flex-col relative w-full h-full">
                <Outlet />
            </main>
        </div>
    );
}
