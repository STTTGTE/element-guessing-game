
import { createContext } from 'react'
import { User } from '@supabase/supabase-js'

export type AuthState = {
  user: User | null
  profile: Record<string, any> | null
  loading: boolean
}

export type AuthContextType = {
  session: AuthState
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  session: { user: null, profile: null, loading: true },
  signOut: async () => {},
})
