import { useEffect, useState } from "react";
import axios from "axios";
import {
    EllipsisVertical,
    FileDown,
    Group,
    ListFilter,
    Pencil,
    PencilLine,
    Plus,
    Trash,
} from "lucide-react";
import { useForm } from "@mantine/form";
import { router, usePage } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import { notifications, showNotification } from "@mantine/notifications";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
    ActionIcon,
    Button,
    Grid,
    LoadingOverlay,
    Modal,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
    Tooltip,
    Image,
    Flex,
    Paper,
    Card,
    Badge,
    Menu,
    Pagination,
} from "@mantine/core";
import { AgGridReact } from "ag-grid-react";

export default function Product() {
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);

    return (
        <Authenticated title="Product">
            {/* Top header */}
            <div className="grid grid-cols-2">
                {/* Left Section */}
                <section></section>
                {/* Right Section */}
                <section className="flex items-center md:justify-end space-x-2">
                    {/* Filter Button */}
                    <Tooltip label="Filter" position="bottom">
                        <ActionIcon size="input-sm" variant="default">
                            <ListFilter size={16} />
                        </ActionIcon>
                    </Tooltip>
                    {/* Export Button */}
                    <Tooltip label="Export CSV" position="bottom">
                        <ActionIcon size="input-sm" variant="default">
                            <FileDown size={16} />
                        </ActionIcon>
                    </Tooltip>
                    {/* Add button */}
                    <Button
                        color="rgba(50, 50, 50, 1)"
                        leftSection={<Plus size={16} />}
                        onClick={() => openNew()}
                    >
                        Add Product
                    </Button>
                </section>
            </div>

            {/* Main content */}
            <div className="mt-5">
                <MainContent />
            </div>

            {/* New Product Modal */}
            <NewProduct openNewModal={newModal} closeNewModal={closeNew} />
        </Authenticated>
    );
}

function ProductCard({ product }) {
    const [opened, { toggle }] = useDisclosure(false);

    const handleMenuAction = (action) => {
        console.log(`Product ID: ${product.id}, Action: ${action}`);
    };

    return (
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Paper shadow="xs" p="md">
                <Grid>
                    <Grid.Col span={12}>
                        <div className="flex justify-between">
                            <Text fz={20} fw={500} mb="xs">
                                {product.name}
                            </Text>
                            <Menu
                                shadow="md"
                                width={200}
                                opened={opened}
                                onChange={() => toggle()}
                            >
                                <Menu.Target>
                                    <ActionIcon
                                        variant="outline"
                                        color="gray"
                                        onClick={toggle}
                                    >
                                        <EllipsisVertical size={16} />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Action</Menu.Label>
                                    <Menu.Item
                                        leftSection={<Pencil size={16} />}
                                        onClick={() => handleMenuAction("Edit")}
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
                        </div>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Grid>
                            <Grid.Col span={5}>
                                <Image
                                    radius="sm"
                                    h={150}
                                    w={150}
                                    src={`/storage/${product.product_files[0].path}`}
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
            </Paper>
        </Grid.Col>
    );
}

function MainContent() {
    const { products } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [products]);

    // Menghitung item untuk pagination
    const startIndex = (activePage - 1) * itemsPerPage;
    const paginatedProducts = products.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <>
            <Grid pos="relative">
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />
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
                    total={Math.ceil(products.length / itemsPerPage)}
                    position="center"
                    mt="md"
                />
            </Flex>
        </>
    );
}

// New Product Modal
function NewProduct({ openNewModal, closeNewModal }) {
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
                        title: "Failed to login!",
                        message: errors[0],
                        position: "top-center",
                    });
                } else {
                    form.setErrors({
                        code: errors.code,
                        name: errors.name,
                        category: errors.category,
                        price: errors.price,
                        initial_stock: errors.initial_stock,
                        location: errors.location,
                    });
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
            title="Create new product"
            opened={openNewModal}
            onClose={closeNewModal}
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack mb="sm">
                    <Grid>
                        {/* Dropzone */}
                        <Grid.Col span={12}>
                            <Dropzone
                                accept={IMAGE_MIME_TYPE}
                                onDrop={handleDrop}
                                loading={loadingDropzone}
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
                            />
                        </Grid.Col>
                        {/* Category */}
                        <Grid.Col span={12}>
                            <Select
                                label="Category"
                                placeholder="Choose option"
                                data={categories}
                                withAsterisk
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
                        Add Product
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
