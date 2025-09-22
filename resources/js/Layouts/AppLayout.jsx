import React from 'react';
import { Head } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
    return (
        <div className="app">
            <Head title={title} />
            <main>
                {children}
            </main>
        </div>
    );
}
