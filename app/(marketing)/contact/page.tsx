"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { submitContactForm } from "@/app/actions/contact-actions";
import { toast } from "sonner";


/* ─── Contact Info Cards ─── */
const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "contacus@ubrainlab.com",
    href: "mailto:contacus@ubrainlab.com",
    subtext: "Response within 24 hours",
    accent: "#D4AF37",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 79037 02068",
    href: "tel:+917903702068",
    subtext: "Mon – Sat, 9 AM – 7 PM IST",
    accent: "#00FF94",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Lucknow, Uttar Pradesh, India",
    href: "https://maps.google.com/?q=Lucknow,Uttar+Pradesh,India",
    subtext: "URekha Intelligence Labs",
    accent: "#FF8C00",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const result = await submitContactForm({ name, email, message });
      
      if (result.success) {
        setIsSent(true);
        setName("");
        setEmail("");
        setMessage("");
        toast.success("Thank you! Your message has been sent successfully.");
        setTimeout(() => setIsSent(false), 5000);
      } else {
        toast.error(result.error || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      toast.error("We couldn't send your message right now. Please try again in a moment.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050A0A] relative overflow-hidden transition-colors duration-300">
      {/* ─── Hero Section (Matching /readings) ─── */}
      <section className="pt-24 pb-3 md:pt-32 md:pb-1 px-6">
        <div className="max-w-5xl mx-auto text-center">
          

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[0.95]"
          >
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00FF94] via-[#00C2FF] to-[#7e56da]">
              Touch
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-16"
          >
            Have a question, a project idea, or just want to say hello? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Subtle ambient glow */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#D4AF37]/[0.015] rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 pb-28 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* ─── Contact Channel Cards ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-14 md:mb-20">
            {CONTACT_CHANNELS.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <motion.a
                  key={ch.label}
                  href={ch.href}
                  target={ch.icon === MapPin ? "_blank" : undefined}
                  rel={ch.icon === MapPin ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.1,
                  }}
                  className="group relative rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/[0.12] shadow-sm dark:shadow-none backdrop-blur-xl p-6 md:p-7 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover corner glow */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `${ch.accent}15` }}
                  />

                  {/* Top accent strip */}
                  <div
                    className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ background: `linear-gradient(90deg, transparent, ${ch.accent}, transparent)` }}
                  />

                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-500"
                      style={{ background: `${ch.accent}10` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: ch.accent }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 dark:text-white/35 mb-1.5 transition-colors duration-300">
                        {ch.label}
                      </span>
                      <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-white/90 leading-snug truncate group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                        {ch.value}
                      </p>
                      <span className="text-[11px] text-slate-500 dark:text-white/30 mt-1 block transition-colors duration-300">
                        {ch.subtext}
                      </span>
                    </div>

                    <ArrowUpRight
                      className="w-4 h-4 text-slate-300 dark:text-white/15 group-hover:text-slate-500 dark:group-hover:text-white/40 shrink-0 mt-1 transition-colors duration-300"
                    />
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* ─── Main Content: Form + Info ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">

            {/* Left Column — Message Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 relative rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-xl overflow-hidden transition-colors duration-300"
            >
              {/* Top accent */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

              <div className="p-7 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                    <Send className="w-4.5 h-4.5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white/90 transition-colors duration-300">
                      Send a Message
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-white/30 font-mono mt-0.5 transition-colors duration-300">
                      We&apos;ll get back to you within 24 hours
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 dark:text-white/40 ml-1 transition-colors duration-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Roshan Kumar"
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/40 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] transition-all duration-300 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 dark:text-white/40 ml-1 transition-colors duration-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/40 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 dark:text-white/40 ml-1 transition-colors duration-300">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project, question, or just say hello..."
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/40 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] transition-all duration-300 text-sm resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSending || isSent}
                    className="w-full sm:w-auto group relative overflow-hidden px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-500 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2.5 border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] disabled:opacity-60"
                  >
                    {isSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#00FF94]" />
                        <span className="text-[#00FF94]">Message Sent!</span>
                      </>
                    ) : isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Right Column — Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              {/* Our Expertise */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-xl p-7 overflow-hidden relative transition-colors duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] bg-[#D4AF37]/[0.06] pointer-events-none" />
                <div className="relative z-10">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 dark:text-white/35 mb-4 transition-colors duration-300">
                    What We Build
                  </span>
                  <div className="space-y-4">
                    {[
                      { emoji: "🔭", title: "Vedic Calculation Engine", desc: "Swiss Ephemeris–powered deterministic astrology" },
                      { emoji: "🤖", title: "AI Predictions", desc: "Generative AI synthesizing celestial data" },
                      { emoji: "🖨️", title: "Hardware Integration", desc: "Bluetooth printer whitelisting for field agents" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <span className="text-lg mt-0.5 shrink-0">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white/80 transition-colors duration-300">{item.title}</p>
                          <p className="text-xs text-slate-600 dark:text-white/30 mt-0.5 transition-colors duration-300">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-xl p-7 flex-1 flex flex-col justify-between transition-colors duration-300">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse shadow-[0_0_8px_#00FF94]" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-600 dark:text-[#00FF94]/70 font-bold transition-colors duration-300">
                      Currently Available
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white/90 mb-2 transition-colors duration-300">
                    Let&apos;s Scale Your Vision
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-white/35 leading-relaxed transition-colors duration-300">
                    Open to discussing backend architecture, AI integrations, and
                    full-stack product builds. Response guaranteed within 24 hours.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.06] transition-colors duration-300">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/30 transition-colors duration-300">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/50" />
                    <span className="font-mono">Timezone: IST (UTC+5:30)</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-xl p-6 grid grid-cols-2 gap-4 transition-colors duration-300">
                <div className="text-center">
                  <p className="text-2xl font-serif font-bold text-[#D4AF37]">&lt;24h</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-white/30 uppercase tracking-wider mt-1 transition-colors duration-300">Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif font-bold text-[#00FF94]">99.9%</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-white/30 uppercase tracking-wider mt-1 transition-colors duration-300">Uptime SLA</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
