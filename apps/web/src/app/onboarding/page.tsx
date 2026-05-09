"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { createSchoolIfNotExists } from "../../services/school.service";

export default function OnboardingPage() {
  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();

      const user = data.user;

      if (!user) return;

      const schoolName = user.user_metadata?.school_name;

      const school = await createSchoolIfNotExists(schoolName);

      // attach school_id to user profile
      await supabase
        .from("user_profiles")
        .update({
          school_id: school.id
        })
        .eq("id", user.id);

      window.location.href = "/dashboard";
    };

    run();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      Setting up your school...
    </div>
  );
}