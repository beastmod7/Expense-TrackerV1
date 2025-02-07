import React, { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { IExpense } from '../types/expense.types';

export const ExpenseForm: React.FC = () => {
  const { addExpense, getCurrentMonth } = useExpense();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form when month changes
    setAmount('');
    setCategory('');
    setDescription('');
    setError('');
  }, [getCurrentMonth()]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    const expense: IExpense = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(),
      month: getCurrentMonth(),
    };

    addExpense(expense);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      {/* ... rest of the form */}
    </form>
  );
}; 