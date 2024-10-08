import { ArrowLeftRight, Gauge, Package } from "lucide-react";

import { Link } from "@inertiajs/react";
import { Avatar, Divider, Stack, Text, Title, Tooltip } from "@mantine/core";

const Sidebar = ({ className, title }) => {
    const tabs = {
        item: [
            { link: route("dashboard"), label: "Dashboard", icon: Gauge },
            { link: route("product.index"), label: "Product", icon: Package },
            {
                link: route("transaction.index"),
                label: "Transaction",
                icon: ArrowLeftRight,
            },
        ],
    };

    return (
        <nav className={className}>
            {/* Sidebar Header */}
            <header className="bg-white flex items-center space-x-4 rounded shadow w-full p-1">
                <Avatar src="/assets/image/Letter W.jpeg" />
                <Title order={5}>Stock Opname</Title>
            </header>

            <Divider my="md" />

            {/* Sidebar Body */}
            <div className="w-full mt-5">
                <Stack spacing="sm">
                    {tabs.item.map((tab, index) => (
                        <NavbarLink
                            key={index}
                            icon={tab.icon}
                            label={tab.label}
                            link={tab.link}
                            title={title}
                        />
                    ))}
                </Stack>
            </div>
        </nav>
    );
};

// Navbar link component
function NavbarLink({ icon: Icon, label, link, title }) {
    return (
        <Tooltip
            label={label}
            position="right"
            offset={29}
            transitionProps={{ transition: "skew-up", duration: 300 }}
        >
            <Link
                href={link}
                className={`${
                    label === title
                        ? "bg-zinc-800 text-white"
                        : "hover:bg-white hover:text-zinc-800 hover:shadow text-zinc-500"
                } flex items-center  rounded space-x-3 p-3 transition duration-300`}
            >
                <Icon size={20} />
                <Text>{label}</Text>
            </Link>
        </Tooltip>
    );
}

export default Sidebar;
