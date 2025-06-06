'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getMonthName, getCategoryColor } from '@/lib/utils';
import { expenseAPI, type AnalyticsData } from '@/lib/api';

export function ExpenseAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await expenseAPI.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the chart
  const chartData = analytics.monthlyData.map((monthData) => {
    const monthLabel = `${getMonthName(monthData._id.month)} ${monthData._id.year}`;
    const dataPoint: any = { month: monthLabel };
    
    monthData.categories.forEach((category) => {
      dataPoint[category.category] = category.amount;
    });
    
    return dataPoint;
  });

  // Get all unique categories for the chart
  const allCategories = Array.from(
    new Set(
      analytics.monthlyData.flatMap((month) =>
        month.categories.map((cat) => cat.category)
      )
    )
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.summary.totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.summary.totalTransactions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.summary.avgExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryBreakdown.map((category) => (
              <div key={category._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge style={{ backgroundColor: getCategoryColor(category._id) }}>
                    {category._id}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {category.count} transactions
                  </span>
                </div>
                <div className="font-medium">
                  {formatCurrency(category.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                {allCategories.map((category) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="expenses"
                    fill={getCategoryColor(category)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
