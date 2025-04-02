import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { AuthContext, AuthState } from '@/lib/auth'
import { Profile, supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    console.log("Auth provider mounted, checking session")
    
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          setSession({ user: null, profile: null, loading: false })
          return
        }
        
        if (data.session?.user) {
          console.log("Found existing session for user:", data.session.user.id)
          await fetchProfile(data.session.user)
        } else {
          console.log("No active session found")
          setSession({ user: null, profile: null, loading: false })
        }
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error)
        setSession({ user: null, profile: null, loading: false })
      }
    }
    
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id)
        
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            console.log("User signed in:", session.user.id)
            toast({
              title: "Signed in successfully",
              description: "Welcome back!",
            })
          }
          await fetchProfile(session.user)
        } else {
          if (event === 'SIGNED_OUT') {
            console.log("User signed out")
            toast({
              title: "Signed out",
              description: "You have been signed out",
            })
          }
          setSession({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => {
      console.log("Auth provider unmounting, unsubscribing")
      subscription.unsubscribe()
    }
  }, [toast])

  const fetchProfile = async (user: User) => {
    console.log("Fetching profile for user:", user.id)
    try {
      // First, check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          console.log("Profile not found, creating one")
          // Profile doesn't exist, create one
          const newProfileData = {
            id: user.id,
            username: user.email || `user_${user.id.substring(0, 8)}`
          };
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating profile:", createError)
            throw createError
          }
          
          setSession({
            user,
            profile: newProfile as Profile,
            loading: false,
          })
        } else {
          console.error("Error fetching profile:", error)
          throw error
        }
      } else {
        console.log("Profile found:", data)
        setSession({
          user,
          profile: data as Profile,
          loading: false,
        })
      }
    } catch (error) {
      console.error('Error in profile flow:', error)
      // Even if profile fetch fails, we still have a user
      setSession({
        user,
        profile: null,
        loading: false,
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      })
      if (error) throw error
    } catch (error) {
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })
      if (error) throw error
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for a confirmation link",
      })
    } catch (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
