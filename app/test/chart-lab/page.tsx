"use client";

import React, { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socketio/client";
import { API_BASE_URL } from "@/lib/config/api";

/**
 * THE ARCHITECT'S LAB: SVG → PNG Rasterization Test
 * Designed for Roshan Kumar (System Architect & Backend Specialist)
 */
export default function ChartLabPage() {
    const [roomId, setRoomId] = useState("");
    const [slug, setSlug] = useState("chart_image_D1");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [resultData, setResultData] = useState<string | null>(null);
    const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'success' | 'err' }[]>([]);
    const logScrollRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string, type: 'info' | 'success' | 'err' = 'info') => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    useEffect(() => {
        if (logScrollRef.current) {
            logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        setRoomId(`lab_room_${Math.random().toString(36).substring(7)}`);
    }, []);

    useEffect(() => {
        if (!roomId) return; // Wait for client-side ID generation
        if (!socket.connected) socket.connect();
        
        socket.emit("join_jyotisham", { room_id: roomId });
        addLog(`Synchronized with Node: ${roomId}`, 'info');

        const eventKey = `jyotisham_result/${roomId}/${slug}`;
        
        const handleResult = (payload: any) => {
            addLog(`Inbound Packet Detected: ${eventKey}`, 'success');
            if (payload.success) {
                // If it's a batch result, we might get an array. But single /jyotisham/:slug sends { success, data }
                const data = payload.data || payload;
                setResultData(data);
                setStatus("success");
                addLog("Aesthetic Rasterization Complete ✓", 'success');
            } else {
                setStatus("error");
                addLog(`Downstream Fault: ${payload.error || 'Unknown Error'}`, 'err');
            }
        };

        socket.on(eventKey, handleResult);
        
        return () => {
            socket.emit("ack_jyotisham", { room_id: roomId });
            socket.off(eventKey, handleResult);
        };
    }, [roomId, slug]);

    const triggerGeneration = async () => {
        setStatus("loading");
        setResultData(null);
        addLog(`Initiating Vector Request: ${slug}`, 'info');
        
        try {
            const res = await fetch(`${API_BASE_URL}/jyotisham/${slug}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    room: roomId,
                    payload: {
                        date: "14/04/1995",
                        time: "10:30",
                        latitude: 25.6,
                        longitude: 85.1,
                        tz: 5.5,
                        lang: "en",
                        style: "north",
                        colored_planets: true
                    }
                })
            });
            
            if (res.ok) {
                addLog("POST 202: Processing Cluster Activated", 'info');
            } else {
                const errData = await res.json().catch(() => ({}));
                addLog(`Transport Error: ${res.status} - ${errData.error || 'Fail'}`, 'err');
                setStatus("error");
            }
        } catch (err: any) {
            addLog(`Network Failure: ${err.message}`, 'err');
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#050A0A] text-white p-4 md:p-12 font-sans selection:bg-[#00FF94]/30 overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 transition-opacity duration-1000">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF94] blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF8C00] blur-[150px] rounded-full opacity-50" />
            </div>

            <header className="max-w-7xl mx-auto mb-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[1px] bg-[#00FF94]" />
                            <span className="text-[#00FF94] font-mono text-[10px] uppercase font-bold tracking-[0.4em]">Sub-System Laboratory</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                            Chart <span className="text-[#00FF94]">Rasterizer</span>
                        </h1>
                        <p className="text-white/40 mt-4 max-w-lg text-sm leading-relaxed font-light italic">
                            Validating deterministic backend SVG-to-PNG conversion for high-performance astrology report components. 
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 font-mono text-[10px] tracking-widest uppercase">
                        <div className="flex items-center gap-2">
                            <span className="text-white/20 text-right">Cluster Status:</span>
                            <span className={status === "loading" ? "text-amber-400 animate-pulse" : "text-[#00FF94]"}>{status.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white/20">Session Room:</span>
                            <span className="text-white/60">{roomId || "SYNCHRONIZING..."}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                {/* Control Panel (4/12) */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl group">
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-3">
                            <div className="w-1 h-3 bg-[#00FF94]" />
                            Input Parameters
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="group/input">
                                <label className="block text-[10px] uppercase font-black text-white/20 mb-3 ml-1 tracking-[0.2em] group-focus-within/input:text-[#00FF94] transition-colors">Endpoint Slug</label>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 font-mono text-sm focus:outline-none focus:border-[#00FF94]/30 focus:shadow-[0_0_20px_rgba(0,255,148,0.05)] transition-all"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/10" />
                                </div>
                            </div>
                            
                            <button 
                                onClick={triggerGeneration}
                                disabled={status === "loading"}
                                className={`w-full group/btn relative py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-700 overflow-hidden
                                    ${status === "loading" ? "bg-white/5 text-white/10 cursor-wait border border-white/5" : "bg-[#00FF94] text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(0,255,148,0.3)]"}
                                `}
                            >
                                <span className={status === "loading" ? "animate-pulse" : ""}>
                                    {status === "loading" ? "Executing Algorithms..." : "Initialize Raster"}
                                </span>
                                {status !== "loading" && (
                                    <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out skew-x-[45deg]" />
                                )}
                            </button>
                        </div>
                    </section>

                    {/* Diagnostic Logs */}
                    <section className="bg-black/60 border border-white/5 rounded-[2.5rem] p-8 h-[350px] flex flex-col shadow-inner">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Diagnostic Data</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/30" />
                            </div>
                        </div>
                        <div ref={logScrollRef} className="flex-1 overflow-y-auto space-y-3 font-mono text-[9px] leading-relaxed pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-white/20 shrink-0">{log.time}</span>
                                    <span className={
                                        log.type === 'err' ? "text-red-400" : 
                                        log.type === 'success' ? "text-[#00FF94]" : 
                                        "text-white/60"
                                    }>
                                        {log.type === 'err' ? '[ERR]' : log.type === 'success' ? '[SYS]' : '[MSG]'}
                                        {' '}{log.msg}
                                    </span>
                                </div>
                            ))}
                            {status === "loading" && (
                                <div className="flex gap-3 animate-pulse text-[#00FF94]">
                                    <span className="text-white/20">{new Date().toLocaleTimeString()}</span>
                                    <span>[PTR] Awaiting background worker resolution...</span>
                                </div>
                            )}
                            {logs.length === 0 && (
                                <div className="text-white/10 italic text-center py-10 tracking-widest">No active telemetry...</div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Raster Engine Display (8/12) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <section className="relative group flex-1 min-h-[600px] flex flex-col">
                        <div className="absolute inset-0 bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-2">
                            <div className="h-full w-full bg-[#FFFDF5] rounded-[3.1rem] overflow-hidden flex flex-col items-center justify-center p-12 transition-all duration-700 shadow-[0_0_100px_rgba(255,253,245,0.05)] relative bg-pattern">
                                {resultData ? (
                                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                                        <div className="relative">
                                            <div className="absolute inset-x-0 -bottom-10 h-20 bg-black/20 blur-2xl rounded-full opacity-60" />
                                            <img 
                                                src={resultData} 
                                                alt="Backend Rasterization Result" 
                                                className="max-w-full max-h-[500px] object-contain relative z-10 scale-100 hover:scale-[1.02] transition-transform duration-700 pointer-events-none"
                                            />
                                        </div>
                                        <div className="mt-16 flex flex-col items-center gap-3">
                                            <div className="px-6 py-2 bg-black text-[#00FF94] rounded-full text-[9px] font-mono font-black uppercase tracking-[0.4em] border border-[#00FF94]/20 shadow-[0_0_30px_rgba(0,255,148,0.15)]">
                                                Raster Success
                                            </div>
                                            <span className="text-black/30 font-mono text-[9px] uppercase tracking-widest font-bold">
                                                Source: Node-Sharp Conversion | {Math.round(resultData.length / 1024)} KB
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center group">
                                        <div className="w-24 h-24 border border-black/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-black/5 transition-colors duration-500">
                                            <div className="w-1.5 h-1.5 bg-black/10 rounded-full animate-ping" />
                                        </div>
                                        <p className="text-black/20 font-mono text-[10px] uppercase tracking-[0.5em] font-black">
                                            Engine Partition Idle
                                        </p>
                                    </div>
                                )}
                                
                                {status === "error" && (
                                    <div className="absolute inset-0 bg-red-600 flex items-center justify-center p-20 text-center animate-in slide-in-from-bottom duration-500">
                                        <div className="max-w-md">
                                            <h3 className="text-white font-black text-4xl tracking-tighter mb-4">CRITICAL FAULT</h3>
                                            <p className="text-white/60 font-mono text-[10px] uppercase leading-relaxed tracking-widest">
                                                The processing cluster encountered a logical exception during vector rasterization. Check server logs for stack trace.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Decoration tags */}
                        <div className="absolute top-8 left-8 text-[9px] font-mono text-black/10 z-20 pointer-events-none">VIEWPORTA_ACTIVE</div>
                        <div className="absolute bottom-8 right-8 text-[9px] font-mono text-black/10 z-20 pointer-events-none uppercase">Architect Labs v1.0</div>
                    </section>
                </div>
            </main>

            <footer className="max-w-7xl mx-auto mt-24 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 text-[10px] font-mono text-white/10 uppercase tracking-[0.4em]">
                <div className="flex items-center gap-4">
                    <span className="w-3 h-3 border border-white/10 rounded-full" />
                    Deterministic Chart Generator
                </div>
                <div className="flex items-center gap-8">
                    <a href="/" className="hover:text-[#00FF94] transition-colors leading-none pt-0.5">Core Home</a>
                    <span className="text-[#00FF94]/40">Authenticated System</span>
                </div>
            </footer>
            
            <style jsx global>{`
                .bg-pattern {
                    background-image: radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0);
                    background-size: 32px 32px;
                }
                ::-webkit-scrollbar {
                    width: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
