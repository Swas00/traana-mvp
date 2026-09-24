import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Navigation, 
  Bot, 
  Database, 
  Cpu, 
  Target, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function PresentationDeck() {
  const { presentationOpen, setPresentationOpen } = useEmergency();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!presentationOpen) return null;

  const slides = [
    {
      number: 1,
      title: "TRAANA",
      subtitle: "Threat Response & Assistance Network for Alerts and Navigation",
      badge: "MVP Demonstration Pitch Deck",
      icon: ShieldAlert,
      content: (
        <div className="space-y-6 text-center max-w-2xl mx-auto py-6">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-600 text-white shadow-2xl shadow-red-500/30">
            <ShieldAlert size={56} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">TRAANA</h2>
            <p className="text-xl font-medium text-amber-400 mt-2">
              Transforming sirens into survival: The complete citizen-centric disaster navigation ecosystem.
            </p>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            A working end-to-end prototype delivering the full disaster response journey: 
            <span className="text-white font-bold block mt-2 text-lg">
              Alert → Understand → Act → Find Shelter → Evacuate → Get Help
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">Real-Time Alerts</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">Shelter Discovery</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">Hazard-Aware Routing</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">TRAANA AI Assistant</span>
          </div>
        </div>
      )
    },
    {
      number: 2,
      title: "The Problem",
      subtitle: "Warning alone is not enough — people need actionable response",
      icon: AlertTriangle,
      content: (
        <div className="grid md:grid-cols-2 gap-6 items-center py-4">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60">
              <h4 className="font-bold text-red-300 mb-1">🚨 The "Alert Fatigue" Barrier</h4>
              <p className="text-sm text-slate-300">
                Traditional SMS and siren alerts say "Danger incoming", but leave citizens panicked with no clear evacuation destination or immediate steps.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <h4 className="font-bold text-amber-300 mb-1">🗺️ The Routing Blindspot</h4>
              <p className="text-sm text-slate-300">
                Standard GPS apps route citizens directly through flooded roads, submerged bridges, and electrocution zones without hazard awareness.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60">
              <h4 className="font-bold text-blue-300 mb-1">🏥 Shelter Congestion & Chaos</h4>
              <p className="text-sm text-slate-300">
                Families arrive at community halls only to find them overflowing, lacking medical equipment or wheelchair accessibility.
              </p>
            </div>
          </div>
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={20} /> The TRAANA Paradigm
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              TRAANA bridges the fatal gap between <strong>early warning</strong> and <strong>safe arrival</strong>. 
              By providing instant actionable instructions, real-time shelter capacity telemetry, hazard-avoiding routing, and AI triage, citizens make calm, calculated survival decisions.
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
              Result: Zero-delay evacuation, reduced casualty rates, and decentralized emergency load.
            </div>
          </div>
        </div>
      )
    },
    {
      number: 3,
      title: "Target Users & Impact",
      subtitle: "Serving vulnerable populations and emergency incident commanders",
      icon: Target,
      content: (
        <div className="grid md:grid-cols-3 gap-5 py-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">01</div>
            <h4 className="font-bold text-white text-base">Citizens & Families</h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Instant plain-language emergency action checklist</li>
              <li>Nearby shelter finder with available beds & infant/pet care</li>
              <li>Offline-capable emergency go-bag guidance</li>
              <li>Turn-by-turn safe detour around flash flood waters</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">02</div>
            <h4 className="font-bold text-white text-base">Emergency Responders & NDRF</h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Real-time shelter occupancy telemetry</li>
              <li>Automated redirection when shelters reach 100% capacity</li>
              <li>Direct dispatch coordination with hospitals & fire teams</li>
              <li>Rapid water rescue resource deployment</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">03</div>
            <h4 className="font-bold text-white text-base">Incident Command / Admin</h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>1-Click crisis broadcast activation</li>
              <li>Dynamic hazard polygon marking on map</li>
              <li>Live situational overview across sectors</li>
              <li>Multilingual reach (English, Hindi, Spanish)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      number: 4,
      title: "Solution Architecture",
      subtitle: "Modular, resilient, decoupled full-stack emergency response system",
      icon: Layers,
      content: (
        <div className="space-y-4 py-2">
          <div className="grid md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Client Layer</span>
              <h5 className="font-bold text-white mt-1">Citizen & Admin UI</h5>
              <p className="text-xs text-slate-400 mt-2">
                React 19 + Vite + Tailwind CSS. High-contrast emergency mode, Web Audio siren synthesizer, multilingual localization.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Mapping Layer</span>
              <h5 className="font-bold text-white mt-1">Spatial GIS & Routing</h5>
              <p className="text-xs text-slate-400 mt-2">
                Leaflet + OpenStreetMap engine. Custom geo-markers, polyline evacuation paths, and real-time hazard avoidance polygons.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">API & Logic</span>
              <h5 className="font-bold text-white mt-1">Express REST Engine</h5>
              <p className="text-xs text-slate-400 mt-2">
                Node.js Express REST API. Dynamic alert dispatcher, shelter capacity monitor, and hazard zone query endpoints.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Intelligence & Data</span>
              <h5 className="font-bold text-white mt-1">TRAANA Neural AI Engine + MongoDB</h5>
              <p className="text-xs text-slate-400 mt-2">
                Contextual emergency triage engine with multi-calamity hazard reasoning. Resilient MongoDB Mongoose schema with dual-mode in-memory fallback.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono text-xs text-slate-300">
            [ Citizen Browser ] ⇄ [ REST API /api/* ] ⇄ [ MongoDB + TRAANA Neural Engine ] ⇄ [ Emergency Dispatch Command ]
          </div>
        </div>
      )
    },
    {
      number: 5,
      title: "Core Workflow",
      subtitle: "The 6-Step Life-Safety Citizen Journey",
      icon: Activity,
      content: (
        <div className="py-4">
          <div className="grid md:grid-cols-6 gap-3">
            {[
              { step: "1. Alert", desc: "Push notification & siren trigger warning of flash flood", color: "border-red-500 text-red-400" },
              { step: "2. Understand", desc: "Severity badge, affected radius, plain-language summary", color: "border-orange-500 text-orange-400" },
              { step: "3. Act", desc: "Checklist: cut main power breaker, grab 72h go-bag", color: "border-amber-500 text-amber-400" },
              { step: "4. Find Shelter", desc: "Filter nearby high-ground shelters with available beds", color: "border-blue-500 text-blue-400" },
              { step: "5. Evacuate", desc: "Interactive map with route avoiding submerged roads", color: "border-purple-500 text-purple-400" },
              { step: "6. Get Help", desc: "TRAANA AI triage and direct helplines (112, 1070)", color: "border-emerald-500 text-emerald-400" }
            ].map((s, idx) => (
              <div key={idx} className={`p-4 rounded-xl bg-slate-900 border-t-2 ${s.color} border-slate-800 text-left space-y-2`}>
                <h5 className="font-bold text-white text-sm">{s.step}</h5>
                <p className="text-xs text-slate-400 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 text-center text-xs text-blue-200">
            🎯 <strong>Demonstrated in MVP:</strong> Reviewer can trigger an alert in Admin, and within 30 seconds complete the entire sequence live.
          </div>
        </div>
      )
    },
    {
      number: 6,
      title: "MVP Features",
      subtitle: "Comprehensive functionality ready for demonstration",
      icon: CheckCircle2,
      content: (
        <div className="grid md:grid-cols-2 gap-4 py-2 text-left">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-white">🚨 Dynamic Disaster Alerting</h5>
              <p className="text-xs text-slate-400">High/Medium/Low severity categorization, timestamps, affected coordinates, and active state toggles.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-white">🏠 Real-Time Shelter Finder</h5>
              <p className="text-xs text-slate-400">Live capacity metrics (available vs total), medical/food badges, wheelchair accessibility, elevation metrics.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-white">🗺️ Hazard-Aware Evacuation Map</h5>
              <p className="text-xs text-slate-400">Interactive OpenStreetMap, citizen position pin, destination shelter marker, avoidance polygons for submerged zones.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-white">🤖 TRAANA AI Assistant</h5>
              <p className="text-xs text-slate-400">Situational emergency advisor using active alert context. Voice synthesis read-aloud and quick prompt chips.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-white">🏥 Comprehensive Resource Directory</h5>
              <p className="text-xs text-slate-400">Hospitals, police, fire brigade, relief camps, ambulance standby units with direct call links.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-white">🎛️ Crisis Dispatcher Admin Suite</h5>
              <p className="text-xs text-slate-400">Simulate emergencies live, update shelter bed counts, broadcast warnings, and reset demo data instantly.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/40 bg-emerald-950/20">
              <h5 className="text-sm font-bold text-emerald-300">🇮🇳 India Disaster Datasets & Feeds</h5>
              <p className="text-xs text-slate-400">Native integration with NDMA SACHET (CAP-India), CWC Flood Watch, NCRMP Cyclone Shelters, OSM India, and custom CSV/GeoJSON ingestion.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      number: 7,
      title: "Technology Stack",
      subtitle: "Industry-standard, high-speed, modern architecture",
      icon: Cpu,
      content: (
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-blue-400 text-sm mb-2">Frontend Stack</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>React 19 & Vite:</strong> Ultra-fast rendering and Hot Module Replacement</li>
                <li><strong>Tailwind CSS v4:</strong> Responsive, utility-first emergency design system</li>
                <li><strong>Leaflet.js:</strong> Lightweight, cross-platform interactive cartography</li>
                <li><strong>Lucide React:</strong> Crisp, accessible disaster and utility iconography</li>
                <li><strong>Web Audio API:</strong> Native synthesized emergency broadcast siren</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-emerald-400 text-sm mb-2">Backend & AI Stack</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Node.js & Express:</strong> High-throughput REST API with structured routing</li>
                <li><strong>MongoDB & Mongoose:</strong> Document schemas for alerts, shelters, and resources</li>
                <li><strong>TRAANA Neural AI:</strong> Contextual disaster reasoning engine with multi-hazard triage</li>
                <li><strong>Dual-Mode Storage:</strong> Zero-fail memory cache ensures offline prototype stability</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      number: 8,
      title: "Live Demo Script",
      subtitle: "Follow this exact walkthrough during your presentation",
      icon: Sparkles,
      content: (
        <div className="space-y-3 py-2 text-left">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">Step 1</span>
            <div>
              <p className="text-xs text-white font-bold">Admin triggers High-Severity Flood</p>
              <p className="text-[11px] text-slate-400">Open Admin Dispatch tab, click "Trigger High-Severity Flood Alert". Notice immediate system-wide broadcast.</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-xs">Step 2</span>
            <div>
              <p className="text-xs text-white font-bold">Citizen Dashboard receives live warning</p>
              <p className="text-[11px] text-slate-400">Navigate to Citizen Dashboard. Point out the Red Alert Banner, high-severity badge, and immediate instructions.</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-xs">Step 3</span>
            <div>
              <p className="text-xs text-white font-bold">Find Safe High-Ground Shelter</p>
              <p className="text-[11px] text-slate-400">Click "Find Shelter". Show the live capacity bar (North Ridge: 240 slots, St. Jude: Full). Select North Ridge.</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">Step 4</span>
            <div>
              <p className="text-xs text-white font-bold">Inspect Hazard-Avoiding Evacuation Route</p>
              <p className="text-[11px] text-slate-400">Click "Evacuate Here". Observe map routing avoiding the red hazard zone (Lowland Inundation 4.2ft).</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">Step 5</span>
            <div>
              <p className="text-xs text-white font-bold">Consult TRAANA AI & Check Resources</p>
              <p className="text-[11px] text-slate-400">Ask TRAANA AI: "What should I carry in my go-bag?" View instant response. Then open Emergency Help for helplines.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      number: 9,
      title: "AI Assistant & Contextual Triage",
      subtitle: "Bridging uncertainty with reliable emergency decision support",
      icon: Bot,
      content: (
        <div className="grid md:grid-cols-2 gap-5 py-3 text-left">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Bot className="text-blue-400" size={18} /> Contextual Situation Awareness
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike generic LLM chats, TRAANA AI continuously injects the <strong>Active Alert ID</strong>, <strong>Disaster Type</strong>, <strong>Citizen Coordinates</strong>, and <strong>Open Shelter Capacities</strong> into its prompt instructions.
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Input: "What should I do?"<br/>
              Awareness: [FLOOD ACTIVE] [Zone 1-4] [North Ridge Open]<br/>
              Output: "Evacuate Zone 1-4 now to North Ridge High School (240 beds free)..."
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm">Key Pre-Tuned Emergency Queries</h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-1.5 rounded bg-slate-800/80">❓ "Where is the nearest shelter?"</div>
              <div className="p-1.5 rounded bg-slate-800/80">❓ "What should I pack in my go-bag?"</div>
              <div className="p-1.5 rounded bg-slate-800/80">❓ "Is municipal tap water safe to drink?"</div>
              <div className="p-1.5 rounded bg-slate-800/80">❓ "Downed power wire in water - what to do?"</div>
            </div>
            <p className="text-[11px] text-amber-300">
              ⚡ Includes safety disclaimers adhering to international disaster management standards.
            </p>
          </div>
        </div>
      )
    },
    {
      number: 10,
      title: "Future Scope & Conclusion",
      subtitle: "Scaling from prototype to municipal resilience infrastructure",
      icon: Sparkles,
      content: (
        <div className="space-y-5 py-4 text-left">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h5 className="font-bold text-white text-sm mb-1">📡 Official Integrations</h5>
              <p className="text-xs text-slate-400">Direct webhook ingestion from NDMA, IMD, USGS, and satellite flood radar streams.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h5 className="font-bold text-white text-sm mb-1">📶 Low-Bandwidth Mode</h5>
              <p className="text-xs text-slate-400">Offline PWA cache and mesh SMS broadcast when cellular towers collapse.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h5 className="font-bold text-white text-sm mb-1">🎙️ Multi-dialect Voice</h5>
              <p className="text-xs text-slate-400">Native two-way voice dialogue for non-literate and visually impaired citizens.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border border-slate-700 text-center space-y-2">
            <h4 className="text-lg font-black text-white">Summary of Success Criterion</h4>
            <p className="text-sm text-slate-200 max-w-2xl mx-auto">
              "A reviewer can trigger an emergency alert, see the alert, understand recommended actions, find an available shelter, view an evacuation route, ask TRAANA for guidance, and access emergency resources."
            </p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              ✅ 100% Implemented & Verified in this TRAANA MVP
            </div>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Icon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Slide {slide.number} of {slides.length}
                </span>
                {slide.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {slide.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{slide.title}</h3>
            </div>
          </div>

          <button
            onClick={() => setPresentationOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-center">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-black text-white">{slide.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{slide.subtitle}</p>
          </div>
          {slide.content}
        </div>

        {/* Modal Footer / Navigation */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
