import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "icon" | "standard" | "full" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTextOnMobile?: boolean;
}

export function LogoIcon({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-32 w-32",
  };

  return (
    <svg
      viewBox="0 0 200 200"
      className={`${sizeMap[size]} ${className} shrink-0 select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold Arch on the Left */}
      <path
        d="M 50 145 A 65 65 0 0 1 100 40"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Five Colorful Circular Dots along the arch */}
      <circle cx="85" cy="40" r="5" fill="#22c55e" />     {/* Green */}
      <circle cx="65" cy="55" r="5" fill="#ec4899" />     {/* Pink */}
      <circle cx="53" cy="73" r="5" fill="#f97316" />     {/* Orange */}
      <circle cx="48" cy="95" r="5" fill="#8b5cf6" />     {/* Purple */}
      <circle cx="47" cy="118" r="5" fill="#3b82f6" />    {/* Blue */}

      {/* Eswatini Flag on Top of the Roof */}
      {/* Flagpole */}
      <line x1="115" y1="40" x2="115" y2="10" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
      {/* Flag Canvas */}
      <g transform="translate(115, 10)">
        {/* Blue bands (top and bottom) */}
        <rect x="0" y="0" width="36" height="22" fill="#002f6c" rx="1" />
        {/* Yellow inner lines */}
        <rect x="0" y="3.5" width="36" height="15" fill="#ffdd00" />
        {/* Crimson red center */}
        <rect x="0" y="5" width="36" height="12" fill="#b10c0c" />
        {/* Simplified Eswatini Shield */}
        <ellipse cx="18" cy="11" rx="4.5" ry="3.5" fill="#000000" />
        <ellipse cx="18" cy="11" rx="2" ry="3.5" fill="#ffffff" />
        <line x1="14" y1="11" x2="22" y2="11" stroke="#ffdd00" strokeWidth="0.8" />
        {/* Tiny staff circles */}
        <circle cx="13" cy="11" r="0.6" fill="#ffffff" />
        <circle cx="23" cy="11" r="0.6" fill="#ffffff" />
      </g>

      {/* House Roof (Blue) */}
      <path
        d="M 60 75 L 115 40 L 170 75"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Wall of House */}
      <path
        d="M 165 74 L 165 110"
        stroke="#1e3a8a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Left Wall of House */}
      <path
        d="M 65 74 L 65 110"
        stroke="#1e3a8a"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Four Colorful Window Panes */}
      <g transform="translate(0, 2)">
        <rect x="104" y="51" width="7" height="7" fill="#ec4899" rx="1" /> {/* Pink */}
        <rect x="113" y="51" width="7" height="7" fill="#f59e0b" rx="1" /> {/* Yellow */}
        <rect x="104" y="60" width="7" height="7" fill="#22c55e" rx="1" /> {/* Green */}
        <rect x="113" y="60" width="7" height="7" fill="#3b82f6" rx="1" /> {/* Blue */}
      </g>

      {/* Waving Boy (Green) inside house */}
      <g>
        {/* Head */}
        <circle cx="94" cy="78" r="6" fill="#22c55e" />
        {/* Body */}
        <path d="M 87 114 C 88 102 91 88 95 86 C 99 88 102 102 103 114 Z" fill="#22c55e" />
        {/* Left Arm waving up */}
        <path d="M 91 88 Q 82 82 80 73" fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />
        {/* Right Arm */}
        <path d="M 97 88 Q 106 91 110 102" fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* Waving Girl (Purple) inside house */}
      <g>
        {/* Head */}
        <circle cx="136" cy="80" r="6" fill="#8b5cf6" />
        {/* Ponytails */}
        <circle cx="129" cy="76" r="3" fill="#8b5cf6" />
        <circle cx="143" cy="76" r="3" fill="#8b5cf6" />
        {/* Body */}
        <path d="M 129 114 C 130 102 133 89 137 87 C 141 89 144 102 145 114 Z" fill="#8b5cf6" />
        {/* Left Arm */}
        <path d="M 132 89 Q 123 92 120 103" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeLinecap="round" />
        {/* Right Arm waving up */}
        <path d="M 139 89 Q 148 83 151 74" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* Open Book at the bottom in Blue */}
      <path
        d="M 115 114 C 90 102 61 110 61 110 L 64 120 C 64 120 90 111 115 122 C 140 111 166 120 166 120 L 169 110 C 169 110 140 102 115 114 Z"
        fill="#2563eb"
      />
    </svg>
  );
}

export function Logo({
  variant = "standard",
  size = "md",
  className = "",
  showTextOnMobile = true,
}: LogoProps) {
  if (variant === "icon") {
    return <LogoIcon size={size} className={className} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon */}
      <LogoIcon size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"} />

      {/* Brand Typography */}
      <div className={`flex flex-col select-none ${!showTextOnMobile ? "hidden sm:flex" : "flex"}`}>
        {/* "Preschools" with smiley face 'o's */}
        <div className="flex items-center font-black tracking-tight text-[#1e293b] leading-none text-lg md:text-xl xl:text-2xl">
          <span>Presch</span>
          {/* Pink smiley 'o' */}
          <span className="inline-flex items-center justify-center mx-px">
            <svg viewBox="0 0 24 24" className="h-[1.15em] w-[1.15em] text-[#db2777]" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              {/* Eyes */}
              <circle cx="8" cy="9" r="1.5" fill="#ffffff" />
              <circle cx="16" cy="9" r="1.5" fill="#ffffff" />
              {/* Smiling Mouth */}
              <path d="M 7 13 Q 12 19 17 13" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          {/* Green smiley 'o' */}
          <span className="inline-flex items-center justify-center mx-px">
            <svg viewBox="0 0 24 24" className="h-[1.15em] w-[1.15em] text-[#22c55e]" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              {/* Eyes */}
              <circle cx="8" cy="9" r="1.5" fill="#ffffff" />
              <circle cx="16" cy="9" r="1.5" fill="#ffffff" />
              {/* Smiling Mouth */}
              <path d="M 7 13 Q 12 19 17 13" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <span>ls</span>
        </div>

        {/* Colorful "ESWATINI" between horizontal lines */}
        <div className="flex items-center justify-between text-[11px] md:text-[12px] font-black tracking-widest uppercase mt-0.5 w-full">
          <span className="h-px bg-blue-300 flex-1 mr-1.5 opacity-60"></span>
          <span className="flex gap-0.5">
            <span className="text-[#2563eb]">E</span>
            <span className="text-[#f59e0b]">S</span>
            <span className="text-[#db2777]">W</span>
            <span className="text-[#22c55e]">A</span>
            <span className="text-[#f59e0b]">T</span>
            <span className="text-[#f97316]">N</span>
            <span className="text-[#2563eb]">I</span>
          </span>
          <span className="h-px bg-blue-300 flex-1 ml-1.5 opacity-60"></span>
        </div>

        {/* Full taglines (only shown in 'full' or 'horizontal' variants) */}
        {variant === "full" && (
          <>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-500 mt-1.5 tracking-tight leading-tight whitespace-nowrap">
              Digital Solutions<span className="text-[#22c55e] mx-1">•</span>
              Stronger Schools<span className="text-[#db2777] mx-1">•</span>
              Brighter Futures
            </p>
            
            <div className="mt-2.5 inline-flex items-center gap-1.5 bg-[#1e293b] text-white rounded-full px-3 py-1 border border-amber-400/20 max-w-max shadow-sm">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-amber-400 shrink-0 fill-current" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-[8px] font-black tracking-wider uppercase text-slate-100">
                EMPOWERING EARLY LEARNING. BUILDING TOMORROW.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
