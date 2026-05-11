/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  Home, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Star,
  Zap
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Overview", icon: Home, path: "/dashboard" },
    { label: "Queue", icon: Briefcase, path: "/jobs" },
    { label: "Calendar", icon: Calendar, path: "/calendar" },
    { label: "Inbox", icon: MessageSquare, path: "/messages" },
    { label: "Activity", icon: Bell, path: "/notifications" },
  ];

  const secondaryItems = [
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r border-slate-100 bg-slate-50 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center gap-2.5 mb-8 px-2 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-black text-sm">R</div>
            <span className="text-sm font-bold tracking-tight text-slate-800">Ria Operations</span>
          </div>

          <div className="flex flex-col flex-1 gap-6">
            <nav className="space-y-0.5">
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main</p>
                {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${isActive ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-primary-600" : "text-slate-400"}`} />
                    {item.label}
                    {item.label === "Queue" && <span className="ml-auto text-[10px] font-bold text-primary-600 bg-primary-100 px-1.5 py-0.5 rounded">2</span>}
                    </Link>
                );
                })}
            </nav>

            <nav className="space-y-0.5">
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
                {secondaryItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${isActive ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-primary-600" : "text-slate-400"}`} />
                    {item.label}
                    </Link>
                );
                })}
            </nav>
          </div>

          <div className="mt-auto px-3 border-t border-slate-200/60 pt-4">
            <button className="flex w-full items-center gap-2.5 py-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-all">
                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">DM</div>
                <span>David Miller</span>
                <LogOut className="h-3.5 w-3.5 ml-auto text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
                <Home className="h-3.5 w-3.5" />
                <span>/</span>
                <span className="text-slate-900 capitalize">
                    {location.pathname.split("/")[1] || "Overview"}
                </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input placeholder="Search commands..." className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[12px] w-48 focus:outline-none focus:ring-1 focus:ring-slate-300" />
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Badge({ children, variant = "neutral", className = "", ...props }: { children: React.ReactNode, variant?: "neutral" | "success" | "warning" | "error" | "primary", className?: string, [key: string]: any }) {
    const variants = {
        neutral: "bg-slate-50 text-slate-600 border-slate-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-100",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        error: "bg-red-50 text-red-700 border-red-200",
        primary: "bg-primary-50 text-primary-700 border-primary-100"
    };
    return (
        <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold tracking-tight ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
}

export function StatCard({ label, value, icon: Icon, trend }: { label: string, value: string | number, icon: any, trend?: { label: string, direction: 'up' | 'down' } }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-slate-300">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {trend && (
            <span className={`text-[10px] font-bold ${trend.direction === 'up' ? 'text-emerald-600' : 'text-slate-400'}`}>
                {trend.direction === 'up' ? '↑' : '↓'} {trend.label}
            </span>
        )}
      </div>
    </div>
  );
}

export function Card({ title, subtitle, children, className = "", variant = "light" }: { title?: string, subtitle?: string, children: React.ReactNode, className?: string, variant?: "light" | "dark" | "flat" }) {
  return (
    <div className={`rounded-xl border ${
        variant === "dark" ? "bg-slate-900 border-slate-800 text-white" : 
        variant === "flat" ? "bg-slate-50 border-slate-200/60" :
        "bg-white border-slate-200/80"
    } ${className}`}>
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-slate-100/50">
          {title && <h3 className={`text-sm font-bold tracking-tight ${variant === "dark" ? "text-white" : "text-slate-900"}`}>{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Header({ title = "Secure Magic Link Access" }: { title?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-base shadow-sm">
            R
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">Ria Operations</span>
        </div>
        <div className="ml-auto">
            <Badge variant="primary">Live Sync</Badge>
        </div>
      </div>
    </header>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string, subtitle?: string, actions?: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="mt-2 text-slate-500 text-sm font-medium leading-relaxed max-w-xl">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}

export function SectionHeader({ title, subtitle, actions }: { title: string, subtitle?: string, actions?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

export function Timeline({ items }: { items: { title: string, description: string, time: string, status: 'completed' | 'active' | 'pending' }[] }) {
    return (
        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
            {items.map((item, i) => (
                <div key={i} className="relative pl-8 flex items-center justify-between group">
                    <div className={`absolute left-0 h-[22px] w-[22px] rounded-full border-4 border-white shadow-sm ${
                        item.status === 'completed' ? 'bg-slate-900' :
                        item.status === 'active' ? 'bg-primary-600 animate-pulse' :
                        'bg-slate-200'
                    }`}></div>
                    <div>
                        <p className={`text-[13px] font-bold ${item.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.description}</p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase">{item.time}</span>
                </div>
            ))}
        </div>
    );
}

export function Modal({ isOpen, onClose, title, children, actions }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, actions?: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-200 text-slate-400 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                {actions && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-row-reverse gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
                <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
            <p className="mt-2 text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">{description}</p>
            {action && <div className="mt-8">{action}</div>}
        </div>
    );
}

export function LoadingState() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        </div>
    );
}

export function VendorCard({ profile }: { profile: any }) {
  if (!profile) return null;
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-900/[0.02] group transition-all hover:border-slate-300">
      <div className="relative h-32 bg-slate-100 overflow-hidden">
        <img src={profile.bannerUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 right-4">
            <Badge variant="primary">AI Recommended</Badge>
        </div>
      </div>
      <div className="px-6 pb-6 pt-0 relative">
        <div className="absolute -top-10 left-6">
            <div className="h-20 w-20 rounded-2xl bg-white p-1 shadow-lg border border-slate-100">
                <img src={profile.logoUrl} className="h-full w-full object-contain rounded-xl" />
            </div>
        </div>
        <div className="pt-12">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{profile.businessName}</h3>
                    <p className="text-[12px] font-medium text-slate-500">{profile.contactName}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-black text-amber-700">{profile.performance.ratingAverage}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-6">
                {(profile.serviceTypes || []).slice(0, 3).map((type: string) => (
                    <span key={type} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-slate-100">
                        {type}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 py-6 border-y border-slate-50">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Completed Jobs</p>
                    <p className="text-[15px] font-black text-slate-900 tabular-nums">{profile.performance.completedJobs}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">On-Time %</p>
                    <p className="text-[15px] font-black text-slate-900 tabular-nums">{profile.performance.onTimePercentage}%</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">SLA Delivery</p>
                    <p className="text-[15px] font-black text-slate-900 tabular-nums">48h</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Response SLA</p>
                    <p className="text-[15px] font-black text-slate-900 tabular-nums">&lt; {profile.performance.avgResponseTimeMinutes}m</p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Price Range</p>
                    <p className="text-[16px] font-black text-slate-900 mt-1">${profile.pricing.minPrice}–${profile.pricing.maxPrice}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Next Available</p>
                    <p className="text-[13px] font-black text-slate-900 mt-1">May 14</p>
                </div>
            </div>

            <div className="mt-8 flex gap-2">
                <Button className="flex-1 h-10 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">
                    Direct Contact
                </Button>
                <Button variant="outline" className="h-10 w-10 p-0 border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
