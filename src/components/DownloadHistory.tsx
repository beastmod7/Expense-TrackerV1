import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

export const DownloadHistory: React.FC = () => {
  const { monthlyExpenses, downloadMonthlyTransactions } = useExpense();
  const [selectedMonth, setSelectedMonth] = useState('');

  const months = Object.keys(monthlyExpenses).sort().reverse();

  const handleDownload = () => {
    if (selectedMonth) {
      downloadMonthlyTransactions(selectedMonth);
    }
  };

  return (
    <div className="mt-4 flex gap-4">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Select Month</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
          </option>
        ))}
      </select>
      <button
        onClick={handleDownload}
        disabled={!selectedMonth}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Download Selected Month
      </button>
    </div>
  );
}; 