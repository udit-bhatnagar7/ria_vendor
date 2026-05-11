/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { SidebarLayout, Card, Button, Badge, PageHeader, EmptyState, LoadingState } from "../components/CommonUI";
import { MapPin, Clock, Calendar, ChevronRight, AlertCircle, Search, Filter, Briefcase } from "lucide-react";
import { VendorJobRequest } from "../types";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export function JobRequestsPage() {
  const [jobs, setJobs] = useState<VendorJobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/jobs")
        .then(res => res.json())
        .then(data => {
            setJobs(data);
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
      <div className="max-w-4xl mx-auto">
        <PageHeader 
            title="Queue" 
            subtitle="Operational triage for incoming service requests. Prioritize critical deployments."
            actions={
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input 
                        placeholder="Filter queue..." 
                        className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-[12px] w-48 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium" 
                        />
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <Button variant="ghost" className="h-8 text-[11px] uppercase tracking-widest px-2 group">
                        History
                        <ChevronRight className="h-3 w-3 ml-1 text-slate-300 group-hover:text-slate-900" />
                    </Button>
                </div>
            }
        />

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="group bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all ring-1 ring-slate-200/60 shadow-sm">
                                <Briefcase className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">{job.propertyAddress}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] font-medium text-slate-500">{job.serviceName}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className={`text-[11px] font-bold ${job.priority === 'High' ? 'text-primary-600' : 'text-slate-400 uppercase tracking-widest'}`}>{job.priority} Priority</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pl-1 pr-6 py-2 bg-slate-50/50 rounded-lg w-fit">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Calendar className="h-3.5 w-3.5 opacity-40" />
                                <span className="text-[11px] font-bold">{format(new Date(job.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            <div className="h-3 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock className="h-3.5 w-3.5 opacity-40" />
                                <span className="text-[11px] font-bold">{Math.floor(job.durationMinutes / 60)}h {job.durationMinutes % 60}m</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-t md:border-t-0 pt-6 md:pt-0 shrink-0">
                        <Button variant="outline" className="h-9 px-4 text-[12px] flex-1 md:flex-none">Archve</Button>
                        <Link to={`/vendor/job/${job.token}`} className="flex-1 md:flex-none">
                            <Button className="h-9 px-6 text-[12px] w-full">Coordinate</Button>
                        </Link>
                    </div>
                </div>
                
                <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${job.priority === 'High' ? 'bg-primary-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Operational Status: {job.status}</span>
                    </div>
                </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <EmptyState 
                icon={Briefcase} 
                title="Triage Pipeline Empty" 
                description="Zero service requests waiting in queue. Synchronizing with listing networks."
            />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
