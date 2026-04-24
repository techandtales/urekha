import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import GenerateKundliClient from "./generate-client";

export default async function GenerateKundliPage() {
  const supabase = await createClient();

  // 1. Get auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/user/login?redirect=/generate/kundli");
  }

  // 2. Verify 'user' Role
  const { data: roleData } = await supabase
    .from("roles")
    .select("role")
    .eq("email", user.email!)
    .eq("role", "user")
    .single();

  if (!roleData) {
    // If not a 'user' role, redirect to their dashboard or home
    redirect("/"); 
  }

  // 3. Fetch user data (for credits and pre-fill)
  const { data: userData } = await supabase
    .from("userdata")
    .select("*")
    .eq("email", user.email)
    .single();

  // 4. Fetch User Pricing Plans
  const { data: userPlans } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("target_audience", "user")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050A0A] flex items-center justify-center text-[#00FF94]/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#00FF94] border-transparent animate-spin" />
          <span className="font-mono text-sm tracking-widest">INITIALIZING_ENGINE...</span>
        </div>
      </div>
    }>
      <GenerateKundliClient 
        userData={userData} 
        userPlans={userPlans || []} 
      />
    </Suspense>
  );
}
