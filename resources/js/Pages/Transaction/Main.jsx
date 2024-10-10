import { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button, Grid, Paper, TextInput } from "@mantine/core";

import NewTransaction from "./Partials/NewTransaction";
import TransactionLists from "./Partials/TransactionList";

const Transaction = () => {
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);
    const { transactions, search: initialSearch } = usePage().props;

    // Separate local state for the input
    const [inputValue, setInputValue] = useState(initialSearch || "");
    const [search, setSearch] = useState(initialSearch || "");

    useEffect(() => {
        if (initialSearch) {
            setInputValue(initialSearch);
            setSearch(initialSearch);
        }
    }, [initialSearch]);

    const handleSearch = () => {
        setSearch(inputValue);
        router.get(route("transaction.index"), {
            search: inputValue,
        });
    };

    return (
        <Authenticated title="Transaction">
            <div className="grid grid-cols-1 gap-1">
                <TransactionLists
                    transaction={transactions}
                    openNew={openNew}
                />
            </div>

            <NewTransaction
                openTransModal={newModal}
                closeTransModal={closeNew}
            />
        </Authenticated>
    );
};

export default Transaction;
