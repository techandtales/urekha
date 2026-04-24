import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Urekha",
    description: "Data protection and privacy standards for Urekha Intelligence.",
};

export default function PrivacyPage() {
    return (
        <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last Updated: January 2026</p>

            <div className="space-y-8 text-foreground/80 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">1. Data Collection & Usage</h2>
                    <p>
                        Urekha ("we", "our", "platform") collects precise birth data (Date, Time, Location) solely for the purpose of generating astrological calculations.
                        This data is processed by our AI algorithms to construct your chart. <strong>We do not sell, trade, or analyze your birth data for targeted advertising purposes.</strong>
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">2. AI Processing & Storage</h2>
                    <p>
                        Your report is generated using automated Artificial Intelligence systems. While we store your report to allow you to download or view it,
                        we implement strict retention policies. You may request the permanent deletion of your data and generated reports at any time by contacting support.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">3. Payment Information</h2>
                    <p>
                        We utilize strict PCI-DSS compliant third-party payment processors (e.g., Stripe, Razorpay). Urekha does not store your credit card or banking information on our servers.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">4. Third-Party Sharing</h2>
                    <p>
                        We do not share your personal information with third parties except as necessary to provide the service (e.g., shipping partners for physical reports, cloud infrastructure providers).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">5. Security</h2>
                    <p>
                        We employ industry-standard encryption (TLS/SSL) for data in transit and at rest. However, no method of transmission over the Internet is 100% secure.
                    </p>
                </section>
            </div>
        </main>
    );
}
