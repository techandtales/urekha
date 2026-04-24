import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AstrologyBackground } from "@/components/admin/AstrologyBackground";
import { getPendingTokenRequestCount } from "@/app/actions/token-actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/agent/login"); 
  }

  // Verify Admin Role
  const { data: roleData } = await supabase
    .from("roles")
    .select("role")
    .eq("email", user.email!)
    .in("role", ["admin", "superadmin"])
    .single();

  if (!roleData) {
    await supabase.auth.signOut();
    redirect("/auth/admin/login?error=permission_denied");
  }

  const { count: pendingTokenCount } = await getPendingTokenRequestCount();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050A0A] text-slate-900 dark:text-white transition-colors duration-500 font-sans relative overflow-hidden">
      {/* Background Layer */}
      <AstrologyBackground />

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar user={user} />

        <div className="flex flex-1 overflow-hidden">
          {/* Main Sidebar */}
          <AdminSidebar user={user} pendingTokenCount={pendingTokenCount} />

          {/* Main Dashboard Area */}
          <main className="flex-1 md:ml-64 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
