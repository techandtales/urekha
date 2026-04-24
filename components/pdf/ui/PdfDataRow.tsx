"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { LucideIcon } from "lucide-react";

interface PdfDataRowProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  isLast?: boolean;
  className?: string;
  valueClassName?: string;
}

interface PdfDataRowProps {
  label: string;
  value: string | number;
  icon?: LucideIcon | undefined;
  isLast?: boolean;
  className?: string;
  valueClassName?: string;
  labelClassName?: string; // Add this prop
}

const PdfDataRow: React.FC<PdfDataRowProps> = ({
  label,
  value,
  icon: Icon,
  isLast = false,
  className = "",
  valueClassName = "",
  labelClassName = "", // Default to empty
}) => {
  return (
    <div
      className={`flex flex-col py-1.5 px-1 ${
        !isLast ? "border-b border-gray-100" : ""
      } ${className}`}
    >
      {/* Label Row - REDUCED SIZE */}
      <div className="flex items-center gap-1.5 mb-0.5">
        {Icon && <Icon size={10} className="text-zinc-900" />}
        <span className={`pdf-label font-sans ${labelClassName}`}>{label}</span>
      </div>

      {/* Value Row - ADJUSTED SIZE */}
      <div
        className={`pl-4 pdf-body font-sans lining-nums tabular-nums text-zinc-700 leading-tight ${valueClassName}`}
      >
        {value}
      </div>
    </div>
  );
};
export default PdfDataRow;
