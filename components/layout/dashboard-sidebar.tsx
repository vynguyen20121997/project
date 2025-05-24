"use client";

import { useState } from 'react';
import { 
  BarChart3, 
  Home, 
  LineChart, 
  PieChart, 
  User, 
  Wallet 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  isActive?: boolean;
}

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [items] = useState<SidebarItem[]>([
    {
      title: "Dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Analytics",
      icon: BarChart3,
    },
    {
      title: "Reports",
      icon: LineChart,
    },
    {
      title: "Finances",
      icon: Wallet,
    },
    {
      title: "Users",
      icon: User,
    },
    {
      title: "Charts",
      icon: PieChart,
    },
  ]);

  return (
    <div
      className={cn(
        "h-full border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="flex h-full flex-col py-4">
        <div className="flex flex-col gap-1 px-2">
          {items.map((item, index) => (
            <Button
              key={index}
              variant={item.isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">{item.title}</span>}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}