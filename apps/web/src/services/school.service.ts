import { supabase } from "../lib/supabaseClient";

export async function createSchoolIfNotExists(schoolName: string) {
  const { data: existing } = await supabase
    .from("schools")
    .select("*")
    .eq("name", schoolName)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("schools")
    .insert([{ name: schoolName }])
    .select()
    .single();

  if (error) throw error;

  return data;
}