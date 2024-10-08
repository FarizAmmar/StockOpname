import {
    MaterialReactTable,
    MRT_ShowHideColumnsButton,
    MRT_ToggleFullScreenButton,
    useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button, IconButton } from "@mui/material";
import { PrinterIcon } from "lucide-react";
import { Box } from "@mui/system";

const TransactionLists = ({ transaction }) => {
    // Transaction data
    const [data, setData] = useState([]);

    useEffect(() => {
        if (transaction && transaction.data) {
            setData(transaction.data);
        }
    }, [transaction]);

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
        data,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
                <Button
                    color="secondary"
                    onClick={() => {
                        alert("Create New Account");
                    }}
                    variant="contained"
                >
                    Create Account
                </Button>
                <Button
                    color="error"
                    disabled={!table.getIsSomeRowsSelected()}
                    onClick={() => {
                        alert("Delete Selected Accounts");
                    }}
                    variant="contained"
                >
                    Delete Selected Accounts
                </Button>
            </Box>
        ),
        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* add your own custom print button or something */}
                <IconButton onClick={() => showPrintPreview(true)}>
                    <PrinterIcon />
                </IconButton>
                {/* built-in buttons (must pass in table prop for them to work!) */}
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
};

export default TransactionLists;
