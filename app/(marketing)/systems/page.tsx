"use client";

import SystemsGrid from "@/components/home/SystemsGrid";
import PremiumHero from "@/components/ui/PremiumHero";

export default function SystemsPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <PremiumHero
                badge="The Architecture"
                title="Systems & Methods"
                description="Our model aggregates 15+ distinct astrological systems into a single cohesive analysis. We don't just look at one chart; we look at twelve."
            />

            {/* Content Container */}
            <div className="relative z-10 pb-24">
                <SystemsGrid />
            </div>
        </main>
    );
}
