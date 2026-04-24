import { fetchUserReportFromMongo } from "@/app/actions/report-actions";
import { redirect } from "next/navigation";
import ReportClient from "./report-client";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function UserReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  
  if (!reportId) {
    redirect("/");
  }

  const res = await fetchUserReportFromMongo(reportId);

  if (!res.success || res.error) {
    return (
      <div className="min-h-screen bg-[#050A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-white/20" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Report Not Available</h1>
        <p className="text-white/30 max-w-md mb-8 font-medium">
          {res.error || "The celestial data might still be processing or you do not have permission to view it."}
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/25 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00FF94]/20 transition-all"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <ReportClient meta={res.meta} coreData={res.coreData} predictions={res.predictions} />;
}
