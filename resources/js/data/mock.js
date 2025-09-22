import { faker } from '@faker-js/faker';

// KPI Data
export const kpiData = [
    {
        id: 1,
        title: 'Revenue',
        value: '$75K',
        trend: '+$34',
        trendType: 'positive',
        icon: 'RiMoneyDollarCircleLine'
    },
    {
        id: 2,
        title: 'Total Customers',
        value: '8.4K',
        trend: '+1.6K',
        trendType: 'positive',
        icon: 'RiUser3Line'
    },
    {
        id: 3,
        title: 'Store Visitors',
        value: '59K',
        trend: '+2.4K',
        trendType: 'positive',
        icon: 'RiShoppingCartLine'
    },
    {
        id: 4,
        title: 'Bounce Rate',
        value: '34.46%',
        trend: '-12.2%',
        trendType: 'negative',
        icon: 'RiBarChart2Line'
    }
];

// Performance Chart Data
export const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Page Views',
            data: [1200, 1900, 3000, 5000, 2000, 3000],
            backgroundColor: '#60a5fa',
            borderColor: '#60a5fa',
            borderWidth: 0,
            borderRadius: 4,
        },
        {
            label: 'Sales',
            data: [800, 1200, 1800, 2200, 1500, 2000],
            backgroundColor: '#22d3ee',
            borderColor: '#22d3ee',
            borderWidth: 0,
            borderRadius: 4,
        },
        {
            label: 'Conversion',
            data: [400, 600, 800, 1000, 700, 900],
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b',
            borderWidth: 0,
            borderRadius: 4,
        }
    ]
};

export const performanceStats = [
    { label: 'Page Views', value: '974' },
    { label: 'Total Sales', value: '1,218' },
    { label: 'Conversion Rate', value: '42.8%' }
];

// Doughnut Chart Data
export const doughnutData = {
    labels: ['Clothing', 'Electronics', 'Furniture'],
    datasets: [
        {
            data: [45, 30, 25],
            backgroundColor: ['#22d3ee', '#7c3aed', '#60a5fa'],
            borderWidth: 0,
        }
    ]
};

export const doughnutTotal = '8,452';
export const doughnutLabel = 'Total Sessions';

// Weekly Visits Data
export const weeklyVisitsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Visits',
            data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            borderColor: '#22d3ee',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
        }
    ]
};

// New Customers Data
export const newCustomersData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'JS'
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'MJ'
    },
    {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'SW'
    },
    {
        id: 5,
        name: 'David Brown',
        email: 'david@example.com',
        avatar: 'DB'
    }
];

// Top Products Data
export const topProductsData = [
    {
        id: 1,
        name: 'Wireless Headphones',
        sales: '245 Sales',
        price: '$24K.00',
        icon: 'RiHeadphoneLine'
    },
    {
        id: 2,
        name: 'Smart Watch',
        sales: '189 Sales',
        price: '$18K.00',
        icon: 'RiTimeLine'
    },
    {
        id: 3,
        name: 'Gaming Mouse',
        sales: '156 Sales',
        price: '$12K.00',
        icon: 'RiMouseLine'
    },
    {
        id: 4,
        name: 'Bluetooth Speaker',
        sales: '134 Sales',
        price: '$8K.00',
        icon: 'RiSpeakerLine'
    },
    {
        id: 5,
        name: 'USB Cable',
        sales: '98 Sales',
        price: '$5K.00',
        icon: 'RiPlugLine'
    }
];

// Social Leads Data
export const socialLeadsData = [
    {
        id: 1,
        name: 'Facebook',
        percentage: '+12.5%',
        value: '2,250',
        icon: 'RiFacebookCircleFill',
        color: '#1877f2'
    },
    {
        id: 2,
        name: 'Google',
        percentage: '+8.2%',
        value: '1,890',
        icon: 'RiGoogleFill',
        color: '#ea4335'
    },
    {
        id: 3,
        name: 'Twitter',
        percentage: '+15.3%',
        value: '1,456',
        icon: 'RiTwitterFill',
        color: '#1da1f2'
    },
    {
        id: 4,
        name: 'LinkedIn',
        percentage: '+6.7%',
        value: '1,234',
        icon: 'RiLinkedinBoxFill',
        color: '#0077b5'
    },
    {
        id: 5,
        name: 'Behance',
        percentage: '+4.1%',
        value: '987',
        icon: 'RiBehanceFill',
        color: '#1769ff'
    },
    {
        id: 6,
        name: 'Dribbble',
        percentage: '+9.8%',
        value: '756',
        icon: 'RiDribbbleFill',
        color: '#ea4c89'
    }
];

// Orders Data
export const ordersData = [
    {
        id: '#ORD-001',
        product: 'Wireless Headphones',
        customer: 'John Doe',
        date: '2024-01-15',
        price: '$299.00',
        status: 'completed',
        productIcon: 'RiHeadphoneLine'
    },
    {
        id: '#ORD-002',
        product: 'Smart Watch',
        customer: 'Jane Smith',
        date: '2024-01-14',
        price: '$399.00',
        status: 'dispatched',
        productIcon: 'RiTimeLine'
    },
    {
        id: '#ORD-003',
        product: 'Gaming Mouse',
        customer: 'Mike Johnson',
        date: '2024-01-13',
        price: '$89.00',
        status: 'pending',
        productIcon: 'RiMouseLine'
    },
    {
        id: '#ORD-004',
        product: 'Bluetooth Speaker',
        customer: 'Sarah Wilson',
        date: '2024-01-12',
        price: '$149.00',
        status: 'completed',
        productIcon: 'RiSpeakerLine'
    },
    {
        id: '#ORD-005',
        product: 'USB Cable',
        customer: 'David Brown',
        date: '2024-01-11',
        price: '$19.00',
        status: 'dispatched',
        productIcon: 'RiPlugLine'
    },
    {
        id: '#ORD-006',
        product: 'Wireless Charger',
        customer: 'Emily Davis',
        date: '2024-01-10',
        price: '$59.00',
        status: 'pending',
        productIcon: 'RiBatteryChargeLine'
    },
    {
        id: '#ORD-007',
        product: 'Laptop Stand',
        customer: 'Chris Miller',
        date: '2024-01-09',
        price: '$79.00',
        status: 'completed',
        productIcon: 'RiComputerLine'
    },
    {
        id: '#ORD-008',
        product: 'Phone Case',
        customer: 'Lisa Garcia',
        date: '2024-01-08',
        price: '$29.00',
        status: 'dispatched',
        productIcon: 'RiSmartphoneLine'
    }
];

// Sidebar Navigation Data
export const sidebarNavData = [
    {
        section: 'main',
        items: [
            { name: 'Dashboard', icon: 'RiDashboardLine', active: false },
            { name: 'Default', icon: 'RiLayoutLine', active: false },
            { name: 'eCommerce', icon: 'RiShoppingBag3Line', active: true },
            { name: 'Sales', icon: 'RiLineChartLine', active: false },
            { name: 'Analytics', icon: 'RiBarChart2Line', active: false },
            { name: 'Alternate', icon: 'RiLayout2Line', active: false },
            { name: 'Digital Marketing', icon: 'RiMegaphoneLine', active: false },
            { name: 'Human Resources', icon: 'RiTeamLine', active: false }
        ]
    },
    {
        section: 'ui',
        title: 'UI Elements',
        items: [
            { name: 'Widgets', icon: 'RiWidgetLine', active: false },
            { name: 'eCommerce', icon: 'RiShoppingCartLine', active: false },
            { name: 'Components', icon: 'RiComponentLine', active: false },
            { name: 'Content', icon: 'RiFileTextLine', active: false },
            { name: 'Icons', icon: 'RiEmojiLine', active: false }
        ]
    },
    {
        section: 'forms',
        title: 'Forms & Tables',
        items: [
            { name: 'Forms', icon: 'RiFileList3Line', active: false },
            { name: 'Tables', icon: 'RiTableLine', active: false }
        ]
    },
    {
        section: 'pages',
        title: 'Pages',
        items: [
            { name: 'Authentication', icon: 'RiShieldUserLine', active: false },
            { name: 'Profile', icon: 'RiUserLine', active: false },
            { name: 'Settings', icon: 'RiSettings3Line', active: false }
        ]
    }
];
