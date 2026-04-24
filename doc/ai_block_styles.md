# AI Prediction Block Reference & Styling Guide

This document specifies the supported content blocks for the AI prediction engine and their visual representation in the final PDF report.

## Visual Design Tokens

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Primary Font (EN)** | Helvetica | Standard PDF font |
| **Primary Font (HI)** | NotoSansDevanagari | High-fidelity Devanagari |
| **Heading Accent** | `#9F1239` (Crimson) | Used for H2 and separators |
| **Primary Text** | `#292524` (Charcoal) | High-contrast for readability |
| **Secondary Text** | `#78716C` (Stone) | Used for subtitles and sources |
| **Gold Accent** | `#C5A059` | Used for borders and highlights |

---

## Supported Blocks

### 1. `heading` (H2)
The primary section break within a category.
- **Font Size**: 16pt (EN) / 17pt (HI)
- **Color**: `#9F1239` (Crimson)
- **Styling**: Underscored with a light crimson line (`#F9D5DC`).
- **Spacing**: 15pt top margin, 8pt bottom.

### 2. `subheading` (H3)
A smaller subsection title.
- **Font Size**: 12pt (EN) / 13pt (HI)
- **Color**: `#7C2D12` (Terra Cotta)
- **Spacing**: 12pt top, 4pt bottom.

### 3. `paragraph` (P)
Standard body text. Supports **bolding** via `**text**` syntax.
- **Font Size**: 10.5pt (EN) / 11.5pt (HI)
- **Line Height**: 1.6 (EN) / 1.85 (HI)
- **Alignment**: Justified (EN) / Left (HI)

### 4. `note`
A subtle info block, usually preceded by an ℹ symbol.
- **Font Size**: 9pt (EN) / 10pt (HI)
- **Color**: `#6B7280` (Gray)
- **Padding**: 12pt left indentation.

### 5. `remark`
A highlighted observation with a vertical accent bar.
- **Label Color**: `#B8963E` (Gold)
- **Label Font**: Helvetica-Bold
- **Body Size**: 10pt (EN) / 10.5pt (HI)
- **Accent**: 2pt left border in `#B8963E`.

### 6. `table`
Structured data layout.
- **Header BG**: `#9F1239` (Crimson)
- **Header Text**: White, Bold, 9pt
- **Cell BG**: Alternating rows (Faint Tan `#FAF5F0`)
- **Cell Text**: 9pt (EN) / 9.5pt (HI)

### 7. `highlight_box`
A shaded box for critical insights or remedies.
- **Background**: `#FFFBEB` (Soft Amber)
- **Border**: 1pt Gold (`#B8963E`)
- **Header Font**: 11pt Gold, Bold

### 8. `verse` (Shloka)
Centered text for Sanskrit verses or poetic quotes.
- **Color**: `#9F1239` (Crimson)
- **Alignment**: Centered
- **Source Size**: 8pt Stone Gray

### 9. `bullet_list`
A simple list of items.
- **Bullet**: Standard dot •
- **Text Size**: 10pt (EN) / 10.5pt (HI)
- **Spacing**: 3pt gap between items.

### 10. `closing`
A summary line at the end of a section.
- **Font Size**: 11pt (EN) / 11.5pt (HI)
- **Alignment**: Centered
- **Color**: `#78716C` (Stone)

---

## Layout Rules

> [!TIP]
> **Hindi Overrides**: When `isHindi` is active, the system automatically increases font sizes by ~1pt and expands line height significantly to prevent Devanagari matras from overlapping.

> [!IMPORTANT]
> **Page Breaks**: The system uses a `PageBackground` component to ensure every new page maintains the deep crimson and gold double-border framing.

---

## AI JSON Output Schema

To trigger the rich UI components above, the AI must output a JSON object wrapped in a markdown code block. The orchestrator is designed to "salvage" this JSON even if there is conversational text before or after the code block.

### Example: Full Multi-Block Response

```json
{
  "blocks": [
    {
      "type": "heading",
      "text": "The Astral Alignment"
    },
    {
      "type": "paragraph",
      "text": "Your charts indicate a **highly favorable** period for career expansion. The alignment of Jupiter in your 10th house suggests recognition and authority."
    },
    {
      "type": "subheading",
      "text": "Professional Roadmap"
    },
    {
      "type": "bullet_list",
      "items": [
        "Focus on networking during the second lunar phase.",
        "Update technical certifications to match transit demands.",
        "Expect a transition in late October."
      ]
    },
    {
      "type": "remark",
      "label": "Architect's Insight",
      "text": "This configuration is rare and only appears once every 12 years. Seize the momentum."
    },
    {
      "type": "table",
      "caption": "Auspicious Dates for Ventures",
      "headers": ["Date", "Event", "Strength"],
      "rows": [
        ["Oct 14", "Signature", "95%"],
        ["Oct 22", "Launch", "88%"],
        ["Nov 05", "Investment", "92%"]
      ]
    },
    {
      "type": "highlight_box",
      "title": "Quantum Remedy",
      "text": "Meditate on the color Indigo tonight to align with the Saturnine frequency currently governing your finance sector."
    },
    {
      "type": "verse",
      "text": "ॐ नमः शिवाय | शुभम भवतु |",
      "source": "Shiva Purana"
    },
    {
      "type": "separator"
    },
    {
      "type": "note",
      "text": "The predictions above are based on high-precision ephemeris data calculated at the time of query."
    },
    {
      "type": "closing",
      "text": "May the stars guide your path to prosperity."
    }
  ],
  "keywords": ["Career", "Success", "Alchemy"]
}
```

### Technical Requirements for AI
1. **Always wrap in ` ```json ` blocks.**
2. **Escape double quotes** inside text strings (e.g., `\"`).
3. **Use 	`\n`** for line breaks within a paragraph if needed.
4. **Bold text** should use standard markdown `**` inside the `text` field.
5. **Types are case-sensitive**: use all lowercase (e.g., `highlight_box` not `HighlightBox`).
