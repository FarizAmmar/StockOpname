import { Head } from "@inertiajs/react";
import Sidebar from "./Partials/Auth/Sidebar";
import Navbar from "./Partials/Auth/Navbar";
import { useDisclosure } from "@mantine/hooks";

export default function Authenticated({ title, className, children }) {
    // Mantine Hooks
    const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure(true);

    return (
        <>
            {/* Headers Title */}
            <Head title={title} />

            <div className="flex min-h-screen">
                {/* Sidebar section */}
                <section
                    className={`hidden md:block transition-all bg-zinc-100 duration-300 overflow-hidden ${
                        sidebarOpened ? "w-64" : "w-0"
                    }`}
                >
                    <Sidebar title={title} className="p-3" />
                </section>

                {/* Section main layout */}
                <section className="flex-1 ">
                    {/* Headers */}
                    <header>
                        <Navbar
                            sidebarOpened={sidebarOpened}
                            toggleSidebar={toggleSidebar}
                        />
                    </header>

                    {/* Main content */}
                    <main className={`p-3 ${className}`}>{children}</main>
                </section>
            </div>
        </>
    );
}
