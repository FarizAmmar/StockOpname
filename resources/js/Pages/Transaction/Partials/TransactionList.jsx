import { router } from "@inertiajs/react";
import { Flex, Pagination, Select, Table } from "@mantine/core";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const TransactionLists = ({ transaction }) => {
    // Transaction data
    const [data, setData] = useState([]);

    // Table helper
    const columnHelper = createColumnHelper();

    // Per page
    const [perPageOptions] = useState(["10", "20", "30", "50"]);

    // Fetch data from the inertia share page
    useEffect(() => {
        setData(transaction.data);
    }, [transaction]);

    // Initialize columns
    const columns = [
        columnHelper.accessor("id", {
            header: "No",
            size: 20,
            cell: (info) => (
                <div className="text-center">{info.row.index + 1}</div>
            ),
        }),
        columnHelper.accessor(
            (row) => (
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td>Kode Barang</td>
                            <td>:</td>
                            <td className="text-red-500">{row.product.code}</td>
                        </tr>
                        <tr>
                            <td>Nama Barang</td>
                            <td>:</td>
                            <td>{row.product.name}</td>
                        </tr>
                    </tbody>
                </table>
            ),
            {
                id: "ProductInfo",
                header: "Product",
                cell: (info) => info.getValue(),
            }
        ),
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
            <Table.ScrollContainer mt={20} mb={20}>
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                    // w={table.getTotalSize()}
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
                                        className={`whitespace-nowrap ${
                                            header.column.id === "ProductInfo"
                                                ? "sticky left-0 bg-white z-10"
                                                : ""
                                        }`}
                                        w={header.getSize()}
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
                                    <Table.Td
                                        key={cell.id}
                                        className={`whitespace-nowrap ${
                                            cell.column.id === "ProductInfo"
                                                ? "sticky left-0 bg-white z-10"
                                                : ""
                                        }`}
                                        w={cell.column.getSize()}
                                    >
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
            </Table.ScrollContainer>

            <Flex gap={20} align="center" justify="space-between">
                {/* Per Page */}
                <Select
                    w={70}
                    value={transaction.per_page.toString()}
                    data={perPageOptions}
                    onChange={(value) => {
                        router.get(
                            route("transaction.index", {
                                per_page: value,
                            })
                        );
                    }}
                />

                {/* Pagination */}
                <TransactionPagination
                    total={transaction.last_page}
                    current_page={transaction.current_page}
                />
            </Flex>
        </>
    );
};

const TransactionPagination = ({ total, current_page }) => {
    const handleChange = (value) => {
        router.get(
            route("transaction.index", { page: value }, { preserveState: true })
        );
    };
    return (
        <>
            {/* Pagination Controls */}
            <div className="align-middle">
                <Pagination
                    position="center"
                    total={total}
                    value={current_page}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};
export default TransactionLists;
