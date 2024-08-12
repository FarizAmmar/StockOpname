import { Link } from "@inertiajs/react";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";
import { Avatar, Burger, Drawer, Menu, MenuDivider, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Navbar({ sidebarOpened, toggleSidebar, className }) {
    const [mobileSidebar, { open: openMobile, close: closeMobile }] =
        useDisclosure(false);
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
                    onClick={() => openMobile()}
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
            ></Drawer>
        </nav>
    );
}
