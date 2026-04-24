import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Check, X } from "lucide-react";

interface PdfBulletListProps {
  items: string[];
  isHindi?: boolean;
  className?: string;
  icon?: "check" | "cross" | "dot" | string;
}

const PdfBulletList: React.FC<PdfBulletListProps> = ({
  items,
  isHindi = false,
  className = "",
  icon = "dot",
}) => {
  const renderIcon = () => {
    if (icon === "check") {
      return <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />;
    }
    if (icon === "cross") {
      return <X className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />;
    }
    // Default dot
    return (
      <span
        className="mt-1.5 min-w-[6px] h-[6px] rounded-full shrink-0"
        style={{ backgroundColor: UREKHA_COLORS.goldPrimary }}
      ></span>
    );
  };

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          {renderIcon()}

          <p
            className={`text-sm leading-relaxed text-zinc-700 ${isHindi ? "font-serif" : "font-sans"}`}
          >
            {item}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default PdfBulletList;
