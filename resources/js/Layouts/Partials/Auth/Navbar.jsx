import { Link } from "@inertiajs/react";
import {
    IconLogout,
    IconUserCircle,
    IconGauge,
    IconPackage,
} from "@tabler/icons-react";
import {
    Avatar,
    Burger,
    Drawer,
    Menu,
    MenuDivider,
    NavLink,
    rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Gauge, Package } from "lucide-react";

export default function Navbar({
    sidebarOpened,
    toggleSidebar,
    className,
    title,
}) {
    // Mantine Hook
    const [mobileSidebar, { open: openMobile, close: closeMobile }] =
        useDisclosure(false);

    // Sidebar mobile tab item
    const tabs = {
        item: [
            { link: route("dashboard"), label: "Dashboard", icon: Gauge },
            {
                link: route("product.index"),
                label: "Product",
                icon: Package,
            },
        ],
    };

    return (
        <nav className={`p-3 ${className}`}>
            <div className="flex justify-between items-center">
                {/* Burger for desktop sidebar */}
                <Burger
                    className="shadow rounded hover hidden md:block"
                    bg="white"
                    size="sm"
                    lineSize={1}
                    opened={sidebarOpened}
                    onClick={toggleSidebar}
                />

                {/* Burger for mobile sidebar */}
                <Burger
                    className="shadow rounded hover block md:hidden"
                    bg="white"
                    size="sm"
                    lineSize={1}
                    opened={mobileSidebar}
                    onClick={openMobile}
                />

                {/* Menu Dropdown */}
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <div className="cursor-pointer">
                            <Avatar></Avatar>
                        </div>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Settings</Menu.Label>
                        <Menu.Item
                            leftSection={
                                <IconUserCircle
                                    style={{ width: rem(20), height: rem(20) }}
                                />
                            }
                        >
                            My Profile
                        </Menu.Item>
                        <MenuDivider />
                        <Menu.Item
                            href={route("logout")}
                            component={Link}
                            color="red"
                            leftSection={
                                <IconLogout
                                    style={{ width: rem(20), height: rem(20) }}
                                />
                            }
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>

            {/* Drawer for mobile sidebar */}
            <Drawer
                title="Main Menu"
                opened={mobileSidebar}
                onClose={closeMobile}
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                size="xs"
            >
                {tabs.item.map((tab, index) => (
                    <NavLink
                        key={index}
                        href={tab.link}
                        label={tab.label}
                        leftSection={<tab.icon size={20} />}
                        active={tab.label === title ? true : false}
                        variant="filled"
                        color="rgba(50, 50, 50, 1)"
                    />
                ))}
            </Drawer>
        </nav>
    );
}
