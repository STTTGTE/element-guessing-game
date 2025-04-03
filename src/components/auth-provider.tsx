
import { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the auth context type
export type AuthContextType = {
  session: {
    user: User | null;
    loading: boolean;
    profile: Record<string, any> | null;
  };
  signOut: () => Promise<void>;
};

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  session: {
    user: null,
    loading: true,
    profile: null,
  },
  signOut: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get the current session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // We're not fetching profiles anymore as it's causing type errors
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
        
        if (!session?.user) {
          setProfile(null);
        }
      }
    );

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session: {
          user,
          loading,
          profile,
        },
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
