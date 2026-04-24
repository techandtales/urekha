"use client";

import { useState } from "react";
import {
  Mail,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ARTICLES = [
  {
    id: "1",
    title: "The Pluto Return: Transforming Global Structures",
    excerpt:
      "As Pluto returns to the exact position it held during the establishment of modern geopolitical foundations, we analyze the seismic shifts occurring in global finance and power dynamics.",
    category: "Mundane Astrology",
    date: "March 15, 2026",
    readTime: "8 min read",
    image: "/slide6.png", // Reusing existing assets for now
    featured: true,
  },
  {
    id: "2",
    title: "Navigating the Mercury-Uranus Square",
    excerpt:
      "Expect sudden breakthroughs and electrical disruptions in communication as Mercury squares Uranus. A technical guide to surviving this volatile transit without losing your data.",
    category: "Transit Alerts",
    date: "March 12, 2026",
    readTime: "4 min read",
    image: "/slide4.png",
  },
  {
    id: "3",
    title: "Venus in Pisces: The Exaltation of Infinite Love",
    excerpt:
      "Venus reaches its highest spiritual expression in Pisces. Discover how this transit dissolves boundaries in relationships and opens channels for profound artistic inspiration.",
    category: "Weekly Forecast",
    date: "March 08, 2026",
    readTime: "6 min read",
    image: "/slide2.png",
  },
  {
    id: "4",
    title: "Decoding the Saturn-Neptune Conjunction",
    excerpt:
      "When reality meets illusion. We unpack the upcoming Saturn-Neptune conjunction and its historical correlation with dissolving borders and redefined societal structures.",
    category: "Deep Dive",
    date: "March 01, 2026",
    readTime: "12 min read",
    image: "/slide5.png",
  },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      alert("Successfully subscribed to the Urekha Newsletter!");
    }, 1000);
  };

  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const gridArticles = ARTICLES.filter((a) => !a.featured);

  return (
    <main className="min-h-screen bg-background relative pt-24 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold/5 via-background to-background" />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -30 }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px]"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -30 }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 3,
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]"
        />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        {/* Hero / Subscribe Section */}
        <section className="py-16 md:py-24 max-w-4xl mx-auto text-center space-y-8 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mx-auto"
          >
            <Sparkles className="w-3 h-3" />
            <span>Transmission Log</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight"
          >
            The Cosmic{" "}
            <span className="bg-gradient-to-r from-brand-gold to-[#F2C94C] bg-clip-text text-transparent">
              Intelligence
            </span>{" "}
            Brief
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Read the latest astrological research, transit alerts, and deep-dive
            planetary analysis from the Urekha data team.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            onSubmit={handleSubmit}
            className="relative max-w-md mx-auto pt-4 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold via-white to-brand-gold rounded-full opacity-0 group-focus-within:opacity-20 blur transition duration-500" />
            <div className="relative flex items-center p-1.5 rounded-full glass-card border border-white/10 bg-black/50 backdrop-blur-xl">
              <div className="pl-4 pr-2 text-white/50">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Subscribe for weekly alerts..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 placeholder:text-white/30 truncate"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-full bg-white text-black font-bold tracking-widest uppercase text-[10px] hover:bg-brand-gold transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? "Syncing..." : "Subscribe"}
              </button>
            </div>
          </motion.form>
        </section>

        {/* Featured Article */}
        <section className="py-16">
          <h2 className="text-sm font-bold tracking-[0.3em] text-brand-gold uppercase mb-8">
            Featured Transmission
          </h2>
          <Link
            href={`/newsletter/${featuredArticle.id}`}
            className="block group"
          >
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-brand-gold/30 transition-colors duration-500">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 glass-nav px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-white">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>
              <div className="space-y-6 md:pr-8">
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    {featuredArticle.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-gold" />
                    {featuredArticle.readTime}
                  </div>
                </div>
                <h3 className="text-3xl lg:text-5xl font-serif text-white group-hover:text-brand-gold transition-colors duration-300 leading-tight">
                  {featuredArticle.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase text-brand-gold pt-4">
                  Read Analysis{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Article Grid */}
        <section className="py-16 border-t border-white/5 mt-8 articles-grid">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-sm font-bold tracking-[0.3em] text-white uppercase">
              Latest Dispatches
            </h2>
            <button className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white uppercase flex items-center gap-1 transition-colors">
              View Archives <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article, i) => (
              <Link key={article.id} href={`/newsletter/${article.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                  className="article-card group flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-brand-gold/20 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground mb-4">
                      <span>{article.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3 group-hover:text-brand-gold transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-xs font-bold tracking-widest uppercase text-white group-hover:text-brand-gold transition-colors">
                      Read{" "}
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
