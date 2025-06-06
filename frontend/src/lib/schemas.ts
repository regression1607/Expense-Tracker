import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum(['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'], {
    required_error: 'Please select a category',
  }),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  date: z.string().min(1, 'Date is required'),
  paymentMode: z.enum(['UPI', 'Credit Card', 'Net Banking', 'Cash'], {
    required_error: 'Please select a payment mode',
  }),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export const CATEGORIES = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'] as const;
export const PAYMENT_MODES = ['UPI', 'Credit Card', 'Net Banking', 'Cash'] as const;
export const DATE_FILTERS = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'last90Days', label: 'Last 90 Days' },
  { value: 'allTime', label: 'All Time' },
] as const;
