import React from 'react';
import { useExpense } from '../context/ExpenseContext';

export const ExpenseHistory: React.FC = () => {
  const { getCurrentMonthExpenses, getCurrentMonth, downloadMonthlyTransactions } = useExpense();
  const currentMonth = getCurrentMonth();
  const expenses = getCurrentMonthExpenses();

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDownload = () => {
    downloadMonthlyTransactions(currentMonth);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <p className="text-gray-600">
            Total for {new Date(currentMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}: 
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Transactions
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t">
                <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{expense.category}</td>
                <td className="px-4 py-2">{expense.description}</td>
                <td className="px-4 py-2">${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                  No transactions for this month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 