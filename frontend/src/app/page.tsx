'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseFiltersComponent } from '@/components/expenses/ExpenseFilters';
import { ExpenseAnalytics } from '@/components/expenses/ExpenseAnalytics';
import { EditExpenseDialog } from '@/components/expenses/EditExpenseDialog';
import { expenseAPI, type Expense, type ExpenseFilters } from '@/lib/api';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await expenseAPI.getExpenses(filters);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleExpenseAdded = () => {
    fetchExpenses();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchExpenses();
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await expenseAPI.deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleFiltersChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          💰 Expense Tracker
        </h1>
        <p className="text-gray-600">
          Track your daily expenses and analyze your spending patterns
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ExpenseForm onSubmit={handleExpenseAdded} />
            </div>
            <div className="lg:col-span-2">
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ExpenseFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
            <div className="lg:col-span-3">
              <ExpenseList
                expenses={expenses}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <ExpenseAnalytics />
        </TabsContent>
      </Tabs>

      <EditExpenseDialog
        expense={editingExpense}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
