import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight, Compass, Bot, Radio, ExternalLink } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function AlertTicker({ setCurrentTab }) {
  const { activeAlert, sachetAlerts, t } = useEmergency();
  const [sachetIndex, setSachetIndex] = useState(0);

  // Rotate through top live SACHET alerts every 5 seconds
  useEffect(() => {
    if (!sachetAlerts || sachetAlerts.length === 0) return;
    const interval = setInterval(() => {
      setSachetIndex(prev => (prev + 1) % Math.min(sachetAlerts.length, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, [sachetAlerts]);

  const currentSachetAlert = sachetAlerts && sachetAlerts.length > 0 ? sachetAlerts[sachetIndex] : null;

  if (!activeAlert && (!sachetAlerts || sachetAlerts.length === 0)) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>No catastrophic weather alerts active. Civil defense monitors operational.</span>
        </div>
      </div>
    );
  }

  const isCritical = activeAlert && (activeAlert.severity === 'HIGH' || activeAlert.severity === 'CRITICAL');

  return (
    <div className="border-b transition-all">
      {/* Primary Active Alert Ticker (if one is active) */}
      {activeAlert && (
        <div className={`py-2.5 px-4 ${
          isCritical 
            ? 'bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-red-600/60 text-white' 
            : 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-600/40 text-amber-100'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-red-600 text-white animate-pulse">
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm uppercase tracking-wider text-red-300">
                    {activeAlert.type} EMERGENCY:
                  </span>
                  <span className="font-bold text-sm text-white">
                    {activeAlert.title}
                  </span>
                </div>
                <p className="text-xs text-red-200/80 line-clamp-1">
                  Location: <strong>{activeAlert.location}</strong> • Issued: {new Date(activeAlert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('shelters')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition"
              >
                <span>{t.findShelterBtn}</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={() => setCurrentTab('routes')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              >
                <Compass size={13} />
                <span className="hidden sm:inline">{t.navRoutes}</span>
              </button>

              <button
                onClick={() => setCurrentTab('assistant')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition"
              >
                <Bot size={13} />
                <span className="hidden md:inline">Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Synchronized NDMA SACHET Live Warning Bar */}
      {currentSachetAlert && (
        <div className="bg-slate-950 border-b border-indigo-950/70 py-1.5 px-4 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold border border-indigo-800/60 text-[11px] shrink-0">
                <Radio size={11} className="text-emerald-400 animate-pulse" />
                <span>NDMA SACHET LIVE ({sachetIndex + 1}/{Math.min(sachetAlerts.length, 10)}):</span>
              </span>

              <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                currentSachetAlert.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                currentSachetAlert.severity === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-yellow-500 text-black'
              }`}>
                {currentSachetAlert.rawDisasterType || currentSachetAlert.type}
              </span>

              <p className="truncate text-[11px] text-slate-200 font-medium">
                <strong>{currentSachetAlert.location}</strong>: {currentSachetAlert.description}
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('alerts')}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-200 font-semibold shrink-0"
            >
              <span>View All {sachetAlerts.length} Alerts</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
