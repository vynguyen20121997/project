"use client";

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CircularChartProps {
  value: number;
  isConnected: boolean;
  typeName: string;
  unit: string;
}

export function CircularChart({ value, isConnected, typeName, unit }: CircularChartProps) {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(0);
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

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
        <div className="text-sm text-muted-foreground">{typeName}</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-bold"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {displayValue.toFixed(1)}{unit ? ` ${unit}` : ''}
            </motion.span>
          </motion.div>
        </AnimatePresence>
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