import { create } from 'zustand';
import { IUser } from '@interfaces/user';

interface CurrentUserState {
  currentUser: IUser | null;
  isLoading: boolean;
  setCurrentUser: (user: IUser) => void;
  clearCurrentUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCurrentUserStore = create<CurrentUserState>()((set) => ({
  currentUser: null,
  isLoading: true,
  setCurrentUser: (user: IUser) => set({ currentUser: user, isLoading: false }),
  clearCurrentUser: () => set({ currentUser: null, isLoading: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
