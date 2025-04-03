
import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
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

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      // Using a generic query approach to avoid type errors with specific tables
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If error is not "not found", log it
        if (error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
        }
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Exception fetching user profile:', error);
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
          await fetchUserProfile(session.user.id);
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
        
        if (session?.user) {
          // Using setTimeout to avoid potential auth deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
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
