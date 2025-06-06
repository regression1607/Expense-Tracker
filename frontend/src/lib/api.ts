import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth token
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // If unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export interface Expense {
  _id: string;
  amount: number;
  category: 'Rental' | 'Groceries' | 'Entertainment' | 'Travel' | 'Others';
  notes: string;
  date: string;
  paymentMode: 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash';
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  dateFilter?: 'thisMonth' | 'last30Days' | 'last90Days' | 'allTime';
  categories?: string[];
  paymentModes?: string[];
  page?: number;
  limit?: number;
}

export interface ExpenseResponse {
  success: boolean;
  data: Expense[];
  pagination?: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface AnalyticsData {
  monthlyData: Array<{
    _id: { year: number; month: number };
    categories: Array<{
      category: string;
      amount: number;
      count: number;
    }>;
    totalAmount: number;
  }>;
  summary: {
    totalExpenses: number;
    totalTransactions: number;
    avgExpense: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
}

// Authentication interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const expenseAPI = {
  // Create expense
  createExpense: async (expense: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    const response = await api.post('/expenses', expense);
    return response.data.data;
  },

  // Get expenses with filters
  getExpenses: async (filters: ExpenseFilters = {}): Promise<ExpenseResponse> => {
    const params = new URLSearchParams();
    
    if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
    if (filters.categories?.length) {
      filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters.paymentModes?.length) {
      filters.paymentModes.forEach(mode => params.append('paymentModes', mode));
    }
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  // Get expense by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data.data;
  },

  // Update expense
  updateExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data.data;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  // Get analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get('/expenses/analytics');
    return response.data.data;
  },
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ success: boolean; data: { token: string } }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export default api;
