"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Youtube, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const isExcludedPage =
    pathname?.includes("/forgot-password") ||
    pathname?.includes("/verify-otp") ||
    pathname?.includes("/phone") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/agent") ||
    pathname?.startsWith("/pipeline");

  if (isExcludedPage) return null;

  const navLinks = [
    {
      heading: "Platform",
      links: [
        { label: "Vision", href: "/platform" },
        { label: "Systems", href: "/systems" },
        { label: "Reports", href: "/reports" },
        { label: "Pricing", href: "/plans" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      heading: "Intelligence",
      links: [
        { label: "Data Methods", href: "/systems" },
        { label: "Chart Graphics", href: "/systems" },
        { label: "Vedic Astrology", href: "/systems" },
        { label: "AI Predictions", href: "/reports" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Ethics", href: "/ethics" },
        { label: "Contact", href: "/contact" },
        { label: "Newsletter", href: "/newsletter" },
      ],
    },
    {
      heading: "Account",
      links: [
        { label: "Login", href: "/auth/user/login" },
        { label: "Sign Up", href: "/auth/user/signup" },
        { label: "My Profile", href: "/profile" },
        { label: "Purchases", href: "/profile/purchases" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Refund Policy", href: "/legal/refund" },
      ],
    },
  ];

  return (
    <footer className="relative bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7e56da]/30 to-transparent" />

      {/* Subtle Vedic SVG watermark pattern */}
      <div className="absolute inset-0 opacity-[0.018] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="footer-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="30,2 58,50 2,50"
                fill="none"
                stroke="#7e56da"
                strokeWidth="0.5"
              />
              <polygon
                points="30,58 2,10 58,10"
                fill="none"
                stroke="#7e56da"
                strokeWidth="0.5"
              />
              <circle
                cx="30"
                cy="30"
                r="18"
                fill="none"
                stroke="#7e56da"
                strokeWidth="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Top Row: Brand + Nav Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-10 lg:gap-8 pb-10 border-b border-slate-100 dark:border-zinc-800">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Urekha"
                width={32}
                height={32}
                className="h-7 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                UREKHA
              </span>
            </Link>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed max-w-[240px]">
              Transforming precise birth data into deeply structured, long-form
              astrological reports using traditional systems and modern AI.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="#"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-[#7e56da] hover:text-white transition-all text-slate-500 dark:text-zinc-400"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-[#7e56da] hover:text-white transition-all text-slate-500 dark:text-zinc-400"
              >
                <Youtube className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-[#7e56da] hover:text-white transition-all text-slate-500 dark:text-zinc-400"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-[#7e56da] hover:text-white transition-all text-slate-500 dark:text-zinc-400"
              >
                <Instagram className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Nav Link Columns */}
          {navLinks.map((col) => (
            <div key={col.heading} className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7e56da]">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row: Copyright + CTA */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-7 text-[12px] text-slate-400 dark:text-zinc-500">
          <p>© 2026 Urekha Intelligence Platform. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/plans"
              className="inline-flex items-center gap-1.5 text-[#7e56da] font-semibold text-[12px] tracking-wide uppercase hover:text-[#6543b5] transition-colors"
            >
              Get Started <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors tracking-widest uppercase"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
