export const locationData = {
    heading: "Location",
    addressHtml: "Aurora Resort & Spa<br/>Sharm El Sheikh<br/>South Sinai, Egypt",
    phone: "+20 69 360 0000",
    email: "info@auroraresort.com",
    center: [27.9158, 34.3300], // Sharm El Sheikh, Egypt
    zoom: 10,
    theme: {
        pinColor: "#d1bb4f",
        ringColor: "#d1bb4f",
        ringFill: "rgba(209, 187, 79, 0.12)",
        mapFilter: "sepia(0.45) hue-rotate(20deg)"
    },
    pins: [
        {
            id: "resort-main",
            lat: 27.9158,
            lng: 34.3300,
            title: "Aurora Resort & Spa",
            subtitle: "Main Resort Location",
            radiusMeters: 500
        },
        {
            id: "airport",
            lat: 27.9772,
            lng: 34.3947,
            title: "Sharm El Sheikh International Airport",
            subtitle: "12 km from resort"
        },
        {
            id: "naama-bay",
            lat: 27.9167,
            lng: 34.3333,
            title: "Na'ama Bay",
            subtitle: "20 km from resort"
        },
        {
            id: "cairo",
            lat: 30.0444,
            lng: 31.2357,
            title: "Cairo",
            subtitle: "500 km from resort"
        }
    ],
    nearest: [
        { label: "Sharm El Sheikh International Airport", km: 12 },
        { label: "Na'ama Bay", km: 20 },
        { label: "Cairo", km: 500 }
    ]
};
