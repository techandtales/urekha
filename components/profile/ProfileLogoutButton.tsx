"use client";

import { useState } from "react";
import { LogOut, AlertTriangle, ShieldAlert } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

export default function ProfileLogoutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    // signOut redirects automatically, but just in case:
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-medium text-sm group shadow-md hover:shadow-lg"
      >
        <LogOut
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Terminate Session
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => !isLoggingOut && setIsOpen(false)}
          />

          <div className="relative bg-[#050A0A] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0" />

            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-serif font-bold text-white">
                Terminate Session?
              </h3>

              <p className="text-white/60 text-sm">
                You will be securely signed out of the Client Dashboard and will
                need to authenticate again to access your records.
              </p>
            </div>

            <div className="p-4 bg-black/40 border-t border-red-500/10 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 animate-spin" />
                    Terminating...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
