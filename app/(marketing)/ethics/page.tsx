"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Scale, HeartHandshake } from "lucide-react";
import PremiumHero from "@/components/ui/PremiumHero";

const QUOTE = {
    text: "The stars incline, they do not compel.",
    author: "Claudius Ptolemy"
};

const VALUES = [
    { icon: HeartHandshake, title: "Empowerment Over Fatalism", text: "We believe the future is mutable. Our reports are designed to reveal potentials and probabilities, not fixed destinies. We strictly avoid fear-mongering.", color: "text-brand-gold", border: "border-brand-gold/20" },
    { icon: Lock, title: "Privacy as a Human Right", text: "Your birth data is biologically unique to you. We treat it with the same sanctity as medical records. Urekha never sells your profile to advertisers.", color: "text-blue-400", border: "border-blue-400/20" },
    { icon: Scale, title: "Cultural Integrity", text: "While we use modern AI, we respect the ancient traditions of Jyotish. We do not 'water down' complex concepts for mass appeal. We explain them fully.", color: "text-purple-400", border: "border-purple-400/20" },
    { icon: Shield, title: "Algorithmic Transparency", text: "We are open about our methods. Our reports clearly distinguish between calculation (astronomical fact) and interpretation (model synthesis).", color: "text-green-400", border: "border-green-400/20" }
];

export default function EthicsPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <PremiumHero
                badge="Our Values"
                title="Our Ethical Code"
                description="We navigate the delicate balance between ancient wisdom and modern technology with unwavering integrity."
            />

            <div className="container mx-auto px-6 pb-24">
                {/* Quote */}
                <div className="flex justify-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass-card inline-block px-8 py-6 rounded-2xl border border-border/50 shadow-lg text-center"
                    >
                        <p className="text-muted-foreground italic text-lg font-serif">
                            "{QUOTE.text}"
                        </p>
                        <p className="text-foreground text-sm mt-2 font-medium">— {QUOTE.author}</p>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {VALUES.map((item, i) => (
                        <motion.section
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-2xl border border-white/10 hover:border-brand-gold/30 transition-all duration-500 group"
                        >
                            <div className="flex gap-6 items-start">
                                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-secondary/50 border ${item.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-3">{item.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </main>
    );
}
