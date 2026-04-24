"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function signInAdminWithPassword(email: string, password: string) {
  try {
    const supabase = await createClient();

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { success: false, error: "Permission Denied, Only Admins Allowed" };
    }

    // 2. Check if the authenticated user has the admin role in the database
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role")
      .eq("email", email)
      .single();

    const allowedRoles = ['admin', 'superadmin'];
    if (roleError || !roleData || !allowedRoles.includes(roleData.role)) {
      // 3. If they are NOT an admin, log them out immediately
      await supabase.auth.signOut();
      revalidatePath("/", "layout");
      return { 
        success: false, 
        error: "Permission Denied, Only Admins Allowed" 
      };
    }

    // 4. Success — user is authenticated and verified as an admin
    return { success: true };
  } catch (err: any) {
    console.error("[ACTION ERROR] signInAdminWithPassword crashed:", err);
    return { success: false, error: "Server Action crashed: " + (err.message || String(err)) };
  }
}
