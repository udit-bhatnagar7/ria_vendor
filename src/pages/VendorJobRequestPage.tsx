/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Card, Button, Badge, LoadingState } from "../components/CommonUI";
import { VendorJobRequest, VendorSlot } from "../types";
import { Calendar, Clock, MapPin, Info, Plus, Trash2, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";

export function VendorJobRequestPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<VendorJobRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [slots, setSlots] = useState<VendorSlot[]>([{ date: "", startTime: "", endTime: "" }]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/vendor/job/${token}`);
        if (!response.ok) throw new Error("Job request not found or expired.");
        const data = await response.json();
        
        // If status is "Scheduled", redirect to appointment page
        if (data.status === "Scheduled" || data.status === "Completed") {
            navigate(`/vendor/appointment/${token}`);
            return;
        }

        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [token, navigate]);

  const addSlot = () => {
    setSlots([...slots, { date: "", startTime: "", endTime: "" }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof VendorSlot, value: string) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    const validSlots = slots.filter(s => s.date && s.startTime && s.endTime);
    if (validSlots.length === 0) {
      alert("Please add at least one available time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/vendor/job/${token}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: validSlots, note }),
      });
      if (!response.ok) throw new Error("Failed to submit availability.");
      
      navigate("/vendor/confirmation", { state: { slots: validSlots } });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotAvailable = async () => {
    if (!confirm("Are you sure you want to mark yourself as not available for this job?")) return;
    
    try {
      await fetch(`/api/vendor/job/${token}/not-available`, { method: "POST" });
      alert("Status updated. Thank you for letting us know.");
      navigate(0); // Refresh
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><LoadingState /></div>;

  if (error || !job) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Request Expired</h1>
      <p className="mt-2 text-center text-slate-500 text-sm max-w-xs mx-auto">{error || "This coordination link has reached terminal state or is invalid."}</p>
      <Button variant="outline" className="mt-8" onClick={() => navigate("/")}>System Reset</Button>
    </div>
  );

  if (job.status === "Availability Submitted") {
     return (
        <div className="min-h-screen bg-slate-50">
            <Header title="Availability Received" />
            <div className="mx-auto mt-20 max-w-lg px-6">
                <div className="text-center mb-10">
                    <div className="mb-6 h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl inline-flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deployment Pending</h1>
                    <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                        Operational availability has been logged. Ria is now synchronizing with the seller to finalize the window.
                    </p>
                </div>
                <Card title="Submitted Windows" variant="flat">
                    <div className="space-y-4">
                        <p className="text-xs text-slate-400 font-medium italic">Your proposed slots are being evaluated against listing priority.</p>
                    </div>
                </Card>
                <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Reference: JOB-{job.id}</p>
                </div>
            </div>
        </div>
     );
  }

  if (job.status === "Not Available") {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-20 px-6">
            <div className="mx-auto max-w-lg w-full">
                <Card>
                    <div className="text-center py-6">
                        <Info className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Status: Unavailable</h1>
                        <p className="mt-2 text-slate-500 text-sm">System has marked this route as blocked for your account.</p>
                        <Button variant="outline" className="mt-8 h-8 text-[11px]" onClick={() => navigate("/")}>Go to Portal</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header title={`Operational Portal • ${job.vendorName}`} />
      
      <main className="mx-auto mt-12 max-w-7xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-12 gap-8"
        >
          {/* Left Column: Job Details & Availability Setup */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Deployment Mission" subtitle="Job parameters and location" className="h-full">
                    <div className="flex flex-col justify-between h-full space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">{job.serviceName}</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900">{job.propertyAddress}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Deployment Target</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 truncate">
                                            {Math.floor(job.durationMinutes / 60)}h {job.durationMinutes % 60}m Est
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 italic">Travel time not included</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-none">REF: JOB-{job.id}</span>
                            <Badge variant="primary">High Priority</Badge>
                        </div>
                    </div>
                </Card>

                <Card title="Access Protocol" subtitle="Site entry instructions" className="h-full">
                    <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Verified Instruction</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic pr-4">
                            "{job.accessNotes || "Use standard lockbox protocol for entry. Verify all lights are off upon exit."}"
                        </p>
                        <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmed Access
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Availability Sync" subtitle="Select operational windows for this deployment">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {slots.map((slot, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="group relative grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100 items-end"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Date</label>
                          <input 
                            required
                            type="date" 
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium"
                            value={slot.date}
                            onChange={(e) => updateSlot(index, 'date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Start Window</label>
                          <input 
                            required
                            type="time" 
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">End Window</label>
                          <input 
                            required
                            type="time" 
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                          />
                        </div>
                        
                        {slots.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="absolute -right-2 -top-2 rounded-full bg-white p-1.5 text-slate-300 shadow-sm border border-slate-100 hover:text-red-500 hover:border-red-100 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <button 
                    type="button" 
                    onClick={addSlot}
                    className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest py-2 px-1 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Window
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Field Intelligence (Optional Note)</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g., Equipment requirements or site access queries..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium placeholder:text-slate-300"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 py-4 text-[12px] bg-slate-900 text-white font-black uppercase tracking-widest" 
                    disabled={submitting}
                  >
                    {submitting ? "Syncing..." : "Commit Availability"}
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button"
                    className="px-8 border-slate-200 text-slate-400 font-black text-[12px] uppercase tracking-widest" 
                    onClick={handleNotAvailable}
                    disabled={submitting}
                  >
                    Mark Unavailable
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Seller Constraints */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <Card variant="dark" title="Seller Parameters" subtitle="Client's preferred windows" className="h-full">
                <div className="space-y-4">
                    {job.sellerAvailability.split('\n').map((line, i) => (
                    <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest opacity-60">Window 0{i+1}</span>
                            <CheckCircle2 className="h-3 w-3 text-white/20 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <p className="text-[15px] font-bold text-white tracking-tight leading-tight">{line}</p>
                    </div>
                    ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Info className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                        Selecting a matching window <br/> accelerates confirmation
                    </p>
                </div>
            </Card>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5" /> Deployment Simulation
                </h4>
                <div className="space-y-3">
                    <button 
                        onClick={async () => {
                            const res = await fetch(`/api/admin/approve-job/${token}`, { method: 'POST' });
                            if (res.ok) navigate(`/vendor/appointment/${token}`);
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[11px] font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-center"
                    >
                        Force Seller Approval
                    </button>
                    <button 
                        onClick={() => navigate(`/vendor/job/demo-token`)}
                        className="w-full px-4 py-3 bg-transparent text-slate-500 rounded-xl text-[11px] font-bold hover:text-slate-300 transition-all uppercase tracking-widest text-center"
                    >
                        Reset Pipeline
                    </button>
                </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
