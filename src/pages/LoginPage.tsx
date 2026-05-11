/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState } from "react";
import { Card, Button } from "../components/CommonUI";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setStep("otp");
    }, 1500);
  };

  const handleAutoLogin = () => {
    setIsLoading(true);
    setEmail("work.uditbhatnagar@gmail.com");
    setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased pointer-events-auto">
      <div className="w-full max-w-[420px] space-y-12">
        <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center font-black text-3xl mb-8 shadow-2xl shadow-slate-900/20">R</div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ria Operations</h1>
            <p className="text-slate-500 text-[13px] mt-2 font-medium leading-relaxed italic">Distributed coordination protocol v1.0.4</p>
        </div>

        <Card className="p-0 border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-10">
                <AnimatePresence mode="wait">
                    {step === "email" ? (
                        <motion.form 
                            key="email-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleEmailSubmit} 
                            className="space-y-8"
                        >
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1 block">Operational Identity</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="name@agency.com" 
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all font-medium placeholder:text-slate-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Button type="submit" className="w-full h-14 text-[12px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10" disabled={isLoading}>
                                    {isLoading ? "Requesting Log..." : "Request Access"} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleAutoLogin}
                                    className="w-full h-12 text-[10px] font-bold uppercase tracking-[0.2em] border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                                    disabled={isLoading}
                                >
                                    Auto-login as Admin
                                </Button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form 
                            key="otp-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleOtpSubmit} 
                            className="space-y-8 text-center"
                        >
                            <div className="space-y-6">
                                <div className="h-16 w-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100 shadow-sm">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Identity Verification</h3>
                                    <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">System code sent to <br/> <span className="text-slate-900 font-black">{email}</span></p>
                                </div>
                                <div className="grid grid-cols-4 gap-3 pt-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <input key={i} type="text" maxLength={1} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-xl focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all" />
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-14 text-[12px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Verify & Connect"}
                            </Button>
                            <button type="button" onClick={() => setStep("email")} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors mt-4">Resend Protocol</button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="bg-slate-50 p-5 border-t border-slate-100 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    <Zap className="h-3 w-3 text-primary-500" /> Operational Priority
                </div>
                <div className="w-px h-3 bg-slate-200"></div>
                <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors leading-none">Help Protocol</button>
            </div>
        </Card>
        
        <div className="text-center space-y-4">
            <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                Authorized access only.<br/>
                Encrypted via Snapshot Pro Network.
            </p>
        </div>
      </div>
    </div>
  );
}
