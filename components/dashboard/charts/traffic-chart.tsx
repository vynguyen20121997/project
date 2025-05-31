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
import { Chart } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { buildHumidityDataSet, buildTempDataSet, buildTimeDataSet } from '@/lib/utils';

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

export function TrafficChart({humidity, temperature, time}: {humidity: number, temperature: number, time:string}) {
  const { theme } = useTheme();
  let labels: string[] = [];
  let tempDatasets : number[]= [];
  let humidityDatasets : number[] = [];
  const [chartData, setChartData] = useState({
    labels: labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Temperature (°C)',
        data: tempDatasets,
        backgroundColor: '#60a5fa',
        barPercentage: 0.6,
      },
      {
        type: 'line' as const,
        label: 'Humidity (%)',
        data: humidityDatasets,
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
          callback: (tickValue: string | number) => `${tickValue}°C`,
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
          callback: (tickValue: string | number) => `${tickValue}%`,
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
        labels: buildTimeDataSet(prev.labels, time),
        datasets: prev.datasets.map((dataset, idx) => {
          if (dataset.type === 'bar') {
            const tempDataSet = buildTempDataSet(dataset.data as number[], temperature);
            return {
              ...dataset,
              data: tempDataSet,
              backgroundColor: barColor,
            };
          }
          if (dataset.type === 'line') {
            const humiDataSet = buildHumidityDataSet(dataset.data as number[], humidity)
            return {
              ...dataset,
               data: humiDataSet,
              borderColor: lineColor,
              backgroundColor: lineBgColor,
              pointBackgroundColor: lineColor,
            };
          }
          return dataset;
        }),
      }));

    }, [humidity, temperature, theme]);

  return (
    <div className="h-80">
      <Chart type="bar" options={options} data={chartData} />
    </div>
  );
}