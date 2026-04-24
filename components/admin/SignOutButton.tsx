"use client";

import { LogOut, AlertTriangle, X } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { useState } from "react";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
  };

  return (
    <>
      <button 
        type="button" 
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg z-50 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 shadow-md"
      >
        <LogOut size={18} className={isLoading ? "animate-pulse" : ""} />
        <span className="text-sm font-medium">
          {isLoading ? "Signing Out..." : "Sign Out"}
        </span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#050A0A] border border-red-500/20 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-500/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Sign Out</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Are you sure you want to exit the Admin Gateway?
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-zinc-500 hover:text-white transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Stay
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <LogOut size={16} className="animate-pulse" />
                    Exiting...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Confirm Exit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
