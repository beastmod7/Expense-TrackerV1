import { ExpenseProvider } from './context/ExpenseContext';
import { MonthSelector } from './components/MonthSelector';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseHistory } from './components/ExpenseHistory';
import { DownloadHistory } from './components/DownloadHistory';

function App() {
  return (
    <ExpenseProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
        <MonthSelector />
        <ExpenseForm />
        <ExpenseHistory />
        <DownloadHistory />
      </div>
    </ExpenseProvider>
  );
}

export default App; 