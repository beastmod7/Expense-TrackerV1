export interface IUserProfile {
  username: string;
  id: string;
  createdAt: Date;
  lastLogin: Date;
  monthlyExpenses: IMonthlyExpenses;
  settings?: {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
  };
}

export interface IProfileContext {
  currentProfile: IUserProfile | null;
  login: (username: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  updateProfile: (updates: Partial<IUserProfile>) => void;
} 