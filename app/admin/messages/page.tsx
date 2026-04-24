"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  User, 
  MessageSquare,
  Search,
  Filter,
  RefreshCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { getContactMessages, updateMessageStatus } from "@/app/actions/contact-actions";
import { toast } from "sonner";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "read">("all");

  const fetchMessages = async () => {
    setLoading(true);
    const result = await getContactMessages();
    if (result.success) {
      setMessages(result.messages as Message[]);
    } else {
      toast.error("Failed to load messages from the database.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusUpdate = async (id: string, status: "read" | "replied") => {
    const result = await updateMessageStatus(id, status);
    if (result.success) {
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      toast.success(`Message marked as ${status}.`);
    } else {
      toast.error("Failed to update message status.");
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || m.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* ── Header Section ── */}
      {/* ── Header Section matching Dashboard Style ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <Mail size={14} /> Communication Log
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            User <span className="text-primary italic">Inquiries</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Real-time synchronization of direct communications from the portal.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Mail size={14} /> {messages.length} ACTIVE THREADS
          </div>
        </div>
      </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchMessages}
            disabled={loading}
            className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-primary transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <div className="h-10 w-px bg-slate-200 dark:bg-white/10 mx-1" />
          
          <div className="flex bg-slate-100 dark:bg-white/[0.03] p-1 rounded-xl border border-slate-200 dark:border-white/10">
            {(["all", "new", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filter === f 
                    ? "bg-white dark:bg-primary/20 text-primary dark:text-primary shadow-sm border border-slate-200 dark:border-primary/30" 
                    : "text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>


      {/* ── Search Bar ── */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Filter by name, email, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm dark:shadow-none"
        />
      </div>

      {/* ── Messages Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-slate-200/50 dark:bg-white/[0.02] animate-pulse border border-slate-200 dark:border-white/5" />
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem]">
          <div className="w-16 h-16 bg-slate-100 dark:bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-zinc-700" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No communications found</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">Adjust your filters or sync with the core.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((msg) => (
              <motion.div
                layout
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-500 overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                  msg.status === "new" ? "bg-primary" : "bg-slate-300 dark:bg-zinc-800"
                }`} />

                <div className="p-7">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                          {msg.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-zinc-500 truncate max-w-[200px]">
                            {msg.email}
                          </span>
                          <a href={`mailto:${msg.email}`} className="text-primary hover:text-primary/80 transition-colors">
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                         msg.status === "new" 
                           ? "bg-primary/10 text-primary border border-primary/20" 
                           : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-white/10"
                       }`}>
                         {msg.status}
                       </span>
                       <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-600 font-mono">
                         <Clock size={10} />
                         {new Date(msg.createdAt).toLocaleDateString()}
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-black/20 rounded-2xl p-5 mb-6 border border-slate-200 dark:border-white/5 relative">
                    <MessageSquare size={14} className="absolute top-4 right-4 text-slate-300 dark:text-zinc-800" />
                    <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                      &quot;{msg.message}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {msg.status === "new" && (
                        <button 
                          onClick={() => handleStatusUpdate(msg._id, "read")}
                          className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                        >
                          <CheckCircle2 size={14} />
                          Mark as Read
                        </button>
                      )}
                      {msg.status === "read" && (
                        <button 
                          onClick={() => handleStatusUpdate(msg._id, "replied")}
                          className="flex items-center gap-2 text-xs font-bold text-teal-500 hover:text-teal-400 transition-colors uppercase tracking-widest"
                        >
                          <MessageSquare size={14} />
                          Mark Replied
                        </button>
                      )}
                    </div>
                    
                    <button className="p-2 text-slate-300 dark:text-zinc-700 hover:text-red-400 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Footer Stats ── */}
      <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary/50" />
            <span>MongoDB Encrypted Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCcw size={14} className="opacity-50" />
            <span>Real-time Sync</span>
          </div>
        </div>
        <div>
          Total Inquiries: {messages.length}
        </div>
      </footer>
    </div>
  );
}
