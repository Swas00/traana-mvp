import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Bot, 
  PhoneCall, 
  Volume2, 
  Clock, 
  Users, 
  MapPin, 
  ShieldCheck,
  Building,
  CheckSquare,
  Square,
  Sparkles,
  Radio,
  Zap
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function Dashboard({ setCurrentTab }) {
  const { 
    activeAlert, 
    shelters, 
    selectedShelter, 
    setSelectedShelter, 
    citizenLocation, 
    isCitizenInDanger,
    threatDistanceKm,
    detectRealLocation,
    resetToDemoLocation,
    isDetectingLocation,
    sachetAlerts,
    sachetTelemetry,
    activateSachetAlert,
    t, 
    isAudioAlertActive, 
    toggleAudioSiren 
  } = useEmergency();

  // Citizen interactive checklist states
  const [completedSteps, setCompletedSteps] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speakEmergencyBroadcast = () => {
    if (!window.speechSynthesis || !activeAlert) return;
    window.speechSynthesis.cancel();
    const text = `Attention citizens. Active emergency alert: ${activeAlert.title}. Affected area: ${activeAlert.location}. Immediate instructions: ${activeAlert.instructions.join('. ')}. Please evacuate to designated safe shelters.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const recommendedShelter = shelters.find(s => s.status !== 'FULL') || shelters[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.navDashboard}</span>
            {activeAlert && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider animate-pulse">
                {activeAlert.severity} PRIORITY
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time citizen threat analysis, life-safety checklist, and rapid evacuation actions.
          </p>
        </div>

        {activeAlert && (
          <div className="flex items-center gap-2">
            <button
              onClick={speakEmergencyBroadcast}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
            >
              <Volume2 size={16} className="text-blue-400" />
              <span>Listen to Broadcast</span>
            </button>

            <button
              onClick={toggleAudioSiren}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                isAudioAlertActive 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800'
              }`}
            >
              <span>{isAudioAlertActive ? 'Stop Siren' : 'Trigger Audio Siren'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Citizen Location & Proximity Threat Assessment Banner */}
      <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isCitizenInDanger
          ? 'bg-gradient-to-r from-red-950/90 via-slate-900 to-red-950/90 border-red-500 shadow-xl shadow-red-950/40'
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border-emerald-500/60'
      }`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isCitizenInDanger
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-emerald-600 text-white'
            }`}>
              {isCitizenInDanger ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
              <span>{isCitizenInDanger ? 'IN ACTIVE DISASTER RADIUS' : 'VERIFIED SAFE SECTOR'}</span>
            </span>

            <span className="text-xs text-slate-400 font-mono">
              Mode: <strong>{citizenLocation.mode || 'GPS'}</strong>
            </span>
          </div>

          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin size={18} className={isCitizenInDanger ? 'text-red-400' : 'text-emerald-400'} />
            <span>{citizenLocation.name}</span>
          </h3>

          <p className="text-xs text-slate-300">
            {isCitizenInDanger ? (
              <>
                ⚠️ Your detected location is situated <strong>{threatDistanceKm} km</strong> from the epicenter of 
                <strong> {activeAlert?.title}</strong> (inside the {activeAlert?.radiusKm || 5} km danger zone). 
                Follow the evacuation checklist below.
              </>
            ) : (
              <>
                ✅ No disaster impact detected at your current GPS coordinates. 
                Nearest regional advisory is <strong>{threatDistanceKm} km away</strong> ({activeAlert?.title || 'Flood in Riverfront'}). 
                You can browse shelters or simulate a localized alert below.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={detectRealLocation}
            disabled={isDetectingLocation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
          >
            <span>{isDetectingLocation ? 'Locating...' : 'Refresh My GPS'}</span>
          </button>

          {!isCitizenInDanger && (
            <button
              onClick={resetToDemoLocation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow"
            >
              <span>Switch to Demo Flood Zone</span>
            </button>
          )}
        </div>
      </div>

      {/* NDMA SACHET Live Early Warning Radar Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 shadow-lg space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-900/40">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Radio size={16} className="text-emerald-400 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">NDMA SACHET Live Early Warning Radar</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 animate-pulse">
                  SYNCED (CAP-India)
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Continuous sync with <strong className="text-white">sachet.ndma.gov.in</strong> • {sachetAlerts?.length || 60}+ live meteorological warnings across India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('alerts')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
            >
              <span>Explore All {sachetAlerts?.length || 60} Live Warnings</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Live warnings preview cards */}
        {sachetAlerts && sachetAlerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {sachetAlerts.slice(0, 2).map((sa) => (
              <div
                key={sa.id}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      sa.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                      sa.severity === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-yellow-500 text-black'
                    }`}>
                      {sa.rawDisasterType || sa.type}
                    </span>
                    <span className="text-[11px] font-bold text-white truncate max-w-[200px] sm:max-w-[280px]">
                      {sa.location}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {sa.description}
                  </span>
                </div>

                <button
                  onClick={async () => {
                    await activateSachetAlert(sa.id);
                  }}
                  title="Deploy this live Indian alert to your evacuation dashboard"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-bold shrink-0 transition"
                >
                  <Zap size={10} className="text-yellow-400" />
                  <span>Deploy</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Alert Card */}
      {activeAlert ? (
        <div className="rounded-3xl bg-gradient-to-br from-red-950/80 via-slate-900 to-amber-950/50 border-2 border-red-600 p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-red-800/40">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider">
                  {activeAlert.type} THREAT
                </span>
                <span className="text-xs text-red-300 font-semibold flex items-center gap-1">
                  <Clock size={14} />
                  Issued: {new Date(activeAlert.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-xs text-red-300 font-semibold flex items-center gap-1">
                  <Users size={14} />
                  ~{activeAlert.affectedPopulation.toLocaleString()} citizens affected
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {activeAlert.title}
              </h2>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {activeAlert.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-red-200/90 font-medium">
                <MapPin size={14} className="text-red-400" />
                <span>Sector: <strong>{activeAlert.location}</strong></span>
                <span className="mx-2">•</span>
                <span>Issuing Authority: <strong>{activeAlert.issuedBy}</strong></span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => setCurrentTab('shelters')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-600/30 transition transform active:scale-95"
              >
                <ShieldAlert size={18} />
                <span>{t.findShelterBtn}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  if (recommendedShelter) setSelectedShelter(recommendedShelter);
                  setCurrentTab('routes');
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs transition"
              >
                <Compass size={16} className="text-amber-400" />
                <span>{t.evacuationRouteBtn}</span>
              </button>

              <button
                onClick={() => setCurrentTab('assistant')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs transition"
              >
                <Bot size={16} />
                <span>{t.askAIBtn}</span>
              </button>
            </div>
          </div>

          {/* Immediate Action Checklist */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <CheckCircle2 className="text-amber-400" size={20} />
                <span>{t.whatToDoNow}</span>
              </h3>
              <span className="text-xs text-slate-400">
                Check off steps as you complete them
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {activeAlert.instructions.map((inst, idx) => {
                const isDone = completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-600/50 text-slate-300'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-white'
                    }`}
                  >
                    <button className="mt-0.5 text-amber-400 shrink-0">
                      {isDone ? <CheckSquare size={18} className="text-emerald-400" /> : <Square size={18} />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-amber-400 block mb-0.5">
                        Action #{idx + 1}
                      </span>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {inst}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <ShieldCheck size={48} className="mx-auto text-emerald-400" />
          <h3 className="text-xl font-bold text-white">No Critical Emergency Alert Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All municipal warning channels are normal. If you are conducting a demonstration, navigate to the 
            <strong> Admin Dispatch</strong> tab to trigger a live disaster alert.
          </p>
          <button
            onClick={() => setCurrentTab('admin')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
          >
            <span>Open Admin Dispatch</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Two Column Layout: Recommended Shelter Card & Citizen Current Location Card */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recommended Shelter Card */}
        {recommendedShelter && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Evacuation Destination
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                {recommendedShelter.availableSlots} SLOTS FREE
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">{recommendedShelter.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{recommendedShelter.address}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Distance</span>
                <span className="font-bold text-white text-sm">{recommendedShelter.distanceKm} km</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Elevation</span>
                <span className="font-bold text-white text-sm">{recommendedShelter.elevationMeters} m</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Medical Aid</span>
                <span className="font-bold text-emerald-400 text-sm">24x7 Doctor</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {recommendedShelter.food && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">🍲 Hot Meals</span>
              )}
              {recommendedShelter.water && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">🚰 Filtered Water</span>
              )}
              {recommendedShelter.powerBackup && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">⚡ Solar Backup</span>
              )}
              {recommendedShelter.accessible && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">♿ Wheelchair Ramp</span>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Status: <strong className="text-emerald-400">{recommendedShelter.status}</strong>
              </span>

              <button
                onClick={() => {
                  setSelectedShelter(recommendedShelter);
                  setCurrentTab('routes');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
              >
                <span>Navigate to this Shelter</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Citizen Location & Emergency Helplines Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Current Location
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              GPS SIMULATED
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">{citizenLocation.name}</h4>
            <p className="text-xs text-slate-400">{citizenLocation.neighborhood}</p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Lat: {citizenLocation.latitude.toFixed(4)}, Lng: {citizenLocation.longitude.toFixed(4)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200 space-y-1">
            <p className="font-bold flex items-center gap-1 text-red-300">
              <AlertTriangle size={14} /> Attention: High-Risk Inundation Zone
            </p>
            <p className="text-[11px] text-slate-300">
              Your coordinates place you within 800m of the overflowing river embankment. Evacuate uphill towards North Ridge.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Emergency Hotlines (Direct Dial)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition block"
              >
                <span className="text-xs font-extrabold text-red-400 block">112</span>
                <span className="text-[10px] text-slate-400">National SOS</span>
              </a>
              <a
                href="tel:1070"
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition block"
              >
                <span className="text-xs font-extrabold text-amber-400 block">1070</span>
                <span className="text-[10px] text-slate-400">Disaster Cell</span>
              </a>
              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition block"
              >
                <span className="text-xs font-extrabold text-blue-400 block">108</span>
                <span className="text-[10px] text-slate-400">Ambulance</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Instruction Banner as required by PDF */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <ShieldAlert size={20} className="text-amber-400 shrink-0" />
        <p>
          <strong className="text-slate-200">Official Safety Disclaimer:</strong> TRAANA MVP is an emergency decision-support network. 
          Instructions are informational. Always comply with live sirens, loudspeaker broadcasts, and instructions from National Disaster Response Force (NDRF), civil defense, and police personnel.
        </p>
      </div>
    </div>
  );
}
