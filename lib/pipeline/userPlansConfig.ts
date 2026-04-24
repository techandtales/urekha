import { JYOTISHAM_MAPPINGS } from "./constants";

export interface UserPlanConfig {
  jyotishamSlugs: string[];
  prompts: Array<{ slug: string; name: string }>;
}

export function getUserPlanConfig(tokenCost: number): UserPlanConfig {
  const isHi = false; // Lang will be handled in orchestrator, here we just define slugs if needed

  let jyotishamSlugs: string[] = [];
  let prompts: Array<{ slug: string; name: string }> = [];

  // Core defaults across all plans
  const coreJyotisham = [
    "ascendant_report",
    "divisional_chart_D1",
    "divisional_chart_D9",
    "divisional_chart_D10",
    "divisional_chart_D30",
    "divisional_chart_D60",
    "chart_image_d1",
    "chart_image_d9",
    "chart_image_d10",
    "chart_image_d30",
    "chart_image_d60",
    "dosha_mangal",
    "dosha_kaalsarp",
    "dosha_manglik",
    "dosha_pitra"
  ];

  const corePrompts = [
    { slug: "personal-insight-1200", name: "Personal Insight" },
    { slug: "health-1200", name: "Health Analysis" },
    { slug: "education-1200", name: "Education Analysis" }
  ];

  if (tokenCost <= 20) {
    jyotishamSlugs = [...coreJyotisham];
    prompts = [...corePrompts];
  } 
  else if (tokenCost <= 50) {
    jyotishamSlugs = [
      ...coreJyotisham,
      "planet_details",
      "extended_friendship_table",
      "divisional_chart_D3",
      "divisional_chart_D7",
      "divisional_chart_D16",
      "divisional_chart_D20",
      "divisional_chart_moon",
      "chart_image_d3",
      "chart_image_d7",
      "chart_image_d16",
      "chart_image_d20",
      "chart_image_moon",
      "ashtakvarga"
    ];
    prompts = [
      ...corePrompts,
      { slug: "career-1200", name: "Career & Professional Journey" },
      { slug: "finance-1200", name: "Finance & Money Flow" },
      { slug: "love-relation-1200", name: "Love, Emotions & Relationships" }
    ];
  } 
  else {
    // 150 Credits Plan (Everything)
    jyotishamSlugs = (JYOTISHAM_MAPPINGS as any[]).map(m => m.slug);
    prompts = [
      { slug: "personal-insight-1200", name: "Personal Insight" },
      { slug: "education-1200", name: "Education Analysis" },
      { slug: "career-1200", name: "Career & Professional Journey" },
      { slug: "finance-1200", name: "Finance & Money Flow" },
      { slug: "love-relation-1200", name: "Love, Emotions & Relationships" },
      { slug: "family-relation-1200", name: "Family & Social Support" },
      { slug: "health-1200", name: "Health Analysis" },
      { slug: "challenges-1200", name: "Enemy & Challenges" },
      { slug: "spirituality-1200", name: "Spirituality" },
    ];
  }

  return { jyotishamSlugs, prompts };
}
