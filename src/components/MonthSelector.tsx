import React from 'react';
import { useExpense } from '../context/ExpenseContext';

export const MonthSelector: React.FC = () => {
  const { getCurrentMonth, switchMonth, monthlyExpenses } = useExpense();
  const currentMonth = getCurrentMonth();

  const months = Object.keys(monthlyExpenses).sort().reverse();

  if (months.length === 0) {
    return (
      <div className="mb-4">
        <p className="text-gray-600">Start adding expenses for this month</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <select
        value={currentMonth}
        onChange={(e) => switchMonth(e.target.value)}
        className="p-2 border rounded"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
          </option>
        ))}
      </select>
    </div>
  );
}; 