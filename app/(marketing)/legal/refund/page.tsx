import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund Policy | Urekha",
    description: "Details on refunds, returns, and cancellations.",
};

export default function RefundPolicyPage() {
    return (
        <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-8">Refund & Return Policy</h1>
            <p className="text-muted-foreground mb-12">Last Updated: January 2026</p>

            <div className="space-y-8 text-foreground/80 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">1. Digital Products</h2>
                    <p>
                        Due to the immediate nature of digital report generation, <strong>all sales of digital PDF reports are final</strong> once the file has been generated and the download link provided.
                    </p>
                    <p className="mt-4">
                        Exceptions are made ONLY in the following cases:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Technical Failure:</strong> The report failed to generate or is blank/corrupted.</li>
                        <li><strong>Data Error:</strong> The system calculated the chart for a completely different time/place than what was input (system bug).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">2. Physical Products</h2>
                    <p>
                        For hardcover printed books:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Damage during Shipping:</strong> If your book arrives damaged, send us a photo within 48 hours of delivery. We will reprint and ship a replacement at no cost.</li>
                        <li><strong>Printing Errors:</strong> If the book has missing pages or print defects, we will provide a full free replacement.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">3. Satisfaction Policy</h2>
                    <p>
                        Astrology is interpretive. Dissatisfaction with the <em>content</em> of the reading (e.g., "I don't like my prediction") is not grounds for a refund.
                        However, our support team is happy to help explain any part of the report you find confusing.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">4. Requesting a Refund</h2>
                    <p>
                        To initiate a request, email <strong>support@urekha.com</strong> with your Order ID and a description of the issue. We typically respond within 24 hours.
                    </p>
                </section>
            </div>
        </main>
    );
}
