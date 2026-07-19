import { supabase } from "../supabase/supabaseClient";

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
};
export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("Signup Data:", data);
  console.log("Signup Error:", error);

  if (error) throw error;

  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

export const listenToAuthChanges = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user || null);
    }
  );
  return () => subscription.unsubscribe();
};
