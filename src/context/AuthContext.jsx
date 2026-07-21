import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  resetPassword as authResetPassword,
  listenToAuthChanges,
} from '../services/authService';
import { supabase } from '../supabase/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Fullscreen loading while checking auth state
  const [authActionLoading, setAuthActionLoading] = useState(false); // For manual actions like logout
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      try {
        if (user) {
          // Fetch user role from Supabase
          console.log("Authenticated User:", user);

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          console.log("========== PROFILE FETCH ==========");
          console.log("User ID:", user.id);
          console.log("Returned Data:", userData);
          console.log("Supabase Error:", userError);
          console.log("==================================");

          if (userError) {
            throw userError;
          }
          
          if (!userData) {
            throw new Error("User profile not found in users table.");
          }

          console.log("========== USER DEBUG ==========");
          console.log("Supabase Auth User:", user);
          console.log("Database User:", userData);
          console.log("Database Role:", userData?.role);
          console.log("Database Email:", userData?.email);
          console.log("Auth Email:", user.email);

          const validRoles = ["student", "admin"];

          console.log("Role Check:", validRoles.includes(userData?.role));
          console.log("Email Match:", userData?.email === user.email);
          console.log("===============================");

          // Validation: Role exists and is valid
          if (!userData.role || !validRoles.includes(userData.role)) {
            throw new Error('Invalid account configuration. Please contact administrator.');
          }

          // Validation: Email and UID match (prevent tampered documents)
          if (userData.email !== user.email) {
            throw new Error('Data validation failed. Email mismatch.');
          }

          setCurrentUser({
            uid: user.id,
            email: user.email,
            name: userData.name,
            role: userData.role,
          });

          // Redirect to appropriate dashboard if they are on login or root
          if (location.pathname === '/login' || location.pathname === '/') {
            const roleRoutes = {
              admin: "/admin/dashboard",
              student: "/student/dashboard",
            };
            const destination = location.state?.from?.pathname || roleRoutes[userData.role] || "/";
            navigate(destination, { replace: true });
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast.error(error.message || 'Authentication error occurred.');
        await authLogout();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate, location.pathname, location.state]);

  const login = async (email, password) => {
    try {
      setAuthActionLoading(true);
      await authLogin(email, password);
      // Let onAuthStateChanged handle the fetching and redirection
    } finally {
      setAuthActionLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthActionLoading(true);
      await authLogout();
      setCurrentUser(null);
      toast.success('Successfully logged out.');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Failed to log out.');
    } finally {
      setAuthActionLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setAuthActionLoading(true);
      await authResetPassword(email);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    resetPassword,
    loading: loading || authActionLoading,
  }), [currentUser, loading, authActionLoading]);

  // Show a fullscreen loading screen while checking initial Firebase auth state
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-primary text-text-primary">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-primary border-t-transparent mb-4"></div>
        <p className="text-text-secondary font-medium">Verifying session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
