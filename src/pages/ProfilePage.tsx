/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  SidebarLayout, 
  PageHeader, 
  Card, 
  Button, 
  LoadingState, 
  Badge,
  SectionHeader,
  VendorCard
} from "../components/CommonUI";
import { 
  User, 
  Shield, 
  Bell, 
  Map, 
  Clock, 
  Globe, 
  Briefcase, 
  Plus, 
  Save, 
  RotateCcw, 
  Camera, 
  DollarSign, 
  Video, 
  Image as ImageIcon, 
  Layout, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  Smartphone,
  Zap,
  Trash2,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Layers,
  X
} from "lucide-react";
import { VendorProfile, VendorService, VendorMedia } from "../types";
import { motion, AnimatePresence } from "motion/react";

type TabType = 'profile' | 'services' | 'availability' | 'pricing' | 'portfolio' | 'notifications' | 'performance' | 'preferences';

export function ProfilePage() {
  const [profile, setProfile] = React.useState<VendorProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabType>('profile');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/vendor/profile")
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <SidebarLayout><LoadingState /></SidebarLayout>;
  if (!profile) return null;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'preferences', label: 'Preferences', icon: Shield },
  ];

  return (
    <SidebarLayout>
      <PageHeader 
        title="Command Center" 
        subtitle="Manage your operational identity, parameters, and mission distribution"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 text-[11px] px-4 font-bold uppercase tracking-widest" onClick={() => setShowPreview(true)}>
                <ExternalLink className="h-3.5 w-3.5 mr-2" /> Live Preview
            </Button>
            <Button variant="outline" className="h-10 text-[11px] px-4 font-bold uppercase tracking-widest" onClick={() => window.location.reload()}>
                <RotateCcw className="h-3.5 w-3.5 mr-2" /> Revert
            </Button>
            <Button className="h-10 text-[11px] px-6 font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg shadow-slate-900/10" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Syncing..." : "Commit Changes"} <Save className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Navigation Rail */}
        <div className="col-span-12 lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <tab.icon className={`h-4 w-4 ${isActive ? "text-primary-500" : "text-slate-400"}`} />
                {tab.label}
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-400" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileSection profile={profile} setProfile={setProfile} />}
              {activeTab === 'services' && <ServicesSection profile={profile} setProfile={setProfile} />}
              {activeTab === 'availability' && <AvailabilitySection profile={profile} setProfile={setProfile} />}
              {activeTab === 'pricing' && <PricingSection profile={profile} setProfile={setProfile} />}
              {activeTab === 'portfolio' && <PortfolioSection profile={profile} setProfile={setProfile} />}
              {activeTab === 'notifications' && <NotificationsSection profile={profile} setProfile={setProfile} />}
              {activeTab === 'performance' && <PerformanceSection profile={profile} />}
              {activeTab === 'preferences' && <PreferencesSection profile={profile} setProfile={setProfile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Live Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <div className="absolute -top-12 right-0">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <VendorCard profile={profile} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}

function ProfileSection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  return (
    <div className="space-y-8">
      <Card title="Identity Protocol" subtitle="Public business details and branding assets">
        <div className="flex flex-col md:flex-row gap-10 items-start mb-10 pb-10 border-b border-slate-100/50">
          <div className="relative group">
              <div className="h-24 w-24 rounded-[2rem] bg-slate-100 overflow-hidden border-2 border-white shadow-lg transition-transform group-hover:scale-105">
                <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest">Avatar</p>
          </div>
          <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                <img src={profile.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-2xl">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest">Logo</p>
          </div>
          <div className="flex-1 space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Identity Statement</h4>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[13px] font-medium leading-relaxed min-h-[100px] focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all shadow-inner"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Brief operational bio..."
              />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
            <InputField label="Vendor Name" value={profile.contactName} onChange={(v) => setProfile({ ...profile, contactName: v })} />
            <InputField label="Company Name" value={profile.businessName} onChange={(v) => setProfile({ ...profile, businessName: v })} />
            <InputField label="Operational Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
            <InputField label="Hotline" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} type="tel" />
            <InputField label="Experience (Years)" value={profile.yearsExperience?.toString() || ""} onChange={(v) => setProfile({ ...profile, yearsExperience: parseInt(v) })} type="number" />
            <InputField label="Digital Hub" value={profile.website || ""} onChange={(v) => setProfile({ ...profile, website: v })} placeholder="https://..." />
        </div>
      </Card>

      <Card title="Geographic Deployment" subtitle="Operational service radius and covered sectors">
        <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 block">Service Areas</label>
            <div className="flex flex-wrap gap-2">
                {profile.operatingAreas.map((area, i) => (
                    <Badge key={i} variant="primary">
                        {area} <button className="ml-2 hover:text-slate-900">×</button>
                    </Badge>
                ))}
                <button className="h-6 px-3 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 transition-all">
                    <Plus className="h-3 w-3" /> Add Sector
                </button>
            </div>
        </div>
      </Card>
    </div>
  );
}

function ServicesSection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  const serviceTypes = ["Photography", "Videography", "3D Tours", "Drone", "Cleaning", "Staging", "Painting", "Repairs", "Landscaping"];

  const toggleService = (type: string) => {
    const existing = profile.services.find(s => s.type === type);
    if (existing) {
        setProfile({
            ...profile,
            services: profile.services.map(s => s.type === type ? { ...s, enabled: !s.enabled } : s)
        });
    } else {
        setProfile({
            ...profile,
            services: [...profile.services, { type, enabled: true, basePrice: 0, estimatedDurationMinutes: 60, turnaroundTimeHours: 24 }]
        });
    }
  };

  return (
    <div className="space-y-8">
      <Card title="Fulfillment Spectrum" subtitle="Configure supported mission types and deliverable parameters">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {serviceTypes.map(type => {
                const config = profile.services.find(s => s.type === type);
                const isEnabled = config?.enabled;
                return (
                    <button
                        key={type}
                        onClick={() => toggleService(type)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all text-center ${
                            isEnabled 
                                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10" 
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                        }`}
                    >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${isEnabled ? "bg-white/10" : "bg-slate-50"}`}>
                            {type === 'Photography' && <Camera className="h-6 w-6" />}
                            {type === 'Videography' && <Video className="h-6 w-6" />}
                            {type === '3D Tours' && <Globe className="h-6 w-6" />}
                            {!['Photography', 'Videography', '3D Tours'].includes(type) && <Layers className="h-6 w-6" />}
                        </div>
                        <span className="text-[13px] font-black tracking-tight">{type}</span>
                        {isEnabled && <span className="text-[10px] font-black text-primary-500 mt-2 uppercase tracking-widest">Active</span>}
                    </button>
                );
            })}
        </div>

        <div className="mt-12 space-y-8">
            <SectionHeader title="Operational Configuration" subtitle="Define pricing and duration for active services" />
            <div className="space-y-6">
                {profile.services.filter(s => s.enabled).map((service, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 grid gap-6 sm:grid-cols-4 items-end">
                        <div className="sm:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Service</label>
                            <p className="text-[14px] font-black text-slate-900">{service.type}</p>
                        </div>
                        <InputField label="Base USD" value={service.basePrice.toString()} type="number" onChange={(v) => {
                            const newServices = [...profile.services];
                            const idx = profile.services.findIndex(s => s.type === service.type);
                            newServices[idx] = { ...service, basePrice: parseFloat(v) || 0 };
                            setProfile({ ...profile, services: newServices });
                        }} />
                        <InputField label="EST. MINS" value={service.estimatedDurationMinutes.toString()} type="number" onChange={(v) => {
                             const newServices = [...profile.services];
                             const idx = profile.services.findIndex(s => s.type === service.type);
                             newServices[idx] = { ...service, estimatedDurationMinutes: parseInt(v) || 0 };
                             setProfile({ ...profile, services: newServices });
                        }} />
                        <InputField label="LOG HRS" value={service.turnaroundTimeHours.toString()} type="number" onChange={(v) => {
                             const newServices = [...profile.services];
                             const idx = profile.services.findIndex(s => s.type === service.type);
                             newServices[idx] = { ...service, turnaroundTimeHours: parseInt(v) || 0 };
                             setProfile({ ...profile, services: newServices });
                        }} />
                    </div>
                ))}
            </div>
        </div>
      </Card>
    </div>
  );
}

function AvailabilitySection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-8">
      <Card title="Temporal Protocol" subtitle="Weekly deployment windows and system status">
        <div className="flex items-center justify-between p-5 bg-amber-50 border border-amber-100 rounded-2xl mb-10">
            <div className="flex gap-4">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                    <h4 className="text-[13px] font-bold text-amber-900 leading-none">Vacation Mode</h4>
                    <p className="text-[11px] text-amber-700 mt-1.5 font-medium leading-tight">When enabled, the Ria matching protocol will bypass this identity for all new missions.</p>
                </div>
            </div>
            <button 
                onClick={() => setProfile({ ...profile, availability: { ...profile.availability, vacationMode: !profile.availability.vacationMode } })}
                className={`h-8 w-14 rounded-full p-1 transition-all ${profile.availability.vacationMode ? "bg-amber-600" : "bg-slate-200"}`}
            >
                <div className={`h-6 w-6 rounded-full bg-white transition-all shadow-sm ${profile.availability.vacationMode ? "translate-x-6" : "translate-x-0"}`} />
            </button>
        </div>

        <div className="space-y-1">
            {days.map(day => {
                const config = (profile.availability.workingHours as any)[day];
                if (!config) return null;
                return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-all">
                        <div className="w-32">
                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{day}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input 
                                type="time" 
                                value={config.start} 
                                disabled={!config.enabled}
                                onChange={(e) => {
                                    setProfile({
                                        ...profile,
                                        availability: {
                                            ...profile.availability,
                                            workingHours: {
                                                ...profile.availability.workingHours,
                                                [day]: { ...config, start: e.target.value }
                                            }
                                        }
                                    });
                                }}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-slate-300 disabled:opacity-30" 
                            />
                            <span className="text-slate-300 text-[10px] font-black">TO</span>
                            <input 
                                type="time" 
                                value={config.end} 
                                disabled={!config.enabled}
                                onChange={(e) => {
                                    setProfile({
                                        ...profile,
                                        availability: {
                                            ...profile.availability,
                                            workingHours: {
                                                ...profile.availability.workingHours,
                                                [day]: { ...config, end: e.target.value }
                                            }
                                        }
                                    });
                                }}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold focus:outline-none focus:ring-1 focus:ring-slate-300 disabled:opacity-30" 
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setProfile({
                                    ...profile,
                                    availability: {
                                        ...profile.availability,
                                        workingHours: {
                                            ...profile.availability.workingHours,
                                            [day]: { ...config, enabled: !config.enabled }
                                        }
                                    }
                                });
                            }}
                            className={`ml-auto text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                                config.enabled ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                            }`}
                        >
                            {config.enabled ? "Active" : "Closed"}
                        </button>
                    </div>
                );
            })}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <InputField label="Identity Timezone" value={profile.availability.timezone} onChange={(v) => setProfile({ ...profile, availability: { ...profile.availability, timezone: v } })} />
            <InputField label="Max Daily Payload" value={profile.availability.maxJobsPerDay.toString()} type="number" onChange={(v) => setProfile({ ...profile, availability: { ...profile.availability, maxJobsPerDay: parseInt(v) || 0 } })} />
        </div>
      </Card>
    </div>
  );
}

function PricingSection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  return (
    <div className="space-y-8">
      <Card title="Economic Calibration" subtitle="Define mission baseline and operational offsets">
         <div className="grid gap-8 sm:grid-cols-2 mb-12">
            <InputField label="Dynamic Range MIN ($)" value={profile.pricing.minPrice.toString()} type="number" onChange={(v) => setProfile({ ...profile, pricing: { ...profile.pricing, minPrice: parseFloat(v) || 0 } })} />
            <InputField label="Dynamic Range MAX ($)" value={profile.pricing.maxPrice.toString()} type="number" onChange={(v) => setProfile({ ...profile, pricing: { ...profile.pricing, maxPrice: parseFloat(v) || 0 } })} />
         </div>

         <div className="space-y-6">
            <SectionHeader title="Operational Offsets" subtitle="Baseline fees for logistical edge cases" />
            <div className="grid gap-6 sm:grid-cols-3">
                <InputField label="Logistic Fee ($)" value={profile.pricing.travelFee.toString()} type="number" onChange={(v) => setProfile({ ...profile, pricing: { ...profile.pricing, travelFee: parseFloat(v) || 0 } })} />
                <InputField label="Priority Fee ($)" value={profile.pricing.rushFee.toString()} type="number" onChange={(v) => setProfile({ ...profile, pricing: { ...profile.pricing, rushFee: parseFloat(v) || 0 } })} />
                <InputField label="Off-Peak Fee ($)" value={profile.pricing.weekendFee.toString()} type="number" onChange={(v) => setProfile({ ...profile, pricing: { ...profile.pricing, weekendFee: parseFloat(v) || 0 } })} />
            </div>
         </div>

         <div className="mt-12 p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="h-24 w-24" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <h4 className="text-lg font-black tracking-tight mb-1">Pricing Logic</h4>
                     <p className="text-[12px] text-slate-400 font-medium leading-relaxed max-w-sm">Ria calculates final agency payloads by aggregating your base service rates with these logistical offsets.</p>
                </div>
                <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    {['fixed', 'hourly', 'package'].map(m => (
                        <button 
                            key={m}
                            onClick={() => setProfile({ ...profile, pricing: { ...profile.pricing, model: m as any } })}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                profile.pricing.model === m ? "bg-white text-slate-900" : "text-white/40 hover:text-white"
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>
         </div>
      </Card>
    </div>
  );
}

function PortfolioSection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  return (
    <div className="space-y-8">
      <Card title="Visual Proof of Mission" subtitle="Asset gallery showcasing past fulfillment excellence">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
             <div className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-all shadow-sm border border-slate-100">
                    <Plus className="h-6 w-6" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">Add Media</p>
             </div>
             {profile.portfolio.map((media) => (
                <div key={media.id} className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-lg border border-slate-100 scale-100 hover:scale-[1.02] transition-all">
                    <img src={media.url} alt="Portfolio" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                         <button className="h-10 w-10 bg-white rounded-xl text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <ImageIcon className="h-5 w-5" />
                         </button>
                         <button 
                            onClick={() => setProfile({ ...profile, portfolio: profile.portfolio.filter(m => m.id !== media.id) })}
                            className="h-10 w-10 bg-red-500 rounded-xl text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                         >
                            <Trash2 className="h-5 w-5" />
                         </button>
                    </div>
                </div>
             ))}
        </div>
        
        <div className="mt-12 p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 flex items-center gap-8 group">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 border border-slate-100 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                <Layout className="h-7 w-7" />
            </div>
            <div className="flex-1">
                <h4 className="text-[15px] font-black text-slate-900 tracking-tight mb-1">Grid Organization</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">Synchronized media is cached via Ria-CDN. Resolution and aspect optimization are handled during transmission.</p>
            </div>
            <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest px-6 shrink-0 bg-white">Reorder Chain</Button>
        </div>
      </Card>
    </div>
  );
}

function NotificationsSection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  const toggle = (field: 'email' | 'sms' | 'push') => {
    setProfile({
        ...profile,
        preferences: {
            ...profile.preferences,
            notifications: {
                ...profile.preferences.notifications,
                [field]: !profile.preferences.notifications[field]
            }
        }
    });
  };

  return (
    <div className="space-y-8">
      <Card title="Signal Intercepts" subtitle="Configure mission update transmission channels">
        <div className="space-y-2">
            <NotificationToggle 
                label="Direct SMS Protocol" 
                description="Instant mission alerts sent to your hotline." 
                icon={Smartphone} 
                enabled={profile.preferences.notifications.sms} 
                toggle={() => toggle('sms')} 
            />
            <NotificationToggle 
                label="Email Operational Logs" 
                description="Detailed mission parameters and fulfillment audits." 
                icon={Mail} 
                enabled={profile.preferences.notifications.email} 
                toggle={() => toggle('email')} 
            />
            <NotificationToggle 
                label="Native Push Notifications" 
                description="Real-time feedback loops via the Ria dashboard." 
                icon={Bell} 
                enabled={profile.preferences.notifications.push} 
                toggle={() => toggle('push')} 
            />
        </div>
      </Card>
    </div>
  );
}

function NotificationToggle({ label, description, icon: Icon, enabled, toggle }: { label: string, description: string, icon: any, enabled: boolean, toggle: () => void }) {
    return (
        <div className="flex items-center justify-between p-6 rounded-[1.5rem] border border-white hover:border-slate-100 hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={toggle}>
            <div className="flex gap-5">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${enabled ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 opacity-60"}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="text-[14px] font-black text-slate-900 tracking-tight leading-none mb-2">{label}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-xs">{description}</p>
                </div>
            </div>
            <button 
                className={`h-7 w-12 rounded-full p-1 transition-all ${enabled ? "bg-emerald-500" : "bg-slate-200"}`}
            >
                <div className={`h-5 w-5 rounded-full bg-white transition-all shadow-sm ${enabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
        </div>
    );
}

function PerformanceSection({ profile }: { profile: VendorProfile }) {
  return (
    <div className="space-y-8">
      <Card title="Mission Audit & Integrity" subtitle="System-generated performance metadata">
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="h-32 w-32" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Operational On-Time</p>
                <h3 className="text-6xl font-black tracking-tighter mb-4">{profile.performance.onTimePercentage}%</h3>
                <p className="text-[12px] text-slate-400 font-medium leading-relaxed max-w-[180px]">Calculated based on {profile.performance.completedJobs} mission deployments.</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-primary-600 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare className="h-32 w-32" />
                </div>
                <p className="text-[11px] font-bold text-primary-200 uppercase tracking-[0.2em] mb-1">Signal Response</p>
                <h3 className="text-6xl font-black tracking-tighter mb-4">&lt; {profile.performance.avgResponseTimeMinutes}m</h3>
                <p className="text-[12px] text-primary-200 font-medium leading-relaxed max-w-[180px]">Average latency between agency request and vendor ACK signal.</p>
            </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
             <StatMini label="Fulfillment Score" value={profile.performance.ratingAverage.toString()} sub="Agent Consensus" />
             <StatMini label="Churn Latency" value={profile.performance.cancellationRate + "%"} sub="Mission Abandonment" />
             <StatMini label="Yield Total" value={profile.performance.completedJobs.toString()} sub="Confirmed Deployments" />
        </div>

        <div className="mt-12 p-8 border border-amber-100 bg-amber-50 rounded-[2.5rem] flex gap-6 items-start">
            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
            <div className="space-y-2">
                 <h4 className="text-[14px] font-black text-amber-900 tracking-tight uppercase">Immutable Data</h4>
                 <p className="text-[12px] text-amber-800 font-medium leading-relaxed italic">
                    Performance metadata is system-generated and cannot be modified via this interface. If identifying data inconsistencies, signal Ria Liaison directly.
                 </p>
            </div>
        </div>
      </Card>
    </div>
  );
}

function StatMini({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col items-center justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
            <h5 className="text-[20px] font-black text-slate-900 tracking-tight leading-none mb-1.5">{value}</h5>
            <p className="text-[10px] text-slate-500 font-medium italic opacity-60 tracking-tight">{sub}</p>
        </div>
    );
}

function PreferencesSection({ profile, setProfile }: { profile: VendorProfile, setProfile: (p: VendorProfile) => void }) {
  return (
    <div className="space-y-8">
      <Card title="Scheduling Logic" subtitle="Operational lead times and mission density constraints">
         <div className="grid gap-8 sm:grid-cols-2">
            <InputField label="Minimal Signal Notice (Hrs)" value={profile.preferences.scheduling.minNoticeHours.toString()} type="number" onChange={(v) => {
                setProfile({ ...profile, preferences: { ...profile.preferences, scheduling: { ...profile.preferences.scheduling, minNoticeHours: parseInt(v) || 0 } } });
            }} />
            <InputField label="Buffer Recovery (Mins)" value={profile.preferences.scheduling.bufferMinutes.toString()} type="number" onChange={(v) => {
                setProfile({ ...profile, preferences: { ...profile.preferences, scheduling: { ...profile.preferences.scheduling, bufferMinutes: parseInt(v) || 0 } } });
            }} />
         </div>

         <div className="mt-12 space-y-4">
            <SectionHeader title="Protocol Preferences" subtitle="System handling for recurring and weekend missions" />
            <div className="flex flex-col gap-3">
                <OptionToggle 
                    label="Accept Peak-Window Missions" 
                    description="Enable or disable weekend deployment suggestion." 
                    enabled={profile.preferences.scheduling.acceptWeekend} 
                    toggle={() => setProfile({ ...profile, preferences: { ...profile.preferences, scheduling: { ...profile.preferences.scheduling, acceptWeekend: !profile.preferences.scheduling.acceptWeekend } } })} 
                />
                <OptionToggle 
                    label="Recurring Mission Chains" 
                    description="Allow Ria to automatically bundle repeat appointments." 
                    enabled={profile.preferences.scheduling.acceptRecurring} 
                    toggle={() => setProfile({ ...profile, preferences: { ...profile.preferences, scheduling: { ...profile.preferences.scheduling, acceptRecurring: !profile.preferences.scheduling.acceptRecurring } } })} 
                />
                <OptionToggle 
                    label="Autonomous ACK Protocol" 
                    description="Enable AI-driven auto-response for inbound messages." 
                    enabled={profile.preferences.communication.autoRespond} 
                    toggle={() => setProfile({ ...profile, preferences: { ...profile.preferences, communication: { ...profile.preferences.communication, autoRespond: !profile.preferences.communication.autoRespond } } })} 
                />
            </div>
         </div>
      </Card>
    </div>
  );
}

function OptionToggle({ label, description, enabled, toggle }: { label: string, description: string, enabled: boolean, toggle: () => void }) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100 transition-all cursor-pointer" onClick={toggle}>
            <div>
                <h4 className="text-[13px] font-black text-slate-900 tracking-tight leading-none mb-1.5">{label}</h4>
                <p className="text-[10px] text-slate-500 font-medium">{description}</p>
            </div>
            <div className={`h-6 w-11 rounded-full p-1 transition-all ${enabled ? "bg-slate-900" : "bg-slate-300"}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-all shadow-sm ${enabled ? "translate-x-5" : "translate-x-0"}`} />
            </div>
        </div>
    );
}

function InputField({ label, value, onChange, type = "text", placeholder = "", className = "" }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, className?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium tracking-tight focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-300 placeholder:italic transition-all shadow-inner" 
        />
    </div>
  );
}
