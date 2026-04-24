"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { socket } from "@/lib/socketio/client";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = "idle" | "running" | "success" | "error" | "skipped";

interface LogEntry {
  id: number;
  time: string;
  status: "info" | "success" | "error" | "warn";
  message: string;
}

interface TestCase {
  slug: string;
  label: string;
  description: string;
  extraArgs?: string[];   // extra required fields beyond base
  payload: Record<string, any>;
}

interface TestState {
  status: "idle" | "running" | "success" | "error";
  steps: {
    roomConnected: StepStatus;
    httpSent: StepStatus;
    httpResponse: StepStatus;
    waitingSocket: StepStatus;
    socketReceived: StepStatus;
    ackSent: StepStatus;
  };
  logs: LogEntry[];
  roomId: string | null;
  socketPayload: any;
  httpStatus: number | null;
}

// ─── Base & per-test payloads ─────────────────────────────────────────────────
// Per integration guide: date DD/MM/YYYY, time HH:MM 24h, tz as number

const BASE_PAYLOAD = {
  date: "15/01/1995",    // DD/MM/YYYY — Patna birth date
  time: "14:30",         // HH:MM 24h
  latitude: 25.5941,     // Patna, Bihar
  longitude: 85.1376,
  tz: 5.5,              // IST = +5.5
  lang: "en",
};

// Today's date for transit
const TRANSIT_DATE = "12/04/2026";
const TRANSIT_TIME = "20:00";

// ─── Test Cases ───────────────────────────────────────────────────────────────

const TEST_CASES: TestCase[] = [
  {
    slug: "planet_details",
    label: "Planet Details",
    description: "Planetary positions, degrees, signs, retrograde status",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "divisional_chart_D1",
    label: "Birth Chart (D1)",
    description: "Primary Lagna / Rashi divisional chart JSON data",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "ascendant_report",
    label: "Ascendant Report",
    description: "Lagna sign, lord, strength, and detailed analysis",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "ashtakvarga",
    label: "Ashtakvarga",
    description: "Sarvashtakavarga scores across 12 houses for all planets",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "binnashtakvarga_Sun",
    label: "Bhinnashtakavarga (Sun)",
    description: "Points contributed by Sun across 12 houses",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "binnashtakvarga_Moon",
    label: "Bhinnashtakavarga (Moon)",
    description: "Points contributed by Moon across 12 houses",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "binnashtakvarga_Jupiter",
    label: "Bhinnashtakavarga (Jupiter)",
    description: "Points contributed by Jupiter across 12 houses",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "dasha_current_maha",
    label: "Current Mahadasha",
    description: "Running Vimshottari Mahadasha, Antardasha, Pratyantardasha",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "dosha_mangal",
    label: "Mangal Dosha",
    description: "Mangal Dosha presence, severity, anshik state and remedies",
    payload: { ...BASE_PAYLOAD },
  },
  {
    slug: "transit_chart",
    label: "Transit Chart",
    description: "Current planetary transit overlay on natal chart (SVG)",
    extraArgs: ["style", "colored_planets", "color", "transit_date", "transit_time"],
    payload: {
      ...BASE_PAYLOAD,
      style: "north",           // "north" | "south" | "east"
      colored_planets: true,    // boolean
      color: "#00FF94",         // accent color hex
      transit_date: TRANSIT_DATE,
      transit_time: TRANSIT_TIME,
    },
  },
  {
    slug: "chart_image_D1",
    label: "Chart Image (D1)",
    description: "Natal Rashi Chart SVG with minimalist identity",
    extraArgs: ["style", "colored_planets", "color"],
    payload: {
      ...BASE_PAYLOAD,
      style: "north",
      colored_planets: true,
      color: "#00FF94",
    },
  },
];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4040";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowStr() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  } as any);
}

const INIT_STEPS = {
  roomConnected: "idle" as StepStatus,
  httpSent: "idle" as StepStatus,
  httpResponse: "idle" as StepStatus,
  waitingSocket: "idle" as StepStatus,
  socketReceived: "idle" as StepStatus,
  ackSent: "idle" as StepStatus,
};

const INIT_STATE: TestState = {
  status: "idle",
  steps: INIT_STEPS,
  logs: [],
  roomId: null,
  socketPayload: null,
  httpStatus: null,
};

// ─── Step Row ─────────────────────────────────────────────────────────────────

function StepRow({ label, status }: { label: string; status: StepStatus }) {
  const icon = {
    idle: <span className="text-white/20">○</span>,
    running: (
      <svg className="w-3.5 h-3.5 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" />
      </svg>
    ),
    success: <span className="text-emerald-400">✓</span>,
    error: <span className="text-red-400">✕</span>,
    skipped: <span className="text-white/20">—</span>,
  };

  const labelColor = {
    idle: "text-white/25",
    running: "text-cyan-300",
    success: "text-emerald-300",
    error: "text-red-300",
    skipped: "text-white/20",
  };

  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-4 flex justify-center shrink-0">{icon[status]}</span>
      <span className={`text-xs font-mono ${labelColor[status]}`}>{label}</span>
    </div>
  );
}

// ─── Log Feed ─────────────────────────────────────────────────────────────────

function LogFeed({ logs }: { logs: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs.length]);

  const badge: Record<LogEntry["status"], string> = {
    info:    "border-white/20 text-white/40",
    success: "border-emerald-500/40 text-emerald-400",
    error:   "border-red-500/40 text-red-400",
    warn:    "border-amber-500/40 text-amber-400",
  };
  const text: Record<LogEntry["status"], string> = {
    info:    "text-white/60",
    success: "text-emerald-300",
    error:   "text-red-300",
    warn:    "text-amber-300",
  };

  return (
    <div ref={ref} className="h-44 overflow-y-auto space-y-1 font-mono text-[11px] pr-1" style={{ scrollbarWidth: "thin" }}>
      {logs.length === 0 && (
        <div className="text-white/20 italic text-center py-6">Run test to see activity log…</div>
      )}
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-2">
          <span className="text-white/25 shrink-0">{l.time}</span>
          <span className={`shrink-0 border rounded px-1 text-[9px] font-bold uppercase ${badge[l.status]}`}>{l.status}</span>
          <span className={`flex-1 leading-relaxed ${text[l.status]}`}>{l.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Collapsible JSON viewer ──────────────────────────────────────────────────

function JsonBlock({ title, data, defaultOpen = false }: { title: string; data: any; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!data) return null;
  const isSuccess = data?.success === true;
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
      >
        <span className="text-[11px] font-mono text-white/50">{title}</span>
        <div className="flex items-center gap-2">
          {data?.success !== undefined && (
            <span className={`text-[9px] font-bold uppercase ${isSuccess ? "text-emerald-400" : "text-red-400"}`}>
              {isSuccess ? "success" : "error"}
            </span>
          )}
          <span className="text-[10px] text-white/30">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && (
        <pre className="text-[10px] font-mono text-cyan-200 bg-black/50 p-3 overflow-x-auto max-h-64 overflow-y-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

// ─── Test Card ────────────────────────────────────────────────────────────────

function TestCard({ tc }: { tc: TestCase }) {
  const [state, setState] = useState<TestState>(INIT_STATE);
  const idRef = useRef(0);

  const log = useCallback((status: LogEntry["status"], message: string) => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, { id: idRef.current++, time: nowStr(), status, message }],
    }));
  }, []);

  const setStep = useCallback((key: keyof TestState["steps"], val: StepStatus) => {
    setState((prev) => ({ ...prev, steps: { ...prev.steps, [key]: val } }));
  }, []);

  const run = useCallback(async () => {
    setState({ ...INIT_STATE, status: "running", steps: { ...INIT_STEPS }, logs: [] });
    idRef.current = 0;

    const roomId = `room_test_${tc.slug}_${Date.now()}`;
    setState((prev) => ({ ...prev, roomId }));

    // ── 0. Connect & join room ────────────────────────────────────────────
    setStep("roomConnected", "running");
    log("info", `Connecting socket to ${BACKEND_URL}…`);

    await new Promise<void>((resolve) => {
      if (socket.connected) {
        log("success", `Socket already connected  (id: ${socket.id})`);
        setStep("roomConnected", "success");
        resolve();
      } else {
        socket.once("connect", () => {
          log("success", `Socket connected  id=${socket.id}`);
          setStep("roomConnected", "success");
          resolve();
        });
        socket.connect();
      }
    });

    socket.emit("join_jyotisham", { room_id: roomId });
    log("info", `Emitted join_jyotisham  { room_id: "${roomId}" }`);

    // ── 1. HTTP POST ──────────────────────────────────────────────────────
    setStep("httpSent", "running");
    const url = `${BACKEND_URL}/jyotisham/${tc.slug}`;
    const requestBody = { room: roomId, payload: tc.payload };
    log("info", `POST ${url}`);
    log("info", `Body: ${JSON.stringify(requestBody)}`);

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
        log("info", `Response body: ${JSON.stringify(body)}`);
      } catch {
        log("info", "Response body: (no JSON — expected for 202 Accepted)");
      }

      setStep("httpResponse", httpOk ? "success" : "error");

      if (!httpOk) {
        log("error", `Unexpected status ${status}. Stopping.`);
        setState((prev) => ({ ...prev, status: "error" }));
        setStep("waitingSocket", "skipped");
        setStep("socketReceived", "skipped");
        setStep("ackSent", "skipped");
        return;
      }
    } catch (err: any) {
      setStep("httpSent", "error");
      setStep("httpResponse", "error");
      log("error", `Fetch failed: ${err.message}`);
      log("error", `Is the backend running on ${BACKEND_URL}?`);
      setState((prev) => ({ ...prev, status: "error" }));
      ["waitingSocket", "socketReceived", "ackSent"].forEach((k) =>
        setStep(k as any, "skipped")
      );
      return;
    }

    // ── 2. Wait for socket event ──────────────────────────────────────────
    setStep("waitingSocket", "running");
    const eventKey = `jyotisham_result/${roomId}/${tc.slug}`;
    log("info", `Listening for: ${eventKey}`);
    log("info", "Timeout: 3 minutes");

    const socketData = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventKey);
        reject(new Error(`No response after 180s. Event key: ${eventKey}`));
      }, 180000);

      socket.once(eventKey, (data: any) => {
        clearTimeout(timer);
        resolve(data);
      });
    }).catch((err: Error) => {
      log("error", err.message);
      setStep("waitingSocket", "error");
      setStep("socketReceived", "error");
      setStep("ackSent", "skipped");
      setState((prev) => ({ ...prev, status: "error" }));
      return null;
    });

    if (!socketData) return;

    // ── 3–4. Process + ACK ────────────────────────────────────────────────
    setStep("waitingSocket", "success");
    setStep("socketReceived", "success");
    setState((prev) => ({ ...prev, socketPayload: socketData }));

    const isSuccess = socketData?.success === true;
    log(isSuccess ? "success" : "error", `Event received!  success=${socketData?.success}`);

    if (!isSuccess) {
      log("warn", `Backend error: ${socketData?.error ?? "unknown"}`);
    } else {
      const dataKeys = socketData?.data ? Object.keys(socketData.data) : [];
      log("success", `Data keys: [${dataKeys.join(", ")}]`);
    }

    setStep("ackSent", "running");
    socket.emit("ack_jyotisham", { room_id: roomId, slug: tc.slug });
    socket.off(eventKey);
    log("info", `Emitted ack_jyotisham  { room_id: "${roomId}", slug: "${tc.slug}" }`);
    setStep("ackSent", "success");

    setState((prev) => ({ ...prev, status: isSuccess ? "success" : "error" }));
    log(isSuccess ? "success" : "warn", isSuccess ? "✓ Full socket flow complete!" : "⚠ Flow complete — backend returned error");
  }, [tc, log, setStep]);

  const reset = useCallback(() => {
    setState(INIT_STATE);
    idRef.current = 0;
  }, []);

  const border = {
    idle: "border-white/[0.08]",
    running: "border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.08)]",
    success: "border-emerald-500/50 shadow-[0_0_16px_rgba(52,211,153,0.08)]",
    error: "border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.08)]",
  };

  const STEPS: { key: keyof TestState["steps"]; label: string }[] = [
    { key: "roomConnected",   label: "0. Socket connected & join_jyotisham emitted" },
    { key: "httpSent",        label: "1. HTTP POST request sent" },
    { key: "httpResponse",    label: "2. HTTP response received" },
    { key: "waitingSocket",   label: "3. Awaiting socket event…" },
    { key: "socketReceived",  label: "4. Socket event received" },
    { key: "ackSent",         label: "5. ACK sent & listener cleaned up" },
  ];

  return (
    <div className={`bg-[#080d0d] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${border[state.status]}`}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <code className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
              POST /jyotisham/{tc.slug}
            </code>
            {state.status === "success" && (
              <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">✓ PASS</span>
            )}
            {state.status === "error" && (
              <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">✕ FAIL</span>
            )}
            {state.status === "running" && (
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse">◌ RUNNING</span>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm">{tc.label}</h3>
          <p className="text-xs text-white/35 mt-0.5">{tc.description}</p>
          {tc.extraArgs && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tc.extraArgs.map((arg) => (
                <span key={arg} className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  +{arg}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {state.status !== "idle" && (
            <button onClick={reset} className="px-3 py-1.5 text-xs font-bold border border-white/10 text-white/40 hover:text-white/70 rounded-lg transition-colors">
              Reset
            </button>
          )}
          <button
            onClick={run}
            disabled={state.status === "running"}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              state.status === "running"
                ? "bg-cyan-500/10 text-cyan-400/50 border-cyan-500/20 cursor-wait"
                : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25 hover:shadow-[0_0_12px_rgba(0,229,255,0.2)]"
            }`}
          >
            {state.status === "running" ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* ── Payload sent ── */}
      <JsonBlock title="Request Payload (sent to backend)" data={{ room: state.roomId ?? "<room_id>", payload: tc.payload }} />

      {/* ── Step tracker ── */}
      {state.status !== "idle" && (
        <div className="bg-black/20 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Pipeline Steps</p>
          {STEPS.map(({ key, label }) => (
            <StepRow key={key} label={label} status={state.steps[key]} />
          ))}
          {state.httpStatus && (
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/30">HTTP STATUS</span>
              <span className={`text-[11px] font-bold font-mono ${state.httpStatus < 300 ? "text-emerald-400" : "text-red-400"}`}>
                {state.httpStatus}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Logs ── */}
      {state.logs.length > 0 && (
        <div className="bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Activity Log</p>
          <LogFeed logs={state.logs} />
        </div>
      )}

      {/* ── Socket payload ── */}
      {state.socketPayload && (
        <JsonBlock
          title={`Socket Event Data — success: ${state.socketPayload?.success}`}
          data={state.socketPayload}
          defaultOpen={true}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JyotishamTestPage() {
  return (
    <div className="min-h-screen bg-[#050a0a] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,1)]" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.25em]">
              Dev · Backend Connectivity Test
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Jyotisham{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              Socket Flow
            </span>{" "}
            Test Suite
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Tests the full lifecycle:{" "}
            <code className="text-cyan-400/80">socket join</code> →{" "}
            <code className="text-amber-400/80">HTTP POST</code> →{" "}
            <code className="text-emerald-400/80">socket event</code> →{" "}
            <code className="text-white/50">ACK</code>. Each test is fully
            independent with its own room ID.
          </p>
        </div>

        {/* Reference card */}
        <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Base Payload (all tests)</p>
            <pre className="text-[10px] font-mono text-amber-300 leading-relaxed">
              {JSON.stringify(BASE_PAYLOAD, null, 2)}
            </pre>
          </div>
          <div>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Backend URL</p>
            <code className="text-xs text-cyan-400">{BACKEND_URL}</code>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2 mt-4">Transit Extra Fields</p>
            <pre className="text-[10px] font-mono text-purple-300 leading-relaxed">
              {JSON.stringify(
                {
                  style: "north",
                  colored_planets: true,
                  color: "#00FF94",
                  transit_date: TRANSIT_DATE,
                  transit_time: TRANSIT_TIME,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>

        {/* Test cards */}
        <div className="flex flex-col gap-5">
          {TEST_CASES.map((tc, idx) => (
            <TestCard key={`${tc.slug}-${idx}`} tc={tc} />
          ))}
        </div>

        <div className="mt-10 text-center text-[10px] text-white/15 font-mono">
          /test/jyotisham — internal dev only — do not ship to production
        </div>
      </div>
    </div>
  );
}
