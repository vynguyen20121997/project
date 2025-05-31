"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  type?: "temperature" | "humidity";
}

export function ColorProgressBar({ value, type = "temperature" }: ProgressBarProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return "bg-blue-500"; // Cool blue
    if (temp <= 26) return "bg-green-500"; // Pleasant green
    if (temp <= 30) return "bg-yellow-500"; // Warm yellow
    if (temp <= 35) return "bg-orange-500"; // Hot orange
    return "bg-red-500"; // Very hot red
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return "bg-red-500"; // Too dry
    if (humidity <= 50) return "bg-green-500"; // Comfortable
    if (humidity <= 70) return "bg-yellow-500"; // Slightly humid
    return "bg-blue-500"; // Very humid
  };

  const getProgressColor = () => {
    if (type === "temperature") {
      return getTemperatureColor(value);
    }
    return getHumidityColor(value);
  };

  const getLabel = () => {
    if (type === "temperature") {
      if (value < 20) return "Cool";
      if (value <= 26) return "Pleasant";
      if (value <= 30) return "Warm";
      if (value <= 35) return "Hot";
      return "Very Hot";
    } else {
      if (value < 30) return "Dry";
      if (value <= 50) return "Comfortable";
      if (value <= 70) return "Humid";
      return "Very Humid";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{getLabel()}</span>
        <span>{type === "temperature" ? `${value}°C` : `${value}%`}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getProgressColor())}
          style={{ width: `${Math.min(100, (value / (type === "temperature" ? 50 : 100)) * 100)}%` }}
        />
      </div>
    </div>
  );
}