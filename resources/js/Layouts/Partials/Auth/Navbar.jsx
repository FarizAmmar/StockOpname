import { Link } from "@inertiajs/react";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";
import { Avatar, Burger, Menu, MenuDivider, rem } from "@mantine/core";

export default function Navbar({ sidebarOpened, toggleSidebar, className }) {
    return (
        <nav className={`p-3 ${className}`}>
            <div className="flex justify-between items-center">
                <Burger
                    className="shadow rounded hover"
                    bg="white"
                    size="sm"
                    lineSize={1}
                    opened={sidebarOpened}
                    onClick={toggleSidebar}
                />
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
        </nav>
    );
}
