/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarLayout, Card, Button, Badge, PageHeader, LoadingState, Timeline } from "../components/CommonUI";
import { Appointment } from "../types";
import { Calendar, Clock, MapPin, CheckCircle2, Navigation, AlertTriangle, ChevronLeft, Camera, Send, Map as MapIcon, Share2, ClipboardCheck, Info, FileText, RotateCcw, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";

type ViewState = 'detail' | 'reschedule' | 'complete' | 'completed';

export function AppointmentDetailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('detail');
  const [isSyncing, setIsSyncing] = useState(false);

  // Form states
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [alternateTimes, setAlternateTimes] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [isCompletedChecked, setIsCompletedChecked] = useState(false);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const response = await fetch(`/api/vendor/appointment/${token}`);
        if (!response.ok) {
           const jobRes = await fetch(`/api/vendor/job/${token}`);
           const job = await jobRes.json();
           if (job.status !== "Scheduled") {
              navigate(`/vendor/job/${token}`);
              return;
           }
           throw new Error("Appointment not found.");
        }
        const data = await response.json();
        setAppointment(data);
        if (data.status === 'Completed') setView('completed');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [token, navigate]);

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await fetch(`/api/vendor/appointment/${token}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rescheduleReason, alternateTimes }),
      });
      setIsSyncing(false);
      navigate("/dashboard");
    } catch (err) {
      setIsSyncing(false);
      alert("Failed to send request.");
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCompletedChecked) {
        return;
    }
    setIsSyncing(true);
    try {
      await fetch(`/api/vendor/appointment/${token}/complete`, { method: "POST" });
      setTimeout(() => {
        setIsSyncing(false);
        setView('completed');
      }, 800);
    } catch (err) {
      setIsSyncing(false);
      alert("Failed to mark as complete.");
    }
  };

  if (loading || isSyncing) return <div className="h-screen"><LoadingState /></div>;

  if (error || !appointment) return (
    <SidebarLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100 mb-6">
                <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Appointment resolution failed.</h1>
            <p className="mt-2 text-[13px] text-slate-500 max-w-xs mx-auto leading-relaxed">This token may have expired or is not yet scheduled for operational delivery.</p>
            <Button variant="outline" className="mt-8 h-10 px-6 text-[11px] font-bold uppercase tracking-widest" onClick={() => navigate(`/job-requests`)}>View Queue</Button>
        </div>
    </SidebarLayout>
  );

  const timeline = [
    { title: "Instruction Received", description: "Operational parameters synchronized", time: format(new Date(appointment.createdAt), "MMM d, h:mm a"), status: 'completed' as const },
    { title: "Locked for Deployment", description: "Current active mission window", time: format(new Date(appointment.confirmedStart), "MMM d, h:mm a"), status: 'active' as const },
  ];

  return (
    <SidebarLayout>
      <PageHeader 
        title={`Mission ${token?.slice(0, 8).toUpperCase()}`}
        subtitle="Operational parameters and fulfillment data synchronization"
        actions={
            <div className="flex gap-2">
                <Button variant="outline" className="h-8 text-[11px] px-3 font-bold uppercase tracking-widest" onClick={() => navigate("/dashboard")}>
                    <ChevronLeft className="h-3 w-3 mr-2" /> Back
                </Button>
                <Button className="h-8 text-[11px] px-3 font-bold uppercase tracking-widest bg-primary-600 text-white" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.propertyAddress)}`)}>
                    <Navigation className="h-3 w-3 mr-2" /> Launch GPS
                </Button>
            </div>
        }
      />

      <div className="mt-10 grid grid-cols-12 gap-10 items-start">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-10">
            <AnimatePresence mode="wait">
                {view === 'detail' && (
                    <motion.div 
                        key="detail"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-10"
                    >
                        <Card title="Engagement Parameters" subtitle="Service definitions and physical coordinates">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                                            <Camera className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Service Type</p>
                                            <p className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">{appointment.serviceName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Target Address</p>
                                            <p className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">{appointment.propertyAddress}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Execution Date</p>
                                            <p className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">{format(new Date(appointment.confirmedStart), "EEEE, MMM d, yyyy")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Deployment Window</p>
                                            <p className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                                                {format(new Date(appointment.confirmedStart), "h:mm a")} – {format(new Date(appointment.confirmedEnd), "h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-slate-100">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <FileText className="h-12 w-12" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Operational Directives</p>
                                    <p className="text-[13px] font-medium text-slate-700 leading-relaxed max-w-2xl italic">
                                        "{appointment.accessNotes || "Contact Ria liaison if access protocol is missing."}"
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="flex gap-4">
                            <Button variant="primary" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.1em] text-[12px] shadow-lg shadow-primary-900/10" onClick={() => setView("complete")}>
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Log Completion
                            </Button>
                            <Button variant="outline" className="flex-1 h-14 border-slate-200 rounded-2xl font-black uppercase tracking-[0.1em] text-[12px] hover:bg-slate-50" onClick={() => setView("reschedule")}>
                                <RotateCcw className="h-4 w-4 mr-2" /> Signal Latency
                            </Button>
                        </div>
                    </motion.div>
                )}

                {view === 'reschedule' && (
                    <motion.div 
                        key="reschedule"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                         <Card title="Signal Latency" subtitle="operational coordination exception report">
                            <div className="space-y-8">
                                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                    <div>
                                        <p className="text-[13px] font-bold text-amber-900 leading-tight">Latency Risk Detected</p>
                                        <p className="text-[11px] text-amber-700 mt-0.5 font-medium leading-relaxed">Signaling latency will pause the current deployment mission and initiate immediate Ria coordinator intervention.</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleRescheduleSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Reason for Exception</label>
                                        <textarea 
                                            required
                                            placeholder="Detail the blocker or conflict..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-[13px] min-h-[120px] focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium placeholder:text-slate-300 transition-all shadow-inner"
                                            value={rescheduleReason}
                                            onChange={(e) => setRescheduleReason(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Correction Windows</label>
                                        <textarea 
                                            required
                                            placeholder="Proposed deployment availability..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-[13px] min-h-[100px] focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium placeholder:text-slate-300 transition-all shadow-inner"
                                            value={alternateTimes}
                                            onChange={(e) => setAlternateTimes(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button variant="primary" type="submit" className="flex-1 h-12 shadow-lg shadow-primary-900/10 uppercase text-[11px] font-black tracking-widest">Transmit Request</Button>
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl uppercase text-[11px] font-black tracking-widest" onClick={() => setView("detail")}>Abort</Button>
                                    </div>
                                </form>
                            </div>
                         </Card>
                    </motion.div>
                )}

                {view === 'complete' && (
                    <motion.div 
                        key="complete"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                         <Card title="Fulfillment Sync" subtitle="mission completion and deliverable upload">
                            <form onSubmit={handleCompleteSubmit} className="space-y-10">
                                <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group cursor-pointer">
                                    <div className="h-20 w-20 bg-white rounded-[1.75rem] shadow-sm flex items-center justify-center text-slate-300 mb-6 group-hover:text-slate-900 transition-all border border-slate-100">
                                        <Camera className="h-10 w-10" />
                                    </div>
                                    <p className="text-[14px] font-bold text-slate-900">Transmit Media Deliverables</p>
                                    <p className="text-[11px] text-slate-400 mt-2 font-medium italic">Synchronize raw or post-processed assets</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Fulfillment Logs</label>
                                    <textarea 
                                        placeholder="Operational notes or site feedback..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-[13px] min-h-[120px] focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium placeholder:text-slate-300 transition-all shadow-inner"
                                        value={completionNotes}
                                        onChange={(e) => setCompletionNotes(e.target.value)}
                                    />
                                </div>

                                <div className={`p-5 rounded-2xl border transition-all flex gap-4 cursor-pointer ${isCompletedChecked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'}`} onClick={() => setIsCompletedChecked(!isCompletedChecked)}>
                                    <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${isCompletedChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white'}`}>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-slate-900 tracking-tight leading-none pt-1">Mission Attestation</p>
                                        <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed">I attest that the service fulfillment protocol was executed at the target coordinates.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-500/10 uppercase text-[12px] font-black tracking-widest disabled:opacity-50" disabled={!isCompletedChecked}>Finalize Fulfillment</Button>
                                    <Button variant="outline" className="flex-1 h-14 rounded-2xl uppercase text-[12px] font-black tracking-widest" onClick={() => setView("detail")}>Abort</Button>
                                </div>
                            </form>
                         </Card>
                    </motion.div>
                )}

                {view === 'completed' && (
                    <motion.div 
                        key="completed"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-16 bg-white border border-emerald-100 rounded-[3rem] shadow-2xl shadow-emerald-500/5 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
                        <div className="mx-auto h-24 w-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Sync Successful.</h2>
                        <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-12">
                            Fulfillment data has been successfully transmitted. Ria will now notify the listing agent and release payout protocol.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Button className="bg-slate-900 min-w-[240px] h-12 text-[12px] uppercase font-black tracking-widest" onClick={() => navigate("/dashboard")}>Return to Ops Dashboard</Button>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] font-mono">TXN: {token?.slice(0, 10).toUpperCase()}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
            <Card title="Operational Yield" variant="dark" subtitle="Real-time payout projection">
                <div className="py-4">
                    <div className="flex items-baseline gap-3 mb-10">
                        <span className="text-5xl font-black text-white tracking-tighter">$250.00</span>
                        <Badge variant="primary">Confirmed</Badge>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Base Rate</span>
                            <span className="text-white font-mono">$250.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-40">
                            <span>Travel Offset</span>
                            <span className="text-white font-mono">+$0.00</span>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Deployment Total</span>
                            <span className="text-primary-400 font-mono text-[14px]">$250.00</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Chain of Custody" subtitle="Chronological audit log" className="bg-slate-50/50 border-slate-100 shadow-none ring-1 ring-slate-900/5">
                <Timeline items={timeline} />
            </Card>

            <div className="p-1 px-1">
                <Card variant="flat" className="bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-300 mb-6 backdrop-blur-md border border-white/10">
                            <Info className="h-6 w-6" />
                        </div>
                        <h4 className="text-[17px] font-black text-white tracking-tight mb-2">Internal Comms</h4>
                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-8 max-w-[200px]">
                            Signal Ria directly if target coordinates are inaccessible.
                        </p>
                        <Button className="w-full h-11 bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all">
                             Open Channel
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
