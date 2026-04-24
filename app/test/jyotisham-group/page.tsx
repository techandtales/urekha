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

interface TaskResult {
  task: string;
  status: "success" | "error";
  data?: any;
  error?: string;
}

interface BatchCase {
  id: string;
  label: string;
  tasks: any[];
  taskLabels: string[];
  payload: Record<string, any>;
}

interface TestState {
  status: "idle" | "running" | "success" | "error" | "partial";
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
  httpStatus: number | null;
  results: TaskResult[];
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

// Today's date for transit
const today = new Date();
const TRANSIT_DATE = "12/04/2026";
const TRANSIT_TIME = "20:00";

const SVG_PAYLOAD = {
  ...BASE_PAYLOAD,
  style: "north",
  colored_planets: true,
  color: "#00FF94",
  transit_date: TRANSIT_DATE,
  transit_time: TRANSIT_TIME,
};

// ─── Batch cases ─────────────────────────────────────────────────────────────

const BATCH_CASES: BatchCase[] = [
  {
    id: "batch_standard",
    label: "Standard Horoscope Info",
    tasks: ["planet_details", "ascendant_report", "dosha_mangal", "ashtakvarga"],
    taskLabels: ["Planet Details", "Ascendant Report", "Mangal Dosha", "Ashtakvarga"],
    payload: BASE_PAYLOAD,
  },
  {
    id: "batch_charts_svg",
    label: "Charts + SVG Info",
    tasks: ["divisional_chart_D1", "divisional_chart_D9", "chart_image_D1"],
    taskLabels: ["D1 Chart Data", "D9 Chart Data", "D1 SVG Image"],
    payload: SVG_PAYLOAD,
  },
  {
    id: "batch_dashas",
    label: "Dasha Timeline",
    tasks: ["dasha_current_maha", "dasha_maha"],
    taskLabels: ["Current Mahadasha", "All Mahadashas"],
    payload: BASE_PAYLOAD,
  },
  {
    id: "batch_mixed_svg_transit",
    label: "Extended Transit + SVG",
    tasks: ["extended_current_sadesati", "transit_chart"],
    taskLabels: ["Sade Sati", "Transit D1 SVG"],
    payload: SVG_PAYLOAD,
  },
  {
    id: "batch_binnashtakvarga",
    label: "Bhinnashtakvarga Matrix",
    tasks: ["binnashtakvarga_Sun", "binnashtakvarga_Moon"],
    taskLabels: ["Sun Points", "Moon Points"],
    payload: BASE_PAYLOAD,
  }
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
  httpStatus: null,
  results: [],
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

function TaskResultCard({ result, label }: { result: TaskResult; label: string }) {
  const [open, setOpen] = useState(false);
  const isSuccess = result.status === "success";

  const preview = React.useMemo(() => {
    if (!result.data) return null;
    if (typeof result.data === "string" && result.data.includes("<svg")) return "SVG Data Block [" + result.data.slice(0, 150) + "...]";
    if (typeof result.data === "object") return JSON.stringify(result.data).slice(0, 150) + "...";
    return null;
  }, [result.data]);

  return (
    <div className={`border rounded-xl overflow-hidden ${isSuccess ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-base ${isSuccess ? "text-emerald-400" : "text-red-400"}`}>
            {isSuccess ? "✓" : "✕"}
          </span>
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold text-white/80 truncate">{label}</p>
            <p className="text-[10px] font-mono text-white/35 mt-0.5">{result.task}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isSuccess && (
            <span className="text-[10px] text-red-400/80 font-mono max-w-[140px] truncate">
              {result.error}
            </span>
          )}
          <span className="text-[10px] text-white/25">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {isSuccess && preview && (
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1.5">Preview</p>
              <p className="text-[11px] text-white/60 leading-relaxed font-mono italic border-l-2 border-emerald-500/30 pl-3">
                {preview}
              </p>
            </div>
          )}
          <div>
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1.5">Full data</p>
            <pre className="text-[10px] font-mono text-cyan-200 bg-black/50 p-3 rounded-lg overflow-x-auto max-h-56 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Test Card ────────────────────────────────────────────────────────────────

function TestCard({ bc }: { bc: BatchCase }) {
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
    setState({ ...INIT_STATE, status: "running", steps: { ...INIT_STEPS }, logs: [], results: [] });
    idRef.current = 0;

    const roomId = `room_jyo_grp_${bc.id}_${Date.now()}`;
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

    socket.emit("join_jyotisham_group", { room_id: roomId });
    log("info", `Emitted join_jyotisham_group  { room_id: "${roomId}" }`);

    // ── 1. HTTP POST ──────────────────────────────────────────────────────
    setStep("httpSent", "running");
    const batchSlug = bc.id;
    const url = `${BACKEND_URL}/jyotisham/group/${batchSlug}`;
    const requestBody = {
      room: roomId,
      tasks: bc.tasks,
      payload: bc.payload,
    };
    log("info", `POST ${url}`);
    const taskNames = bc.tasks.map((t: any) => typeof t === "string" ? t : t.task);
    log("info", `tasks: [${taskNames.join(", ")}]`);

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
    const eventKey = `jyotisham_group_result/${roomId}/${batchSlug}`;
    log("info", `Listening for: ${eventKey}`);
    log("info", "Timeout: 3 minutes");

    const socketData: TaskResult[] | null = await new Promise<TaskResult[]>((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventKey);
        reject(new Error(`No response after 180s. Event: ${eventKey}`));
      }, 180000); // 3 min

      socket.once(eventKey, (data: any) => {
        clearTimeout(timer);
        resolve(Array.isArray(data) ? data : [data]);
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
    setState((prev) => ({ ...prev, results: socketData }));

    const successCount = socketData.filter((r) => r.status === "success").length;
    const errorCount = socketData.filter((r) => r.status === "error").length;

    log(
      successCount === bc.tasks.length ? "success" : "warn",
      `Received ${socketData.length} results — ${successCount} success, ${errorCount} error`
    );

    socketData.forEach((r) => {
      if (r.status === "success") {
        log("success", `[${r.task}] ✓ success`);
      } else {
        log("error", `[${r.task}] ✕ error: ${r.error ?? "unknown"}`);
      }
    });

    // ── 4. ACK ────────────────────────────────────────────────────────────
    setStep("ackSent", "running");
    socket.emit("ack_jyotisham_group", { room_id: roomId, slug: batchSlug });
    socket.off(eventKey);
    log("info", `Emitted ack_jyotisham_group  { room_id: "${roomId}", slug: "${batchSlug}" }`);
    setStep("ackSent", "success");

    const finalStatus = errorCount === 0 ? "success" : successCount > 0 ? "partial" : "error";
    setState((prev) => ({ ...prev, status: finalStatus }));
    log(
      finalStatus === "success" ? "success" : finalStatus === "partial" ? "warn" : "error",
      finalStatus === "success"
        ? "✓ All jyotisham tasks received successfully!"
        : finalStatus === "partial"
          ? `⚠ ${successCount}/${bc.tasks.length} succeeded — check individual results`
          : "✕ All tasks failed"
    );
  }, [bc, log, setStep]);

  const reset = useCallback(() => {
    setState(INIT_STATE);
    idRef.current = 0;
  }, []);

  const border: Record<string, string> = {
    idle: "border-white/[0.08]",
    running: "border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.07)]",
    success: "border-emerald-500/50 shadow-[0_0_16px_rgba(52,211,153,0.08)]",
    partial: "border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.06)]",
    error: "border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.08)]",
  };

  const STEPS: { key: keyof TestState["steps"]; label: string }[] = [
    { key: "roomConnected",  label: "0. Socket connected & join_jyotisham_group emitted" },
    { key: "httpSent",       label: "1. HTTP POST /jyotisham/group/:slug sent" },
    { key: "httpResponse",   label: "2. HTTP response received (expect 202)" },
    { key: "waitingSocket",  label: "3. Awaiting jyotisham_group_result socket event…" },
    { key: "socketReceived", label: "4. Socket event received — results array parsed" },
    { key: "ackSent",        label: "5. ACK sent & listener cleaned up" },
  ];

  return (
    <div className={`bg-[#080d0d] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${border[state.status]}`}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <code className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
              POST /jyotisham/group/{bc.id}
            </code>
            {{
              idle: null,
              running: <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse">◌ RUNNING</span>,
              success: <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">✓ PASS</span>,
              partial: <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">⚠ PARTIAL</span>,
              error:   <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">✕ FAIL</span>,
            }[state.status]}
          </div>
          <h3 className="font-semibold text-white text-sm">{bc.label}</h3>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            {bc.tasks.map((t, i) => {
              const slug = typeof t === "string" ? t : t.task;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {slug}
                  </span>
                  <span className="text-[9px] text-white/30">{bc.taskLabels[i]}</span>
                  {i < bc.tasks.length - 1 && <span className="text-white/20 text-xs">+</span>}
                </div>
              );
            })}
          </div>
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
      {state.results.length > 0 && (
        <div className="space-y-2">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest px-1">Socket Results ({state.results.length} tasks)</p>
          {state.results.map((result, i) => (
            <TaskResultCard
              key={`${result.task}-${i}`}
              result={result}
              label={bc.taskLabels[i] ?? result.task}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JyotishamGroupTestPage() {
  return (
    <div className="min-h-screen bg-[#050a0a] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,1)]" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.25em]">Dev · Jyotisham Batch Test</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Jyotisham Group{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
              Socket Flow
            </span>{" "}
            Test Suite
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Each test fires{" "}
            <code className="text-cyan-400/80">POST /jyotisham/group/:slug</code> with{" "}
            <strong className="text-white/60">multiple tasks</strong> and tracks the full lifecycle.
            Socket listens for{" "}
            <code className="text-indigo-400/80">jyotisham_group_result</code> which returns an{" "}
            <strong className="text-white/60">array of task results</strong>.
          </p>
        </div>

        <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">Request Body Shape</p>
            <pre className="text-[10px] font-mono text-cyan-300 leading-relaxed">
{`{
  "room": "<uuid>",
  "tasks": ["planet_details", "ascendant_report"],
  "payload": {
    "date": "15/01/1995",
    "time": "14:30",
    ...
  }
}`}
            </pre>
          </div>
          <div>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1 mb-1">Socket Events</p>
            <div className="space-y-0.5 font-mono text-[10px]">
              <div><span className="text-white/30">Join: </span><span className="text-blue-300">join_jyotisham_group</span></div>
              <div><span className="text-white/30">Listen: </span><span className="text-emerald-300">jyotisham_group_result/{"{room}/{slug}"}</span></div>
              <div><span className="text-white/30">ACK: </span><span className="text-amber-300">ack_jyotisham_group</span></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {BATCH_CASES.map((bc) => (
            <TestCard key={bc.id} bc={bc} />
          ))}
        </div>
      </div>
    </div>
  );
}
