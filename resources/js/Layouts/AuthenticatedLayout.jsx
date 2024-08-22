import { Head } from "@inertiajs/react";
import Sidebar from "./Partials/Auth/Sidebar";
import Navbar from "./Partials/Auth/Navbar";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { Affix, Button, rem, Transition } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";

export default function Authenticated({ title, className, children }) {
    // Mantine Hooks
    const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure(true);
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <>
            {/* Headers Title */}
            <Head title={title} />

            <div className="flex min-h-screen bg-slate-200">
                {/* Sidebar section */}
                <section
                    className={`hidden md:block transition-all bg-white duration-300 overflow-hidden ${
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
                            title={title}
                            sidebarOpened={sidebarOpened}
                            toggleSidebar={toggleSidebar}
                        />
                    </header>

                    {/* Main content */}
                    <main className={`p-3 ${className}`}>{children}</main>
                </section>
            </div>

            {/* Affix */}
            <Affix position={{ bottom: 15, right: 15 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            radius="xl"
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            <IconArrowUp
                                style={{ width: rem(16), height: rem(16) }}
                            />
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    );
}
