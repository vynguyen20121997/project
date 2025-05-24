import { ReactNode } from 'react';
import { DashboardHeader } from './dashboard-header';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}