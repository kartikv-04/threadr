import { UserPanel } from "@/components/UserPanel";

// Home Sidebar - Shows when no server is selected
export const HomeSidebar = () => {
    return (
        <aside className="flex flex-col w-60 min-w-[240px] h-screen bg-neutral-950 border-r border-neutral-800/60">
            {/* Header */}
            <div className="flex items-center h-12 px-4 border-b border-neutral-800/60 shadow-md">
                <h2 className="font-bold text-white">Direct Messages</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-3 px-2">
                <p className="text-neutral-500 text-sm text-center mt-8">
                    Select a server to view rooms
                </p>
            </div>

            {/* User Panel */}
            <div className="mt-auto pb-4">
                <UserPanel />
            </div>
        </aside>
    );
};
