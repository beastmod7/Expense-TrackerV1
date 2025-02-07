export interface IExpense {
  id: string;
  amount: number;
  category: string;
  date: Date;
  description: string;
  month: string; // Add this to track expenses by month
}

export interface IMonthlyExpenses {
  [month: string]: IExpense[];
} 