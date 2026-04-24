import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = null;
  if (user && user.email) {
    const { data: roleData } = await supabase
      .from("roles")
      .select("role")
      .eq("email", user.email)
      .single();
    if (roleData) {
      userRole = roleData.role;
    }
  }

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/auth/") &&
    !request.nextUrl.pathname.includes("/update-password") &&
    !request.nextUrl.pathname.startsWith("/auth/callback");

  // Protect the admin routes
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/auth/admin/login")
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/admin/login";
      return NextResponse.redirect(url);
    }
    if (userRole !== "admin" && userRole !== "superadmin") {
      const url = request.nextUrl.clone();
      // Redirect to their respective dashboards instead of just login
      if (userRole === "agent") {
        url.pathname = "/dashboard";
      } else {
        url.pathname = "/profile";
      }
      return NextResponse.redirect(url);
    }
  }

  // Protect the dashboard route (agents only)
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/agent/login";
      return NextResponse.redirect(url);
    }
    // If authenticated but not an agent, send them to their specific dashboard
    if (userRole !== "agent") {
      const url = request.nextUrl.clone();
      if (userRole === "admin" || userRole === "superadmin") {
        url.pathname = "/admin/dashboard";
      } else {
        url.pathname = "/profile";
      }
      return NextResponse.redirect(url);
    }
  }

  // Protect the profile route (users only)
  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/user/login";
      return NextResponse.redirect(url);
    }
    // If authenticated as agent or admin, send them to their respective dashboard
    if (userRole !== "user") {
      const url = request.nextUrl.clone();
      if (userRole === "admin" || userRole === "superadmin") {
        url.pathname = "/admin/dashboard";
      } else {
        url.pathname = "/dashboard";
      }
      return NextResponse.redirect(url);
    }
    // Check profile completion for users (skip if already on /profile/complete)
    if (
      userRole === "user" &&
      !request.nextUrl.pathname.startsWith("/profile/complete")
    ) {
      const { data: userData } = await supabase
        .from("userdata")
        .select("profile_complete")
        .eq("email", user.email)
        .single();

      if (userData && userData.profile_complete !== true) {
        const url = request.nextUrl.clone();
        url.pathname = "/profile/complete";
        return NextResponse.redirect(url);
      }
    }
  }

  // Prevent logged in users from visiting auth pages
  // We ignore POST requests so that Server Actions (like ensureAccountAfterSignup) aren't maliciously hijacked into redirects.
  if (isAuthPage && user && request.method !== "POST") {
    const url = request.nextUrl.clone();

    // Check role to determine destination
    if (userRole === "admin" || userRole === "superadmin") {
      url.pathname = "/admin/dashboard";
    } else if (userRole === "agent") {
      url.pathname = "/dashboard";
    } else {
      url.pathname = "/profile";
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
