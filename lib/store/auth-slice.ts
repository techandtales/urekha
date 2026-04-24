import { StateCreator } from 'zustand'
import { User, Session } from '@supabase/supabase-js'

export interface AuthSlice {
  user: User | null
  session: Session | null
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
})