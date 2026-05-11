/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { SidebarLayout, Card, Button, PageHeader, LoadingState } from "../components/CommonUI";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Layers, LayoutGrid, Info } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Appointment } from "../types";
import { motion, AnimatePresence } from "motion/react";

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/appointments")
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      });
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  if (loading) return <div className="h-screen"><LoadingState /></div>;

  return (
    <SidebarLayout>
      <PageHeader 
        title="Operations Log"
        subtitle="Chronological scheduling and mission distribution"
        actions={
            <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                    <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                </button>
                <span className="text-[11px] font-black text-slate-900 min-w-[120px] text-center uppercase tracking-widest">
                    {format(currentDate, "MMMM yyyy")}
                </span>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                </button>
            </div>
        }
      />

      <div className="mt-10 grid grid-cols-12 gap-10 items-start">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-10">
            <Card className="p-0 border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-100 divide-x divide-slate-100">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 divide-x divide-slate-100">
                    {calendarDays.map((day, i) => {
                        const dayAppointments = appointments.filter(a => isSameDay(new Date(a.confirmedStart), day));
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div 
                                key={i} 
                                className={`min-h-[140px] p-2 border-b border-slate-100 transition-all ${!isCurrentMonth ? 'bg-slate-50/20 opacity-40' : 'bg-white'}`}
                            >
                                <div className="flex justify-between items-start mb-2 p-1">
                                    <span className={`text-[11px] font-black ${isToday ? 'bg-slate-900 text-white h-7 w-7 flex items-center justify-center rounded-lg shadow-lg shadow-slate-900/20' : isCurrentMonth ? 'text-slate-900' : 'text-slate-300'}`}>
                                        {format(day, "d")}
                                    </span>
                                </div>
                                <div className="space-y-1.5 px-1">
                                    {dayAppointments.map(appt => (
                                        <div key={appt.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white transition-all cursor-pointer group">
                                            <div className="h-1 w-full bg-primary-500 rounded-full mb-1.5 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                                            <p className="text-[10px] font-bold text-slate-900 truncate leading-tight tracking-tight">
                                                {appt.serviceName}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
            <Card title="Active Agenda" subtitle="Near-term engagement queue">
                <div className="space-y-4">
                    {appointments
                        .filter(a => new Date(a.confirmedStart) >= new Date())
                        .sort((a, b) => new Date(a.confirmedStart).getTime() - new Date(b.confirmedStart).getTime())
                        .slice(0, 4)
                        .map(appt => (
                            <div key={appt.id} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-900/5 transition-all cursor-pointer group">
                                <div className="flex flex-col items-center justify-center min-w-[56px] h-14 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 transition-transform group-hover:scale-105">
                                    <span className="text-[15px] font-black leading-none">{format(new Date(appt.confirmedStart), "d")}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">{format(new Date(appt.confirmedStart), "MMM")}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 truncate">{appt.serviceName}</p>
                                    <p className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{appt.propertyAddress}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-3 w-3 text-slate-300" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {format(new Date(appt.confirmedStart), "h:mm a")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {appointments.filter(a => new Date(a.confirmedStart) >= new Date()).length === 0 && (
                        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Zero Active Mission</p>
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-1 px-1">
                <Card variant="flat" className="bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Layers className="h-32 w-32 text-primary-500" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 mb-6 backdrop-blur-md border border-white/10 shadow-xl">
                            <LayoutGrid className="h-6 w-6" />
                        </div>
                        <h4 className="text-[17px] font-black text-white tracking-tight mb-2 uppercase">Sync Link</h4>
                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-8 max-w-[220px]">
                            Synchronize your master availability link with Ria protocols for direct agent bookings.
                        </p>
                        <Button className="w-full h-11 bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-white/10">
                             Copy Protocol Link
                        </Button>
                    </div>
                </Card>
            </div>
            
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex gap-4">
                <Info className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                    Calendar data is cached and synchronized every 300s. Immediate mission updates will appear in your notification log.
                </p>
            </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
