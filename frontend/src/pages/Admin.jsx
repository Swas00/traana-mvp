import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  AlertTriangle, 
  Radio, 
  RotateCcw, 
  Play, 
  Sliders, 
  ShieldAlert, 
  PlusCircle, 
  CheckCircle2, 
  Database, 
  Activity,
  Send,
  Building,
  ArrowRight,
  Flame,
  Wind,
  Waves,
  Zap
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import IndiaDatasetsHub from '../components/IndiaDatasetsHub';

export default function Admin({ setCurrentTab }) {
  const { 
    alerts, 
    activeAlert, 
    shelters, 
    triggerFloodAlert, 
    resetDemoData, 
    toggleAlertStatus, 
    updateShelterSlots,
    refetch, 
    t 
  } = useEmergency();

  const [adminStatus, setAdminStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Form State for creating a custom alert
  const [formType, setFormType] = useState('FLOOD');
  const [formSeverity, setFormSeverity] = useState('HIGH');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('Riverfront Lowlands Zone 2');
  const [formDesc, setFormDesc] = useState('');
  const [formPopulation, setFormPopulation] = useState(45000);
  const [formRadius, setFormRadius] = useState(5);
  const [formInstructions, setFormInstructions] = useState(
    "Evacuate immediately to designated high-ground shelters.\nTurn off the main electrical breaker and LPG gas valves.\nDo not walk, swim, or drive through moving flood waters."
  );

  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await fetch('/api/admin/feedback');
      const json = await res.json();
      if (json.success) setFeedbackList(json.data);
    } catch (e) {
      console.warn('Feedback fetch error', e);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await fetch('/api/admin/status');
      const json = await res.json();
      if (json.success) setAdminStatus(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchFeedback();
  }, []);


  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleTriggerFlood = async () => {
    const res = await triggerFloodAlert();
    showNotification("🚨 High-Severity Flood Alert triggered and activated across TRAANA network!");
    fetchStatus();
  };

  const handleResetDemo = async () => {
    const res = await resetDemoData();
    showNotification("🔄 System baseline reset to default demo scenario.");
    fetchStatus();
  };

  const handlePresetSimulation = async (scenario) => {
    try {
      const res = await fetch('/api/admin/preset-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`✅ Scenario '${scenario}' broadcast live!`);
        await refetch();
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCustomAlert = async (e) => {
    e.preventDefault();
    if (!formTitle) return;

    try {
      const instructionsArray = formInstructions
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          type: formType,
          severity: formSeverity,
          location: formLocation,
          description: formDesc || `Simulated ${formType} emergency alert issued by Emergency Operations Center.`,
          radiusKm: Number(formRadius),
          affectedPopulation: Number(formPopulation),
          instructions: instructionsArray
        })
      });

      const json = await res.json();
      if (json.success) {
        showNotification(`✅ New Alert "${formTitle}" broadcasted successfully!`);
        setFormTitle('');
        setFormDesc('');
        await refetch();
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.adminTitle}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 text-xs font-bold border border-red-500/40">
              DISPATCH PRIVILEGED
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t.adminSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
          >
            <RotateCcw size={14} className="text-amber-400" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* Floating success banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 font-bold text-sm shadow-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 font-bold"
          >
            Check Citizen View →
          </button>
        </div>
      )}

      {/* Telemetry Status Strip */}
      {adminStatus && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Database Mode</span>
            <span className="text-base font-black text-white flex items-center gap-1.5 mt-1">
              <Database size={16} className={adminStatus.databaseConnected ? 'text-emerald-400' : 'text-blue-400'} />
              <span>{adminStatus.databaseMode}</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Crisis Alerts</span>
            <span className="text-xl font-black text-red-400 mt-1 block">
              {adminStatus.activeAlertsCount} Broadcasts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Shelter Bed Pool</span>
            <span className="text-xl font-black text-white mt-1 block">
              {adminStatus.availableSlots} / {adminStatus.totalCapacity}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overall Occupancy</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">
              {adminStatus.occupancyRate}% Filled
            </span>
          </div>
        </div>
      )}

      {/* India Regional Datasets & Government Feeds Hub */}
      <IndiaDatasetsHub onScenarioLoaded={() => fetchStatus()} />

      {/* 1-Click Simulation Triggers (Section 9 Requirement) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950/60 via-slate-900 to-amber-950/40 border-2 border-red-600/70 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Play className="text-red-400 fill-red-400" size={20} />
              <span>1-Click Core Demo Scenario Trigger</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Instantly activates the Section 9 Evaluation Flow: High-Severity Flood in Riverfront Sector 1-4.
            </p>
          </div>

          <button
            onClick={handleTriggerFlood}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-600/40 transition transform active:scale-95 shrink-0"
          >
            <Waves size={18} />
            <span>{t.triggerFlood}</span>
          </button>
        </div>

        {/* Additional disaster presets */}
        <div className="pt-3 border-t border-red-900/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Alternative Multi-Hazard Simulation Presets:
          </span>
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              onClick={() => handlePresetSimulation('CYCLONE_WARNING')}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Wind size={14} /> Cyclone Category 3
              </div>
              <p className="text-[11px] text-slate-400 mt-1">125 km/h gusts, tidal surge warning.</p>
            </button>

            <button
              onClick={() => handlePresetSimulation('WILDFIRE')}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <Flame size={14} /> Rapid Forest Fire
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Smoke plume encroaching eastern suburbs.</p>
            </button>

            <button
              onClick={() => handlePresetSimulation('EARTHQUAKE_AFTERSHOCK')}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Activity size={14} /> Magnitude 5.8 Tremor
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Structural advisory, open ground muster.</p>
            </button>

            <button
              onClick={() => handlePresetSimulation('TSUNAMI_WARNING')}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <Waves size={14} /> Tsunami Coastal Surge
              </div>
              <p className="text-[11px] text-slate-400 mt-1">3.5m wave front, evacuate 2 km inland.</p>
            </button>

            <button
              onClick={() => handlePresetSimulation('THUNDERSTORM_LIGHTNING')}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <Zap size={14} /> Thunderstorm & Lightning
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Severe squall, 30-30 shelter protocol.</p>
            </button>

            <button
              onClick={() => handlePresetSimulation('CLOUDBURST_LANDSLIDE')}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldAlert size={14} /> Cloudburst & Landslide
              </div>
              <p className="text-[11px] text-slate-400 mt-1">100mm/h torrent, valley slope collapse.</p>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Custom Alert Creator & Shelter Occupancy Sliders */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Custom Alert Creator Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <PlusCircle size={18} className="text-blue-400" />
              <span>Broadcast Custom Disaster Alert</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">PUSHES REAL-TIME</span>
          </div>

          <form onSubmit={handleCreateCustomAlert} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Hazard Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="FLOOD">🌊 Flood & Inundation</option>
                  <option value="CYCLONE">🌀 Severe Cyclone</option>
                  <option value="EARTHQUAKE">🌋 Earthquake</option>
                  <option value="LANDSLIDE">⛰️ Landslide</option>
                  <option value="TSUNAMI">🌊 Tsunami Surge</option>
                  <option value="THUNDERSTORM">⚡ Thunderstorm & Lightning</option>
                  <option value="HEATWAVE">☀️ Severe Heatwave</option>
                  <option value="WILDFIRE">🔥 Forest Fire / Wildfire</option>
                  <option value="COLDWAVE">❄️ Severe Cold Wave</option>
                  <option value="CLOUDBURST">🌧️ Mountain Cloudburst</option>
                  <option value="DROUGHT">🌾 Severe Drought</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Severity Rating</label>
                <select
                  value={formSeverity}
                  onChange={(e) => setFormSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="HIGH">HIGH (Mandatory Evacuation)</option>
                  <option value="MEDIUM">MEDIUM (Preparedness)</option>
                  <option value="LOW">LOW (Advisory)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Alert Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Flash Flood Advisory for Sector 3"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Affected Location / Sector</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Est. Affected Citizens</label>
                <input
                  type="number"
                  value={formPopulation}
                  onChange={(e) => setFormPopulation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Provide short situational context..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Life-Safety Instructions (One per line)
              </label>
              <textarea
                rows={3}
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition"
            >
              <Send size={15} />
              <span>Broadcast Alert to Citizen Dashboards</span>
            </button>
          </form>
        </div>

        {/* Dynamic Shelter Occupancy Live Sliders */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sliders size={18} className="text-amber-400" />
              <span>Live Shelter Occupancy Control</span>
            </h3>
            <span className="text-[10px] text-slate-400">TEST REROUTING LOGIC</span>
          </div>

          <p className="text-xs text-slate-300">
            Slide available bed slots to <strong>0</strong> to simulate a shelter reaching maximum capacity. 
            Watch how the Citizen Evacuation Map dynamically recalculates routes to alternative open facilities!
          </p>

          <div className="space-y-4 pt-2">
            {shelters.map(shelter => {
              const pct = Math.round(((shelter.capacity - shelter.availableSlots) / shelter.capacity) * 100);
              const isFull = shelter.availableSlots === 0;

              return (
                <div key={shelter.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white block">{shelter.name}</strong>
                      <span className="text-slate-400 text-[11px]">{shelter.address}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isFull ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isFull ? 'FULL (REROUTE)' : `${shelter.availableSlots} SLOTS FREE`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={shelter.capacity}
                      value={shelter.availableSlots}
                      onChange={(e) => updateShelterSlots(shelter.id, Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-300 font-bold shrink-0 w-16 text-right">
                      {shelter.availableSlots} / {shelter.capacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{pct}% filled</span>
                    <button
                      onClick={() => updateShelterSlots(shelter.id, isFull ? 150 : 0)}
                      className="text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      {isFull ? 'Reopen Beds (+150)' : 'Mark as 100% Full'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Community Feedback & Feature Suggestions from Friends */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>💬 Community Feedback & Friend Feature Requests</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold">
                {feedbackList.length} Suggestions Logged
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live feedback received from friends and reviewers testing the prototype.
            </p>
          </div>

          <button
            onClick={fetchFeedback}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            {feedbackLoading ? 'Refreshing...' : 'Refresh Suggestions'}
          </button>
        </div>

        {feedbackList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No suggestions received yet. Share the app link with your friends to collect their ideas!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{item.suggestion}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span>⭐ {item.rating} / 5 stars</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

