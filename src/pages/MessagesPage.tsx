/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { SidebarLayout, Button } from "../components/CommonUI";
import { Send, Search, MoreVertical, Phone, Video, Paperclip } from "lucide-react";

export function MessagesPage() {
  const [message, setMessage] = React.useState("");

  const contacts = [
    { id: 1, name: "Ria AI", role: "Coordination System", lastMsg: "Tomorrow's shoot confirmed.", time: "10:30 AM", unread: 0, active: true },
    { id: 2, name: "Sarah Jenkins", role: "Listing Agent", lastMsg: "The seller might be late.", time: "9:15 AM", unread: 1, active: false },
    { id: 3, name: "Marcus Thorne", role: "Agent", lastMsg: "Thanks for the photos!", time: "Yesterday", unread: 0, active: false },
  ];

  const chatHistory = [
    { id: 1, sender: "Agent", content: "Hi David, I just sent over a new photography request for Scenic View Dr. Does that work for you?", time: "9:00 AM" },
    { id: 2, sender: "Vendor", content: "Hey Sarah! Received it. I'll check my availability for Monday and submit the slots through the portal.", time: "9:15 AM" },
    { id: 3, sender: "Agent", content: "Great, thanks! The seller is ideally looking for Monday morning if possible.", time: "9:16 AM" },
    { id: 4, sender: "System", content: "Job 'Real Estate Photography' status changed to: Availability Submitted", time: "10:00 AM", isSystem: true },
  ];

  return (
    <SidebarLayout>
      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Contacts Sidebar */}
        <div className="col-span-12 lg:col-span-4 border-r border-slate-100 flex flex-col bg-slate-50/50">
            <div className="p-5 border-b border-slate-100 bg-white">
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input type="text" placeholder="Search protocol..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 px-5 pt-6 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Transmission Logs</span>
                </div>
                {contacts.map(c => (
                    <div key={c.id} className={`p-5 flex items-center gap-4 cursor-pointer transition-all relative ${c.active ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] z-10' : 'hover:bg-white/80'}`}>
                        {c.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>}
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-[13px] shadow-sm relative shrink-0 border ${c.active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'}`}>
                            {c.name.split(" ").map(n => n[0]).join("")}
                            {c.unread > 0 && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-black">{c.unread}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{c.name}</h4>
                                <span className="text-[9px] text-slate-400 uppercase font-black shrink-0 tracking-widest">{c.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate font-medium">{c.lastMsg}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat Window */}
        <div className="hidden lg:col-span-8 flex flex-col bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[13px] border border-indigo-100">SJ</div>
                    <div>
                        <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none">Sarah Jenkins</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-0.5">Listing Agent • active</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="h-9 w-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors border border-transparent hover:border-slate-100"><Phone className="h-4 w-4" /></button>
                    <button className="h-9 w-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors border border-transparent hover:border-slate-100"><Video className="h-4 w-4" /></button>
                    <div className="w-px h-4 bg-slate-100 mx-1"></div>
                    <button className="h-9 w-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors border border-transparent hover:border-slate-100"><MoreVertical className="h-4 w-4" /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50/20">
                {chatHistory.map(m => (
                    m.isSystem ? (
                        <div key={m.id} className="flex flex-col items-center gap-2 py-2">
                             <div className="h-px w-20 bg-slate-100"></div>
                             <span className="px-3 py-1 bg-indigo-50/50 text-indigo-500 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-indigo-100/50">
                                {m.content}
                            </span>
                        </div>
                    ) : (
                        <div key={m.id} className={`flex flex-col ${m.sender === 'Vendor' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.sender === 'Vendor' ? 'Identity Alpha' : m.sender}</span>
                                <span className="text-[9px] font-medium text-slate-300">• {m.time}</span>
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-[13px] leading-relaxed font-medium ${
                                m.sender === 'Vendor' 
                                ? 'bg-slate-900 text-white rounded-tr-none shadow-slate-900/10' 
                                : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                            }`}>
                                <p>{m.content}</p>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-slate-100 bg-white">
                <form className="flex items-center gap-3" onSubmit={(e) => e.preventDefault()}>
                    <button type="button" className="h-12 w-12 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 transition-all shrink-0">
                        <Paperclip className="h-4 w-4" />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="Input transmission..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-12 py-3.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-12 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-all">
                            <Send className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
