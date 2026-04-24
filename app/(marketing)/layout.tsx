import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function MarketingLayout({
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
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}