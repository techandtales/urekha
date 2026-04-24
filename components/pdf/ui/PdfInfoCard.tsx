import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { LucideIcon } from "lucide-react";

type CardVariant = "default" | "highlight" | "warning" | "success";

interface PdfInfoCardProps {
  variant?: CardVariant;
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const PdfInfoCard: React.FC<PdfInfoCardProps> = ({
  variant = "default",
  title,
  icon: Icon,
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col border border-zinc-200 overflow-hidden bg-white ${className}`}
    >
      {/* Optional Header */}
      {title && (
        <div
          className={`flex items-center gap-2 px-3 py-2.5 bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100`}
        >
          {Icon && <Icon size={16} />}
          <span className="leading-none">{title}</span>
        </div>
      )}

      {/* Content */}
      <div className="p-3 bg-white text-sm text-zinc-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default PdfInfoCard;
