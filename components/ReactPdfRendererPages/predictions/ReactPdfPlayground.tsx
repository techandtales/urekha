import React, { useMemo } from "react";
import ReactPdfCoverPage from "@/components/ReactPdfRendererPages/ReactPdfCoverPage";
import ReactPdfIntroPage from "@/components/ReactPdfRendererPages/ReactPdfIntroPage";
import ReactPdfIndexPage from "@/components/ReactPdfRendererPages/ReactPdfIndexPage";
import ReactPdfHowToReadKundliPage from "@/components/ReactPdfRendererPages/ReactPdfHowToReadKundliPage";
import ReactPdfBirthDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfBirthDetailsPage";
import ReactPdfReportGuidePage from "@/components/ReactPdfRendererPages/ReactPdfReportGuidePage";
import ReactPdfLagnaProfilePage from "@/components/ReactPdfRendererPages/ReactPdfLagnaProfilePage";
import ReactPdfPlanetaryDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfPlanetaryDetailsPage";
import ReactPdfFriendshipPage from "@/components/ReactPdfRendererPages/ReactPdfFriendshipPage";
import ReactPdfKpPlanetsPage from "../ReactPdfKpPlanetsPage";
import ReactPdfKpHousesPage from "@/components/ReactPdfRendererPages/ReactPdfKpHousesPage";
import ReactPdfKpSignificatorsPage from "@/components/ReactPdfRendererPages/ReactPdfKpSignificatorsPage";
import ReactPdfDivisionalChartsPage from "@/components/ReactPdfRendererPages/ReactPdfDivisionalChartsPage";
import ReactPdfAshtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfAshtakavargaPage"; 
import ReactPdfSarvashtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfSarvashtakavargaPage";
import ReactPdfVimshottariDashaPage from "@/components/ReactPdfRendererPages/ReactPdfVimshottariDashaPage";
import ReactPdfDoshaReportPage from "@/components/ReactPdfRendererPages/ReactPdfDoshaReportPage";
import ReactPdfYoginiDashaPage from "@/components/ReactPdfRendererPages/ReactPdfYoginiDashaPage";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import { useSvgToPng, DUMMY_SVG } from "@/utils/svgToPng";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

const pt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    paddingTop: pt(14),
    paddingBottom: pt(25),
    paddingHorizontal: pt(16),
    backgroundColor: "#EAE0C8",
    fontFamily: "Helvetica",
  },
  outerBorder: {
    position: "absolute",
    top: pt(8),
    left: pt(8),
    right: pt(8),
    bottom: pt(8),
    borderWidth: 2.5,
    borderColor: "#8A1A2F",
    opacity: 0.85,
  },
  innerBorder: {
    position: "absolute",
    top: pt(10.5),
    left: pt(10.5),
    right: pt(10.5),
    bottom: pt(10.5),
    borderWidth: 1,
    borderColor: "#D4AF37",
    opacity: 0.6,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: pt(10),
    marginBottom: pt(10),
  },
  headerLabel: {
    fontSize: 8,
    color: "#B8963E",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  headerSymbol: { fontSize: 22, color: "#9F1239", marginBottom: 5 },
  headerTitle: {
    fontSize: 21,
    color: "#1C1917",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#78716C",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  crimsonRule: {
    width: pt(55),
    height: 1.5,
    backgroundColor: "#9F1239",
    opacity: 0.6,
    marginBottom: 4,
  },
  goldRule: {
    width: pt(40),
    height: 0.75,
    backgroundColor: "#B8963E",
    opacity: 0.4,
  },
  h2: {
    fontSize: 18,
    color: "#9F1239",
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#F9D5DC",
    paddingBottom: 4,
  },
  h3: { fontSize: 13, color: "#7C2D12", marginTop: 12, marginBottom: 4 },
  p: {
    fontSize: 10.5,
    color: "#292524",
    marginBottom: 8,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  bold: { fontFamily: "Helvetica-Bold", color: "#9F1239" },
  footer: {
    position: "absolute",
    bottom: pt(18),
    left: pt(22),
    right: pt(22),
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(184, 150, 62, 0.4)",
    paddingTop: pt(3),
  },
  footerText: {
    fontSize: 8,
    color: "#A8A29E",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});

const PageBackground = () => (
  <>
    <View fixed style={styles.outerBorder} />
    <View fixed style={styles.innerBorder} />

    <View fixed style={styles.footer}>
      <Text style={styles.footerText}>UREKHA • Vedic Intelligence</Text>
      <Text style={styles.footerText}>www.urekha.com</Text>
    </View>
  </>
);

function renderParagraphElements(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={`${keyPrefix}-b${idx}`} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={`${keyPrefix}-t${idx}`}>{part}</Text>;
  });
}

function renderMarkdownBlocks(raw: string) {
  const nodes = [];
  const lines = raw.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      nodes.push(
        <Text key={`h2-${i}`} style={styles.h2}>
          {line.slice(3)}
        </Text>,
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <Text key={`h3-${i}`} style={styles.h3}>
          {line.slice(4)}
        </Text>,
      );
      i++;
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    const combined = paraLines.join(" ");
    nodes.push(
      <Text key={`p-${i}`} style={styles.p}>
        {renderParagraphElements(combined, `p-${i}`)}
      </Text>,
    );
  }
  return nodes;
}

const DUMMY_DATA = `
## The Cosmic Blueprint of Your Life
At the precise moment of your birth, the cosmic bodies were arranged in a unique configuration. This snapshot of the heavens is your Kundli, a divine blueprint that outlines your path, potential, and purpose. It is within this intricate web of planetary alignments that your soul's journey is mapped.

The Sun, representing your core essence and ego, was positioned in a way that illuminates your inherent strengths, while the Moon, reflecting your emotional landscape, reveals your deepest needs and instinctual reactions. The rising sign, or Ascendant, dictates the mask you wear and the primary way you engage with the world.

### Ascendant Dynamics
Your Ascendant sets the stage for your life's narrative. It influences your physical appearance, your initial approach to new situations, and the overall trajectory of your personal development. The ruler of your Ascendant acts as the captain of your ship, guiding you through the ebbs and flows of existence. Its placement and condition in the chart provide profound insights into your vitality and life force.

When the planets interact through aspects and conjunctions, they weave a complex tapestry of traits and tendencies. **A harmonious aspect between Venus and Jupiter**, for instance, may bestow a natural charm and a propensity for attracting abundance, while a challenging aspect between Mars and Saturn could indicate areas where you must cultivate patience and resilience.

## Professional Trajectory and Ambitions
The tenth house of your Kundli governs your career, public standing, and professional aspirations. The planets positioned here, along with the sign on the cusp, offer a window into your vocational calling. Whether you are destined for leadership, creative expression, or service to others, this area of the chart highlights the domains where you can leave a lasting impact.

The influence of Saturn in relation to the tenth house signifies the dedication, discipline, and hard work required to bring your goals to fruition. It reminds you that true success is often built on a foundation of perseverance and a willingness to overcome obstacles. **Jupiter's placement**, on the other hand, indicates where you may find natural expansion, luck, and opportunities for growth in your professional life.

It is important to consider the dignity and strength of the planets involved in your career house. A well-placed Sun suggests a natural inclination towards authority and recognition, while a prominent Mercury may indicate a career in communication, commerce, or analytical pursuits.

### Financial Prospects and Wealth Acqusition
The second and eleventh houses are central to your financial well-being and material resources. The second house reflects your earning potential, your values, and your relationship with money and possessions. The eleventh house governs your gains, hopes, and the financial rewards that come from your professional endeavors.

Planets residing in these houses, as well as the condition of their ruling planets, provide a comprehensive picture of your financial landscape. A strong Venus can attract comfort and luxury, while a well-supported Jupiter often brings broader financial growth and benevolence. However, challenging planetary alignments in these areas may indicate periods of financial instability or the need for careful resource management.

## Interpersonal Connections and Partnerships
The seventh house of your Kundli is the realm of partnerships, marriage, and significant relationships. It reveals the qualities you seek in a partner and the nature of your interactions with others. The sign on the descendant and any planets located in the seventh house offer insights into the dynamics of your close relationships.

A harmonious seventh house suggests a natural ability to form balanced and mutually supportive partnerships. However, if challenging planets like Saturn or Mars are placed here, it may indicate a need to navigate conflicts or learn important lessons regarding compromise and boundaries.

**Venus, the natural significator of love and harmony**, plays a crucial role in evaluating your capacity for affection and the quality of your romantic connections. Its placement by sign and house, along with its aspects, reveals your approach to love and what you value in a partner.

### Family Dynamics and Domestic Life
The fourth house represents your roots, family history, and psychological foundations. It reflects your home environment, your relationship with your mother, and your sense of emotional security. A well-fortified fourth house indicates a supportive and nurturing upbringing, providing a strong base from which to explore the world.

The Moon's condition is intertwined with the themes of the fourth house, as it governs the emotional realm and the maternal figure. A dignified Moon suggests emotional stability and a strong connection to one's roots, while an afflicted Moon may indicate emotional fluctuations or challenges related to the home front.

## Spiritual Evolution and Inner Calling
Beyond the material and interpersonal realms, your Kundli offers profound insights into your spiritual journey and the deeper purpose of your incarnation. The ninth and twelfth houses are particularly significant in this regard.

The ninth house represents higher learning, philosophy, and the search for meaning. It governs your belief systems, your relationship with mentors or gurus, and your inclination towards spiritual exploration. A prominent ninth house suggests a lifelong quest for wisdom and a desire to understand the deeper universal truths.

The twelfth house is the realm of the subconscious, hidden matters, and ultimate liberation (Moksha). It represents the aspects of your life that remain veiled, your solitary pursuits, and your connection to the divine. Planets in the twelfth house may point towards periods of seclusion, introspective practices, or a calling to serve humanity selflessly.

### Overcoming Karmic Patterns
Throughout your life, you will encounter various planetary periods, known as Dashas, which activate specific potentials and challenges outlined in your chart. These periods are not merely predetermined events but rather opportunities for growth and the resolution of karmic patterns.

By understanding the nature of the active Dasha, you can navigate life's transitions with greater awareness and intention. **A challenging Saturn period**, for example, may demand hard work and restructuring, while a favorable Jupiter Dasha could bring expansion and new opportunities.

Your Kundli is a dynamic map, revealing the interplay of forces that shape your existence. By embracing its wisdom, you can align with your true purpose, cultivate your strengths, and navigate challenges with grace and resilience. Remember that the stars incline, but they do not compel; your free will and conscious choices remain the ultimate arbiters of your destiny.

This multi-page document serves as a demonstration of the automatic page-breaking capabilities of the React-PDF renderer. As the narrative continues to unfold, expanding upon the intricate details of Vedic astrology, the text naturally flows from one page to the next, constrained gracefully by the golden borders that frame the celestial wisdom. The layout engine calculates the precise moment when the text overflows the available space, orchestrating a seamless transition to a new page, complete with the designated header, footer, and the ever-present golden margins.

The seamless rendering of content ensures that the reader's experience remains uninterrupted, allowing for a deep immersion into the astrological analysis. Whether it is a detailed breakdown of planetary periods, an exploration of divisional charts, or a comprehensive synthesis of the overall life path, the text adapts to the continuous flow, demonstrating the robust capabilities of the underlying technology.

In conclusion, this test successfully validates the integration of the React-PDF library, confirming its ability to handle extensive, multi-page documents with elegance and precision. The golden borders serve as a testament to the meticulous attention to detail, ensuring that the visual presentation of the report aligns perfectly with the brand's aesthetic standards. The cosmic journey, as mapped in the Kundli, is now ready to be presented in a format that is both informative and visually captivating.
`.repeat(3); // Repeat the text to ensure it spans at least 4 pages

export default function ReactPdfPlayground() {
  const dummyPng = useSvgToPng(DUMMY_SVG);

  // Memoize the entire document so that the parent's rapid re-renders (e.g. from the live clock)
  // don't force the PDFViewer to rebuild the blob iframe every second.
  const pdfDocument = useMemo(
    () => (
      <Document title="PDF Playground" author="Urekha">
        <ReactPdfCoverPage lang="en" />
        <ReactPdfIntroPage lang="en" />
        <ReactPdfIndexPage lang="en" />
        <ReactPdfHowToReadKundliPage lang="en" />
        <ReactPdfBirthDetailsPage lang="en" />
        <ReactPdfReportGuidePage lang="en" />
        <ReactPdfLagnaProfilePage lang="en" />
        <ReactPdfPlanetaryDetailsPage lang="en" />
        <ReactPdfFriendshipPage lang="en" />
        <ReactPdfKpPlanetsPage lang="en" />
        <ReactPdfKpHousesPage lang="en" />
        <ReactPdfKpSignificatorsPage lang="en" />
        <ReactPdfDivisionalChartsPage lang="en" dummyImage={dummyPng} />
        <ReactPdfAshtakavargaPage lang="en" />
        <ReactPdfSarvashtakavargaPage lang="en" />
        <ReactPdfVimshottariDashaPage lang="en" />
        <ReactPdfDoshaReportPage lang="en" />
        <ReactPdfYoginiDashaPage lang="en" />

        <Page size="A4" style={styles.page}>
          <PageBackground />

          <View style={styles.headerContainer}>
            <Text style={styles.headerLabel}>✦ Vedic Astrology Insight ✦</Text>
            <Text style={styles.headerSymbol}>☸</Text>
            <Text style={styles.headerTitle}>Lifelong Overview</Text>
            <Text style={styles.headerSubtitle}>
              Destiny • Purpose • Soul Map
            </Text>
            <View style={styles.crimsonRule} />
            <View style={styles.goldRule} />
          </View>

          <View>{renderMarkdownBlocks(DUMMY_DATA)}</View>
        </Page>
      </Document>
    ),
    [dummyPng],
  );

  return (
    <div className="w-full mt-6 flex flex-col items-center animate-in fade-in zoom-in duration-500">
      <div className="bg-white/[0.02] border border-brand-gold/20 p-6 rounded-2xl shadow-2xl w-full max-w-4xl text-center mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent pointer-events-none" />
        <h2 className="text-2xl font-bold font-serif text-brand-gold mb-2 uppercase tracking-widest relative z-10">
          PDF Playground (Auto Page Breaks)
        </h2>
        <p className="text-white/60 text-sm max-w-2xl mx-auto relative z-10">
          This viewer demonstrates how content automatically overflows to a new
          A4 page when it runs out of space. The outer and inner golden borders
          are implemented natively inside React-PDF and map identically to every
          new document page automatically.
        </p>
      </div>

      <PDFViewer
        style={{ width: "100%", height: "900px", maxWidth: "210mm" }}
        className="border-4 border-[#1c1c1c] rounded-xl shadow-2xl"
      >
        {pdfDocument}
      </PDFViewer>
    </div>
  );
}
