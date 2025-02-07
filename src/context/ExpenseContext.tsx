import { createContext, useContext, useEffect, useState } from 'react';
import { IExpense, IMonthlyExpenses } from '../types/expense.types';
import { useProfile } from './ProfileContext';

interface ExpenseContextType {
  expenses: IExpense[];
  monthlyExpenses: IMonthlyExpenses;
  addExpense: (expense: IExpense) => void;
  // ... existing context properties
  getCurrentMonth: () => string;
  switchMonth: (month: string) => void;
  getCurrentMonthExpenses: () => IExpense[];
  getMonthExpenses: (month: string) => IExpense[];
  downloadMonthlyTransactions: (month: string) => void;
}

// Export the context hook for better type safety
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

// Create the context with initial values
const ExpenseContext = createContext<ExpenseContextType | null>(null);

// ... existing imports and initial context

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentProfile, updateProfile } = useProfile();
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<IMonthlyExpenses>(
    currentProfile?.monthlyExpenses || {}
  );
  const [currentMonth, setCurrentMonth] = useState<string>('');

  // Initialize with current profile data
  useEffect(() => {
    if (currentProfile) {
      setMonthlyExpenses(currentProfile.monthlyExpenses);
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(monthKey);
      setExpenses(currentProfile.monthlyExpenses[monthKey] || []);
    }
  }, [currentProfile]);

  // Save to profile whenever monthlyExpenses changes
  useEffect(() => {
    if (currentProfile && Object.keys(monthlyExpenses).length > 0) {
      updateProfile({
        monthlyExpenses,
        lastLogin: new Date()
      });
    }
  }, [monthlyExpenses]);

  const addExpense = (expense: IExpense) => {
    try {
      const newExpense = {
        ...expense,
        month: currentMonth,
      };
      
      // Update current month expenses
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      
      // Update monthly storage
      const updatedMonthly = {
        ...monthlyExpenses,
        [currentMonth]: updatedExpenses,
      };
      setMonthlyExpenses(updatedMonthly);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw new Error('Failed to add expense');
    }
  };

  const switchMonth = (month: string) => {
    setCurrentMonth(month);
    setExpenses(monthlyExpenses[month] || []);
  };

  const getCurrentMonth = () => currentMonth;

  const getCurrentMonthExpenses = () => {
    return monthlyExpenses[currentMonth] || [];
  };

  const getMonthExpenses = (month: string) => {
    return monthlyExpenses[month] || [];
  };

  const downloadMonthlyTransactions = (month: string) => {
    const monthExpenses = monthlyExpenses[month] || [];
    const csvContent = [
      ['Date', 'Category', 'Description', 'Amount'].join(','),
      ...monthExpenses.map(expense => [
        new Date(expense.date).toLocaleDateString(),
        expense.category,
        expense.description,
        expense.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const monthName = new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${monthName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ... existing context methods

  return (
    <ExpenseContext.Provider value={{
      expenses,
      monthlyExpenses,
      addExpense,
      getCurrentMonth,
      switchMonth,
      getCurrentMonthExpenses,
      getMonthExpenses,
      downloadMonthlyTransactions,
      // ... existing context values
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}; 