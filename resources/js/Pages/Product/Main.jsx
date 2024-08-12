import Authenticated from "@/Layouts/AuthenticatedLayout";
import { ActionIcon, Button, SegmentedControl, Tooltip } from "@mantine/core";
import { FileDown, ListFilter, Plus } from "lucide-react";

export default function Product() {
    const segment_filter = ["All", "Active", "Draft"];
    return (
        <Authenticated title="Product">
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
                        color="rgba(69, 69, 69, 1)"
                        leftSection={<Plus size={16} />}
                    >
                        Add Product
                    </Button>
                </section>
            </div>
        </Authenticated>
    );
}
