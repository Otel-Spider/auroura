export const locationData = {
    heading: "Location",
    addressHtml: "Paradise Resort & Spa<br/>Coconut Beach, Paradise Island<br/>Nassau, Bahamas",
    phone: "+1 (242) 555-0123",
    email: "info@paradiseresort.com",
    center: [25.0772, -77.3385], // Paradise Island, Bahamas
    zoom: 14,
    theme: {
        pinColor: "#7e6936",
        ringColor: "#7e6936",
        ringFill: "rgba(126, 105, 54, 0.12)",
        mapFilter: "sepia(0.45) hue-rotate(20deg)"
    },
    pins: [
        {
            id: "resort-main",
            lat: 25.0772,
            lng: -77.3385,
            title: "Paradise Resort & Spa",
            subtitle: "Main Resort Location",
            radiusMeters: 500
        },
        {
            id: "beach-access",
            lat: 25.0750,
            lng: -77.3400,
            title: "Private Beach Access",
            subtitle: "5 min walk from resort"
        },
        {
            id: "marina",
            lat: 25.0790,
            lng: -77.3350,
            title: "Paradise Marina",
            subtitle: "Boat tours & water sports",
            radiusMeters: 300
        },
        {
            id: "golf-course",
            lat: 25.0820,
            lng: -77.3420,
            title: "Oceanview Golf Course",
            subtitle: "18-hole championship course"
        },
        {
            id: "shopping",
            lat: 25.0740,
            lng: -77.3450,
            title: "Paradise Shopping Center",
            subtitle: "Boutiques & restaurants"
        }
    ],
    nearest: [
        { label: "Atlantis Paradise Island", km: 2.1 },
        { label: "Nassau International Airport", km: 8.5 },
        { label: "Downtown Nassau", km: 12.3 },
        { label: "Cable Beach", km: 15.7 },
        { label: "Blue Lagoon Island", km: 18.2 },
        { label: "Exuma Cays", km: 45.8 },
        { label: "Pig Beach", km: 52.1 }
    ]
};
