'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExpenseForm } from './ExpenseForm';
import { type Expense } from '@/lib/api';

interface EditExpenseDialogProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditExpenseDialog({ 
  expense, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditExpenseDialogProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        {expense && (
          <ExpenseForm
            expense={expense}
            isEditing={true}
            onSubmit={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
