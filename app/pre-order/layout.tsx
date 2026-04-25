import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function PreOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let initialRole = "user"; // fallback

  if (session?.user?.email) {
    const { data: roleData } = await supabase
      .from("roles")
      .select("role")
      .eq("email", session.user.email)
      .single();
    if (roleData) {
      initialRole = roleData.role;
    }
  }

  const isAuthenticated = !!session;

  return (
    <>
      <Navbar
        initialRole={initialRole as any}
        initialIsAuthenticated={isAuthenticated}
      />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}
