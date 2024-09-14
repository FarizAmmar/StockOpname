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
        }, 500);
    };

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
            title="Ubah Produk"
            opened={openEditModal}
            onClose={closeEditModal}
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
                                                fit="cover"
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
                                label="Kode Produk"
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
                                label="Nama Produk"
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
                                label="Kategori"
                                placeholder="Choose option"
                                data={categories}
                                withAsterisk
                                allowDeselect
                                {...form.getInputProps("category")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
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
                        <Grid.Col span={12}>
                            <TextInput
                                label="Lokasi"
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
                        Simpan Perubahan
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
};

export default EditProduct;
