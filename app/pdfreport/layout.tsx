import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  Lora,
  Lato,
} from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import "./pdf-styles.css";
import SocketInitializer from "@/components/socket-initializer";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "URekha | AI-Powered Vedic Astrology",
  description: "Advanced Vedic astrology engine powered by AI.",
};

// --- Font Configurations ---
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // Cleaned up weights for performance
  variable: "--font-lato",
  display: "swap",
});

const hindiSerif = localFont({
  src: [
    {
      path: "../../utils/Noto_Sans_Devanagari/static/NotoSansDevanagari-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../utils/Noto_Sans_Devanagari/static/NotoSansDevanagari-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hindi-serif",
  display: "swap",
});

const hindiSans = localFont({
  src: [
    {
      path: "../../utils/Noto_Sans_Devanagari/static/NotoSansDevanagari-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../utils/Noto_Sans_Devanagari/static/NotoSansDevanagari-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hindi-sans",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/agent/login");
  }

  // Authorize as Agent
  const { data: agentData } = await supabase
    .from("agentdata")
    .select("id")
    .eq("email", user.email!)
    .single();

  if (!agentData) {
    redirect("/auth/agent/login?error=Unauthorized");
  }

  return (
    <div
      className={`
        antialiased min-h-screen bg-white text-zinc-900 light
        ${lora.variable} ${lato.variable} 
        ${hindiSerif.variable} ${hindiSans.variable}
      `}
    >
      <SocketInitializer />
      <Toaster position="top-right" richColors theme="light" />
      {children}
    </div>
  );
}
