import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";

interface PdfTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard A3 Table Wrapper
 * Use standard <thead> and <tbody> inside, but apply these helper classes:
 * - Header: bg-zinc-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold
 * - Row: hover:bg-gray-50
 * - Cell: px-4 py-3 text-sm border-b border-gray-100
 */
const PdfTable: React.FC<PdfTableProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full bg-white border border-zinc-200 ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
};

export default PdfTable;
