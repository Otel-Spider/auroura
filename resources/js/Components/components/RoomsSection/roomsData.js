// Sample rooms data
export const roomsData = [
    {
        id: 'standard-garden',
        title: 'Standard Double Room with Garden View',
        image: '/storage/Rooms/Standard Double Room with Garden View.jpg',
        area: '40 m²',
        occupancy: '3 People max',
        bed: '1 Twin Bed',
        view: 'Garden View',
        ctaUrl: '#'
    },
    {
        id: 'standard-pool',
        title: 'Standard Double Room with Pool View',
        image: '/storage/Rooms/Standard Double Room with Pool View.jpg',
        area: '40 m²',
        occupancy: '3 People max',
        bed: '1 Twin Bed',
        view: 'Pool View',
        ctaUrl: '#'
    },
    {
        id: 'standard-sea',
        title: 'Standard Double Room with Side Sea View',
        image: '/storage/Rooms/Standard Double Room with Side Sea View.jpg',
        area: '40 m²',
        occupancy: '3 People max',
        bed: '1 Twin Bed',
        view: 'Sea View',
        ctaUrl: '#'
    },
    {
        id: 'deluxe-pool',
        title: 'Deluxe Double Room with Pool View',
        image: '/storage/Rooms/Deluxe Double Room with Pool View.jpg',
        area: '40 m²',
        occupancy: '3 People max',
        bed: '1 Twin Bed',
        view: 'Pool View',
        ctaUrl: '#'
    },
    {
        id: 'triple-garden',
        title: 'Triple Room with Garden View',
        image: '/storage/Rooms/Triple Room with Garden View.jpg',
        area: '40 m²',
        occupancy: '3 People max',
        bed: '1 Twin Bed & 1 Sofa bed',
        view: 'Garden View',
        ctaUrl: '#'
    },
    {
        id: 'triple-pool',
        title: 'Triple Room with Pool View',
        image: '/storage/Rooms/Triple Room with Pool View.jpg',
        area: '40 m²',
        occupancy: '3 People max',
        bed: '1 Twin Bed & 1 Sofa bed',
        view: 'Pool View',
        ctaUrl: '#'
    }
];

// Only rooms with available photos are included
export const roomsCategories = [
    { key: 'rooms', label: 'Rooms', items: roomsData }
];
