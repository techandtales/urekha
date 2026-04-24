import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import YourKundliClient from "@/components/kundli/YourKundliClient";

export default async function YourKundliPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/user/login");
  }

  const { data: userData } = await supabase
    .from("userdata")
    .select("*")
    .eq("email", user.email)
    .single();

  return <YourKundliClient userData={userData} userId={user.id} />;
}
