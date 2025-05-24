"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function TrafficChart() {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState({
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    datasets: [
      {
        type: 'bar' as const,
        label: 'Temperature (°C)',
        data: [22, 21, 21, 20, 22, 23, 24, 25, 24, 23, 22, 22],
        backgroundColor: '#60a5fa',
        barPercentage: 0.6,
      },
      {
        type: 'line' as const,
        label: 'Humidity (%)',
        data: [45, 44, 44, 45, 46, 45, 43, 42, 44, 45, 45, 45],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      }
    ],
  });

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        position: 'left' as const,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `${value}°C`,
        },
        title: {
          display: true,
          text: 'Temperature',
        },
      },
      y1: {
        position: 'right' as const,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value: number) => `${value}%`,
        },
        title: {
          display: true,
          text: 'Humidity',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
    },
  };

  useEffect(() => {
    const barColor = theme === 'dark' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-1))';
    const lineColor = theme === 'dark' ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-2))';
    const lineBgColor = theme === 'dark' ? 'hsla(var(--chart-2), 0.1)' : 'hsla(var(--chart-2), 0.1)';
    
    setChartData(prev => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          backgroundColor: barColor,
        },
        {
          ...prev.datasets[1],
          borderColor: lineColor,
          backgroundColor: lineBgColor,
          pointBackgroundColor: lineColor,
        }
      ]
    }));
  }, [theme]);

  return (
    <div className="h-80">
      <Bar options={options} data={chartData} />
    </div>
  );
}