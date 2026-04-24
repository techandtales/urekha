import { create } from "zustand";

interface AuthState {
  userRole: "agent" | "user" | "admin" | "superadmin" | null;
  isAuthenticated: boolean;
  setAuth: (role: "agent" | "user" | "admin" | "superadmin" | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userRole: null,
  isAuthenticated: false,
  setAuth: (role) => set({ userRole: role, isAuthenticated: !!role }),
  clearAuth: () => set({ userRole: null, isAuthenticated: false }),
}));
