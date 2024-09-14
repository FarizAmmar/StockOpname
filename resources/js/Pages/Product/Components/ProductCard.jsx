import { useEffect, useState } from "react";

import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import { useDisclosure } from "@mantine/hooks";
import CardLoading from "@/Components/CardLoading";
import {
    ActionIcon,
    Flex,
    Grid,
    Image,
    Menu,
    Paper,
    Stack,
    Text,
} from "@mantine/core";

import EditProduct from "../Partials/EditProduct";
import DeleteProduct from "../Partials/DeleteProduct";

// Product card item
const ProductCard = ({ product }) => {
    // Hook lists
    const [menu, { toggle: toggleMenu }] = useDisclosure(false);

    const [editModal, { open: openEdit, close: closeEdit }] =
        useDisclosure(false);

    const [deleteModal, { open: openDel, close: closeDel }] =
        useDisclosure(false);

    const [loading, setLoading] = useState(true);

    // Handle menu action
    const handleMenuAction = (action) => {
        switch (action) {
            case "Edit":
                openEdit();
                break;

            case "Delete":
                openDel();
                break;
        }
    };

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [product]);

    return (
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Paper shadow="xs" p="md">
                {loading ? (
                    <CardLoading />
                ) : (
                    <Grid>
                        <Grid.Col span={12}>
                            <Flex justify="space-between">
                                <Text fz={20} fw={500} mb="xs">
                                    {product.name}
                                </Text>
                                <Menu
                                    shadow="md"
                                    width={200}
                                    opened={menu}
                                    onChange={() => toggleMenu()}
                                >
                                    <Menu.Target>
                                        <ActionIcon
                                            variant="outline"
                                            color="gray"
                                            onClick={toggleMenu}
                                        >
                                            <EllipsisVertical size={16} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Action</Menu.Label>
                                        <Menu.Item
                                            leftSection={<Pencil size={16} />}
                                            onClick={() =>
                                                handleMenuAction("Edit")
                                            }
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item
                                            color="red"
                                            leftSection={<Trash size={16} />}
                                            onClick={() =>
                                                handleMenuAction("Delete")
                                            }
                                        >
                                            Delete
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Flex>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Grid>
                                <Grid.Col span={5}>
                                    <Image
                                        radius="sm"
                                        h={150}
                                        w={150}
                                        src={
                                            product.product_files[0]
                                                ? `/storage/${product.product_files[0].path}`
                                                : ""
                                        }
                                        alt={product.name}
                                    />
                                </Grid.Col>
                                <Grid.Col span={7}>
                                    <Stack spacing="xs">
                                        <Text size="sm">
                                            Kategori : {product.category.name}
                                        </Text>
                                        <Text size="sm">
                                            Stok Awal : {product.initial_stock}
                                        </Text>
                                        <Text size="sm">
                                            Lokasi : {product.location}
                                        </Text>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Grid.Col>
                    </Grid>
                )}
            </Paper>

            {/* Modal Edit*/}
            <EditProduct
                openEditModal={editModal}
                closeEditModal={closeEdit}
                product_id={product.id}
            />

            {/* Modal Delete */}
            <DeleteProduct
                openDelModal={deleteModal}
                closeDelModal={closeDel}
                product_id={product.id}
            />
        </Grid.Col>
    );
};

export default ProductCard;
