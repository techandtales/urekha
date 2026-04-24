"use client";

import React, { useState } from "react";
import { socket } from "@/lib/socketio/client";
import dynamic from "next/dynamic";
import { Document } from "@react-pdf/renderer";
import ReactPdfPredictionsView, { CategoryPage } from "@/components/ReactPdfRendererPages/predictions/ReactPdfPredictionsView";

// Dynamically import PDFViewer to avoid SSR window/navigator errors
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

// ─── Base payload (matches Jyotisham/Predict Zod schema) ───────────────
const BASE_PAYLOAD = {
  date: "15/01/1995",
  time: "14:30",
  latitude: 25.5941,
  longitude: 85.1376,
  tz: 5.5,
  lang: "en",
};

const TEST_CASES = [
  { slug: "career-1200", category: "career", label: "Career & Profession" },
  { slug: "finance-1200", category: "finance", label: "Wealth & Prosperity" },
  { slug: "health-1200", category: "health", label: "Health & Vitality" },
  { slug: "love-relation-1200", category: "love", label: "Love & Relationships" },
  { slug: "education-1200", category: "education", label: "Education & Learning" },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4040";

export default function PdfPredictTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeSocketData, setActiveSocketData] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("");

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const runTest = async (tc: { slug: string; category: string; label: string }) => {
    setIsRunning(true);
    setLogs([]);
    setActiveSocketData(null);
    setActiveCategory(tc.category);

    const roomId = `room_pdfpred_${tc.slug}_${Date.now()}`;
    addLog(`[INIT] Connecting socket to ${BACKEND_URL}...`);

    await new Promise<void>((resolve) => {
      if (socket.connected) {
        addLog(`[SOCKET] Already connected with id: ${socket.id}`);
        resolve();
      } else {
        socket.once("connect", () => {
          addLog(`[SOCKET] Connected with id: ${socket.id}`);
          resolve();
        });
        socket.connect();
      }
    });

    socket.emit("join_predict", { room_id: roomId });
    addLog(`[ROOM] Joined predict room: ${roomId}`);

    const url = `${BACKEND_URL}/predict/${tc.slug}`;
    addLog(`[HTTP] Sending POST to ${url}`);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: roomId, payload: BASE_PAYLOAD }),
      });
      
      addLog(`[HTTP] Status: ${res.status} ${res.statusText}`);

      if (!res.ok && res.status !== 202) {
        addLog(`[ERROR] Fetch failed with status ${res.status}`);
        setIsRunning(false);
        return;
      }
    } catch (e: any) {
      addLog(`[ERROR] Fetch Error: ${e.message}`);
      setIsRunning(false);
      return;
    }

    const eventKey = `predict_result/${roomId}/${tc.slug}`;
    addLog(`[WAIT] Listening for socket event: ${eventKey}`);

    const socketData: any = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventKey);
        reject(new Error("Socket listener timed out after 5 minutes."));
      }, 300000);

      socket.once(eventKey, (data: any) => {
        clearTimeout(timer);
        resolve(data);
      });
    }).catch((e) => {
      addLog(`[ERROR] Socket error: ${e.message}`);
      setIsRunning(false);
      return null;
    });

    if (socketData) {
      addLog(`[RESULT] Socket data received! Success: ${socketData.success}`);
      
      socket.off(eventKey);
      socket.emit("ack_predict", { room_id: roomId, slug: tc.slug });
      addLog(`[CLEANUP] ACK emitted for ${tc.slug}`);
      
      // Delay state update by 100ms so Socket.IO can flush the ACK packet
      // before React PDF synchronously blocks the main thread.
      setTimeout(() => {
        setActiveSocketData(socketData);
      }, 100);
    }

    setIsRunning(false);
    addLog(`[DONE] Test execution complete.`);
  };

  return (
    <div className="min-h-screen bg-[#050A0A] text-white p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
              Laboratory
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI PDF Generation Test</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Send a prediction trigger to the backend queue, await the socket response, and instantly 
            inject the generated output directly into the <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">ReactPdfPredictionsView</code>.
          </p>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TEST_CASES.map((tc) => (
            <button
              key={tc.slug}
              onClick={() => runTest(tc)}
              disabled={isRunning}
              className={`px-4 py-3 text-xs md:text-sm font-semibold rounded-lg border transition-all ${
                isRunning 
                  ? "bg-zinc-800/50 border-zinc-700 text-zinc-500 cursor-not-allowed" 
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              }`}
            >
              Test {tc.label}
            </button>
          ))}
        </div>

        {/* Logs Console */}
        <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 flex flex-col">
          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Execution Output
          </h3>
          <div className="h-40 overflow-y-auto space-y-1.5 pr-2 font-mono text-[11px]">
            {logs.length === 0 ? (
              <span className="text-zinc-600 italic">Awaiting execution run...</span>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`${log.includes("[ERROR]") ? "text-red-400" : log.includes("[RESULT]") ? "text-emerald-400" : "text-zinc-400"}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* PDF Viewer Render */}
        {activeSocketData?.success && activeSocketData?.data && (
          <div className="flex flex-col bg-zinc-900 border border-zinc-700 p-2 rounded-xl h-[85vh]">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest px-2 py-3">
              Rendered PDF Document
            </h3>
            <div className="flex-1 bg-zinc-950 rounded-lg overflow-hidden border border-black shadow-inner relative">
              <PDFViewer style={{ width: "100%", height: "100%", border: "none" }}>
                <Document>
                  <CategoryPage
                    category={activeCategory}
                    // ReactPdfPredictionsView expects data as a string fallback
                    data={
                      typeof activeSocketData.data === "string"
                        ? activeSocketData.data
                        : JSON.stringify(activeSocketData.data, null, 2)
                    }
                    // If JSON blocks exist, provide it directly object
                    structured={
                      typeof activeSocketData.data !== "string" &&
                      activeSocketData.data?.blocks
                        ? activeSocketData.data
                        : null
                    }
                    isHindi={false}
                  />
                </Document>
              </PDFViewer>
            </div>
          </div>
        )}

        {/* Failure Message */}
        {activeSocketData && !activeSocketData.success && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
            <h4 className="font-bold mb-1">Prediction Failed</h4>
            <p className="text-sm opacity-80 font-mono">
              {activeSocketData.error || "Unknown backend failure."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
