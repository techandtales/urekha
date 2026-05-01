"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { SampleReportTab } from "@/components/agent/dashboard/SampleReportTab";
import { RefreshCw } from "lucide-react";

export function SampleReportsClient() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="animate-spin text-primary" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Initializing Neural Engine...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
        <p className="text-red-500 font-bold">Authentication required.</p>
      </div>
    );
  }

  return <SampleReportTab user={user} role="admin" />;
}
