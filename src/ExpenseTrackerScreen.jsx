import React, { useEffect, useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

const categoryColors = [
  '#FF5733', // Red-Orange
  '#33FF57', // Green
  '#5733FF', // Blue-Purple
  '#FF33E9', // Pink
  '#33E9FF', // Cyan
  '#E9FF33', // Yellow
  '#FF8C33', // Orange
  '#33FF8C', // Light Green
  '#8C33FF', // Purple
  '#FF338C'  // Magenta
];

// Default categories with emojis
const DEFAULT_CATEGORIES = [
  'Food 🍔',
  'Petrol ⛽',
  'Rent 🏠',
  'Utilities 💡',
  'Transport 🚗',
  'Entertainment 🎬',
  'Shopping 🛍️',
  'Health 🏥',
  'Travel ✈️',
  'Education 📚'
]

const generatePieChart = (categories, expenses, totalSpent) => {
  if (totalSpent === 0) {
    return null;
  }

  const radius = 50;
  const centerX = 50;
  const centerY = 50;
  let startAngle = 0;
  let paths = [];

  categories.forEach((category, index) => {
    const categoryTotal = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    const percentage = (categoryTotal / totalSpent) * 360;
    const endAngle = startAngle + percentage;

    if (percentage > 0) {
      const x1 = centerX + radius * Math.cos(Math.PI * startAngle / 180);
      const y1 = centerY + radius * Math.sin(Math.PI * startAngle / 180);
      const x2 = centerX + radius * Math.cos(Math.PI * endAngle / 180);
      const y2 = centerY + radius * Math.sin(Math.PI * endAngle / 180);

      const largeArcFlag = percentage > 180 ? 1 : 0;
      const path = `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
      paths.push({ path, color: categoryColors[index % categoryColors.length], category, percentage: (categoryTotal / totalSpent) * 100 });
    }
    startAngle = endAngle;
  });

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      {paths.map((p, index) => (
        <path key={index} d={p.path} fill={p.color} title={`${p.category}: ${p.percentage.toFixed(2)}%`} />
      ))}
    </svg>
  );
};

export default function ExpenseTrackerScreen({ username }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem('categories')) || DEFAULT_CATEGORIES
  );
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem('expenses')) || []
  );
  const [newCategory, setNewCategory] = useState('');
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isCategoriesCollapsed, setIsCategoriesCollapsed] = useState(false);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const toggleCategoryForm = () => {
    setShowCategoryForm(!showCategoryForm);
  };

  const toggleCategoriesCollapse = () => {
    setIsCategoriesCollapsed(!isCategoriesCollapsed);
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory)) {
      const newCategories = [...categories, `${newCategory} 🏷️`];
      setCategories(newCategories);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (newExpense.amount && newExpense.category) {
      const expense = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toLocaleString()
      };
      const newExpenses = [expense, ...expenses];
      setExpenses(newExpenses);
      setNewExpense({
        amount: '',
        category: '',
        description: ''
      });
    }
  };

  const deleteCategory = (categoryToDelete) => {
    const newCategories = categories.filter(category => category !== categoryToDelete);
    setCategories(newCategories);
    const newExpenses = expenses.filter(expense => expense.category !== categoryToDelete);
    setExpenses(newExpenses);
  };

  const getCategoryTotal = (category) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
      .toFixed(2);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2);
  const pieChart = generatePieChart(categories, expenses, totalSpent);

  // Get categories with expenses
  const categoriesWithData = categories.filter(category => 
    expenses.some(expense => expense.category === category)
  );

  const handleDownload = () => {
    // Create CSV content with proper escaping
    const csvContent = [
      'Date,Description,Amount(₹),Category',
      ...expenses.map(e => 
        `"${e.date}","${e.description.replace(/"/g, '""')}",${e.amount},"${e.category}"`
      )
    ].join('\r\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`expense-tracker ${isDarkMode ? 'dark' : ''}`}>
      <div className="header">
        <h2>Welcome, <span style={{ color: 'var(--primary-color)' }}>{username}</span> 👋</h2>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>
      </div>
      
      <div className="expense-input">
        <h3>Add Expense 💸</h3>
        <form onSubmit={addExpense} className="expense-form">
          <div className="input-row">
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              placeholder="Amount in ₹"
              required
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              required
            >
              <option value="">Select category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            placeholder="Description"
          />
          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div className="category-management">
        <div className="category-header">
          <h3>Categories 🗂️</h3>
          <div className="category-controls">
            <button 
              onClick={toggleCategoryForm}
              className="toggle-category-btn"
            >
              {showCategoryForm ? 'Hide' : 'Add Category ➕'}
            </button>
            <button 
              onClick={toggleCategoriesCollapse}
              className="toggle-category-btn"
            >
              {isCategoriesCollapsed ? 'Show All' : 'Collapse'}
            </button>
      </div>

      {editingExpense && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Edit Transaction</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const updatedExpenses = expenses.map(exp => 
                exp === editingExpense ? editingExpense : exp
              );
              setExpenses(updatedExpenses);
              setEditingExpense(null);
            }}>
              <div className="input-row">
                <input
                  type="number"
                  step="0.01"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    amount: parseFloat(e.target.value)
                  })}
                  placeholder="Amount"
                  required
                />
                <select
                  value={editingExpense.category}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense,
                    category: e.target.value
                  })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={editingExpense.description}
                onChange={(e) => setEditingExpense({
                  ...editingExpense,
                  description: e.target.value
                })}
                placeholder="Description"
              />
              <div className="form-buttons">
                <button type="submit">Save</button>
                <button 
                  type="button"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
        
        {showCategoryForm && (
          <form onSubmit={addCategory} className="category-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
            />
            <button type="submit">Add</button>
          </form>
        )}
        
        <div className={`category-list ${isCategoriesCollapsed ? 'collapsed' : ''}`}>
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <span>{category}</span>
              <button
                className="delete-category-btn"
                onClick={() => deleteCategory(category)}
              >
                <span role="img" aria-label="delete">
                  🗑️
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics">
        <h3>Analytics 📊</h3>
        <div className="total-spent">
          Total Spent: ₹{totalSpent}
        </div>
        <div className="pie-chart-container">
          {pieChart}
        </div>
        <div className="category-breakdown">
          {categoriesWithData.map((category, index) => (
            <div key={index} className="category-progress">
              <span>{category}</span>
              <progress
                value={getCategoryTotal(category)}
                max={totalSpent || 1}
              />
              <span>₹{getCategoryTotal(category)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-transactions">
        <div className="transactions-header">
          <h3>All Transactions 🧾</h3>
          <button 
            className="download-btn"
            onClick={handleDownload}
            title="Download as CSV"
            aria-label="Download transaction history"
          >
            <FaFileDownload />
          </button>
        </div>
        <div className="transactions-container">
          {expenses.map((expense, index) => (
            <div key={index} className="transaction">
              <div className="transaction-header">
                <span>{expense.category}</span>
                <span>₹{expense.amount.toFixed(2)}</span>
                <button 
                  className="edit-btn"
                  onClick={() => setEditingExpense(expense)}
                  title="Edit transaction"
                  aria-label="Edit transaction"
                >
                  ✏️
                </button>
              </div>
              <div className="transaction-details">
                <span>{expense.description}</span>
                <span>{expense.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
