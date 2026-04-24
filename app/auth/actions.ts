"use server";

import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Custom error mappings for a better user experience
function getCustomErrorMessage(errorMsg: string): string {
  if (
    errorMsg.includes("Invalid login credentials") ||
    errorMsg.includes("Token has expired or is invalid")
  ) {
    return "Invalid or expired transmission code. Please initiate a new sync.";
  }
  if (
    errorMsg.includes("Signups not allowed for otp") ||
    errorMsg.includes("Signups not allowed")
  ) {
    return "Node Access Denied: This identity is not registered within the Urekha ecosystem.";
  }
  if (errorMsg.includes("User already registered")) {
    return "Identity Conflict: This node is already active. Please proceed to the login gateway.";
  }
  if (
    errorMsg.includes("rate_limit") ||
    errorMsg.includes("Too many requests")
  ) {
    return "System Overload: Too many requests detected. Try again shortly.";
  }
  if (errorMsg.includes("Email not confirmed")) {
    return "Pending Authorization: Please confirm your email address to activate your node.";
  }
  return errorMsg;
}

// Database helper to check and create user/agent rows (used during signup flows BEFORE login)
async function ensureUserRole(
  email: string,
  role: "user" | "agent",
  isSignUp: boolean = false,
) {
  const supabase = await createClient();

  // 1. Check existing role in `roles` table
  const { data: existingRole, error: roleError } = await supabase
    .from("roles")
    .select("role")
    .eq("email", email)
    .single();

  if (existingRole) {
    if (
      !isSignUp &&
      existingRole.role !== role &&
      existingRole.role !== "admin" &&
      existingRole.role !== "superadmin"
    ) {
      throw new Error(
        `Access Denied: You are registered as a ${existingRole.role}, but attempting to login as a ${role}.`,
      );
    }
  }
  // Don't insert role here anymore - that happens post-login in ensureAccountAfterSignup
}

export async function signInWithOtp(
  email: string,
  isSignUp: boolean = false,
  role?: "user" | "agent",
) {
  const supabase = await createClient();

  // For login (not signup), skip pre-login DB checks — those happen post-login via verifyAccountExists
  // For signup, we only check if there's a conflicting role
  if (role && isSignUp) {
    try {
      await ensureUserRole(email, role, isSignUp);
    } catch (err: any) {
      return { error: err.message };
    }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: isSignUp,
      data: isSignUp && role ? { signup_role: role } : undefined,
    },
  });

  if (error) {
    return { error: getCustomErrorMessage(error.message) };
  }

  return { success: true };
}

export async function verifyOtp(
  email: string,
  token: string,
  type: EmailOtpType,
  role?: "user" | "agent",
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) {
      return { error: getCustomErrorMessage(error.message) };
    }

    // Only verify the account role/existence on login flows.
    // Skip during signup ('email' type) because the userdata record is created
    // AFTER OTP verification via ensureAccountAfterSignup on the client.
    if (role && type !== "recovery" && type !== "email") {
      const verify = await verifyAccountExists(role);
      if (verify.error) {
        return { error: verify.error };
      }
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Server Action crashed: " + (err.message || String(err)) };
  }
}

export async function signInWithGoogle(role?: "user" | "agent") {
  const supabase = await createClient();

  // Note: For Google OAuth, we only have the email AFTER the callback.
  // Unless we pass a state parameter. For now, since GoogleLogin is used on the client
  // with signInWithGoogleIdToken, that's where we'll handle the DB logic.

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: getCustomErrorMessage(error.message) };
  }

  return { url: data.url };
}

export async function signInWithGoogleIdToken(
  idToken: string,
  role?: "user" | "agent",
  mode: "login" | "signup" = "login",
) {
  const supabase = await createClient();

  // Exchange the client-side Google ID Token for a Supabase Session
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });

  if (error) {
    return { error: getCustomErrorMessage(error.message) };
  }

  const email = data.user?.email;
  // Google often stores the full name in data.user.user_metadata.full_name or .name
  const fullName =
    data.user?.user_metadata?.full_name ||
    data.user?.user_metadata?.name ||
    null;

  if (!role || !email) {
    return { success: true };
  }

  const tableName = role === "agent" ? "agentdata" : "userdata";

  if (mode === "login") {
    // 1. Check the roles table first to detect gateway mismatch
    const { data: roleData } = await supabase
      .from("roles")
      .select("role")
      .eq("email", email)
      .single();

    if (
      roleData &&
      roleData.role !== role &&
      (roleData.role === "admin" || roleData.role === "agent")
    ) {
      await supabase.auth.signOut();
      revalidatePath("/", "layout");
      return {
        error: `Please login via the ${roleData.role} login page.`,
      };
    }

    // 2. Verify account exists in the correct data table
    const { data: existingData, error: checkError } = await supabase
      .from(tableName)
      .select("email")
      .eq("email", email)
      .single();

    if (checkError || !existingData) {
      // Account not found — sign out immediately
      await supabase.auth.signOut();
      revalidatePath("/", "layout");
      if (role === "agent") {
        return {
          error:
            "No agent account found for this email. Please contact your administrator or sign up for agent access.",
        };
      } else {
        return {
          error:
            "No account found for this email. Please sign up first to create your profile.",
        };
      }
    }
  } else {
    // SIGNUP: Ensure the account and role exist, create if missing
    const { data: existingData } = await supabase
      .from(tableName)
      .select("*")
      .eq("email", email)
      .single();

    if (!existingData) {
      const { error: insertError } = await supabase.from(tableName).insert({
        email,
        ...(fullName && { name: fullName }),
        ...(role === "agent" && { agent_uuid: data.user.id }),
      });
      if (insertError) {
        return {
          error:
            "Something went wrong while setting up your account. Please try again or contact support.",
        };
      }
    } else if (!existingData.name && fullName) {
      // If the email exists but doesn't have a name yet, update it
      await supabase
        .from(tableName)
        .update({ name: fullName })
        .eq("email", email);
    }

    const { data: existingRole } = await supabase
      .from("roles")
      .select("role")
      .eq("email", email)
      .single();

    if (!existingRole) {
      const { error: insertRoleError } = await supabase
        .from("roles")
        .insert({ email, role, user_id: data.user.id });
      if (insertRoleError) {
        return {
          error:
            "Something went wrong while setting up your account. Please try again or contact support.",
        };
      }
    }
  }

  return { success: true };
}

export async function resetPasswordOtp(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: getCustomErrorMessage(error.message) };
  }

  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: getCustomErrorMessage(error.message) };
  }

  return { success: true };
}

export async function signInWithPassword(
  email: string,
  password: string,
  role?: "user" | "agent",
) {
  const supabase = await createClient();

  // No pre-login DB checks — those happen post-login via verifyAccountExists

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: getCustomErrorMessage(error.message) };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

/**
 * Verifies that the authenticated user's email exists in the correct data table.
 * Must be called AFTER a successful login so that RLS policies allow the query.
 * If the email is not found, the user is signed out and an error is returned.
 */
export async function verifyAccountExists(role: "user" | "agent") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      error: "Authentication session could not be verified. Please try again.",
    };
  }

  // 1. Check the roles table first to detect unauthorized access across login gateways
  const { data: roleData } = await supabase
    .from("roles")
    .select("role")
    .eq("email", user.email)
    .single();

  if (roleData) {
    const actualRole = roleData.role;

    // Check if the user is trying to access the wrong gateway
    if (
      actualRole !== role &&
      (actualRole === "admin" || actualRole === "agent")
    ) {
      await supabase.auth.signOut();
      revalidatePath("/", "layout");
      return {
        error: `Please login via the ${actualRole} login page.`,
      };
    }

    // Generic role mismatch (for other roles)
    if (actualRole !== role && actualRole !== "admin") {
      await supabase.auth.signOut();
      revalidatePath("/", "layout");
      return {
        error: `Access Denied: You are registered as an ${actualRole}, but attempting to login as a ${role}.`,
      };
    }
  }

  const tableName = role === "agent" ? "agentdata" : "userdata";

  const { data, error } = await supabase
    .from(tableName)
    .select("email")
    .eq(
      role === "agent" ? "agent_uuid" : "email",
      role === "agent" ? user.id : user.email,
    )
    .single();

  if (error || !data) {
    // Account not found — sign the user out immediately
    await supabase.auth.signOut();
    revalidatePath("/", "layout");

    if (role === "agent") {
      return {
        error:
          "No agent account found for this email. Please contact your administrator or sign up for agent access.",
      };
    } else {
      return {
        error:
          "No account found for this email. Please sign up first to create your profile.",
      };
    }
  }

  return { success: true };
}

/**
 * Signs up a new user with email/password.
 * Stores the intended role in user metadata so we know which table to insert into after verification.
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  role: "user" | "agent",
  fullName?: string,
) {
  const supabase = await createClient();

  // Step 1: Register the account with email + password
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        signup_role: role,
        full_name: fullName || "",
      },
    },
  });

  if (signUpError) {
    return { error: getCustomErrorMessage(signUpError.message) };
  }

  // signUp() already sends a confirmation email with a 6-digit OTP code.
  // Verify it on the client using verifyOtp(email, code, "signup").
  return { success: true };
}

/**
 * Called AFTER a successful signup + login (post OTP verification or Google OAuth).
 * Checks if the email already exists in the correct data table.
 * If not, inserts the email into userdata/agentdata AND the roles table.
 * If already exists, does nothing — just returns success.
 */
export async function ensureAccountAfterSignup(role: "user" | "agent") {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return {
        error:
          "Authentication session could not be verified. Please try again.",
      };
    }

    const email = user.email;
    const tableName = role === "agent" ? "agentdata" : "userdata";

    // Check if email already exists in the data table
    const { data: existingData, error: dataError } = await supabase
      .from(tableName)
      .select("email")
      .eq(
        role === "agent" ? "agent_uuid" : "email",
        role === "agent" ? user.id : user.email,
      )
      .single();

    if (existingData) {
      // Already registered — nothing to do
      return { success: true };
    }

    const fullName =
      user.user_metadata?.full_name || user.user_metadata?.name || null;
    console.log("ensureAccountAfterSignup inserting Data:", {
      email,
      name: fullName,
    });

    // Insert into the data table
    const { error: insertDataError } = await supabase.from(tableName).insert({
      email,
      ...(fullName && { name: fullName }),
      ...(role === "agent" && { agent_uuid: user.id }),
    });

    if (insertDataError) {
      console.error(
        "ensureAccountAfterSignup insertDataError:",
        insertDataError,
      );
      return {
        error:
          "Something went wrong while setting up your account (data check). Please try again or contact support.",
      };
    }
    console.log("ensureAccountAfterSignup Data inserted perfectly.");

    // Insert/upsert the role
    const { data: existingRole } = await supabase
      .from("roles")
      .select("role")
      .eq("email", email)
      .single();

    if (!existingRole) {
      console.log("ensureAccountAfterSignup inserting role.");
      const { error: insertRoleError } = await supabase
        .from("roles")
        .insert({ email, role, user_id: user.id });

      if (insertRoleError) {
        console.error(
          "ensureAccountAfterSignup insertRoleError",
          insertRoleError,
        );
        return {
          error:
            "Something went wrong while setting up your account (role check). Please try again or contact support.",
        };
      }
    }

    console.log("ensureAccountAfterSignup success");
    return { success: true };
  } catch (err: any) {
    console.error("ensureAccountAfterSignup crash:", err);
    return { error: "Server Action crashed: " + (err.message || String(err)) };
  }
}

/**
 * Updates the user's profile with required details and marks it as complete.
 * Called from the /profile/complete page after first signup.
 */
export async function completeUserProfile(profileData: {
  name: string;
  date_of_birth: string;
  time_of_birth: string;
  gender: string;
  phone?: string;
  country: string;
  state: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      error: "Authentication session could not be verified. Please try again.",
    };
  }

  const { error } = await supabase
    .from("userdata")
    .update({
      name: profileData.name,
      date_of_birth: profileData.date_of_birth,
      time_of_birth: profileData.time_of_birth,
      gender: profileData.gender,
      phone: profileData.phone,
      country: profileData.country,
      state: profileData.state,
      city: profileData.city,
      latitude:
        profileData.latitude !== undefined ? profileData.latitude : null,
      longitude:
        profileData.longitude !== undefined ? profileData.longitude : null,
      timezone:
        profileData.timezone !== undefined ? profileData.timezone : null,
      profile_complete: true,
    })
    .eq("email", user.email);

  if (error) {
    return {
      error: "Failed to update your profile. Please try again.",
    };
  }

  revalidatePath("/profile", "layout");
  return { success: true };
}

/**
 * Checks if the authenticated user's profile is complete.
 * Returns { complete: boolean }.
 */
export async function checkProfileComplete() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { complete: false };
  }

  const { data } = await supabase
    .from("userdata")
    .select("profile_complete")
    .eq("email", user.email)
    .single();

  return { complete: data?.profile_complete === true };
}

/**
 * Updates the user's geospatial location data.
 * Called from the LocationUpdateModal on the profile page.
 */
export async function updateUserLocation(locationData: {
  country: string;
  state: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      error: "Authentication session could not be verified. Please try again.",
    };
  }

  const { error } = await supabase
    .from("userdata")
    .update({
      country: locationData.country,
      state: locationData.state,
      city: locationData.city,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    })
    .eq("email", user.email);

  if (error) {
    return {
      error: "Failed to update your location. Please try again.",
    };
  }

  revalidatePath("/profile");
  return { success: true };
}
