import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Navigation, 
  Bot, 
  PhoneCall, 
  AlertTriangle, 
  ArrowRight, 
  HeartHandshake, 
  CheckCircle2, 
  Waves, 
  Wind, 
  Flame, 
  Activity,
  Sparkles,
  Play
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function Home({ setCurrentTab }) {
  const { activeAlert, shelters, t, setDemoTourOpen, triggerFloodAlert } = useEmergency();

  const openShelters = shelters.filter(s => s.status !== 'FULL');

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/60 border border-slate-800 p-6 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Disaster Alert & Emergency Response Prototype
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Threat Response & Assistance Network for <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">Alerts & Navigation</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            TRAANA guides citizens through the critical moments of a catastrophe: from the instant a disaster alert sounds, to discovering verified high-ground shelters, navigating hazard-avoiding routes, and consulting contextual emergency AI.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/25 transition transform active:scale-95"
            >
              <Radio size={18} />
              <span>{t.navDashboard}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setCurrentTab('shelters')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition"
            >
              <ShieldAlert size={18} className="text-amber-400" />
              <span>{t.findShelterBtn}</span>
            </button>

            <button
              onClick={() => setDemoTourOpen(true)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-sm transition"
            >
              <Play size={16} />
              <span>Run Guided Demo Flow</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Crisis Telemetry Card */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border transition-all ${
          activeAlert 
            ? 'bg-gradient-to-b from-red-950/40 to-slate-900 border-red-600/50 shadow-lg shadow-red-950/50' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Threat Status</span>
            {activeAlert ? (
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-xs animate-pulse">
                {activeAlert.severity} SEVERITY
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-xs">
                NORMAL
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {activeAlert ? activeAlert.title : "No Active Disaster Warnings"}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 mb-4">
            {activeAlert ? activeAlert.description : "Municipal sensors and civil defense weather radars are reporting normal conditions."}
          </p>
          <button
            onClick={() => setCurrentTab(activeAlert ? 'dashboard' : 'admin')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <span>{activeAlert ? "View Citizen Action Plan" : "Simulate Crisis in Admin"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Shelters</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-xs">
              {openShelters.length} OPEN
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {openShelters.reduce((acc, s) => acc + s.availableSlots, 0)} Beds Available
          </h3>
          <p className="text-xs text-slate-300 mb-4">
            Equipped with backup solar power, emergency drinking water filtration, and pediatric medical staff.
          </p>
          <button
            onClick={() => setCurrentTab('shelters')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Explore Shelter Discovery</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency AI Assistant</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-xs">
              ONLINE
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Instant Natural-Language Triage
          </h3>
          <p className="text-xs text-slate-300 mb-4">
            Ask questions regarding evacuation routes, go-bag checklists, drinking water safety, and downed power wires.
          </p>
          <button
            onClick={() => setCurrentTab('assistant')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Ask TRAANA AI</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* The Citizen Journey (Alert -> Understand -> Act -> Find Shelter -> Evacuate -> Get Help) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">The Citizen Survival Journey</h2>
          <p className="text-sm text-slate-400">
            A continuous, zero-confusion operational flow designed to preserve human life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            {
              num: "01",
              title: "Alert",
              desc: "Simulated or geo-targeted alert pushed with audio warning siren.",
              color: "text-red-400",
              border: "border-red-500/40"
            },
            {
              num: "02",
              title: "Understand",
              desc: "Severity rating, affected sector bounds, and plain language summary.",
              color: "text-orange-400",
              border: "border-orange-500/40"
            },
            {
              num: "03",
              title: "Act",
              desc: "Turn off power, pack 72-hour emergency go-bag, avoid moving water.",
              color: "text-amber-400",
              border: "border-amber-500/40"
            },
            {
              num: "04",
              title: "Find Shelter",
              desc: "Filter nearby shelters by real-time available capacity and medical care.",
              color: "text-blue-400",
              border: "border-blue-500/40"
            },
            {
              num: "05",
              title: "Evacuate",
              desc: "Interactive map with route avoiding flooded roads and downed lines.",
              color: "text-purple-400",
              border: "border-purple-500/40"
            },
            {
              num: "06",
              title: "Get Help",
              desc: "TRAANA AI triage and direct one-touch 112/1070 dispatch contacts.",
              color: "text-emerald-400",
              border: "border-emerald-500/40"
            }
          ].map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl bg-slate-900 border ${item.border} space-y-2 relative overflow-hidden group hover:bg-slate-850 transition`}>
              <span className={`text-2xl font-black ${item.color}`}>{item.num}</span>
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Disasters Grid */}
      <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white text-center">Multi-Hazard Support Ready for Scaled Deployment</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <Waves className="mx-auto text-blue-400" size={32} />
            <h5 className="font-bold text-white text-sm">Flash Floods</h5>
            <p className="text-xs text-slate-400">Inundation level tracking, submerged bridges, and high-ground routing.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <Wind className="mx-auto text-cyan-400" size={32} />
            <h5 className="font-bold text-white text-sm">Cyclones & Storms</h5>
            <p className="text-xs text-slate-400">Wind velocity buffers, coastal storm surge evacuation, and shelter hardening.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <Activity className="mx-auto text-amber-400" size={32} />
            <h5 className="font-bold text-white text-sm">Earthquakes</h5>
            <p className="text-xs text-slate-400">Structural integrity alerts, gas line shutoff guides, and safe open assembly zones.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <Flame className="mx-auto text-red-400" size={32} />
            <h5 className="font-bold text-white text-sm">Urban & Wildfires</h5>
            <p className="text-xs text-slate-400">Smoke plume dispersion, air quality masks, and upwind evacuation routes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
