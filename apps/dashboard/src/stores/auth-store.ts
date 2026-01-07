import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string) => {
        // Mock login - in a real app, this would validate credentials
        set({
          isAuthenticated: true,
          user: {
            id: 'user-1',
            name: 'Demo User',
            email: email,
            role: 'admin',
            avatar: 'https://github.com/shadcn.png',
          },
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'clipfactory-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
