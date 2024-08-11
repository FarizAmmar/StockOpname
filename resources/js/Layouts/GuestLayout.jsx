import { Head } from "@inertiajs/react";

export default function Guest({ title, className, children }) {
    return (
        <>
            {/* Title */}
            <Head title={title} />

            {/* Main layout */}
            <main className={className}>{children}</main>
        </>
    );
}
