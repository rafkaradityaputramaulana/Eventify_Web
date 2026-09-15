import axios from 'axios';
import type { User, EventItem, Order, DashboardStats, SystemConfig, EventStatus, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://139.190.96.203:8093/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor Request: Menyisipkan token Bearer dari localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventify_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Handling Error 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized (401): Token expired atau belum login.');
      localStorage.removeItem('eventify_admin_token');
      localStorage.removeItem('eventify_admin_user');
    }
    return Promise.reject(error);
  }
);

// Helper ekstraksi response Go (PASTI MENGEMBALIKAN ARRAY [])
const extractArrayData = <T>(resData: any): T[] => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (resData.data && Array.isArray(resData.data.items)) return resData.data.items;
  if (resData.data && Array.isArray(resData.data.orders)) return resData.data.orders;
  if (resData.data && Array.isArray(resData.data.events)) return resData.data.events;
  if (resData.data && Array.isArray(resData.data.users)) return resData.data.users;
  if (Array.isArray(resData.items)) return resData.items;
  if (Array.isArray(resData.orders)) return resData.orders;
  if (Array.isArray(resData.events)) return resData.events;
  if (Array.isArray(resData.users)) return resData.users;
  return [];
};

const extractObjectData = <T>(resData: any): T => {
  if (!resData) return resData;
  return resData.data !== undefined ? resData.data : resData;
};

export const eventifyApi = {
  login: async (email: string, pass: string) => {
    const res = await apiClient.post('/auth/login', { email, password: pass });
    const payload = res.data;

    const rawUser = payload.user || payload.data?.user || payload.data;
    const token = payload.token || payload.data?.token || payload.access_token;

    if (!rawUser) {
      throw new Error('Format respon server tidak valid.');
    }

    const roleId = rawUser.role_id || rawUser.roleId;
    const roleString = String(rawUser.role || '').toLowerCase();
    
    const isAdmin = roleId === 1 || roleId === '1' || roleString === 'admin';

    if (!isAdmin) {
      throw new Error('Akses Ditolak: Khusus Administrator');
    }

    const loggedUser: User = {
      ...rawUser,
      role: 'admin'
    };

    return {
      token,
      user: loggedUser
    };
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me');
    return extractObjectData<User>(res.data);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await apiClient.get('/admin/dashboard');
      const data = extractObjectData<any>(res.data) || {};

      return {
        active_events: Number(data.active_events ?? data.activeEvents ?? data.totalEvents ?? 0),
        tickets_sold: Number(data.tickets_sold ?? data.ticketsSold ?? data.totalOrders ?? 0),
        gate_scans: Number(data.gate_scans ?? data.gateScans ?? 0),
        total_revenue: Number(data.total_revenue ?? data.totalRevenue ?? 0),
        daily_transactions: Array.isArray(data.daily_transactions ?? data.dailyTransactions)
          ? (data.daily_transactions ?? data.dailyTransactions)
          : [],
        recent_orders: Array.isArray(data.recent_orders ?? data.recentOrders)
          ? (data.recent_orders ?? data.recentOrders)
          : [],
        recent_events: Array.isArray(data.recent_events ?? data.recentEvents)
          ? (data.recent_events ?? data.recentEvents)
          : [],
      };
    } catch (err) {
      console.error('Gagal mengambil data dashboard stats:', err);
      return {
        active_events: 0,
        tickets_sold: 0,
        gate_scans: 0,
        total_revenue: 0,
        daily_transactions: [],
        recent_orders: [],
        recent_events: [],
      };
    }
  },

  getEvents: async (): Promise<EventItem[]> => {
    try {
      let res;
      try {
        res = await apiClient.get('/admin/events');
      } catch {
        res = await apiClient.get('/events');
      }
      return extractArrayData<EventItem>(res.data);
    } catch (err) {
      console.error('Gagal fetch events:', err);
      return [];
    }
  },

  updateEventStatus: async (id: string, status: EventStatus): Promise<EventItem> => {
    const res = await apiClient.put(`/admin/events/${id}/status`, { status });
    return extractObjectData<EventItem>(res.data);
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/events/${id}`);
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const res = await apiClient.get('/admin/users');
      return extractArrayData<User>(res.data);
    } catch (err) {
      console.error('Gagal fetch users:', err);
      return [];
    }
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    // Mapping string role ke integer ID yang diminta backend
    const roleMap: Record<UserRole, number> = {
      admin: 1,
      organizer: 2,
      customer: 3,
    };

    const roleId = roleMap[role] || 3;

    // Mengirim payload lengkap (role_id & role) untuk memastikan backend menerima request body dengan benar
    const res = await apiClient.put(`/admin/users/${userId}/role`, {
      role_id: roleId,
      role: role,
    });
    
    return extractObjectData<User>(res.data);
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await apiClient.get('/admin/orders');
      return extractArrayData<Order>(res.data);
    } catch (err) {
      console.error('Gagal fetch orders:', err);
      return [];
    }
  },

  getSystemConfig: async (): Promise<SystemConfig> => {
    try {
      const res = await apiClient.get('/admin/system/config');
      return extractObjectData<SystemConfig>(res.data);
    } catch {
      return {
        maintenance_mode: false,
        maintenance_message: ''
      };
    }
  },

  updateSystemConfig: async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
    try {
      const res = await apiClient.put('/admin/system/config', config);
      return extractObjectData<SystemConfig>(res.data);
    } catch {
      return config as SystemConfig;
    }
  }
};