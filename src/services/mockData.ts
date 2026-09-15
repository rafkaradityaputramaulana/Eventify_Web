import type { User, EventItem, Order, DashboardStats, SystemConfig } from '../types';

export const INITIAL_MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Budi Admin High',
    email: 'admin@eventify.id',
    phone: '081299887766',
    role: 'admin',
    created_at: '2025-01-10T08:00:00Z',
    status: 'active',
  },
  {
    id: 'usr-002',
    name: 'Siti Rahma Organiser',
    email: 'siti@soundwave.co.id',
    phone: '081344556677',
    role: 'organizer',
    created_at: '2025-02-01T10:30:00Z',
    status: 'active',
  },
  {
    id: 'usr-003',
    name: 'Rian Tech Organizer',
    email: 'rian@devfest.org',
    phone: '085611223344',
    role: 'organizer',
    created_at: '2025-02-15T14:20:00Z',
    status: 'active',
  },
  {
    id: 'usr-004',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@gmail.com',
    phone: '087812345678',
    role: 'customer',
    created_at: '2025-03-01T09:15:00Z',
    status: 'active',
  },
  {
    id: 'usr-005',
    name: 'Dina Permata',
    email: 'dina.permata@yahoo.com',
    phone: '081288990011',
    role: 'customer',
    created_at: '2025-03-05T11:45:00Z',
    status: 'active',
  },
  {
    id: 'usr-006',
    name: 'Kevin Wijaya',
    email: 'kevin.wijaya@outlook.com',
    phone: '081977665544',
    role: 'customer',
    created_at: '2025-03-10T16:00:00Z',
    status: 'active',
  },
  {
    id: 'usr-007',
    name: 'Mega Pratiwi',
    email: 'mega.pratiwi@gmail.com',
    phone: '085733445566',
    role: 'customer',
    created_at: '2025-03-12T13:20:00Z',
    status: 'active',
  }
];

export const INITIAL_MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    title: 'Nusantara Soundwave Music Fest 2026',
    description: 'Festival musik terbesar menghadirkan 20+ musisi papan atas Indonesia dengan panggung Neobrutalist outdoor interaktif.',
    category: 'Musik',
    organizer_id: 'usr-002',
    organizer_name: 'Soundwave Indonesia',
    poster_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-10-15T15:00:00Z',
    end_date: '2026-10-16T23:00:00Z',
    location: 'Gelora Bung Karno, Jakarta',
    is_online: false,
    status: 'published',
    total_quota: 5000,
    sold_tickets: 3840,
    ticket_tiers: [
      { id: 'tier-101', name: 'Presale 1 (Early)', price: 250000, quota: 1000, sold: 1000, description: 'Akses 2 Hari + Merchandise' },
      { id: 'tier-102', name: 'Regular Festival', price: 350000, quota: 3000, sold: 2340, description: 'Akses 2 Hari Festival Area' },
      { id: 'tier-103', name: 'VIP Frontstage', price: 750000, quota: 1000, sold: 500, description: 'VIP Baris Depan + Lounge' }
    ],
    created_at: '2025-01-15T09:00:00Z'
  },
  {
    id: 'evt-002',
    title: 'IndoTech Summit & AI Expo 2026',
    description: 'Konferensi teknologi & kecerdasan buatan terbesar di Asia Tenggara mempertemukan founder, investor, dan engineer.',
    category: 'Teknologi',
    organizer_id: 'usr-003',
    organizer_name: 'DevFest Indonesia',
    poster_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-11-05T08:30:00Z',
    end_date: '2026-11-06T17:00:00Z',
    location: 'BSD Grand Ballroom, Tangerang',
    is_online: false,
    status: 'published',
    total_quota: 2000,
    sold_tickets: 1450,
    ticket_tiers: [
      { id: 'tier-201', name: 'Standard Pass', price: 450000, quota: 1500, sold: 1200, description: 'Semua Keynote & Expo' },
      { id: 'tier-202', name: 'Executive VIP', price: 1250000, quota: 500, sold: 250, description: 'Keynote + Networking Dinner' }
    ],
    created_at: '2025-02-01T10:00:00Z'
  },
  {
    id: 'evt-003',
    title: 'Neobrutalism UI/UX Design Workshop',
    description: 'Belajar membuat antarmuka web & mobile modern dengan estetika Neobrutalism bersama desainer senior.',
    category: 'Design',
    organizer_id: 'usr-003',
    organizer_name: 'Designers Guild ID',
    poster_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-09-25T13:00:00Z',
    end_date: '2026-09-25T17:00:00Z',
    location: 'Zoom Meeting (Online)',
    is_online: true,
    status: 'published',
    total_quota: 300,
    sold_tickets: 285,
    ticket_tiers: [
      { id: 'tier-301', name: 'Single Pass', price: 150000, quota: 300, sold: 285, description: 'Live Stream + Figma Kit File' }
    ],
    created_at: '2025-02-10T11:00:00Z'
  },
  {
    id: 'evt-004',
    title: 'Indo Gaming Championship Season 4',
    description: 'Turnamen e-sports nasional Valorant, MLBB, & PUBG Mobile dengan total hadiah Rp 250 Juta.',
    category: 'E-Sports',
    organizer_id: 'usr-002',
    organizer_name: 'Esports Indo League',
    poster_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-12-01T10:00:00Z',
    end_date: '2026-12-03T22:00:00Z',
    location: 'Mall Taman Anggrek, Jakarta',
    is_online: false,
    status: 'draft',
    total_quota: 1500,
    sold_tickets: 0,
    ticket_tiers: [
      { id: 'tier-401', name: 'General Admission', price: 75000, quota: 1200, sold: 0 },
      { id: 'tier-402', name: 'Gamer Pass VIP', price: 200000, quota: 300, sold: 0 }
    ],
    created_at: '2025-03-01T08:00:00Z'
  },
  {
    id: 'evt-005',
    title: 'Jakarta Street Food & Coffee Fest',
    description: 'Ratusan tenant kuliner kekinian dan kompetisi barista kopi terbaik nusantara.',
    category: 'Culinary',
    organizer_id: 'usr-002',
    organizer_name: 'Kulinari Kita',
    poster_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-08-01T10:00:00Z',
    end_date: '2026-08-03T21:00:00Z',
    location: 'Parkir Timur Senayan, Jakarta',
    is_online: false,
    status: 'ended',
    total_quota: 8000,
    sold_tickets: 7920,
    ticket_tiers: [
      { id: 'tier-501', name: 'Entry Ticket + Food Voucher', price: 50000, quota: 8000, sold: 7920 }
    ],
    created_at: '2025-01-05T09:00:00Z'
  }
];

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_code: 'EVT-20260914-001',
    user_id: 'usr-004',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad.fauzi@gmail.com',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    total_amount: 700000,
    payment_method: 'qris',
    status: 'paid',
    created_at: '2026-09-14T11:20:00Z',
    payment_details: {
      qris_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EVT-20260914-001-QRIS',
      expiry_time: '2026-09-14T11:35:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-102', ticket_tier_name: 'Regular Festival', quantity: 2, price_per_item: 350000, subtotal: 700000 }
    ]
  },
  {
    id: 'ord-1002',
    order_code: 'EVT-20260914-002',
    user_id: 'usr-005',
    user_name: 'Dina Permata',
    user_email: 'dina.permata@yahoo.com',
    event_id: 'evt-002',
    event_title: 'IndoTech Summit & AI Expo 2026',
    total_amount: 1250000,
    payment_method: 'bca_va',
    status: 'paid',
    created_at: '2026-09-14T10:05:00Z',
    payment_details: {
      va_number: '880128899001145',
      expiry_time: '2026-09-15T10:05:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-202', ticket_tier_name: 'Executive VIP', quantity: 1, price_per_item: 1250000, subtotal: 1250000 }
    ]
  },
  {
    id: 'ord-1003',
    order_code: 'EVT-20260914-003',
    user_id: 'usr-006',
    user_name: 'Kevin Wijaya',
    user_email: 'kevin.wijaya@outlook.com',
    event_id: 'evt-003',
    event_title: 'Neobrutalism UI/UX Design Workshop',
    total_amount: 150000,
    payment_method: 'gopay',
    status: 'paid',
    created_at: '2026-09-14T09:40:00Z',
    payment_details: {
      qris_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EVT-20260914-003-GOPAY',
      expiry_time: '2026-09-14T10:10:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-301', ticket_tier_name: 'Single Pass', quantity: 1, price_per_item: 150000, subtotal: 150000 }
    ]
  },
  {
    id: 'ord-1004',
    order_code: 'EVT-20260914-004',
    user_id: 'usr-007',
    user_name: 'Mega Pratiwi',
    user_email: 'mega.pratiwi@gmail.com',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    total_amount: 750000,
    payment_method: 'mandiri_va',
    status: 'pending',
    created_at: '2026-09-14T12:15:00Z',
    payment_details: {
      va_number: '890085733445566',
      expiry_time: '2026-09-15T12:15:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-103', ticket_tier_name: 'VIP Frontstage', quantity: 1, price_per_item: 750000, subtotal: 750000 }
    ]
  },
  {
    id: 'ord-1005',
    order_code: 'EVT-20260913-089',
    user_id: 'usr-004',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad.fauzi@gmail.com',
    event_id: 'evt-002',
    event_title: 'IndoTech Summit & AI Expo 2026',
    total_amount: 450000,
    payment_method: 'qris',
    status: 'cancelled',
    created_at: '2026-09-13T18:00:00Z',
    payment_details: {
      qris_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EVT-EXPIRED',
      expiry_time: '2026-09-13T18:15:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-201', ticket_tier_name: 'Standard Pass', quantity: 1, price_per_item: 450000, subtotal: 450000 }
    ]
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  maintenance_mode: false,
  maintenance_message: 'Sistem Eventify Mobile sedang dalam pemeliharaan berkala untuk peningkatan performa server. Harap kembali beberapa saat lagi.'
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  active_events: 3,
  tickets_sold: 13495,
  gate_scans: 9820,
  total_revenue: 1845000000,
  daily_transactions: [
    { date: 'Senin', revenue: 145000000, orders: 320 },
    { date: 'Selasa', revenue: 210000000, orders: 480 },
    { date: 'Rabu', revenue: 190000000, orders: 410 },
    { date: 'Kamis', revenue: 280000000, orders: 620 },
    { date: 'Jumat', revenue: 350000000, orders: 750 },
    { date: 'Sabtu', revenue: 420000000, orders: 940 },
    { date: 'Minggu', revenue: 250000000, orders: 580 },
  ],
  recent_orders: INITIAL_MOCK_ORDERS,
  recent_events: INITIAL_MOCK_EVENTS.slice(0, 5)
};
