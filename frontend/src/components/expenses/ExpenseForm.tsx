'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { expenseSchema, type ExpenseFormData, CATEGORIES, PAYMENT_MODES } from '@/lib/schemas';
import { expenseAPI, type Expense } from '@/lib/api';

interface ExpenseFormProps {
  onSubmit: () => void;
  expense?: Expense;
  isEditing?: boolean;
}

export function ExpenseForm({ onSubmit, expense, isEditing = false }: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditing && expense) {
      setValue('amount', expense.amount);
      setValue('category', expense.category);
      setValue('notes', expense.notes || '');
      setValue('date', expense.date.split('T')[0]);
      setValue('paymentMode', expense.paymentMode);
    }
  }, [isEditing, expense, setValue]);

  const onFormSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && expense) {
        await expenseAPI.updateExpense(expense._id, {
          ...data,
          amount: Number(data.amount),
          notes: data.notes || '',
        });
      } else {
        await expenseAPI.createExpense({
          ...data,
          amount: Number(data.amount),
          notes: data.notes || '',
        });
      }
      reset();
      onSubmit();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} expense:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue('category', value as any)} value={watch('category')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add a description"
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select onValueChange={(value) => setValue('paymentMode', value as any)} value={watch('paymentMode')}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMode && (
              <p className="text-sm text-red-500 mt-1">{errors.paymentMode.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Expense' : 'Add Expense')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
