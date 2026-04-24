import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { LucideIcon } from "lucide-react";

interface PdfSectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "centered";
}

const PdfSectionHeader: React.FC<PdfSectionHeaderProps> = ({
  title,
  icon: Icon,
  className = "",
  variant = "default",
}) => {
  return (
    <div
      className={`flex items-center gap-3 mb-4 opacity-70 ${variant === "centered" ? "justify-center" : ""} ${className}`}
    >
      {Icon && (
        <Icon
          size={18}
          style={{ color: UREKHA_COLORS.goldPrimary }} // Gold Icon
        />
      )}

      <h3 className="text-sm font-bold uppercase tracking-widest text-black/80 font-serif">
        {title}
      </h3>

      {/* Divider Line (Only for default left-aligned) */}
      {variant === "default" && (
        <div className="h-[1px] flex-1 bg-gray-200"></div>
      )}
    </div>
  );
};

export default PdfSectionHeader;
