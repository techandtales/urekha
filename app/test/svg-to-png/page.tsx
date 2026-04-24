"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { socket } from "@/lib/socketio/client";
import dynamic from "next/dynamic";

// ─── Dynamic imports (SSR-unsafe react-pdf) ──────────────────────────────────
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => <div className="text-white/40 text-sm p-4">Loading PDF engine…</div> }
);
const SvgChartPdfDoc = dynamic(
  () => import("@/components/ReactPdfRendererPages/ReactPdfSvgChartTestPage"),
  { ssr: false }
);

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "idle" | "running" | "success" | "error" | "skipped";
type Phase = "idle" | "socket" | "http" | "waiting" | "converting" | "done" | "error";

interface LogEntry {
  id: number;
  time: string;
  status: "info" | "success" | "error" | "warn";
  message: string;
}

interface TestState {
  phase: Phase;
  steps: {
    roomConnected: StepStatus;
    httpSent: StepStatus;
    httpResponse: StepStatus;
    waitingSocket: StepStatus;
    socketReceived: StepStatus;
    ackSent: StepStatus;
    converting: StepStatus;
  };
  logs: LogEntry[];
  roomId: string | null;
  httpStatus: number | null;
  svgRaw: string | null;
  pngDataUrl: string | null;
  svgFetchMs: number | null;   // time for full socket round-trip
  pngConvertMs: number | null; // time for sharp conversion
}

interface ChartCase {
  id: string;
  label: string;
  /** Slug sent to POST /jyotisham/:slug — matches the backend route */
  slug: string;
  isTransit: boolean;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4040";

const TRANSIT_DATE = "12/04/2026";
const TRANSIT_TIME = "20:00";

const BASE_PAYLOAD = {
  date: "15/01/1996",
  time: "14:30",
  latitude: 25.5941,
  longitude: 85.1376,
  tz: 5.5,
  lang: "en",
  style: "north",
  colored_planets: true,
  color: "#7B1818",
};

// Each slug matches exactly a route registered on the backend: POST /jyotisham/:slug
// These are the same slugs used in the existing /test/jyotisham test page.
const CHART_CASES: ChartCase[] = [
  { id: "d1",    label: "D1 – Birth Chart (Lagna)",  slug: "chart_image_D1",           isTransit: false },
  { id: "d9",    label: "D9 – Navamsha",             slug: "chart_image_D9",           isTransit: false },
  { id: "d10",   label: "D10 – Dashamsha",           slug: "chart_image_D10",          isTransit: false },
  { id: "moon",  label: "Moon Chart",                slug: "chart_image_moon",         isTransit: false },
  { id: "d3",    label: "D3 – Dreshkanna",           slug: "chart_image_D3",           isTransit: false },
  { id: "transit", label: "Transit Chart (Now)",     slug: "transit_chart",         isTransit: true  },
];

// ─── Init state ──────────────────────────────────────────────────────────────

const INIT_STEPS = {
  roomConnected: "idle" as StepStatus,
  httpSent:      "idle" as StepStatus,
  httpResponse:  "idle" as StepStatus,
  waitingSocket: "idle" as StepStatus,
  socketReceived:"idle" as StepStatus,
  ackSent:       "idle" as StepStatus,
  converting:    "idle" as StepStatus,
};

const INIT_STATE: TestState = {
  phase: "idle",
  steps: INIT_STEPS,
  logs: [],
  roomId: null,
  httpStatus: null,
  svgRaw: null,
  pngDataUrl: null,
  svgFetchMs: null,
  pngConvertMs: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowStr() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" } as any);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepRow({ label, status }: { label: string; status: StepStatus }) {
  const icon = {
    idle:    <span className="text-white/20">○</span>,
    running: <svg className="w-3.5 h-3.5 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" /></svg>,
    success: <span className="text-emerald-400">✓</span>,
    error:   <span className="text-red-400">✕</span>,
    skipped: <span className="text-white/20">—</span>,
  };
  const color = { idle: "text-white/25", running: "text-cyan-300", success: "text-emerald-300", error: "text-red-300", skipped: "text-white/20" };
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-4 flex justify-center shrink-0">{icon[status]}</span>
      <span className={`text-xs font-mono ${color[status]}`}>{label}</span>
    </div>
  );
}

function LogFeed({ logs }: { logs: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs.length]);
  const badge = { info: "border-white/20 text-white/40", success: "border-emerald-500/40 text-emerald-400", error: "border-red-500/40 text-red-400", warn: "border-amber-500/40 text-amber-400" };
  const text  = { info: "text-white/55",  success: "text-emerald-300", error: "text-red-300", warn: "text-amber-300" };
  return (
    <div ref={ref} className="h-44 overflow-y-auto space-y-1 font-mono text-[11px] pr-1" style={{ scrollbarWidth: "thin" }}>
      {logs.length === 0 && <div className="text-white/20 italic text-center py-6">Run test to see activity log…</div>}
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-2">
          <span className="text-white/25 shrink-0">{l.time}</span>
          <span className={`shrink-0 border rounded px-1 text-[9px] font-bold uppercase ${badge[l.status]}`}>{l.status}</span>
          <span className={`flex-1 leading-relaxed break-all ${text[l.status]}`}>{l.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Test Card ────────────────────────────────────────────────────────────────

function TestCard({ chartCase }: { chartCase: ChartCase }) {
  const [state, setState] = useState<TestState>(INIT_STATE);
  const [showSvg, setShowSvg] = useState(false);
  const [showPng, setShowPng] = useState(false);
  const idRef = useRef(0);

  const log = useCallback((status: LogEntry["status"], message: string) => {
    setState((prev) => ({ ...prev, logs: [...prev.logs, { id: idRef.current++, time: nowStr(), status, message }] }));
  }, []);

  const setStep = useCallback((key: keyof TestState["steps"], val: StepStatus) => {
    setState((prev) => ({ ...prev, steps: { ...prev.steps, [key]: val } }));
  }, []);

  const run = useCallback(async () => {
    setState({ ...INIT_STATE, phase: "socket" as Phase, steps: { ...INIT_STEPS }, logs: [], roomId: null });
    idRef.current = 0;

    const roomId = `room_svg_test_${chartCase.id}_${Date.now()}`;
    setState((prev) => ({ ...prev, roomId }));

    // ── 0. Socket connect + join ──────────────────────────────────────────
    setStep("roomConnected", "running");
    log("info", `Connecting to ${BACKEND_URL}…`);

    await new Promise<void>((resolve) => {
      if (socket.connected) {
        log("success", `Socket already connected (id: ${socket.id})`);
        setStep("roomConnected", "success");
        resolve();
      } else {
        socket.once("connect", () => {
          log("success", `Socket connected (id: ${socket.id})`);
          setStep("roomConnected", "success");
          resolve();
        });
        socket.connect();
      }
    });

    // Chart images use the same join event as regular jyotisham endpoints
    socket.emit("join_jyotisham", { room_id: roomId });
    log("info", `Emitted join_jyotisham  { room_id: "${roomId}" }`);

    // ── 1. HTTP POST ──────────────────────────────────────────────────────
    setStep("httpSent", "running");
    setState((prev) => ({ ...prev, phase: "http" }));

    const payload = chartCase.isTransit
      ? { ...BASE_PAYLOAD, transit_date: TRANSIT_DATE, transit_time: TRANSIT_TIME }
      : { ...BASE_PAYLOAD };

    const requestBody = { room: roomId, payload };
    const url = `${BACKEND_URL}/jyotisham/${chartCase.slug}`;

    log("info", `POST ${url}`);
    log("info", `Body: ${JSON.stringify(requestBody).substring(0, 200)}`);

    const svgStart = performance.now();
    let httpOk = false;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const status = res.status;
      setState((prev) => ({ ...prev, httpStatus: status }));
      httpOk = res.ok || status === 202;
      setStep("httpSent", "success");
      setStep("httpResponse", "running");
      log(httpOk ? "success" : "warn", `HTTP ${status} ${res.statusText}`);

      try {
        const body = await res.json();
        log("info", `Response: ${JSON.stringify(body)}`);
      } catch {
        log("info", "Response: (no JSON body — expected for 202 Accepted)");
      }

      setStep("httpResponse", httpOk ? "success" : "error");

      if (!httpOk) {
        log("error", `Unexpected HTTP ${status}. Stopping.`);
        setState((prev) => ({ ...prev, phase: "error" }));
        (["waitingSocket", "socketReceived", "ackSent", "converting"] as const).forEach((k) => setStep(k, "skipped"));
        return;
      }
    } catch (err: any) {
      setStep("httpSent", "error");
      setStep("httpResponse", "error");
      log("error", `Fetch failed: ${err.message}`);
      log("error", `Is the backend running on ${BACKEND_URL}?`);
      setState((prev) => ({ ...prev, phase: "error" }));
      (["waitingSocket", "socketReceived", "ackSent", "converting"] as const).forEach((k) => setStep(k, "skipped"));
      return;
    }

    // ── 2. Wait for socket event ──────────────────────────────────────────
    setStep("waitingSocket", "running");
    setState((prev) => ({ ...prev, phase: "waiting" }));
    const eventKey = `jyotisham_result/${roomId}/${chartCase.slug}`;
    log("info", `Listening for: ${eventKey}`);
    log("info", "Timeout: 3 minutes");

    const socketData: any = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventKey);
        reject(new Error(`No response after 180s. Event: ${eventKey}`));
      }, 180000);

      socket.once(eventKey, (data: any) => {
        clearTimeout(timer);
        resolve(data);
      });
    }).catch((err: Error) => {
      log("error", err.message);
      setStep("waitingSocket", "error");
      setStep("socketReceived", "skipped");
      setStep("ackSent", "skipped");
      setStep("converting", "skipped");
      setState((prev) => ({ ...prev, phase: "error" }));
      return null;
    });

    if (!socketData) return;

    const svgFetchMs = Math.round(performance.now() - svgStart);
    setStep("waitingSocket", "success");
    setStep("socketReceived", "success");

    // Confirm the socket result was successful
    const isSuccess = socketData?.success === true;
    log(isSuccess ? "success" : "error", `Socket result: success=${socketData?.success}`);

    if (!isSuccess) {
      log("error", `Backend error: ${socketData?.error ?? "unknown"}`);
      setStep("ackSent", "skipped");
      setStep("converting", "skipped");
      setState((prev) => ({ ...prev, phase: "error", svgFetchMs }));
      return;
    }

    // The SVG data is under socketData.data (raw SVG string)
    const svgRaw: string = typeof socketData.data === "string"
      ? socketData.data
      : JSON.stringify(socketData.data);

    log("success", `SVG received (${svgRaw.length} chars) in ${svgFetchMs}ms`);
    setState((prev) => ({ ...prev, svgRaw, svgFetchMs }));

    // ── 3. ACK ────────────────────────────────────────────────────────────
    setStep("ackSent", "running");
    socket.emit("ack_jyotisham", { room_id: roomId, slug: chartCase.slug });
    socket.off(eventKey);
    log("info", `Emitted ack_jyotisham  { room_id: "${roomId}", slug: "${chartCase.slug}" }`);
    setStep("ackSent", "success");

    // ── 4. Convert SVG → PNG via server-side /api/svg-to-png ─────────────
    setStep("converting", "running");
    setState((prev) => ({ ...prev, phase: "converting" }));
    log("info", "Converting SVG → PNG via POST /api/svg-to-png (sharp server-side)…");

    const convertStart = performance.now();
    try {
      const res = await fetch("/api/svg-to-png", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ svg: svgRaw }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const pngDataUrl: string | null = data.png ?? null;
      if (!pngDataUrl) throw new Error("API returned no 'png' field");

      const pngConvertMs = Math.round(performance.now() - convertStart);
      log("success", `PNG ready in ${pngConvertMs}ms (data URL length: ${pngDataUrl.length})`);
      setStep("converting", "success");
      setState((prev) => ({ ...prev, phase: "done", pngDataUrl, pngConvertMs }));
    } catch (err: any) {
      const pngConvertMs = Math.round(performance.now() - convertStart);
      log("error", `PNG conversion failed after ${pngConvertMs}ms: ${err.message}`);
      setStep("converting", "error");
      setState((prev) => ({ ...prev, phase: "error", pngConvertMs }));
    }
  }, [chartCase, log, setStep]);

  const reset = useCallback(() => {
    setState(INIT_STATE);
    setShowSvg(false);
    setShowPng(false);
    idRef.current = 0;
  }, []);

  const borderCls = {
    idle:       "border-white/[0.08]",
    socket:     "border-cyan-500/40 shadow-[0_0_16px_rgba(0,229,255,0.07)]",
    http:       "border-cyan-500/40 shadow-[0_0_16px_rgba(0,229,255,0.07)]",
    waiting:    "border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.07)]",
    converting: "border-purple-500/40 shadow-[0_0_16px_rgba(168,85,247,0.08)]",
    done:       "border-emerald-500/40 shadow-[0_0_16px_rgba(52,211,153,0.08)]",
    error:      "border-red-500/40 shadow-[0_0_16px_rgba(239,68,68,0.08)]",
  };

  const STEPS: { key: keyof TestState["steps"]; label: string }[] = [
    { key: "roomConnected",  label: "0. Socket connected & join_jyotisham emitted" },
    { key: "httpSent",       label: "1. POST /jyotisham/:slug sent" },
    { key: "httpResponse",   label: "2. HTTP 202 response received" },
    { key: "waitingSocket",  label: "3. Awaiting jyotisham_result/{room}/{slug}…" },
    { key: "socketReceived", label: "4. Socket event received (SVG payload)" },
    { key: "ackSent",        label: "5. ack_jyotisham emitted & listener cleaned up" },
    { key: "converting",     label: "6. POST /api/svg-to-png → sharp conversion" },
  ];

  const phaseLabel: Record<Phase, React.ReactNode> = {
    idle:       null,
    socket:     <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse">◌ CONNECTING</span>,
    http:       <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse">◌ HTTP POST</span>,
    waiting:    <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase animate-pulse">◌ WAITING SOCKET</span>,
    converting: <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase animate-pulse">◌ CONVERTING PNG</span>,
    done:       <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">✓ DONE</span>,
    error:      <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">✕ ERROR</span>,
  };

  return (
    <div className={`bg-[#080d0d] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${borderCls[state.phase]}`}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <code className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
              POST /jyotisham/{chartCase.slug}
            </code>
            {phaseLabel[state.phase]}
          </div>
          <h3 className="font-semibold text-white text-sm">{chartCase.label}</h3>
          {chartCase.isTransit && (
            <p className="text-[10px] font-mono text-purple-300/60 mt-0.5">
              +transit_date: {TRANSIT_DATE}  +transit_time: {TRANSIT_TIME}
            </p>
          )}
          {(state.svgFetchMs || state.pngConvertMs) && (
            <div className="flex gap-3 mt-1">
              {state.svgFetchMs && (
                <span className="text-[9px] font-mono text-white/30">
                  socket round-trip: <span className="text-white/60">{state.svgFetchMs}ms</span>
                </span>
              )}
              {state.pngConvertMs && (
                <span className="text-[9px] font-mono text-white/30">
                  sharp convert: <span className="text-white/60">{state.pngConvertMs}ms</span>
                </span>
              )}
              {state.svgFetchMs && state.pngConvertMs && (
                <span className="text-[9px] font-mono text-white/30">
                  total: <span className="text-emerald-400/80">{state.svgFetchMs + state.pngConvertMs}ms</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {state.phase !== "idle" && (
            <button onClick={reset} className="px-3 py-1.5 text-xs font-bold border border-white/10 text-white/40 hover:text-white/70 rounded-lg transition-colors">
              Reset
            </button>
          )}
          <button
            onClick={run}
            disabled={state.phase !== "idle" && state.phase !== "done" && state.phase !== "error"}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              (state.phase !== "idle" && state.phase !== "done" && state.phase !== "error")
                ? "bg-amber-500/10 text-amber-400/50 border-amber-500/20 cursor-wait"
                : "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]"
            }`}
          >
            {(state.phase !== "idle" && state.phase !== "done" && state.phase !== "error") ? "Running…" : state.phase === "done" || state.phase === "error" ? "↺ Re-run" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* ── Step tracker ───────────────────────────────────────────── */}
      {state.phase !== "idle" && (
        <div className="bg-black/20 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Pipeline Steps</p>
          {STEPS.map(({ key, label }) => (
            <StepRow key={key} label={label} status={state.steps[key]} />
          ))}
          {state.httpStatus && (
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/30">HTTP</span>
              <span className={`text-[11px] font-bold font-mono ${state.httpStatus < 300 ? "text-emerald-400" : "text-red-400"}`}>
                {state.httpStatus}
              </span>
              {state.roomId && (
                <>
                  <span className="text-white/15 mx-1">|</span>
                  <span className="text-[9px] font-mono text-white/30">ROOM</span>
                  <span className="text-[10px] font-mono text-white/45 truncate max-w-[160px]">{state.roomId}</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Activity log ───────────────────────────────────────────── */}
      {state.logs.length > 0 && (
        <div className="bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Activity Log</p>
          <LogFeed logs={state.logs} />
        </div>
      )}

      {/* ── Results (done) ─────────────────────────────────────────── */}
      {state.phase === "done" && state.pngDataUrl && (
        <div className="space-y-2">
          {/* PNG preview */}
          <button
            onClick={() => setShowPng((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10 transition-colors"
          >
            <span className="text-[10px] font-mono text-emerald-300">
              {showPng ? "▲" : "▼"} PNG Preview (server sharp-converted, {Math.round(state.pngDataUrl.length / 1024)}KB)
            </span>
          </button>
          {showPng && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#FFFDF5] p-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.pngDataUrl} alt={chartCase.label} className="w-72 h-72 object-contain" />
            </div>
          )}

          {/* Raw SVG */}
          {state.svgRaw && (
            <>
              <button
                onClick={() => setShowSvg((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                <span className="text-[10px] font-mono text-white/40">
                  {showSvg ? "▲" : "▼"} Raw SVG ({state.svgRaw.length} chars)
                </span>
              </button>
              {showSvg && (
                <pre className="text-[9px] font-mono text-cyan-300/70 bg-black/40 p-3 rounded-xl overflow-x-auto max-h-40 overflow-y-auto">
                  {state.svgRaw.substring(0, 800)}…
                </pre>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SvgToPngTestPage() {
  const [results, setResults] = useState<Record<string, { id: string; label: string; png: string }>>({});
  const [showPdf, setShowPdf] = useState(false);

  // We track which charts have completed from child cards via a shared ref
  // Children call this on success to register their PNG
  const registerPng = useCallback((id: string, label: string, png: string) => {
    setResults((prev) => ({ ...prev, [id]: { id, label, png } }));
  }, []);

  const successfulCharts = Object.values(results);

  return (
    <div className="min-h-screen bg-[#050a0a] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]" />
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.25em]">
              Dev · SVG → PNG Server-Side Conversion Test
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Server-Side{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
              SVG → PNG
            </span>{" "}
            Pipeline Test
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Each test follows the <strong className="text-white/60">exact same</strong> socket flow as{" "}
            <code className="text-cyan-400/80">/test/jyotisham</code>:<br />
            <code className="text-cyan-400/80">join_jyotisham</code> →{" "}
            <code className="text-amber-400/80">POST /jyotisham/:slug</code> →{" "}
            <code className="text-emerald-400/80">jyotisham_result</code> →{" "}
            <code className="text-white/50">ack_jyotisham</code> →{" "}
            <code className="text-purple-400/80">POST /api/svg-to-png</code>
          </p>
        </div>

        {/* ─── Architecture card ──────────────────────────────────────── */}
        <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono">
          <div>
            <p className="text-white/25 uppercase tracking-widest mb-2">Request body sent</p>
            <pre className="text-amber-300/80 leading-relaxed">{`POST /jyotisham/:slug
{
  "room": "<roomId>",
  "payload": {
    "date": "15/01/1995",
    "time": "14:30",
    "latitude": 25.5941,
    "longitude": 85.1376,
    "tz": 5.5,
    "lang": "en",
    "style": "north",
    "colored_planets": true
  }
}`}</pre>
          </div>
          <div>
            <p className="text-white/25 uppercase tracking-widest mb-2">Socket events</p>
            <div className="space-y-1">
              <div><span className="text-white/30">Emit:   </span><span className="text-blue-300">join_jyotisham</span></div>
              <div><span className="text-white/30">Listen: </span><span className="text-emerald-300">jyotisham_result/{"{room}/{slug}"}</span></div>
              <div><span className="text-white/30">ACK:    </span><span className="text-amber-300">ack_jyotisham</span></div>
            </div>
            <p className="text-white/25 uppercase tracking-widest mb-2 mt-4">Then (client)</p>
            <div className="space-y-1">
              <div><span className="text-white/30">POST    </span><span className="text-purple-300">/api/svg-to-png</span></div>
              <div><span className="text-white/30">Engine: </span><span className="text-purple-300">sharp (Node.js)</span></div>
              <div><span className="text-white/30">Output: </span><span className="text-purple-300">data:image/png;base64,…</span></div>
            </div>
          </div>
        </div>

        {/* ─── PDF viewer toggle (shows after any chart succeeds) ── */}
        {successfulCharts.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowPdf((p) => !p)}
              className={`w-full px-5 py-3 text-sm font-bold uppercase tracking-wider rounded-xl border transition-all ${
                showPdf
                  ? "bg-purple-500/20 text-purple-200 border-purple-500/40"
                  : "bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20"
              }`}
            >
              {showPdf ? "▲ Hide" : "▼ Open"} React-PDF Preview — {successfulCharts.length} chart{successfulCharts.length !== 1 ? "s" : ""} rendered
            </button>

            {showPdf && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_24px_rgba(168,85,247,0.1)]">
                <div className="bg-purple-500/10 px-4 py-2 border-b border-purple-500/20">
                  <p className="text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                    React-PDF — {successfulCharts.length} charts embedded as server-generated PNGs (no canvas)
                  </p>
                </div>
                <div style={{ height: "600px" }}>
                  <PDFViewer style={{ width: "100%", height: "100%", border: "none" }}>
                    {/* @ts-ignore */}
                    <SvgChartPdfDoc charts={successfulCharts} />
                  </PDFViewer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Test cards ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {CHART_CASES.map((c) => (
            <TestCardWithRegister
              key={c.id}
              chartCase={c}
              onSuccess={registerPng}
            />
          ))}
        </div>

        <div className="mt-10 text-center text-[10px] text-white/15 font-mono">
          /test/svg-to-png — internal dev only — do not ship to production
        </div>
      </div>
    </div>
  );
}

// ─── Wrapper that intercepts success to register PNG ─────────────────────────

function TestCardWithRegister({
  chartCase,
  onSuccess,
}: {
  chartCase: ChartCase;
  onSuccess: (id: string, label: string, png: string) => void;
}) {
  const [state, setState] = useState<TestState>(INIT_STATE);
  const [showSvg, setShowSvg] = useState(false);
  const [showPng, setShowPng] = useState(false);
  const idRef = useRef(0);

  const log = useCallback((status: LogEntry["status"], message: string) => {
    setState((prev) => ({ ...prev, logs: [...prev.logs, { id: idRef.current++, time: nowStr(), status, message }] }));
  }, []);

  const setStep = useCallback((key: keyof TestState["steps"], val: StepStatus) => {
    setState((prev) => ({ ...prev, steps: { ...prev.steps, [key]: val } }));
  }, []);

  // Register PNG on success
  useEffect(() => {
    if (state.phase === "done" && state.pngDataUrl) {
      onSuccess(chartCase.id, chartCase.label, state.pngDataUrl);
    }
  }, [state.phase, state.pngDataUrl, chartCase.id, chartCase.label, onSuccess]);

  const run = useCallback(async () => {
    setState({ ...INIT_STATE, phase: "socket" as Phase, steps: { ...INIT_STEPS }, logs: [], roomId: null });
    idRef.current = 0;
    setShowSvg(false);
    setShowPng(false);

    const roomId = `room_svg_test_${chartCase.id}_${Date.now()}`;
    setState((prev) => ({ ...prev, roomId }));

    // 0. Socket
    setStep("roomConnected", "running");
    log("info", `Connecting to ${BACKEND_URL}…`);
    await new Promise<void>((resolve) => {
      if (socket.connected) { log("success", `Already connected (id: ${socket.id})`); setStep("roomConnected", "success"); resolve(); }
      else { socket.once("connect", () => { log("success", `Connected (id: ${socket.id})`); setStep("roomConnected", "success"); resolve(); }); socket.connect(); }
    });
    socket.emit("join_jyotisham", { room_id: roomId });
    log("info", `Emitted join_jyotisham  { room_id: "${roomId}" }`);

    // 1. HTTP POST
    setStep("httpSent", "running");
    setState((prev) => ({ ...prev, phase: "http" }));
    const payload = chartCase.isTransit
      ? { ...BASE_PAYLOAD, transit_date: TRANSIT_DATE, transit_time: TRANSIT_TIME }
      : { ...BASE_PAYLOAD };
    const url = `${BACKEND_URL}/jyotisham/${chartCase.slug}`;
    log("info", `POST ${url}`);
    log("info", `Body payload keys: [${Object.keys(payload).join(", ")}]`);

    const svgStart = performance.now();
    let httpOk = false;
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room: roomId, payload }) });
      const status = res.status;
      setState((prev) => ({ ...prev, httpStatus: status }));
      httpOk = res.ok || status === 202;
      setStep("httpSent", httpOk ? "success" : "error");
      setStep("httpResponse", "running");
      log(httpOk ? "success" : "warn", `HTTP ${status} ${res.statusText}`);
      try { const b = await res.json(); log("info", `Response body: ${JSON.stringify(b)}`); } catch { log("info", "Response: (no JSON — expected for 202)"); }
      setStep("httpResponse", httpOk ? "success" : "error");
      if (!httpOk) { log("error", `Status ${status}. Stopping.`); setState((prev) => ({ ...prev, phase: "error" })); (["waitingSocket","socketReceived","ackSent","converting"] as const).forEach(k => setStep(k,"skipped")); return; }
    } catch (err: any) {
      setStep("httpSent", "error"); setStep("httpResponse", "error");
      log("error", `Fetch failed: ${err.message}`);
      log("error", `Is the backend running on ${BACKEND_URL}?`);
      setState((prev) => ({ ...prev, phase: "error" }));
      (["waitingSocket","socketReceived","ackSent","converting"] as const).forEach(k => setStep(k,"skipped")); return;
    }

    // 2. Wait for socket
    setStep("waitingSocket", "running");
    setState((prev) => ({ ...prev, phase: "waiting" }));
    const eventKey = `jyotisham_result/${roomId}/${chartCase.slug}`;
    log("info", `Listening: ${eventKey}`);
    const socketData: any = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => { socket.off(eventKey); reject(new Error(`Timeout 180s. Key: ${eventKey}`)); }, 180000);
      socket.once(eventKey, (data: any) => { clearTimeout(timer); resolve(data); });
    }).catch((err: Error) => {
      log("error", err.message);
      setStep("waitingSocket","error"); setStep("socketReceived","skipped"); setStep("ackSent","skipped"); setStep("converting","skipped");
      setState((prev) => ({ ...prev, phase: "error" })); return null;
    });
    if (!socketData) return;

    const svgFetchMs = Math.round(performance.now() - svgStart);
    setStep("waitingSocket", "success"); setStep("socketReceived", "success");
    const isSuccess = socketData?.success === true;
    log(isSuccess ? "success" : "error", `Result: success=${socketData?.success}`);
    if (!isSuccess) { log("error", `Backend error: ${socketData?.error ?? "unknown"}`); setStep("ackSent","skipped"); setStep("converting","skipped"); setState((prev) => ({ ...prev, phase: "error", svgFetchMs })); return; }

    const svgRaw: string = typeof socketData.data === "string" ? socketData.data : JSON.stringify(socketData.data);
    log("success", `SVG received: ${svgRaw.length} chars in ${svgFetchMs}ms`);
    setState((prev) => ({ ...prev, svgRaw, svgFetchMs }));

    // 3. ACK
    setStep("ackSent", "running");
    socket.emit("ack_jyotisham", { room_id: roomId, slug: chartCase.slug });
    socket.off(eventKey);
    log("info", `ACK sent`);
    setStep("ackSent", "success");

    // 4. Sharp conversion
    setStep("converting", "running");
    setState((prev) => ({ ...prev, phase: "converting" }));
    log("info", "POST /api/svg-to-png…");
    const convertStart = performance.now();
    try {
      const res = await fetch("/api/svg-to-png", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ svg: svgRaw }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `HTTP ${res.status}`); }
      const data = await res.json();
      if (!data.png) throw new Error("No png field in response");
      const pngConvertMs = Math.round(performance.now() - convertStart);
      log("success", `PNG ready in ${pngConvertMs}ms (${Math.round(data.png.length / 1024)}KB)`);
      setStep("converting", "success");
      setState((prev) => ({ ...prev, phase: "done", pngDataUrl: data.png, pngConvertMs }));
    } catch (err: any) {
      const pngConvertMs = Math.round(performance.now() - convertStart);
      log("error", `Conversion failed (${pngConvertMs}ms): ${err.message}`);
      setStep("converting", "error");
      setState((prev) => ({ ...prev, phase: "error", pngConvertMs }));
    }
  }, [chartCase, log, setStep, onSuccess]);

  const reset = useCallback(() => { setState(INIT_STATE); setShowSvg(false); setShowPng(false); idRef.current = 0; }, []);

  const borderCls: Record<Phase, string> = {
    idle: "border-white/[0.08]", socket: "border-cyan-500/40", http: "border-cyan-500/40",
    waiting: "border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.07)]",
    converting: "border-purple-500/40 shadow-[0_0_16px_rgba(168,85,247,0.08)]",
    done: "border-emerald-500/40 shadow-[0_0_16px_rgba(52,211,153,0.08)]",
    error: "border-red-500/40 shadow-[0_0_16px_rgba(239,68,68,0.08)]",
  };

  const STEPS: { key: keyof TestState["steps"]; label: string }[] = [
    { key: "roomConnected",  label: "0. Socket connected & join_jyotisham emitted" },
    { key: "httpSent",       label: `1. POST /jyotisham/${chartCase.slug}` },
    { key: "httpResponse",   label: "2. HTTP 202 received" },
    { key: "waitingSocket",  label: `3. Awaiting jyotisham_result/{room}/${chartCase.slug}…` },
    { key: "socketReceived", label: "4. SVG payload received from socket" },
    { key: "ackSent",        label: "5. ack_jyotisham sent & listener removed" },
    { key: "converting",     label: "6. POST /api/svg-to-png → sharp PNG" },
  ];

  const phaseTag: Record<Phase, React.ReactNode> = {
    idle: null, error: <span className="text-[10px] text-red-400 font-bold uppercase">✕ ERROR</span>,
    done: <span className="text-[10px] text-emerald-400 font-bold uppercase">✓ DONE</span>,
    socket: <span className="text-[10px] text-cyan-400 font-bold uppercase animate-pulse">◌ SOCKET</span>,
    http: <span className="text-[10px] text-cyan-400 font-bold uppercase animate-pulse">◌ HTTP</span>,
    waiting: <span className="text-[10px] text-amber-400 font-bold uppercase animate-pulse">◌ WAITING</span>,
    converting: <span className="text-[10px] text-purple-400 font-bold uppercase animate-pulse">◌ CONVERTING</span>,
  };

  return (
    <div className={`bg-[#080d0d] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${borderCls[state.phase]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <code className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-mono">POST /jyotisham/{chartCase.slug}</code>
            {phaseTag[state.phase]}
          </div>
          <h3 className="font-semibold text-white text-sm">{chartCase.label}</h3>
          {chartCase.isTransit && <p className="text-[10px] font-mono text-purple-300/50 mt-0.5">+transit_date: {TRANSIT_DATE}  +transit_time: {TRANSIT_TIME}</p>}
          {(state.svgFetchMs !== null || state.pngConvertMs !== null) && (
            <div className="flex gap-3 mt-1">
              {state.svgFetchMs !== null && <span className="text-[9px] font-mono text-white/30">socket: <span className="text-white/60">{state.svgFetchMs}ms</span></span>}
              {state.pngConvertMs !== null && <span className="text-[9px] font-mono text-white/30">sharp: <span className="text-white/60">{state.pngConvertMs}ms</span></span>}
              {state.svgFetchMs !== null && state.pngConvertMs !== null && <span className="text-[9px] font-mono text-white/30">total: <span className="text-emerald-400/80">{state.svgFetchMs + state.pngConvertMs}ms</span></span>}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {state.phase !== "idle" && <button onClick={reset} className="px-3 py-1.5 text-xs font-bold border border-white/10 text-white/40 hover:text-white/70 rounded-lg transition-colors">Reset</button>}
          <button
            onClick={run}
            disabled={state.phase !== "idle" && state.phase !== "done" && state.phase !== "error"}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              (state.phase !== "idle" && state.phase !== "done" && state.phase !== "error")
                ? "bg-amber-500/10 text-amber-400/50 border-amber-500/20 cursor-wait"
                : "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
            }`}
          >
            {(state.phase !== "idle" && state.phase !== "done" && state.phase !== "error") ? "Running…" : (state.phase === "done" || state.phase === "error") ? "↺ Re-run" : "▶ Run"}
          </button>
        </div>
      </div>

      {state.phase !== "idle" && (
        <div className="bg-black/20 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Pipeline Steps</p>
          {STEPS.map(({ key, label }) => <StepRow key={key} label={label} status={state.steps[key]} />)}
          {state.httpStatus && (
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/30">HTTP</span>
              <span className={`text-[11px] font-bold font-mono ${state.httpStatus < 300 ? "text-emerald-400" : "text-red-400"}`}>{state.httpStatus}</span>
              {state.roomId && <><span className="text-white/15 mx-1">|</span><span className="text-[9px] font-mono text-white/30">ROOM</span><span className="text-[10px] font-mono text-white/45 truncate max-w-[160px]">{state.roomId}</span></>}
            </div>
          )}
        </div>
      )}

      {state.logs.length > 0 && (
        <div className="bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Activity Log</p>
          <LogFeed logs={state.logs} />
        </div>
      )}

      {state.phase === "done" && state.pngDataUrl && (
        <div className="space-y-2">
          <button onClick={() => setShowPng(p => !p)} className="w-full flex items-center justify-between px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10 transition-colors">
            <span className="text-[10px] font-mono text-emerald-300">{showPng ? "▲" : "▼"} PNG Preview — {Math.round(state.pngDataUrl.length / 1024)}KB (server-converted by sharp)</span>
          </button>
          {showPng && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#FFFDF5] p-2 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.pngDataUrl} alt={chartCase.label} className="w-72 h-72 object-contain" />
            </div>
          )}
          {state.svgRaw && (
            <>
              <button onClick={() => setShowSvg(p => !p)} className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors">
                <span className="text-[10px] font-mono text-white/40">{showSvg ? "▲" : "▼"} Raw SVG ({state.svgRaw.length} chars)</span>
              </button>
              {showSvg && <pre className="text-[9px] font-mono text-cyan-300/70 bg-black/40 p-3 rounded-xl overflow-x-auto max-h-40 overflow-y-auto">{state.svgRaw.substring(0, 800)}…</pre>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
