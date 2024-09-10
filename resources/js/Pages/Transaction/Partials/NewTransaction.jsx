import { useState } from "react";

import dayjs from "dayjs";

import { useForm } from "@mantine/form";
import { router } from "@inertiajs/react";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
    Button,
    Grid,
    LoadingOverlay,
    Modal,
    NumberInput,
    Select,
    Stack,
    Textarea,
} from "@mantine/core";

import ComboboxProducts from "../Components/ComboboxProduct";

const NewTransaction = ({ openTransModal, closeTransModal }) => {
    // Initilize loading state
    const [loading, setLoading] = useState(false);

    // Initilize & validation form
    const form = useForm({
        initialValues: {
            product: "",
            transaction_date: null,
            transaction_type: "",
            quantity: 0,
            notes: "",
        },
    });

    // Handle form submission
    const handleSubmit = (values) => {
        const formattedDate = dayjs(values.transaction_date).format(
            "YYYY/MM/DD"
        );

        const data = {
            ...values,
            transaction_date: formattedDate,
        };

        router.post(route("transaction.store"), data, {
            onStart: () => {
                setLoading(true);
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
                form.reset();
                setLoading(false);
                closeTransModal();
            },
            onError: (errors) => {
                if (errors[0] != null) {
                    notifications.show({
                        color: "red",
                        title: "Failed to create a new transaction",
                        message: errors[0],
                        position: "top-center",
                    });
                }

                if (errors != null) {
                    form.setErrors(errors);
                }
            },
        });
    };

    return (
        <Modal
            title="Buat Transaksi"
            opened={openTransModal}
            onClose={closeTransModal}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />
                <Stack mb="sm" pos="relative">
                    <Grid>
                        {/* List Product */}
                        <Grid.Col span={12}>
                            <ComboboxProducts
                                modalOpen={openTransModal}
                                onChange={(value) =>
                                    form.setFieldValue("product", value)
                                }
                                key={form.key("product")}
                                form={form}
                            />
                        </Grid.Col>

                        {/* Transaction Date */}
                        <Grid.Col span={12}>
                            <DateInput
                                label="Tanggal Transaksi"
                                placeholder="Pilih tanggal transaksi"
                                valueFormat="DD/MM/YYYY"
                                withAsterisk
                                clearable
                                {...form.getInputProps("transaction_date")}
                            />
                        </Grid.Col>

                        {/* Transaction Type */}
                        <Grid.Col span={12}>
                            <Select
                                label="Tipe Transaksi"
                                placeholder="Pilih tipe transaksi"
                                data={["Masuk", "Keluar"]}
                                checkIconPosition="right"
                                withAsterisk
                                clearable
                                {...form.getInputProps("transaction_type")}
                            />
                        </Grid.Col>

                        {/* Stock Quantity */}
                        <Grid.Col span={12}>
                            <NumberInput
                                label="Jumlah Barang"
                                min={0}
                                max={99999}
                                maxLength={5}
                                allowNegative={false}
                                withAsterisk
                                {...form.getInputProps("quantity")}
                            />
                        </Grid.Col>

                        {/* Notes information */}
                        <Grid.Col span={12}>
                            <Textarea
                                label="Keterangan"
                                placeholder="Masukan keterangan transaksi"
                                {...form.getInputProps("notes")}
                            />
                        </Grid.Col>

                        {/* Submit Button Form */}
                        <Button
                            color="rgba(50, 50, 50, 1)"
                            type="submit"
                            fullWidth
                            mt="md"
                        >
                            Tambah Transaksi
                        </Button>
                    </Grid>
                </Stack>
            </form>
        </Modal>
    );
};

const TransactionLists = () => {
    return <div>List</div>;
};

export default NewTransaction;
