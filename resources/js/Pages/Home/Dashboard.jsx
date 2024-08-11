import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Paper } from "@mantine/core";

export default function Dashboard() {
    return (
        <Authenticated title={"Dashboard"}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Paper shadow="xs" p="md">
                    testing
                </Paper>
                <Paper shadow="xs" p="md">
                    testing
                </Paper>
            </div>
        </Authenticated>
    );
}
