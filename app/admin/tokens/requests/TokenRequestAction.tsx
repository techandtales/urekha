"use client";

import { useState } from "react";
import { approveTokenRequest } from "@/app/actions/token-actions";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";

type TxDetailsProps = {
  tx: any;
};

export default function TokenRequestAction({ tx }: TxDetailsProps) {
  const [isProcessing, setIsProcessing] = useState<"approve" | "reject" | null>(null);

  const handleAction = async (isApproved: boolean) => {
    setIsProcessing(isApproved ? "approve" : "reject");
    try {
      const res = await approveTokenRequest(tx.id, isApproved);
      if (res.success) {
        toast.success(`Request ${isApproved ? 'approved' : 'rejected'} successfully.`);
      } else {
        toast.error(`Error: ${res.error}`);
      }
    } catch (e: any) {
      toast.error(`Failed to process: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction(true)}
        disabled={isProcessing !== null}
        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isProcessing === "approve" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        Approve
      </button>
      <button
        onClick={() => handleAction(false)}
        disabled={isProcessing !== null}
        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isProcessing === "reject" ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
        Reject
      </button>
    </div>
  );
}
