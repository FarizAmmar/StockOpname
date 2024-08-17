import { useEffect, useState } from "react";
import axios from "axios";
import { FileDown, ListFilter, Plus } from "lucide-react";
import { useForm } from "@mantine/form";
import { router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
    ActionIcon,
    Button,
    Grid,
    LoadingOverlay,
    Modal,
    NumberInput,
    SegmentedControl,
    Select,
    Stack,
    Text,
    TextInput,
    Tooltip,
    Image,
    Group,
    Flex,
} from "@mantine/core";

export default function Product() {
    // Hooks
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);

    // Segment items
    const segment_filter = ["All", "Active", "Draft"];

    return (
        <Authenticated title="Product">
            {/* Top header */}
            <div className="grid grid-cols-2">
                {/* Left Section */}
                <section>
                    <SegmentedControl data={segment_filter} />
                </section>
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

            {/* New Product Modal */}
            <NewProduct openNewModal={newModal} closeNewModal={closeNew} />
        </Authenticated>
    );
}

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
            price: 0,
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
                        {/* Price */}
                        <Grid.Col span={12}>
                            <NumberInput
                                label="Price"
                                name="price"
                                allowNegative={false}
                                thousandSeparator=","
                                defaultValue={1_000_000}
                                prefix="Rp. "
                                withAsterisk
                                hideControls
                                {...form.getInputProps("price")}
                            />
                        </Grid.Col>
                        {/* Initial stock */}
                        <Grid.Col span={12}>
                            <NumberInput
                                label="Start stock"
                                name="initial_stock"
                                min={0}
                                max={999}
                                maxLength={3}
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
