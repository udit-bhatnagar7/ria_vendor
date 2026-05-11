/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLocation, useNavigate } from "react-router-dom";
import { Header, Card, Button, Badge } from "../components/CommonUI";
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { VendorSlot } from "../types";

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const slots = (location.state?.slots || []) as VendorSlot[];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pointer-events-auto">
      <Header title="Mission Logged" />
      
      <main className="mx-auto mt-24 max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-10 h-20 w-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-slate-900/20">
            <CheckCircle2 className="h-10 w-10 text-indigo-400" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Sync Initiated.</h1>
          <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            Operational availability has been successfully transmitted. Ria will now negotiate the lock window with the seller.
          </p>

          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-0.5">Proposed Deployment Windows</span>
            </div>
            
            {slots.length > 0 ? (
                slots.map((slot, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                                <Calendar className="h-5 w-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{slot.date}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-none">{slot.startTime} – {slot.endTime}</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                    </div>
                ))
            ) : (
                <div className="py-12 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/30">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">No slots detected</p>
                </div>
            )}
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            <Button variant="outline" className="min-w-[240px] h-12 text-[12px] font-black uppercase tracking-widest border-slate-200" onClick={() => navigate(-1)}>
                Edit Availability
            </Button>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] font-mono leading-none">ID: LOG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
