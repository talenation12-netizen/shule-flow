import { supabase } from "./supabaseClient";

export async function signUp(email: string, password: string, fullName: string, schoolName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        school_name: schoolName
      }
    }
  });

  return { data, error };
}