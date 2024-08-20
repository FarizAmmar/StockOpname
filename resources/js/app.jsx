import "./bootstrap";
import "../css/app.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const theme = {
    fontFamily: "Poppins, sans-serif",
    primaryColor: "blue",
    colorScheme: "light", // Use "light" or "dark"
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider theme={theme}>
                <Notifications />
                <App {...props} />
            </MantineProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
