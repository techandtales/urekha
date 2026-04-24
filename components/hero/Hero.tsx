import HeroSlider from "./HeroSlider";



export default function Hero() {
    return (
        <section className="relative h-[calc(100vh-2rem)] w-[calc(100%-2rem)] mt-4 mx-4 mb-4 rounded-[2rem] overflow-hidden shadow-2xl" id="hero-section">
            <HeroSlider />
            {/* Top Gradient for seamless Navbar Tab blend - Stronger to ensure black match */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0C0A09] via-[#0C0A09]/70 to-transparent pointer-events-none z-40" />
        </section>
    );
}
