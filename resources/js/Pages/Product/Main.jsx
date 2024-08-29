import { useEffect, useState } from "react";

import axios from "axios";
import {
    EllipsisVertical,
    ListFilter,
    Pencil,
    Plus,
    Search,
    Trash,
    X,
} from "lucide-react";

import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { router, usePage } from "@inertiajs/react";
import CardLoading from "@/Components/CardLoading";
import { notifications } from "@mantine/notifications";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import {
    ActionIcon,
    Button,
    Flex,
    Grid,
    Image,
    LoadingOverlay,
    Menu,
    Modal,
    NumberInput,
    Pagination,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";

// Default product view
const Product = () => {
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState("");
    return (
        <Authenticated title="Product">
            {/* Top header */}
            <div className="grid grid-cols-2 gap-1">
                {/* Left Section */}
                <section>
                    <TextInput
                        type="search"
                        placeholder="Search"
                        value={searchValue}
                        onChange={(event) =>
                            setSearchValue(event.currentTarget.value)
                        }
                        leftSection={<Search size={16} />}
                        rightSection={
                            searchValue && (
                                <X
                                    size={16}
                                    className="cursor-pointer"
                                    onClick={() => setSearchValue("")}
                                />
                            )
                        }
                    />
                </section>
                {/* Right Section */}
                <section className="flex items-center justify-end space-x-1">
                    {/* Filter Button */}
                    {/* <Tooltip label="Filter" position="bottom">
                        <ActionIcon size="input-sm" variant="default">
                            <ListFilter size={16} />
                        </ActionIcon>
                    </Tooltip> */}

                    {/* Add button */}
                    <Button
                        color="rgba(50, 50, 50, 1)"
                        leftSection={<Plus size={16} />}
                        onClick={() => openNew()}
                    >
                        Add
                    </Button>
                </section>
            </div>

            {/* Main content */}
            <div className="mt-5">
                <MainContent searchValue={searchValue} />
            </div>

            {/* New Product Modal */}
            <NewProduct openNewModal={newModal} closeNewModal={closeNew} />
        </Authenticated>
    );
};

// Main Content
const MainContent = ({ searchValue }) => {
    const { products } = usePage().props;
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;

    // Filter products based on searchValue
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Menghitung item untuk pagination
    const startIndex = (activePage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <>
            <Grid pos="relative">
                {paginatedProducts.length === 0 ? (
                    <Grid.Col span={12}>
                        <Paper shadow="xs" p="md">
                            <Text align="center" size="lg" color="dimmed">
                                No Record Found
                            </Text>
                        </Paper>
                    </Grid.Col>
                ) : (
                    paginatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </Grid>

            {/* Pagination Controls */}
            <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
            >
                <Pagination
                    page={activePage}
                    onChange={setActivePage}
                    total={Math.ceil(filteredProducts.length / itemsPerPage)}
                    position="center"
                    mt="md"
                />
            </Flex>
        </>
    );
};

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
                                            Stock Awal : {product.initial_stock}
                                        </Text>
                                        <Text size="sm">
                                            Location : {product.location}
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

// New Product Modal
const NewProduct = ({ openNewModal, closeNewModal }) => {
    // State for loading form hooks
    const [loading, { open: openLoading, close: closeLoading }] =
        useDisclosure(false);
    const [
        loadingDropzone,
        { open: openLoadingDrop, close: closeLoadingDrop },
    ] = useDisclosure(false);

    // State for categories
    const [categories, setCategories] = useState([]);

    // State for file previews
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(route("category.index"));
                setCategories(
                    response.data.category.map((item) => ({
                        value: item.id.toString(),
                        label: item.name,
                    }))
                );
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Product form hook
    const form = useForm({
        initialValues: {
            code: "",
            name: "",
            category: "",
            initial_stock: 0,
            location: "",
            files: [],
        },
    });

    // Handle on submit
    const handleSubmit = (values) => {
        router.post(route("product.store"), values, {
            onStart: () => {
                openLoading();
            },
            onSuccess: (response) => {
                notifications.show({
                    color: "green",
                    title: response.props.flash.success,
                    message: response.props.flash.message,
                    position: "top-center",
                });
                closeNewModal(false);
                form.reset();
                setPreviews("");
            },
            onFinish: () => {
                closeLoading();
            },
            onError: (errors) => {
                if (errors[0] != null) {
                    notifications.show({
                        color: "red",
                        title: "Failed to create a new product",
                        message: errors[0],
                        position: "top-center",
                    });
                }

                if (errors != null) {
                    form.setErrors(errors);

                    if (errors.files) {
                        const fileErrors = Array.isArray(errors.files)
                            ? errors.files.join(", ")
                            : errors.files;

                        notifications.show({
                            color: "red",
                            title: "File upload error",
                            message: fileErrors,
                            position: "top-center",
                        });
                    }
                }
            },
        });
    };

    // Handle on drop files
    const handleDrop = (files) => {
        openLoadingDrop();
        setTimeout(() => {
            form.setFieldValue("files", files);

            const filePreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews(filePreviews);
            closeLoadingDrop();
        }, 2000);
    };

    // Handle clear files
    const clearFiles = () => {
        openLoadingDrop();
        setTimeout(() => {
            form.setFieldValue("files", []);
            setPreviews([]);
            closeLoadingDrop();
        }, 2000);
    };

    return (
        <Modal
            title="Create new product"
            opened={openNewModal}
            onClose={closeNewModal}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack mb="sm">
                    <Grid>
                        {/* Dropzone */}
                        <Grid.Col span={12}>
                            <Dropzone
                                onDrop={handleDrop}
                                loading={loadingDropzone}
                                accept={[
                                    MIME_TYPES.png,
                                    MIME_TYPES.jpeg,
                                    MIME_TYPES.svg,
                                ]}
                                onReject={() =>
                                    form.setFieldError(
                                        "files",
                                        "Select images only"
                                    )
                                }
                            >
                                {previews.length > 0 ? (
                                    <Flex justify="center">
                                        {previews.map((src, index) => (
                                            <Image
                                                key={index}
                                                src={src}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: 300,
                                                    height: 300,
                                                }}
                                                radius="sm"
                                            />
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text ta="center">
                                        Drag & Drop images here
                                    </Text>
                                )}
                            </Dropzone>
                            {previews.length > 0 && (
                                <Button
                                    variant="outline"
                                    color="red"
                                    fullWidth
                                    mt="md"
                                    onClick={clearFiles}
                                >
                                    Clear
                                </Button>
                            )}
                        </Grid.Col>
                    </Grid>
                </Stack>
                <Stack pos="relative">
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />
                    <Grid>
                        {/* Product Code */}
                        <Grid.Col span={6}>
                            <TextInput
                                label="Product Code"
                                name="code"
                                placeholder="Enter product code"
                                maxLength={20}
                                withAsterisk
                                {...form.getInputProps("code")}
                                onChange={(event) => {
                                    form.setFieldValue(
                                        "code",
                                        event.target.value.toUpperCase()
                                    );
                                }}
                            />
                        </Grid.Col>
                        {/* Product Name */}
                        <Grid.Col span={6}>
                            <TextInput
                                label="Product Name"
                                name="name"
                                maxLength={50}
                                withAsterisk
                                placeholder="Enter product name"
                                {...form.getInputProps("name")}
                                onChange={(event) => {
                                    form.setFieldValue(
                                        "name",
                                        event.target.value
                                            .charAt(0)
                                            .toUpperCase() +
                                            event.target.value
                                                .slice(1)
                                                .toLowerCase()
                                    );
                                }}
                            />
                        </Grid.Col>
                        {/* Category */}
                        <Grid.Col span={12}>
                            <Select
                                label="Category"
                                placeholder="Choose option"
                                data={categories}
                                withAsterisk
                                allowDeselect
                                {...form.getInputProps("category")}
                            />
                        </Grid.Col>
                        {/* Initial stock */}
                        <Grid.Col span={12}>
                            <NumberInput
                                label="Start stock"
                                name="initial_stock"
                                min={0}
                                max={99999}
                                maxLength={5}
                                allowNegative={false}
                                withAsterisk
                                {...form.getInputProps("initial_stock")}
                            />
                        </Grid.Col>
                        {/* Location */}
                        <Grid.Col span={12}>
                            <TextInput
                                label="Location"
                                name="location"
                                placeholder="Enter product location"
                                withAsterisk
                                {...form.getInputProps("location")}
                            />
                        </Grid.Col>
                    </Grid>
                    {/* Button Submit */}
                    <Button
                        color="rgba(50, 50, 50, 1)"
                        type="submit"
                        fullWidth
                        mt="md"
                    >
                        Create Product
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
};

// Edit Product Modal
const EditProduct = ({ openEditModal, closeEditModal, product_id }) => {
    const [loading, { open: openLoading, close: closeLoading }] =
        useDisclosure(false);
    const [
        loadingDropzone,
        { open: openLoadingDrop, close: closeLoadingDrop },
    ] = useDisclosure(false);

    const [categories, setCategories] = useState([]);

    const [previews, setPreviews] = useState([]);

    const form = useForm({
        initialValues: {
            code: "",
            name: "",
            category: "",
            initial_stock: 0,
            location: "",
            files: [],
        },
    });

    useEffect(() => {
        if (openEditModal) {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get(route("category.index"));
                    setCategories(
                        response.data.category.map((item) => ({
                            value: item.id.toString(),
                            label: item.name,
                        }))
                    );
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            };

            const fetchProduct = async () => {
                try {
                    const response = await axios.get(
                        route("product.edit", product_id)
                    );
                    const product = response.data.product;

                    form.setValues({
                        code: product?.code,
                        name: product?.name,
                        category: product?.category_id.toString(),
                        initial_stock: product?.initial_stock,
                        location: product?.location,
                    });

                    if (product.product_files) {
                        const filePreviews = [];
                        const fileObjects = [];

                        for (const file of product.product_files) {
                            const fileUrl = `/storage/${file.path}`;
                            filePreviews.push(fileUrl);
                            const response = await fetch(fileUrl);
                            const blob = await response.blob();
                            fileObjects.push(
                                new File([blob], file.path, { type: blob.type })
                            );
                        }

                        setPreviews(filePreviews);
                        form.setFieldValue("files", fileObjects);
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            };

            fetchCategories();
            fetchProduct();
        }
    }, [openEditModal, product_id]);

    const handleSubmit = (values) => {
        router.post(route("product.update", product_id), values, {
            onStart: () => {
                openLoading();
            },
            onSuccess: (response) => {
                notifications.show({
                    color: "green",
                    title: response.props.flash.success,
                    message: response.props.flash.message,
                    position: "top-center",
                });
                closeEditModal(false);
                form.reset();
                setPreviews([]);
            },
            onFinish: () => {
                closeLoading();
            },
            onError: (errors) => {
                if (errors[0] != null) {
                    notifications.show({
                        color: "red",
                        title: "Failed to create a new product",
                        message: errors[0],
                        position: "top-center",
                    });
                }

                if (errors != null) {
                    form.setErrors(errors);

                    if (errors.files) {
                        const fileErrors = Array.isArray(errors.files)
                            ? errors.files.join(", ")
                            : errors.files;

                        notifications.show({
                            color: "red",
                            title: "File upload error",
                            message: fileErrors,
                            position: "top-center",
                        });
                    }
                }
            },
        });
    };

    const handleDrop = (files) => {
        openLoadingDrop();
        setTimeout(() => {
            form.setFieldValue("files", files);
            const filePreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews(filePreviews);
            closeLoadingDrop();
        }, 2000);
    };

    const clearFiles = () => {
        openLoadingDrop();
        setTimeout(() => {
            form.setFieldValue("files", []);
            setPreviews([]);
            closeLoadingDrop();
        }, 2000);
    };

    return (
        <Modal
            title="Edit product"
            opened={openEditModal}
            onClose={closeEditModal}
            centered
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack mb="sm">
                    <Grid>
                        <Grid.Col span={12}>
                            <Dropzone
                                onDrop={handleDrop}
                                loading={loadingDropzone}
                                accept={[
                                    MIME_TYPES.png,
                                    MIME_TYPES.jpeg,
                                    MIME_TYPES.svg,
                                ]}
                                onReject={() =>
                                    form.setFieldError(
                                        "files",
                                        "Select images only"
                                    )
                                }
                            >
                                {previews.length > 0 ? (
                                    <Flex justify="center">
                                        {previews.map((src, index) => (
                                            <Image
                                                key={index}
                                                src={src}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: 300,
                                                    height: 300,
                                                }}
                                                radius="sm"
                                            />
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text ta="center">
                                        Drag & Drop images here
                                    </Text>
                                )}
                            </Dropzone>
                            {previews.length > 0 && (
                                <Button
                                    variant="outline"
                                    color="red"
                                    fullWidth
                                    mt="md"
                                    onClick={clearFiles}
                                >
                                    Clear
                                </Button>
                            )}
                        </Grid.Col>
                    </Grid>
                </Stack>
                <Stack pos="relative">
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Product Code"
                                name="code"
                                placeholder="Enter product code"
                                maxLength={20}
                                withAsterisk
                                disabled
                                {...form.getInputProps("code")}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        "code",
                                        event.target.value.toUpperCase()
                                    )
                                }
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Product Name"
                                name="name"
                                maxLength={50}
                                withAsterisk
                                placeholder="Enter product name"
                                {...form.getInputProps("name")}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        "name",
                                        event.target.value
                                            .charAt(0)
                                            .toUpperCase() +
                                            event.target.value
                                                .slice(1)
                                                .toLowerCase()
                                    )
                                }
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Select
                                label="Category"
                                placeholder="Choose option"
                                data={categories}
                                withAsterisk
                                allowDeselect
                                {...form.getInputProps("category")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <NumberInput
                                label="Start stock"
                                name="initial_stock"
                                min={0}
                                max={99999}
                                maxLength={5}
                                allowNegative={false}
                                withAsterisk
                                {...form.getInputProps("initial_stock")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Location"
                                name="location"
                                placeholder="Enter product location"
                                withAsterisk
                                {...form.getInputProps("location")}
                            />
                        </Grid.Col>
                    </Grid>
                    <Button
                        color="rgba(50, 50, 50, 1)"
                        type="submit"
                        fullWidth
                        mt="md"
                    >
                        Update Product
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
};
// Delete Product Modal
const DeleteProduct = ({ openDelModal, closeDelModal, product_id }) => {
    const [loading, { open: openLoading, close: closeLoading }] =
        useDisclosure(false);

    const handleDelete = () => {
        router.delete(route("product.destroy", product_id), {
            onStart: () => {
                openLoading();
            },
            onSuccess: (response) => {
                notifications.show({
                    color: "green",
                    title: response.props.flash.success,
                    message: response.props.flash.message,
                    position: "top-center",
                });
            },
            onFinish: () => {
                closeLoading();
                closeDelModal();
            },
            onError: (error) => {
                notifications.show({
                    color: "red",
                    title: "Error",
                    message: `Failed to delete product ${error}`,
                    position: "top-center",
                });
            },
        });
    };

    return (
        <Modal
            title="Delete Confirmation"
            opened={openDelModal}
            onClose={closeDelModal}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Text fz={14}>Are you sure you want to delete this product?</Text>
            <Flex justify="end">
                <Button color="red" onClick={handleDelete} loading={loading}>
                    Confirm
                </Button>
            </Flex>
        </Modal>
    );
};

export default Product;
