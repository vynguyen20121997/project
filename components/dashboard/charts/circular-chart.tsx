"use client";

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';


ChartJS.register(ArcElement, Tooltip, Legend);

interface CircularChartProps {
  value: number;
  isConnected: boolean;
}

export function CircularChart({ value, isConnected }: CircularChartProps) {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);


  const [chartData, setChartData] = useState({
    datasets: [{
      data: [value, 100 - value],
      backgroundColor: ['hsl(var(--chart-1))', 'hsl(var(--secondary))'],
      borderWidth: 0,
      cutout: '75%'
    }],
  });

  useEffect(() => {
    setChartData({
      datasets: [{
        data: [value, 100 - value],
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--secondary))'
        ],
        borderWidth: 0,
        cutout: '75%'
      }],
    });
  }, [value, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center h-48">
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-sm text-muted-foreground">Temperature</div>
        <div className="text-3xl font-bold">{value.toFixed(1)}°C</div>
        {error && (
          <div className="text-xs text-red-500 mt-1">{error}</div>
        )}
        {!isConnected && !error && (
          <div className="text-xs text-yellow-500 mt-1">Reconnecting...</div>
        )}
      </div>
    </div>
  );
}