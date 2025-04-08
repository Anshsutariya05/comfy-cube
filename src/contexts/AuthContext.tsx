
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile information from profiles table
  const fetchProfile = async (userId: string) => {
    try {
      // Using get_profile RPC with the correct parameter name (user_id)
      const { data, error } = await supabase
        .rpc('get_profile', { user_id: userId });
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      // Cast the data to Profile type after validation
      const profileData = data as unknown;
      
      // Basic validation to ensure the data has the required structure
      if (
        profileData && 
        typeof profileData === 'object' &&
        'id' in profileData &&
        'email' in profileData
      ) {
        return profileData as Profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If no user, clear profile and set loading to false
        if (!session?.user) {
          setProfile(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // Use setTimeout to avoid Supabase auth deadlocks
        setTimeout(async () => {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
          setIsAdmin(userProfile?.role === 'admin');
          setLoading(false);
        }, 0);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        setIsAdmin(userProfile?.role === 'admin');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
            role: role || 'user',
          }
        }
      });
      if (error) throw error;
      
      toast.success("Account created successfully", {
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast.error("Signup failed", {
        description: error.message || "An error occurred during signup.",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (error: any) {
      toast.error("Sign out failed", {
        description: error.message || "An error occurred during sign out.",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    isAdmin,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
