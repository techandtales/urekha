import PricingTiers from "@/components/pricing/PricingTiers";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import PremiumHero from "@/components/ui/PremiumHero";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: "Plans & Pricing | URekha — Vedic Intelligence Platform",
    description:
        "Choose from premium astrology plans for online users and offline agents. AI-powered Vedic insights, dynamic PDF reports, and scalable ecosystem access.",
};

export default async function PlansPage() {
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
        <main className="min-h-screen bg-[#050A0A] relative overflow-hidden">
            <PremiumHero
                badge="Investment"
                title="Plans & Pricing"
                description="Choose the level of cosmic depth that matches your journey — from essential insights to comprehensive life analysis."
            />

            <div className="relative z-10 pb-24 space-y-0">
                <PricingTiers
                    userPlans={userPlans || []}
                    agentPlans={agentPlans || []}
                />

                <div className="container mx-auto px-6 pt-12">
                    <ComparisonTable />
                </div>
            </div>
        </main>
    );
}
