"use client";

import { cn } from "@/lib/utils";

interface CircleProgressProps {
  value: number;
  color?: "success" | "danger" | "warning" | "info";
  size?: number;
  strokeWidth?: number;
}

export function CircleProgress({
  value,
  color = "success",
  size = 40,
  strokeWidth = 4,
}: CircleProgressProps) {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorMap = {
    success: "stroke-emerald-500",
    danger: "stroke-rose-500",
    warning: "stroke-amber-500",
    info: "stroke-sky-500",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="stroke-muted"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className={cn(colorMap[color])}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {value}
      </div>
    </div>
  );
}