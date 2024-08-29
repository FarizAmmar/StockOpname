import { Head } from "@inertiajs/react";

const Guest = ({ title, className, children }) => {
    return (
        <>
            {/* Title */}
            <Head title={title} />

            {/* Main layout */}
            <main className={className}>{children}</main>
        </>
    );
};

export default Guest;
