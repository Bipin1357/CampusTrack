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

export const signupStudent = async ({ fullName, email, password }) => {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;

  if (!user) {
    throw new Error("User account was not created.");
  }

  // 2. Insert into public.users
  const { error: usersError } = await supabase
    .from("users")
    .insert({
      id: user.id,
      name: fullName.trim(),
      email: email.toLowerCase(),
      role: "student",
    });

  if (usersError) throw usersError;

  // 3. Insert into public.students
  const { error: studentsError } = await supabase
    .from("students")
    .insert({
      id: crypto.randomUUID(),
      full_name: fullName.trim(),
      email: email.toLowerCase(),
      role: "student",
      user_id: user.id,
      status: "Active",
    });

  if (studentsError) throw studentsError;

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
      console.log("Auth Event:", event);
      console.log("Session User:", session?.user);
      callback(session?.user || null);
    }
  );
  return () => subscription.unsubscribe();
};
