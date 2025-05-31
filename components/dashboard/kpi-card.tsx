"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleProgress } from "./charts/circle-progress";

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
  trendIcon: React.ReactNode;
  trendText: string;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  positive: boolean;
  details?: string;
}

export function KpiCard({
  title,
  value,
  trend,
  trendIcon,
  trendText,
  icon,
  prefix = "",
  suffix = "%",
  positive,
  details
}: KpiCardProps) {
  // Calculate normalized value for the circle progress
  const normalizeValue = (val: string, suffix: string) => {
    const numValue = parseFloat(val);
    if (suffix === "°C") {
      // For temperature, normalize between -10°C and 40°C
      return Math.min(100, Math.max(0, ((numValue + 10) / 50) * 100));
    } else if (suffix === "%") {
      // For percentage values
      return Math.min(100, Math.max(0, numValue));
    } else if (suffix === "ppm") {
      // For PPM values, normalize between 0 and 1000
      return Math.min(100, Math.max(0, (numValue / 1000) * 100));
    }
    return trend;
  };

  // Determine color based on value and type
  const getProgressColor = () => {
    const numValue = parseFloat(value);
    if (suffix === "°C") {
      if (numValue < 18) return "info";
      if (numValue < 25) return "success";
      if (numValue < 30) return "warning";
      return "danger";
    } else if (suffix === "%") {
      if (numValue < 30) return "danger";
      if (numValue < 60) return "success";
      if (numValue < 80) return "warning";
      return "info";
    }
    return positive ? "success" : "danger";
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex items-center justify-between">
        <div className="text-sm font-medium">
          {title}
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {prefix}{value}{suffix}
            </div>
            <div className="flex flex-col text-xs mt-1">
              <span className={cn(
                "font-medium",
                positive ? "text-emerald-500" : "text-rose-500"
              )}>
                {trendText}
              </span>
              {details && (
                <span className="text-muted-foreground">
                  {details}
                </span>
              )}
            </div>
          </div>
          <div className="h-16 w-16">
            <CircleProgress 
              value={normalizeValue(value, suffix)}
              color={getProgressColor()}
              unit={suffix === "%" ? "%" : ""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}