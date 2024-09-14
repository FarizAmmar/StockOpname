import { Combobox, ScrollArea, TextInput, useCombobox } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

const ComboboxProducts = ({ modalOpen, onChange, form }) => {
    const [products, setProducts] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (modalOpen) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(
                        route("api.product.get_data")
                    );
                    setProducts(response.data.product);
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                }
            };

            fetchProducts();
        }
    }, [modalOpen]);

    const combobox = useCombobox();

    // Filter products based on the input value
    const filteredOptions = products.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase().trim())
    );

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item.id} key={item.id}>
            {item.name}
        </Combobox.Option>
    ));

    return (
        <>
            <Combobox
                onOptionSubmit={(optionValue) => {
                    const selected = products.find(
                        (product) => product.id === optionValue
                    );
                    if (selected) {
                        setInputValue(selected.name);
                        onChange(optionValue);
                    } else {
                        setInputValue("");
                        onChange("");
                    }
                    combobox.closeDropdown();
                }}
                store={combobox}
            >
                <Combobox.Target>
                    <TextInput
                        label="Product"
                        placeholder="Cari dan pilih produk"
                        value={inputValue}
                        withAsterisk
                        onChange={(event) => {
                            setInputValue(event.currentTarget.value);
                            onChange("");
                            combobox.openDropdown();
                            combobox.updateSelectedOptionIndex();
                        }}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
                        error={form.errors.product}
                    />
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>
                        <ScrollArea.Autosize type="scroll" mah={200}>
                            {options.length === 0 ? (
                                <Combobox.Empty>Nothing found</Combobox.Empty>
                            ) : (
                                options
                            )}
                        </ScrollArea.Autosize>
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
        </>
    );
};

export default ComboboxProducts;
