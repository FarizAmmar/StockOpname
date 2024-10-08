import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
    Flex,
    Grid,
    Image,
    LoadingOverlay,
    Modal,
    Stack,
    TextInput,
    Textarea,
} from "@mantine/core";
import { ImageIcon } from "lucide-react";

// Modal detail product
const DetailProduct = ({ openDetailModal, closeDetailModal, product_id }) => {
    const [loading, { open: openLoading, close: closeLoading }] =
        useDisclosure(false);
    const [categories, setCategories] = useState([]);
    const [previews, setPreviews] = useState([]);

    const form = useForm({
        initialValues: {
            code: "",
            name: "",
            category: "",
            initial_stock: 0,
            unit: "",
            notes: "",
            files: [],
        },
    });

    useEffect(() => {
        if (openDetailModal) {
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
                    openLoading();
                    const response = await axios.get(
                        route("product.edit", product_id)
                    );
                    const product = response.data.product;

                    form.setValues({
                        code: product?.code,
                        name: product?.name,
                        category: product?.category_id.toString(),
                        initial_stock: product?.initial_stock,
                        unit: product?.unit,
                        notes: product?.notes,
                    });

                    if (product.product_files) {
                        const filePreviews = [];
                        for (const file of product.product_files) {
                            const fileUrl = `/storage/${file.path}`;
                            filePreviews.push(fileUrl);
                        }
                        setPreviews(filePreviews);
                    }

                    closeLoading();
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            };

            fetchCategories();
            fetchProduct();
        }
    }, [openDetailModal, product_id]);

    return (
        <Modal
            title="Detail Barang"
            opened={openDetailModal}
            onClose={closeDetailModal}
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            <Stack mb="sm">
                <Grid>
                    <Grid.Col span={12}>
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
                                        mb={20}
                                    />
                                ))}
                            </Flex>
                        ) : (
                            <Flex
                                justify="center"
                                align="center"
                                style={{ height: 250 }}
                            >
                                <ImageIcon size={100} color="gray" />
                            </Flex>
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
                            placeholder="Masukan kode produk"
                            maxLength={20}
                            readOnly
                            {...form.getInputProps("code")}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Nama Produk"
                            name="name"
                            maxLength={50}
                            placeholder="Masukan nama produk"
                            readOnly
                            {...form.getInputProps("name")}
                        />
                    </Grid.Col>

                    {/* Category */}
                    <Grid.Col span={12}>
                        <TextInput
                            label="Kategori"
                            placeholder="Pilih kategori"
                            value={
                                categories.find(
                                    (cat) => cat.value === form.values.category
                                )?.label || ""
                            }
                            readOnly
                        />
                    </Grid.Col>

                    {/* Unit */}
                    <Grid.Col span={6}>
                        <TextInput
                            label="Satuan"
                            name="unit"
                            maxLength={50}
                            readOnly
                            {...form.getInputProps("unit")}
                        />
                    </Grid.Col>

                    {/* Initial Stock */}
                    <Grid.Col span={6}>
                        <TextInput
                            label="Stok Awal"
                            name="initial_stock"
                            placeholder="0"
                            value={form.values.initial_stock}
                            readOnly
                        />
                    </Grid.Col>

                    {/* Notes */}
                    <Grid.Col span={12}>
                        <Textarea
                            label="Keterangan Barang"
                            name="notes"
                            readOnly
                            {...form.getInputProps("notes")}
                        />
                    </Grid.Col>
                </Grid>
            </Stack>
        </Modal>
    );
};

export default DetailProduct;
