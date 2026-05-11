/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { SidebarLayout, PageHeader, LoadingState, EmptyState, Button } from "../components/CommonUI";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, MailOpen } from "lucide-react";
import { Notification } from "../types";
import { format } from "date-fns";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      });
  }, []);

  const markAllAsRead = () => {
    fetch("/api/vendor/notifications/read", { method: "POST" })
        .then(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))));
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
          case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
          case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
          default: return <Info className="h-4 w-4 text-indigo-500" />;
      }
  };

  return (
    <SidebarLayout>
      <PageHeader 
        title="Notifications" 
        subtitle="Manage operational updates and transmission logs"
        actions={
            <Button variant="outline" className="h-8 text-[11px] px-3 font-bold uppercase tracking-widest" onClick={markAllAsRead}>
                <MailOpen className="h-3 w-3 mr-2" /> Mark all read
            </Button>
        }
      />

      {loading ? (
        <div className="py-20"><LoadingState /></div>
      ) : notifications.length === 0 ? (
        <EmptyState 
            title="Clean Transmission" 
            description="No pending alerts or operational updates found in the history." 
            icon={Bell}
        />
      ) : (
        <div className="space-y-3 mt-8">
            {notifications.map(n => (
                <div 
                    key={n.id} 
                    className={`group relative p-5 bg-white border rounded-2xl transition-all hover:bg-slate-50/50 ${
                        n.read ? 'border-slate-100 opacity-60 grayscale-[0.5]' : 'border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                    }`}
                >
                    <div className="flex gap-5">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            n.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 
                            n.type === 'warning' ? 'bg-amber-50 border-amber-100' : 
                            n.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                        }`}>
                            {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-[13px] font-bold truncate pr-4 ${n.read ? 'text-slate-600' : 'text-slate-900 tracking-tight'}`}>{n.title}</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{format(new Date(n.createdAt), "MMM d • h:mm a")}</span>
                            </div>
                            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                        <button className="h-8 w-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-slate-100">
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </SidebarLayout>
  );
}
