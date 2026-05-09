"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    schoolName: ""
  });

  const handleSignup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          school_name: form.schoolName
        }
      }
    });

    setLoading(false);

    if (!error) {
      window.location.href = "/onboarding";
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold">Create School Account</h1>

        <input
          placeholder="Full Name"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          placeholder="School Name"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 p-2 text-white"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}