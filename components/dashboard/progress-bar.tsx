"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: "success" | "danger" | "warning" | "info";
}

export function ProgressBar({ value, color = "success" }: ProgressBarProps) {
  const colorMap = {
    success: "bg-emerald-500",
    danger: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-sky-500",
  };

  return (
    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full", colorMap[color])}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}