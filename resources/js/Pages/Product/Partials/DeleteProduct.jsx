import { router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Button, Flex, Modal, Text } from "@mantine/core";

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
            title="Konfirmasi"
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

export default DeleteProduct;
