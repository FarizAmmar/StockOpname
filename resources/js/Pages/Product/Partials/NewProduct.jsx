import { useEffect, useState } from "react";

import axios from "axios";

import { useForm } from "@mantine/form";
import { router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import {
    Button,
    Flex,
    Grid,
    Image,
    LoadingOverlay,
    Modal,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";

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
        if (openNewModal) {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get(
                        route("api.category.get_data")
                    );
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
        }
    }, [openNewModal]);

    // Product form hook
    const form = useForm({
        initialValues: {
            code: "",
            name: "",
            category: "",
            initial_stock: 0,
            unit: "",
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
        }, 500);
    };

    // Handle clear files
    const clearFiles = () => {
        openLoadingDrop();
        setTimeout(() => {
            form.setFieldValue("files", []);
            setPreviews([]);
            closeLoadingDrop();
        }, 500);
    };

    return (
        <Modal
            title="Tambah Produk"
            opened={openNewModal}
            onClose={closeNewModal}
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
                                label="Kode Barang"
                                name="code"
                                placeholder="Masukan kode barang"
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
                                label="Nama Barang"
                                name="name"
                                maxLength={50}
                                withAsterisk
                                placeholder="Masukan nama barang"
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
                                label="Kategori"
                                placeholder="Pilih kategori"
                                data={categories}
                                withAsterisk
                                allowDeselect
                                {...form.getInputProps("category")}
                            />
                        </Grid.Col>

                        {/* Unit product */}
                        <Grid.Col span={6}>
                            <TextInput
                                label="Satuan"
                                name="unit"
                                maxLength={50}
                                withAsterisk
                                placeholder="Masukan satuan barang"
                                {...form.getInputProps("unit")}
                            />
                        </Grid.Col>

                        {/* Initial stock */}
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Stok Awal"
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
                                label="Lokasi"
                                name="location"
                                placeholder="Masukan lokasi barang"
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
                        Buat Barang
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
};

export default NewProduct;
