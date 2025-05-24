"use client";

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';
import io from 'socket.io-client';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CircularChartProps {
  value: number;
}

export function CircularChart({ value: initialValue }: CircularChartProps) {
  const { theme } = useTheme();
  const [temperature, setTemperature] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socket: ReturnType<typeof io>;

    const connectToServer = () => {
      try {
        socket = io('http://3.24.136.211:5000', {
          transports: ['websocket'],
          reconnectionAttempts: 3,
          timeout: 5000,
        });

        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          setIsConnected(true);
          setError(null);
        });

        socket.on('connect_error', (err) => {
          console.warn('WebSocket connection error:', err);
          setIsConnected(false);
          setError('Unable to connect to temperature service');
        });

        socket.on('temperature_update', (data) => {
          setTemperature(data.temperature);
          setError(null);
        });

        socket.on('error', (err) => {
          console.error('WebSocket error:', err);
          setError('Error receiving temperature updates');
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
        });
      } catch (err) {
        console.error('Error initializing socket:', err);
        setError('Unable to initialize temperature service');
      }
    };

    const fetchInitialData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('http://3.24.136.211:5000/api/latest', {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTemperature(data.temperature);
        setError(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.warn('Request timeout - using initial value');
        } else {
          console.error('Error fetching initial data:', err);
        }
        // Keep using the initial value passed as prop
        setError('Unable to fetch latest temperature');
      }
    }

    fetchInitialData();
    connectToServer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [initialValue]);

  const [chartData, setChartData] = useState({
    datasets: [{
      data: [temperature, 100 - temperature],
      backgroundColor: ['#60a5fa', '#e5e7eb'],
      borderWidth: 0,
      cutout: '75%'
    }],
  });

  useEffect(() => {
    const color = theme === 'dark' ? 
      ['hsl(var(--chart-1))', 'hsl(var(--secondary))'] : 
      ['hsl(var(--chart-1))', 'hsl(var(--secondary))'];
    
    setChartData({
      datasets: [{
        data: [temperature, 100 - temperature],
        backgroundColor: color,
        borderWidth: 0,
        cutout: '75%'
      }],
    });
  }, [temperature, theme]);

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
        <div className="text-3xl font-bold">{temperature.toFixed(1)}°C</div>
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