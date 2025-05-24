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
  positive
}: KpiCardProps) {
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
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {trendText}
            </div>
          </div>
          <div className="h-16 w-16">
            <CircleProgress 
              value={trend} 
              color={positive ? "success" : "danger"} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}