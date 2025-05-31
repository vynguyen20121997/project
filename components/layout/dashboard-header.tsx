"use client";

import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface TemperatureAlert {
  id: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'high' | 'normal';
}

export function DashboardHeader() {
  const [dateTime, setDateTime] = useState(new Date());
  const [alerts, setAlerts] = useState<TemperatureAlert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Monitor temperature and create alerts
  useEffect(() => {
    const socket = new WebSocket('ws://3.27.156.160:5000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const temp = Number(data.temperature);

      if (temp < 18) {
        const alert: TemperatureAlert = {
          id: Date.now().toString(),
          message: "Low Temperature Alert: Current temperature may cause discomfort and increase risk of respiratory issues. Consider wearing warm clothing and maintaining indoor heating.",
          timestamp: new Date(),
          severity: 'low'
        };
        setAlerts(prev => [alert, ...prev].slice(0, 5));
        toast({
          title: "Temperature Warning",
          description: alert.message,
          variant: "destructive",
        });
      } else if (temp > 30) {
        const alert: TemperatureAlert = {
          id: Date.now().toString(),
          message: "High Temperature Alert: Risk of heat stress. Stay hydrated and avoid prolonged exposure. Seek cool environments if possible.",
          timestamp: new Date(),
          severity: 'high'
        };
        setAlerts(prev => [alert, ...prev].slice(0, 5));
        toast({
          title: "Temperature Warning",
          description: alert.message,
          variant: "destructive",
        });
      }
    };

    return () => socket.close();
  }, [toast]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatAlertTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl">Analytics Dashboard</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium">{formatTime(dateTime)}</span>
          <span className="text-xs text-muted-foreground">{formatDate(dateTime)}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px]">
            {alerts.length === 0 ? (
              <DropdownMenuItem className="text-sm text-muted-foreground">
                No new alerts
              </DropdownMenuItem>
            ) : (
              alerts.map(alert => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start py-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      alert.severity === 'high' ? 'text-red-500' : 
                      alert.severity === 'low' ? 'text-blue-500' : 
                      'text-green-500'
                    }`}>
                      {alert.severity.toUpperCase()} TEMPERATURE
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatAlertTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{alert.message}</p>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}