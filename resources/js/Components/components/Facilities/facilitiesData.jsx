// Icon helper function
const ico = (d) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {d}
    </svg>
);

// Facilities data
export const facilitiesData = [
    { key: "wifi", label: "WI-FI", icon: ico(<path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0M12 19h0" />) },
    { key: "pool", label: "POOL", icon: ico(<path d="M2 12h20M4 8h16M6 4h12M8 16h8" />) },
    { key: "spa", label: "SPA", icon: ico(<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />) },
    { key: "gym", label: "GYM", icon: ico(<path d="M6.5 6.5h11v11h-11zM9 9h6v6H9z" />) },
    { key: "restaurant", label: "RESTAURANT", icon: ico(<path d="M3 2h18l-1 18H4L3 2zM8 8h8M8 12h8M8 16h5" />) },
    { key: "bar", label: "BAR", icon: ico(<path d="M3 2h18v4H3V2zM5 6h14v14H5V6zM7 8h10v2H7V8z" />) },
    { key: "parking", label: "PARKING", icon: ico(<path d="M3 3h18v18H3V3zM6 6h12v12H6V6zM8 8h8v8H8V8z" />) },
    { key: "concierge", label: "CONCIERGE", icon: ico(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />) },
    { key: "room-service", label: "ROOM SERVICE", icon: ico(<path d="M3 2h18l-1 18H4L3 2zM8 8h8M8 12h8" />) },
    { key: "laundry", label: "LAUNDRY", icon: ico(<path d="M3 3h18v18H3V3zM6 6h12v12H6V6z" />) },
    { key: "business", label: "BUSINESS CENTER", icon: ico(<path d="M3 3h18v18H3V3zM6 6h12v12H6V6zM8 8h8v2H8V8z" />) },
    { key: "kids", label: "KIDS CLUB", icon: ico(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />) },
    { key: "beach", label: "BEACH ACCESS", icon: ico(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />) },
    { key: "tennis", label: "TENNIS COURT", icon: ico(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />) },
    { key: "golf", label: "GOLF COURSE", icon: ico(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />) },
    { key: "shuttle", label: "AIRPORT SHUTTLE", icon: ico(<path d="M3 2h18l-1 18H4L3 2zM6 6h12v12H6V6z" />) },
    { key: "valet", label: "VALET PARKING", icon: ico(<path d="M3 3h18v18H3V3zM6 6h12v12H6V6z" />) },
    { key: "pet", label: "PET FRIENDLY", icon: ico(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />) }
];
