import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const planId = req.nextUrl.searchParams.get("planId");
    if (!planId) return NextResponse.json({ error: "No planId" }, { status: 400 });

    const supabase = await createClient();
    const { data: prompts, error } = await supabase
      .from("pricing_plan_prompts")
      .select("display_order, prompts(*)")
      .eq("plan_id", planId)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[Prompts API] Error fetching:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedPrompts = prompts.map((p: any) => ({
      slug: p.prompts.slug,
      name: p.prompts.name,
      template: p.prompts.prompt_template,
      templateHi: p.prompts.prompt_template_hi,
      inputCodes: p.prompts.input_data_codes,
      wordCount: p.prompts.word_count_target
    }));

    return NextResponse.json({ success: true, prompts: formattedPrompts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
