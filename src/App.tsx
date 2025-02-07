import { ProfileProvider } from './context/ProfileContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { Login } from './components/Login';
import { useProfile } from './context/ProfileContext';
import { MonthSelector } from './components/MonthSelector';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseHistory } from './components/ExpenseHistory';
import { DownloadHistory } from './components/DownloadHistory';

const ExpenseApp = () => {
  const { isLoggedIn, currentProfile } = useProfile();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <ExpenseProvider>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <div className="text-gray-600">
            Welcome, {currentProfile?.username}
          </div>
        </div>
        <MonthSelector />
        <ExpenseForm />
        <ExpenseHistory />
        <DownloadHistory />
      </div>
    </ExpenseProvider>
  );
};

function App() {
  return (
    <ProfileProvider>
      <ExpenseApp />
    </ProfileProvider>
  );
}

export default App; 