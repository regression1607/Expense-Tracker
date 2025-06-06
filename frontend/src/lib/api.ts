import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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

export default api;
