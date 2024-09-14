import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Button,
    Grid,
    Pagination,
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
import { useEffect, useMemo, useState } from "react";
import NewTransaction from "./Partials/NewTransaction";
import { useDisclosure } from "@mantine/hooks";
import { Plus, Search } from "lucide-react";
import dayjs from "dayjs";

// Default transaction view
const Transaction = () => {
    // Mantine Hooks
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);

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

                    {/* Transaction table listing */}
                    <TransactionLists />

                    {/* Pagination and rows */}
                </Paper>
            </div>

            {/* New Transaction Modal */}
            <NewTransaction
                openTransModal={newModal}
                closeTransModal={closeNew}
            />
        </Authenticated>
    );
};

const TransactionLists = () => {
    // Table helper
    const columnHelper = createColumnHelper();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Fetch data from the API
    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                // Fetch record
                const response = await axios.get(
                    route("api.transaction.get_data")
                );

                // Set data and pagination info after fetch
                setData(response.data.data);
                setTotalPages(response.data.last_page);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransaction();
    }, [page]);

    // Initialize columns
    const columns = [
        columnHelper.accessor("id", {
            header: "No",
            cell: (info) => info.row.index + 1,
        }),
        columnHelper.accessor("product.code", {
            header: "Kode Barang",
        }),
        columnHelper.accessor("product.name", {
            header: "Nama Barang",
        }),
        columnHelper.accessor("product.initial_stock", {
            header: "Stok Awal",
        }),
        columnHelper.accessor("quantity", {
            header: "Jumlah Barang",
        }),
        columnHelper.accessor("transaction_date", {
            header: "Tanggal Transaksi",
            cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY"),
        }),
        columnHelper.accessor("type", {
            header: "Tipe Transaksi",
            cell: (info) => (info.getValue() === "in" ? "Masuk" : "Keluar"),
        }),
    ];

    // Initialize react table
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <ScrollArea mt={20}>
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Tr
                                key={headerGroup.id}
                                className="text-center"
                            >
                                {headerGroup.headers.map((header) => (
                                    <Table.Th
                                        key={header.id}
                                        className="whitespace-nowrap"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Thead>
                    <Table.Tbody>
                        {table.getRowModel().rows.map((row) => (
                            <Table.Tr key={row.original.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Table.Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>

            {/* Pagination Controls */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={totalPages}
                    position="center"
                />
            </div>
        </>
    );
};

export default Transaction;
