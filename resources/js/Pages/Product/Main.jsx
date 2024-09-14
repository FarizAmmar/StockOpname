import { useState } from "react";

import { Plus, Search, X } from "lucide-react";

import { usePage } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Button,
    Flex,
    Grid,
    Pagination,
    Paper,
    Text,
    TextInput,
} from "@mantine/core";

import NewProduct from "./Partials/NewProduct";
import ProductCard from "./Components/ProductCard";

// Default product view
const Product = () => {
    const [newModal, { open: openNew, close: closeNew }] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState("");
    return (
        <Authenticated title="Product">
            {/* Top header */}
            <div className="grid grid-cols-2 gap-1">
                {/* Left Section */}
                <section>
                    <TextInput
                        type="search"
                        placeholder="Search"
                        value={searchValue}
                        onChange={(event) =>
                            setSearchValue(event.currentTarget.value)
                        }
                        leftSection={<Search size={16} />}
                        rightSection={
                            searchValue && (
                                <X
                                    size={16}
                                    className="cursor-pointer"
                                    onClick={() => setSearchValue("")}
                                />
                            )
                        }
                    />
                </section>
                {/* Right Section */}
                <section className="flex items-center justify-end space-x-1">
                    {/* Filter Button */}
                    {/* <Tooltip label="Filter" position="bottom">
                        <ActionIcon size="input-sm" variant="default">
                            <ListFilter size={16} />
                        </ActionIcon>
                    </Tooltip> */}

                    {/* Add button */}
                    <Button
                        color="rgba(50, 50, 50, 1)"
                        leftSection={<Plus size={16} />}
                        onClick={() => openNew()}
                    >
                        Tambah
                    </Button>
                </section>
            </div>

            {/* Main content */}
            <div className="mt-5">
                <MainContent searchValue={searchValue} />
            </div>

            {/* New Product Modal */}
            <NewProduct openNewModal={newModal} closeNewModal={closeNew} />
        </Authenticated>
    );
};

// Main Content
const MainContent = ({ searchValue }) => {
    const { products } = usePage().props;
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;

    // Filter products based on searchValue
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Menghitung item untuk pagination
    const startIndex = (activePage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <>
            <Grid pos="relative">
                {paginatedProducts.length === 0 ? (
                    <Grid.Col span={12}>
                        <Paper shadow="xs" p="md">
                            <Text align="center" size="lg" color="dimmed">
                                No Record Found
                            </Text>
                        </Paper>
                    </Grid.Col>
                ) : (
                    paginatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </Grid>

            {/* Pagination Controls */}
            <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
            >
                <Pagination
                    page={activePage}
                    onChange={setActivePage}
                    total={Math.ceil(filteredProducts.length / itemsPerPage)}
                    position="center"
                    mt="md"
                />
            </Flex>
        </>
    );
};

export default Product;
