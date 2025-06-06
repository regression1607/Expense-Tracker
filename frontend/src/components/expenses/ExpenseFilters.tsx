'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CATEGORIES, PAYMENT_MODES, DATE_FILTERS } from '@/lib/schemas';
import type { ExpenseFilters } from '@/lib/api';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

export function ExpenseFiltersComponent({ filters, onFiltersChange }: ExpenseFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories || []);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState<string[]>(filters.paymentModes || []);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handlePaymentModeToggle = (mode: string) => {
    const newModes = selectedPaymentModes.includes(mode)
      ? selectedPaymentModes.filter(m => m !== mode)
      : [...selectedPaymentModes, mode];
    
    setSelectedPaymentModes(newModes);
    onFiltersChange({
      ...filters,
      paymentModes: newModes,
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPaymentModes([]);
    onFiltersChange({
      dateFilter: undefined,
      categories: [],
      paymentModes: [],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Date Range</Label>
          <Select
            value={filters.dateFilter || 'allTime'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                dateFilter: value === 'allTime' ? undefined : (value as any),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allTime">All Time</SelectItem>
              {DATE_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Payment Modes</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PAYMENT_MODES.map((mode) => (
              <Badge
                key={mode}
                variant={selectedPaymentModes.includes(mode) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handlePaymentModeToggle(mode)}
              >
                {mode}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
