"use client";

import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import PredictionPageLayout from "../ui/PredictionPageLayout";

// ─────────────────────────────────────────────────────
// Markdown → React nodes  (1 node = 1 DOM element for measurement)
// ─────────────────────────────────────────────────────
function parseBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-b${idx}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function parseMarkdown(raw: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = raw.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${i}`} className="prediction-h2">
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${i}`} className="prediction-h3">
          {line.slice(4)}
        </h3>,
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
      <p key={`p-${i}`} className="prediction-p">
        {parseBold(combined, `p-${i}`)}
      </p>,
    );
  }

  return nodes;
}

// ─────────────────────────────────────────────────────
// Content area heights for overflow detection
//
// A4 total: 297mm.
// First page:    297 - 74mm(full header) - 30mm(footer+pad) - 6mm(body-pad) = 187mm
// Continuation:  297 - 46mm(compact header) - 30mm(footer+pad) - 6mm(body-pad) = 215mm
// ─────────────────────────────────────────────────────
const MM = 3.7795; // px per 1mm at 96dpi
const FIRST_PAGE_H = 187 * MM; // ~707px
const CONTINUE_PAGE_H = 215 * MM; // ~813px

// ─────────────────────────────────────────────────────
// Auto-paging component for a single prediction category
//
// Strategy:
//  1. Render all nodes into a hidden off-screen div with the exact
//     content-area width & font settings.
//  2. After paint (useLayoutEffect), walk the DOM children and
//     accumulate their rendered heights.
//  3. When the next element would exceed the page boundary, start
//     a new page group.
//  4. Re-render: one PredictionPageLayout per page group.
// ─────────────────────────────────────────────────────
function PredictionAutoPage({
  category,
  lang,
  data,
}: {
  category: string;
  lang: "en" | "hi";
  data: string;
}) {
  const nodes = useMemo(() => parseMarkdown(data), [data]);
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<React.ReactNode[][] | null>(null);

  useLayoutEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const pageGroups: React.ReactNode[][] = [];
    let currentGroup: React.ReactNode[] = [];
    let accumulated = 0;
    let isFirst = true;

    children.forEach((child, idx) => {
      const style = getComputedStyle(child);
      const h =
        child.offsetHeight +
        parseFloat(style.marginTop || "0") +
        parseFloat(style.marginBottom || "0");

      const limit = isFirst ? FIRST_PAGE_H : CONTINUE_PAGE_H;

      if (accumulated + h > limit && currentGroup.length > 0) {
        // This element overflows → push current page, start next
        pageGroups.push([...currentGroup]);
        currentGroup = [nodes[idx]];
        accumulated = h;
        isFirst = false;
      } else {
        currentGroup.push(nodes[idx]);
        accumulated += h;
      }
    });

    if (currentGroup.length > 0) pageGroups.push(currentGroup);
    setPages(pageGroups.length > 0 ? pageGroups : [nodes]);
  }, [data, nodes]);

  return (
    <>
      {/*
        Hidden measurement sandbox — exact same font/size/width as the
        body area inside PredictionPageLayout (178mm = 210mm - 2×16mm padding).
        position:fixed keeps it out of document flow but still laid out.
      */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: "178mm",
          fontSize: "10.5pt",
          lineHeight: "1.9",
          wordSpacing: "0.04em",
          letterSpacing: "0.01em",
          fontFamily: "var(--font-lato), var(--font-hindi-sans), sans-serif",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {nodes}
      </div>

      {/* Render all page groups — or the raw nodes before measurement completes */}
      {(pages ?? [nodes]).map((pageNodes, idx) => (
        <PredictionPageLayout
          key={`${category}-p${idx}`}
          lang={lang}
          category={category}
          isContinuation={idx > 0}
          pageNumber={idx > 0 ? idx + 1 : undefined}
        >
          {pageNodes}
        </PredictionPageLayout>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────
export default function PredictionsView() {
  const { birthDetails, jyotishamData } = useStore();
  const lang = birthDetails.language || "en";
  const predictions = jyotishamData.predictions;

  const predictionCategories = Object.keys(predictions);
  const hasPredictions = predictionCategories.some(
    (cat) => predictions[cat]?.status === "success" && predictions[cat]?.data,
  );

  if (!hasPredictions) return null;

  return (
    <>
      {predictionCategories.map((cat) => {
        const pred = predictions[cat];
        if (pred?.status !== "success" || !pred.data) return null;

        return (
          <PredictionAutoPage
            key={cat}
            category={cat}
            lang={lang as "en" | "hi"}
            data={pred.data}
          />
        );
      })}
    </>
  );
}
