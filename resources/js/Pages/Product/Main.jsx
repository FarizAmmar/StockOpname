import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    ActionIcon,
    Button,
    Modal,
    SegmentedControl,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FileDown, ListFilter, Plus } from "lucide-react";

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
                    <SegmentedControl data={segment_filter}></SegmentedControl>
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
    return (
        <>
            <Modal
                title="Create new product"
                opened={openNewModal}
                onClose={closeNewModal}
                centered
            ></Modal>
        </>
    );
}
