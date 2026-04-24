/** A single typed content block — the AI returns an array of these */
export type ContentBlock =
  | { type:"summary"; text: string }
  | { type: "heading";        text: string }
  | { type: "subheading";     text: string }
  | { type: "paragraph";      text: string }
  | { type: "note";           text: string }
  | { type: "remark";         label: string; text: string }
  | { type: "table";          caption?: string; headers: string[]; rows: string[][] }
  | { type: "highlight_box";  title: string; text: string }
  | { type: "verse";          text: string; source?: string }
  | { type: "bullet_list";    items: string[] }
  | { type: "separator" }
  | { type: "closing";        text: string };

/** Top-level response returned by the AI */
export interface PredictionJSONResponse {
  blocks: ContentBlock[];
  keywords: string[];
}
