"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sparkles, AlertCircle, Moon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "transit" | "reading" | "alert" | "info";
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Jupiter Transit Update",
    description: "Jupiter is moving into your 10th house. Expect career growth opportunities.",
    time: "2h ago",
    type: "transit",
    isRead: false,
  },
  {
    id: "2",
    title: "Complete Your Reading",
    description: "Your comprehensive 'Destiny Blueprint' report is 80% ready. Complete the data check.",
    time: "5h ago",
    type: "reading",
    isRead: false,
  },
  {
    id: "3",
    title: "Sade Sati Warning",
    description: "Saturn's influence is peak this month. Check your remedies list.",
    time: "1d ago",
    type: "alert",
    isRead: true,
  },
];

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setHasUnread(false);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "transit": return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "reading": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "alert": return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return <Moon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "hover:text-gray-900 dark:hover:text-white transition-all relative flex items-center justify-center w-9 h-9 rounded-full",
          isOpen ? "bg-gray-100 dark:bg-zinc-800 text-slate-900 dark:text-white" : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
        )}
      >
        <motion.div
          animate={isOpen ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Bell className="w-[19px] h-[19px] stroke-[1.8]" />
        </motion.div>

        {/* Notification Dot */}
        {hasUnread && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border-[1.5px] border-white dark:border-zinc-900"></span>
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[1000]"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/30">
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications
              </h3>
              <button 
                onClick={markAllRead}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 uppercase tracking-wide transition-colors"
                disabled={!hasUnread}
              >
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href="#"
                      className={cn(
                        "flex gap-4 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50 relative group",
                        !notification.isRead && "bg-amber-50/30 dark:bg-amber-400/5"
                      )}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                          {getIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn(
                            "text-[13px] leading-tight",
                            notification.isRead ? "text-slate-600 dark:text-zinc-400 font-medium" : "text-slate-900 dark:text-white font-bold"
                          )}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-500 dark:text-zinc-500 leading-snug line-clamp-2">
                          {notification.description}
                        </p>
                      </div>

                      {/* Unread indicator bar */}
                      {!notification.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500" />
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-10 py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                    <Bell className="w-5 h-5 text-slate-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-[13px] text-slate-400 dark:text-zinc-500">
                    Your cosmic queue is empty
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50/50 dark:bg-zinc-800/30 border-t border-slate-100 dark:border-zinc-800 text-center">
              <Link
                href="/profile/activity"
                className="text-[12px] font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors inline-flex items-center gap-1.5"
              >
                View all activity
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
