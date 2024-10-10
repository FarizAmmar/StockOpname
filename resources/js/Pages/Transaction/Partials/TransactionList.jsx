import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Plus, Search, X } from "lucide-react";
import { Box } from "@mui/system";
import { Button, TextInput } from "@mantine/core";

const TransactionLists = ({ transaction, openNew }) => {
    // Transaction data
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (transaction && transaction.data) {
            setData(transaction.data);
            setFilteredData(transaction.data);
        }
    }, [transaction]);

    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);

        const filtered = data.filter(
            (item) =>
                item.code.toLowerCase().includes(value.toLowerCase()) ||
                item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "code",
                header: "Kode Produk",
            },
            {
                accessorKey: "name",
                header: "Nama Produk",
            },
            {
                accessorKey: "transaction_date",
                header: "Tanggal Transaksi",
                Cell: ({ cell }) =>
                    dayjs(cell.getValue()).format("DD MMM YYYY"),
            },
            {
                accessorKey: "initial_stock",
                header: "Stok Awal",
            },
            {
                accessorKey: "total_in",
                header: "Masuk",
            },
            {
                accessorKey: "total_out",
                header: "Keluar",
            },
            {
                accessorKey: "final_stock",
                header: "Stok Akhir",
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: filteredData,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
                <TextInput
                    type="search"
                    placeholder="Search"
                    value={search}
                    leftSection={<Search size={16} />}
                    rightSection={
                        search && (
                            <X
                                size={16}
                                className="cursor-pointer"
                                onClick={() => setSearch("")}
                            />
                        )
                    }
                    onChange={handleSearch}
                />
            </Box>
        ),
        renderToolbarInternalActions: ({ table }) => (
            <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
                <Button
                    color="rgba(50, 50, 50, 1)"
                    leftSection={<Plus size={16} />}
                    onClick={() => openNew()}
                >
                    Buat
                </Button>
            </Box>
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
};

export default TransactionLists;
