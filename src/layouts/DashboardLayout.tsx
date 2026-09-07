import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  MessageSquareText, 
  Cpu, 
  Activity, 
  Settings, 
  Menu
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useMock } from '../services';

const navGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Home', path: '/', icon: LayoutDashboard }
    ]
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { name: 'List Dokumen', path: '/knowledge', icon: Library }
    ]
  },
  {
    title: 'AI ENGINE',
    items: [
      { name: 'Chat / RAG Test', path: '/chat', icon: MessageSquareText },
      { name: 'Models', path: '/models', icon: Cpu }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'API & Docs', path: '/docs', icon: Activity },
      { name: 'Settings', path: '/settings', icon: Settings }
    ]
  }
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col border-r border-slate-200 bg-white transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-emerald-800">BIMA</span>
              <span className="text-xs font-medium text-amber-600 -mt-1">Sorgum AI</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 mx-auto"
          >
            <Menu size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-6 px-2">
            {navGroups.map((group) => (
              <div key={group.title}>
                {!collapsed && (
                  <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        collapsed && "justify-center"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon size={18} className={cn("shrink-0", !collapsed && "mr-3")} />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Status Indicator */}
        <div className="border-t border-slate-200 p-4">
          <div className={cn("flex flex-col space-y-2", collapsed && "items-center")}>
            <div className="flex items-center text-xs">
              <div className={cn("mr-2 h-2 w-2 rounded-full", useMock ? "bg-amber-500" : "bg-emerald-500")} />
              {!collapsed && (
                <span className="font-medium text-slate-600">
                  {useMock ? "Mock API Mode" : "Backend Connected"}
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
