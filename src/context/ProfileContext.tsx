import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUserProfile, IProfileContext } from '../types/profile.types';

const ProfileContext = createContext<IProfileContext | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState<IUserProfile | null>(null);

  // Load profile on startup
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        // Convert date strings back to Date objects
        profile.createdAt = new Date(profile.createdAt);
        profile.lastLogin = new Date(profile.lastLogin);
        
        // Convert expense dates
        Object.keys(profile.monthlyExpenses).forEach(month => {
          profile.monthlyExpenses[month] = profile.monthlyExpenses[month].map(expense => ({
            ...expense,
            date: new Date(expense.date)
          }));
        });
        
        setCurrentProfile(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('userProfile', JSON.stringify(currentProfile));
    }
  }, [currentProfile]);

  const login = (username: string) => {
    const existingProfile = localStorage.getItem(`profile_${username}`);
    
    if (existingProfile) {
      const profile = JSON.parse(existingProfile);
      profile.lastLogin = new Date();
      setCurrentProfile(profile);
    } else {
      const newProfile: IUserProfile = {
        username,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        lastLogin: new Date(),
        monthlyExpenses: {},
        settings: {
          currency: 'USD',
          language: 'en',
          theme: 'light'
        }
      };
      setCurrentProfile(newProfile);
    }
  };

  const logout = () => {
    setCurrentProfile(null);
  };

  const updateProfile = (updates: Partial<IUserProfile>) => {
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      setCurrentProfile(updatedProfile);
    }
  };

  return (
    <ProfileContext.Provider value={{
      currentProfile,
      login,
      logout,
      isLoggedIn: !!currentProfile,
      updateProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
}; 