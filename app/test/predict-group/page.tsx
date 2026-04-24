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
  results: any[] | null;
  httpStatus: number | null;
}

const BASE_PAYLOAD = {
  date: "15/01/1995",
  time: "14:30",
  latitude: 25.5941,
  longitude: 85.1376,
  tz: 5.5,
  lang: "en",
};

// ─── Group Test Cases ─────────────────────────────────────────────────────────

const TEST_GROUPS = [
  {
    id: "group-1-en",
    label: "Professional & Financial (English)",
    desc: "Career and Finance analysis in a single batch.",
    tasks: ["career-1200", "finance-1200"],
    lang: "en"
  },
  {
    id: "group-2-hi",
    label: "स्वास्थ्य और संबंध (Hindi)",
    desc: "Health and Relationship analysis in a Hindi batch.",
    tasks: ["health-1200", "love-relation-1200"],
    lang: "hi"
  }
];

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4040";

function nowStr() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" } as any);
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
  results: null,
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
      <span className={`text-[11px] font-mono ${color[status]}`}>{label}</span>
    </div>
  );
}

function LogFeed({ logs }: { logs: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs.length]);
  return (
    <div ref={ref} className="h-40 overflow-y-auto space-y-1 font-mono text-[10px] pr-1" style={{ scrollbarWidth: "thin" }}>
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-2">
          <span className="text-white/25 shrink-0">{l.time}</span>
          <span className={`flex-1 leading-relaxed ${l.status === 'error' ? 'text-red-300' : l.status === 'success' ? 'text-emerald-300' : 'text-white/50'}`}>{l.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Group Card ────────────────────────────────────────────────────────────────

function GroupCard({ group }: { group: typeof TEST_GROUPS[0] }) {
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
    const roomId = `room_group_${Date.now()}`;
    const slugId = `batch_${group.id}`;
    setState((prev) => ({ ...prev, roomId }));

    // 0. Socket
    setStep("roomConnected", "running");
    if (!socket.connected) await new Promise<void>(r => { socket.once("connect", r); socket.connect(); });
    socket.emit("join_predict", { room_id: roomId });
    setStep("roomConnected", "success");
    log("info", `Joined room: ${roomId}`);

    // 1. HTTP POST
    setStep("httpSent", "running");
    const url = `${BACKEND_URL}/predict/group/${slugId}`;
    const payload = { ...BASE_PAYLOAD, lang: group.lang };
    const requestBody = { room: roomId, tasks: group.tasks, payload };
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      setState((prev) => ({ ...prev, httpStatus: res.status }));
      setStep("httpSent", "success");
      setStep("httpResponse", res.ok ? "success" : "error");
      log(res.ok ? "success" : "error", `HTTP ${res.status}: ${res.statusText}`);
      if (!res.ok) return;
    } catch (err: any) {
      log("error", `Request failed: ${err.message}`);
      return;
    }

    // 2. Socket Listen
    setStep("waitingSocket", "running");
    const eventKey = `predict_group_result/${roomId}/${slugId}`;
    log("info", `Awaiting: ${eventKey}`);

    const results: any = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout after 8 minutes")), 480000);
      socket.once(eventKey, (data) => { clearTimeout(timer); resolve(data); });
    }).catch(err => { log("error", err.message); return null; });

    if (results) {
      setStep("waitingSocket", "success");
      setStep("socketReceived", "success");
      setState(prev => ({ ...prev, results, status: "success" }));
      log("success", `Batch completed! Received ${results.length} results.`);
      
      setStep("ackSent", "running");
      socket.emit("ack_predict", { room_id: roomId, slug: slugId });
      setStep("ackSent", "success");
    } else {
      setStep("waitingSocket", "error");
      setState(prev => ({ ...prev, status: "error" }));
    }
  }, [group, log, setStep]);

  return (
    <div className={`bg-[#080d0d] border rounded-2xl p-6 transition-all duration-300 ${state.status === 'running' ? 'border-purple-500/50 shadow-lg' : 'border-white/[0.08]'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{group.label}</h3>
          <p className="text-xs text-white/40 mb-3">{group.desc}</p>
          <div className="flex gap-2">
            {group.tasks.map(t => (
              <span key={t} className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
                {t}
              </span>
            ))}
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">
              {group.lang}
            </span>
          </div>
        </div>
        <button
          onClick={run}
          disabled={state.status === "running"}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
        >
          {state.status === "running" ? "Processing..." : "▶ Run Group"}
        </button>
      </div>

      {state.status !== "idle" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.05]">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Pipeline</p>
            {Object.entries(state.steps).map(([k, v]) => (
              <StepRow key={k} label={k} status={v as any} />
            ))}
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.05]">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Logs</p>
            <LogFeed logs={state.logs} />
          </div>
        </div>
      )}

      {state.results && (
        <div className="mt-4 space-y-3">
          {state.results.map((r, i) => (
             <div key={i} className="border border-white/[0.05] bg-white/[0.02] rounded-xl p-3">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{r.task}</span>
                 <span className={`text-[9px] px-2 py-0.5 rounded ${r.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {r.status.toUpperCase()}
                 </span>
               </div>
               {r.status === 'success' ? (
                 <div className="text-[10px] text-white/60 line-clamp-3 font-serif italic">
                   {JSON.stringify(r.data.blocks?.[1]?.text || "No preview text")}
                 </div>
               ) : (
                 <div className="text-[10px] text-red-400">{r.error}</div>
               )}
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PredictGroupTestPage() {
  return (
    <div className="min-h-screen bg-[#050a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_purple]" />
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Dev · Batch Processing Test</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 mb-4">
            Predict Group Flow Test
          </h1>
          <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
            Test the aggregation of multiple AI predictions into a single ordered socket packet. 
            This validates the <code className="text-purple-400">predict_group_parent</code> aggregation logic and 
            child task parallel execution.
          </p>
        </header>

        <div className="space-y-8">
          {TEST_GROUPS.map(g => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
