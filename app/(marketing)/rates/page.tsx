import PremiumHero from "@/components/ui/PremiumHero";
import PricingTiers from "@/components/pricing/PricingTiers";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const FAQS = [
  {
    q: "How are the report prices calculated?",
    a: "Our pricing reflects the depth of planetary computation required. Complete Lifecycle Predictors involve 18+ divisional charts and 120-year dasha mapping."
  },
  {
    q: "Do I get a physical print of the report?",
    a: "Yes, our 'The Destiny' tier includes a premium hardcover physical bind of your report, delivered globally. Other tiers include high-definition digital PDFs."
  },
  {
    q: "Are the payments secure?",
    a: "Absolutely. We use enterprise-grade encryption and secure payment gateways. No sensitive financial data is stored on our servers."
  }
];

export default async function RatesPage() {
  const supabase = await createClient();

  // Fetch user pricing plans
  const { data: userPlans } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("target_audience", "user")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

  // Fetch agent pricing plans
  const { data: agentPlans } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("target_audience", "agent")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050A0A] relative overflow-hidden pb-24 transition-colors duration-300">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/60 to-slate-50 dark:from-[#050A0A]/0 dark:via-[#050A0A]/60 dark:to-[#050A0A] transition-colors duration-300" />
      </div>

      <div className="relative z-10">
        <PremiumHero 
          badge="Investment & Value"
          title="Transparent Pricing"
          description="Access elite astrological intelligence without ambiguity. Choose the depth of cosmic insight that fits your path."
        />
      </div>

      <div className="relative z-10 mt-[-80px]">
        <PricingTiers userPlans={userPlans || []} agentPlans={agentPlans || []} />
      </div>

      {/* Additional FAQ / Support Section */}
      <div className="container mx-auto px-6 mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-4 transition-colors duration-300">Billing Inquiries</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <h4 className="text-slate-800 dark:text-white font-medium mb-3 flex items-start gap-3 transition-colors duration-300">
                    <HelpCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                    {faq.q}
                  </h4>
                  <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed pl-8 transition-colors duration-300">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-3xl p-10 flex flex-col justify-between transition-colors duration-300">
              <div>
                <MessageCircle className="w-10 h-10 text-brand-gold mb-6" />
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3 transition-colors duration-300">Custom Enterprise Tiers</h3>
                <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors duration-300">
                  For institutions, media agencies, or high-volume practitioners, we offer specialized API access and volume-based licensing packages.
                </p>
              </div>
              
              <Link href="/contact" className="mt-8 flex items-center justify-between group text-slate-900 dark:text-white font-medium text-sm transition-colors duration-300">
                Get Personalized Quote
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-white flex items-center justify-center group-hover:bg-brand-gold group-hover:text-[#050A0A] transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
