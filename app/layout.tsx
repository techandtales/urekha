import type { Metadata } from "next";
import {
  Outfit,
  Roboto,
  Inter,
  Cinzel,
  Cormorant_Garamond,
  Source_Code_Pro,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto" 
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-code",
});

export const metadata: Metadata = {
  title: "Urekha | AI-Powered Astrology Intelligence",
  description:
    "Transform precise birth data into deeply structured, long-form astrological reports.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          outfit.variable,
          roboto.variable,
          inter.variable,
          cinzel.variable,
          cormorant.variable,
          sourceCode.variable,
          "font-sans antialiased bg-background text-foreground selection:bg-brand-gold/30",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
          enableSystem={false}
          disableTransitionOnChange
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
          >
            {(!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) && (
              <script dangerouslySetInnerHTML={{ __html: `console.warn("Google Client ID is missing. Google Sign-In will not work.")` }} />
            )}

            {children}
            <Toaster position="top-right" richColors />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
