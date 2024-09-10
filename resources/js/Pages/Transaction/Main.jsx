import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Button,
    Grid,
    Paper,
    ScrollArea,
    Table,
    TextInput,
} from "@mantine/core";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import NewTransaction from "./Partials/NewTransaction";
import { useDisclosure } from "@mantine/hooks";
import { Plus, Search } from "lucide-react";

// Default transaction view
const Transaction = () => {
    // Mantine Hooks
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);

    // Table helper
    const columnHelper = createColumnHelper();

    // Sample data table
    const data = useMemo(
        () => [
            {
                firstName: "Jane",
                surname: "Doe",
                age: 13,
                gender: "Female",
            },
            {
                firstName: "John",
                surname: "Doe",
                age: 43,
                gender: "Male",
            },
            {
                firstName: "Tom",
                surname: "Doe",
                age: 89,
                gender: "Male",
            },
        ],
        []
    );

    // Sample Columns
    const columns = useMemo(
        () => [
            columnHelper.accessor((row) => `${row.firstName} ${row.surname}`, {
                id: "fullName",
                header: "Full Name",
            }),
            columnHelper.accessor("gender", {
                header: "Gender",
            }),
        ],
        []
    );

    // Main react table
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const elements = [
        { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
        { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
        { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
        { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
        { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
    ];

    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Authenticated title="Transaction">
            <div className="grid grid-cols-1 gap-1">
                <Paper p="lg">
                    {/* Search & New Button */}
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                type="search"
                                placeholder="Search"
                                leftSection={<Search size={16} />}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} className="flex justify-end">
                            <Button
                                color="rgba(50, 50, 50, 1)"
                                leftSection={<Plus size={16} />}
                                onClick={() => openNew()}
                            >
                                Buat
                            </Button>
                        </Grid.Col>
                    </Grid>
                    <ScrollArea mt={20}>
                        <Table
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Element position</Table.Th>
                                    <Table.Th>Element name</Table.Th>
                                    <Table.Th>Symbol</Table.Th>
                                    <Table.Th>Atomic mass</Table.Th>
                                    <Table.Th>Atomic mass</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                    {/* Pagination and rows */}
                </Paper>
            </div>

            {/* New Transaction Modal */}
            <NewTransaction
                openTransModal={newModal}
                closeTransModal={closeNew}
            ></NewTransaction>
        </Authenticated>
    );
};

export default Transaction;
