import { Plus, Search } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button, Grid, Paper, TextInput } from "@mantine/core";
import NewTransaction from "./Partials/NewTransaction";
import TransactionLists from "./Partials/TransactionList";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

const Transaction = () => {
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);
    const { transactions, search: initialSearch } = usePage().props;
    const [search, setSearch] = useState(initialSearch || "");

    const handleSearch = () => {
        router.get(
            route("transaction.index"),
            { search },
            { preserveState: true }
        );
    };

    return (
        <Authenticated title="Transaction">
            <div className="grid grid-cols-1 gap-1">
                <Paper p="lg">
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                type="search"
                                value={search}
                                placeholder="Search"
                                leftSection={<Search size={16} />}
                                onChange={(event) =>
                                    setSearch(event.currentTarget.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
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
