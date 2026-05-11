/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { SidebarLayout, StatCard, Card, Button, PageHeader, SectionHeader, EmptyState, LoadingState, Badge } from "../components/CommonUI";
import { Clock, Briefcase, CheckCircle, Bell, ChevronRight, MapPin, Calendar as CalendarIcon, X } from "lucide-react";
import { motion } from "motion/react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/dashboard")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <SidebarLayout>
      <LoadingState />
    </SidebarLayout>
  );

  return (
    <SidebarLayout>
      <div className="space-y-10">
        <PageHeader 
            title="Overview" 
            subtitle="Operational command center for Snapshot Pro Media. Dynamic sync active."
            actions={
                <>
                    <Button variant="outline" className="h-9 text-[12px] px-3">Export System Log</Button>
                    <Button className="h-9 text-[12px] px-3">Live Sync</Button>
                </>
            }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Live Requests" value={data.stats.pendingRequests} icon={Briefcase} trend={{ label: "+2 this week", direction: 'up' }} />
          <StatCard label="Active Operations" value={data.stats.upcomingJobs} icon={CalendarIcon} />
          <StatCard label="Platform Revenue" value="$4,250" icon={CheckCircle} trend={{ label: "12% from last month", direction: 'up' }} />
          <StatCard label="System Alert" value={data.stats.unreadNotifications} icon={Bell} />
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-12">
            <section>
                <SectionHeader 
                    title="Active Deployment" 
                    subtitle="Current operational window"
                    actions={
                        <Link to="/calendar" className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
                            Full Calendar →
                        </Link>
                    }
                />
                
                <div className="space-y-2">
                    {data.todaySchedule.length > 0 ? (
                    data.todaySchedule.map((appt: any) => (
                        <Link to={`/appointment/${appt.id}`} key={appt.id} className="group flex items-center gap-6 p-5 bg-white hover:bg-slate-50 transition-all border border-slate-100 rounded-xl hover:border-slate-200">
                            <div className="flex flex-col items-center justify-center min-w-[70px] py-1 border-r border-slate-100 group-hover:border-slate-200 transition-colors">
                                <span className="text-base font-bold text-slate-900 leading-none">{format(new Date(appt.confirmedStart), "h:mm")}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{format(new Date(appt.confirmedStart), "a")}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{appt.propertyAddress}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="primary">{appt.serviceName}</Badge>
                                    <span className="text-[11px] font-medium text-slate-400 italic">• Travel time optimized</span>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                    <p className="text-[11px] font-bold text-slate-900 mt-1">{appt.status}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    ))
                    ) : (
                        <EmptyState 
                            icon={CalendarIcon} 
                            title="Zero Appointments" 
                            description="No operational deployments scheduled for this window. Syncing secondary queues."
                        />
                    )}
                </div>
            </section>

            <section>
                <SectionHeader title="Operational Intelligence" subtitle="System health and metrics" />
                <div className="grid grid-cols-2 gap-4">
                    <Card variant="flat" className="relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Network Risk</span>
                            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 tabular-nums">2 Requests</p>
                            <p className="text-[11px] text-slate-500 mt-1">Awaiting vendor response for {'>'} 24h</p>
                        </div>
                    </Card>
                    <Card variant="flat" className="relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Operational Latency</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 tabular-nums">Optimal</p>
                            <p className="text-[11px] text-slate-500 mt-1">Ria Core: 12ms • Status: 200 OK</p>
                        </div>
                    </Card>
                </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-10">
            <Card title="Operational Queue" subtitle="Priority items requiring triage">
                <div className="space-y-6">
                    {data.stats.pendingRequests > 0 && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <div className="flex gap-4 items-start mb-4">
                                <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Briefcase className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold text-slate-900">Job Requests</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">System has identified {data.stats.pendingRequests} inbound coordination tasks.</p>
                                </div>
                            </div>
                            <Link to="/jobs">
                            <Button variant="primary" className="w-full h-8 text-[11px]">
                                Enter Triage Pipeline
                            </Button>
                            </Link>
                        </div>
                    )}
                    
                    <div className="space-y-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Audit Log</p>
                        <div className="space-y-5">
                            {data.recentActivity.map((activity: any) => (
                            <div key={activity.id} className="flex gap-4 items-start pl-1 relative truncate">
                                <div className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${
                                    activity.type === 'success' ? 'bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300'
                                }`} />
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900 leading-tight">{activity.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{activity.message}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-900/10 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-primary-400 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ria Optimizer</span>
                </div>
                <p className="text-[13px] font-medium leading-relaxed italic text-slate-300">
                    "Traffic density rising in Sector 4. Sychronize '782 Spruce' 15 minutes early to maintain operational velocity."
                </p>
                <div className="mt-6">
                    <Button variant="secondary" className="w-full h-8 text-[10px] font-black uppercase tracking-widest">
                        Optimize Schedule
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
