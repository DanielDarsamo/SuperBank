import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Language, QueueEntry } from '@/types';

interface AppState {
  user: User | null;
  language: Language;
  isAuthenticated: boolean;
  currentQueue: QueueEntry | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLanguage: (language: Language) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setCurrentQueue: (queue: QueueEntry | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'en',
      isAuthenticated: false,
      currentQueue: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLanguage: (language) => set({ language }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setCurrentQueue: (currentQueue) => set({ currentQueue }),
      logout: () => set({ user: null, isAuthenticated: false, currentQueue: null }),
    }),
    {
      name: 'bank-app-storage',
    }
  )
);