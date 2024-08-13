import Guest from "@/Layouts/GuestLayout";
import { router } from "@inertiajs/react";
import {
    Paper,
    Text,
    Title,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Anchor,
    Group,
    Stack,
    LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { KeyRound, Mail } from "lucide-react";

export default function Login() {
    // Mantine Hooks
    const [loading, { open: loadingOpen, close: loadingClose }] =
        useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const handleSubmit = (values) => {
        router.post(route("login.store"), values, {
            onStart: () => {
                loadingOpen();
            },
            onFinish: () => {
                loadingClose();
            },
            onError: (errors) => {
                if (errors[0] != null) {
                    notifications.show({
                        color: "red",
                        title: "Failed to login!",
                        message: errors[0],
                        position: "top-center",
                    });
                } else {
                    form.setErrors({
                        email: errors.email,
                        password: errors.password,
                    });
                }
            },
        });
    };

    return (
        <Guest
            title="Login"
            className="min-h-screen flex items-center justify-center bg-zinc-100"
        >
            <Paper
                className="w-full mx-5 sm:w-[350px] p-5"
                shadow="xs"
                pos={"relative"}
            >
                {/* Loading Overlay */}
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />

                <Title order={3}>Login</Title>
                <Text size="xs" c="dimmed" mb="lg">
                    Welcome back! Ready to dive in?
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">
                        <TextInput
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            leftSection={<Mail size={16} />}
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            label="Password"
                            type="password"
                            placeholder="Your password"
                            leftSection={<KeyRound size={16} />}
                            {...form.getInputProps("password")}
                        />

                        <Group position="apart">
                            <Checkbox
                                label="Remember me"
                                {...form.getInputProps("remember", {
                                    type: "checkbox",
                                })}
                            />
                            <Anchor href="#" size="sm" ml="auto">
                                Forgot Password?
                            </Anchor>
                        </Group>

                        <Button
                            color="rgba(50, 50, 50, 1)"
                            type="submit"
                            fullWidth
                            mt="md"
                        >
                            Login
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Guest>
    );
}
