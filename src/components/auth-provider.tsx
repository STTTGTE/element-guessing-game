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
    console.log('Initializing auth state...');
    let isMounted = true;

    // Get the current session
    const initializeAuth = async () => {
      try {
        console.log('Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (session?.user) {
          console.log('User found in session:', session.user.id);
          if (isMounted) {
            setUser(session.user);
          }
        } else {
          console.log('No user found in session');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    console.log('Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (isMounted) {
          setUser(session?.user || null);
          setLoading(false);
          
          if (!session?.user) {
            setProfile(null);
          }
        }
      }
    );

    // Clean up the subscription
    return () => {
      console.log('Cleaning up auth provider...');
      isMounted = false;
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
