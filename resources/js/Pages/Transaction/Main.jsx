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
                <Paper p="lg">
                    <Grid>
                        <Grid.Col span={4}>
                            <TextInput
                                type="search"
                                placeholder="Search"
                                value={inputValue}
                                leftSection={<Search size={16} />}
                                rightSection={
                                    inputValue && (
                                        <X
                                            size={16}
                                            className="cursor-pointer"
                                            onClick={() => setInputValue("")}
                                        />
                                    )
                                }
                                onChange={(event) =>
                                    setInputValue(event.currentTarget.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={8} className="flex justify-end">
                            <Button
                                color="rgba(50, 50, 50, 1)"
                                leftSection={<Plus size={16} />}
                                onClick={() => openNew()}
                            >
                                Buat
                            </Button>
                        </Grid.Col>
                    </Grid>

                    <TransactionLists transaction={transactions} />
                </Paper>
            </div>

            <NewTransaction
                openTransModal={newModal}
                closeTransModal={closeNew}
            />
        </Authenticated>
    );
};

export default Transaction;
