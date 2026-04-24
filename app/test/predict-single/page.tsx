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

// ─── Base payload (matches Jyotisham API Zod schema) ─────────────────────────

const BASE_PAYLOAD = {
  date: "15/01/1995",    // DD/MM/YYYY
  time: "14:30",
  latitude: 25.5941,     // Patna, Bihar
  longitude: 85.1376,
  tz: 5.5,
  lang: "en",
};

// ─── Single Prediction Test Cases ────────────────────────────────────────────
// Slug format: {category}-{wordCount}  e.g. career-1200

const TEST_CASES = [
  { slug: "career-1200", label: "Career & Profession", desc: "1200-word detailed career outlook" },
  { slug: "finance-1200", label: "Wealth & Prosperity", desc: "1200-word financial analysis" },
  { slug: "health-1200", label: "Health & Vitality", desc: "1200-word health prediction" },
  { slug: "love-relation-1200", label: "Love & Relationships", desc: "1200-word relationship forecast" },
  { slug: "education-1200", label: "Education & Learning", desc: "1200-word educational path analysis" },
  // --- Hindi Test Cases ---
  { slug: "health-1200", lang: "hi", label: "Health (Hindi)", desc: "Hindi health analysis" },
  { slug: "career-1200", lang: "hi", label: "Career (Hindi)", desc: "Hindi career outlook" },
  { slug: "marriage-2000", lang: "hi", label: "Marriage (Hindi - Premium)", desc: "Premium Hindi marriage analysis with Venus Bhinnashtakvarga" },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4040";

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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
  const color = {
    idle: "text-white/25", running: "text-cyan-300",
    success: "text-emerald-300", error: "text-red-300", skipped: "text-white/20",
  };
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
  const text = { info: "text-white/55", success: "text-emerald-300", error: "text-red-300", warn: "text-amber-300" };
  return (
    <div ref={ref} className="h-36 overflow-y-auto space-y-1 font-mono text-[11px] pr-1" style={{ scrollbarWidth: "thin" }}>
      {logs.length === 0 && <div className="text-white/20 italic text-center py-4">Run test to see activity…</div>}
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

function JsonBlock({ title, data, defaultOpen = false }: { title: string; data: any; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!data) return null;
  const isSuccess = data?.success === true;
  return (
    <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl overflow-hidden mt-3">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
      >
        <span className="text-[11px] font-mono text-emerald-400/80">{title}</span>
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

function TestCard({ tc }: { tc: { slug: string; label: string; desc: string; lang?: string } }) {
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

    const roomId = `room_pred_sgl_${tc.slug}_${Date.now()}`;
    setState((prev) => ({ ...prev, roomId }));

    // ── 0. Connect & join room ────────────────────────────────────────────
    setStep("roomConnected", "running");
    log("info", `Connecting socket to ${BACKEND_URL}…`);

    await new Promise<void>((resolve) => {
      if (socket.connected) {
        log("success", `Socket already connected  id=${socket.id}`);
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

    socket.emit("join_predict", { room_id: roomId });
    log("info", `Emitted join_predict  { room_id: "${roomId}" }`);

    // ── 1. HTTP POST ──────────────────────────────────────────────────────
    setStep("httpSent", "running");
    const url = `${BACKEND_URL}/predict/${tc.slug}`;
    const payloadWithLang = { ...BASE_PAYLOAD, lang: tc.lang || BASE_PAYLOAD.lang };
    const requestBody = { room: roomId, payload: payloadWithLang };
    log("info", `POST ${url}`);

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
        log("info", "Response body: (no JSON body — expected for 202 Accepted)");
      }

      setStep("httpResponse", httpOk ? "success" : "error");

      if (!httpOk) {
        log("error", `Unexpected HTTP ${status}. Stopping.`);
        setState((prev) => ({ ...prev, status: "error" }));
        (["waitingSocket", "socketReceived", "ackSent"] as const).forEach((k) => setStep(k, "skipped"));
        return;
      }
    } catch (err: any) {
      setStep("httpSent", "error");
      setStep("httpResponse", "error");
      log("error", `Fetch failed: ${err.message}`);
      log("error", `Is the backend running on ${BACKEND_URL}?`);
      setState((prev) => ({ ...prev, status: "error" }));
      (["waitingSocket", "socketReceived", "ackSent"] as const).forEach((k) => setStep(k, "skipped"));
      return;
    }

    // ── 2. Wait for socket event ──────────────────────────────────────────
    setStep("waitingSocket", "running");
    const eventKey = `predict_result/${roomId}/${tc.slug}`;
    log("info", `Listening for: ${eventKey}`);
    log("info", "Timeout: 5 minutes (AI generation takes time)");

    const socketData: any = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventKey);
        reject(new Error(`No response after 300s. Event: ${eventKey}`));
      }, 300000); // 5 min

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

    // ── 3. Process results ────────────────────────────────────────────────
    setStep("waitingSocket", "success");
    setStep("socketReceived", "success");
    setState((prev) => ({ ...prev, socketPayload: socketData }));

    const isSuccess = socketData?.success === true;
    log(isSuccess ? "success" : "error", `Received result: ${isSuccess ? "success" : socketData?.error}`);

    // ── 4. ACK ────────────────────────────────────────────────────────────
    setStep("ackSent", "running");
    socket.emit("ack_predict", { room_id: roomId, slug: tc.slug });
    socket.off(eventKey);
    log("info", `Emitted ack_predict  { room_id: "${roomId}", slug: "${tc.slug}" }`);
    setStep("ackSent", "success");

    setState((prev) => ({ ...prev, status: isSuccess ? "success" : "error" }));
    log(
      isSuccess ? "success" : "error",
      isSuccess ? "✓ Individual prediction received successfully!" : "✕ Prediction failed"
    );
  }, [tc, log, setStep]);

  const reset = useCallback(() => {
    setState(INIT_STATE);
    idRef.current = 0;
  }, []);

  const border: Record<string, string> = {
    idle: "border-white/[0.08]",
    running: "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.07)]",
    success: "border-emerald-500/50 shadow-[0_0_16px_rgba(52,211,153,0.08)]",
    error: "border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.08)]",
  };

  const STEPS: { key: keyof TestState["steps"]; label: string }[] = [
    { key: "roomConnected",  label: "0. Socket connected & join_predict emitted" },
    { key: "httpSent",       label: "1. HTTP POST /predict/:slug sent" },
    { key: "httpResponse",   label: "2. HTTP response received (expect 202)" },
    { key: "waitingSocket",  label: "3. Awaiting predict_result socket event…" },
    { key: "socketReceived", label: "4. Socket event received" },
    { key: "ackSent",        label: "5. ACK sent & listener cleaned up" },
  ];

  return (
    <div className={`bg-[#080d0d] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${border[state.status]}`}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <code className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
              POST /predict/{tc.slug}
            </code>
            {{
              idle: null,
              running: <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase animate-pulse">◌ RUNNING</span>,
              success: <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">✓ PASS</span>,
              error:   <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">✕ FAIL</span>,
            }[state.status]}
          </div>
          <h3 className="font-semibold text-white text-sm">{tc.label}</h3>
          <p className="text-xs text-white/40 mt-1">{tc.desc}</p>
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
                ? "bg-purple-500/10 text-purple-400/50 border-purple-500/20 cursor-wait"
                : "bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25 hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            }`}
          >
            {state.status === "running" ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* ── Step tracker + meta ── */}
      {state.status !== "idle" && (
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
                  <span className="text-[10px] font-mono text-white/45 truncate max-w-[180px]">{state.roomId}</span>
                </>
              )}
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

      {/* ── Task Results ── */}
      {state.socketPayload && (
        <div className="space-y-2">
          <JsonBlock title={`Socket Event Data — success: ${state.socketPayload?.success}`} data={state.socketPayload} defaultOpen={true} />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PredictSingleTestPage() {
  return (
    <div className="min-h-screen bg-[#050a0a] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" />
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.25em]">Dev · AI Prediction Test</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Predict Single{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              Socket Flow
            </span>{" "}
            Test Suite
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Each test fires{" "}
            <code className="text-purple-400/80">POST /predict/:slug</code> for a{" "}
            <strong className="text-white/60">single prediction</strong> and tracks the full lifecycle.
            Socket listens for{" "}
            <code className="text-pink-400/80">predict_result</code> which returns an object.
          </p>
        </div>

        <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Request Body Shape</p>
            <pre className="text-[10px] font-mono text-purple-300 leading-relaxed">
{`{
  "room": "<uuid>",
  "payload": {
    "date": "15/01/1995",
    "time": "14:30",
    "latitude": 25.5941,
    "longitude": 85.1376,
    ...
  }
}`}
            </pre>
          </div>
          <div>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1 mb-1">Socket Events</p>
            <div className="space-y-0.5 font-mono text-[10px]">
              <div><span className="text-white/30">Join: </span><span className="text-purple-300">join_predict</span></div>
              <div><span className="text-white/30">Listen: </span><span className="text-emerald-300">predict_result/{"{room}/{slug}"}</span></div>
              <div><span className="text-white/30">ACK: </span><span className="text-amber-300">ack_predict</span></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {TEST_CASES.map((tc) => (
            <TestCard key={`${tc.slug}-${tc.lang || 'en'}`} tc={tc} />
          ))}
        </div>
      </div>
    </div>
  );
}
