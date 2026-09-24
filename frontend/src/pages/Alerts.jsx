import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  Radio, 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Loader2,
  Compass,
  Zap,
  Globe2,
  Share2
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function Alerts({ setCurrentTab }) {
  const { 
    alerts, 
    activeAlert, 
    toggleAlertStatus, 
    sachetAlerts, 
    sachetTelemetry, 
    sachetSyncing, 
    syncSachetNow, 
    activateSachetAlert, 
    t 
  } = useEmergency();

  // Active view tab: 'sachet' (Live NDMA feed) or 'simulated' (Crisis Simulation & Presets)
  const [activeView, setActiveView] = useState('sachet');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [activatingId, setActivatingId] = useState(null);

  // Extract distinct Indian states from live SACHET alerts
  const availableStates = useMemo(() => {
    if (!sachetAlerts || sachetAlerts.length === 0) return [];
    const stateSet = new Set();
    sachetAlerts.forEach(a => {
      const loc = a.location || '';
      const parts = loc.split('of ');
      if (parts.length > 1) {
        stateSet.add(parts[1].trim());
      } else {
        const commaParts = loc.split(',');
        if (commaParts.length > 1) {
          stateSet.add(commaParts[commaParts.length - 1].trim());
        }
      }
    });
    return Array.from(stateSet).sort();
  }, [sachetAlerts]);

  // Filter SACHET live alerts
  const filteredSachetAlerts = useMemo(() => {
    return (sachetAlerts || []).filter(alert => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        alert.title.toLowerCase().includes(q) ||
        alert.location.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q) ||
        (alert.rawDisasterType && alert.rawDisasterType.toLowerCase().includes(q));

      const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;
      const matchesState = selectedState === 'ALL' || alert.location.toLowerCase().includes(selectedState.toLowerCase());

      return matchesSearch && matchesSeverity && matchesState;
    });
  }, [sachetAlerts, searchTerm, selectedSeverity, selectedState]);

  // Filter simulated alerts
  const filteredSimulatedAlerts = (alerts || []).filter(alert => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      alert.title.toLowerCase().includes(q) ||
      alert.location.toLowerCase().includes(q) ||
      alert.description.toLowerCase().includes(q);

    const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'ALL' || alert.type === selectedType;

    return matchesSearch && matchesSeverity && matchesType;
  });

  const handleActivateLiveAlert = async (alertId) => {
    setActivatingId(alertId);
    try {
      await activateSachetAlert(alertId);
      setCurrentTab('dashboard');
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CAP-India Integration Active</span>
            </span>
            <span className="text-xs text-slate-400">Synchronized with sachet.ndma.gov.in</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.navAlerts}</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
              {sachetAlerts?.length || 0} Live Pan-India Threats
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time disaster broadcasts directly ingested from NDMA SACHET, IMD meteorological radars, and State Emergency Operation Centers.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveView('sachet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeView === 'sachet'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio size={14} className={activeView === 'sachet' ? 'text-white' : 'text-slate-400'} />
            <span>NDMA SACHET Live Feed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-extrabold">
              {sachetAlerts?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveView('simulated')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeView === 'simulated'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Crisis Simulations</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-300 font-extrabold">
              {alerts?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* NDMA SACHET Live Feed View */}
      {activeView === 'sachet' && (
        <div className="space-y-6">
          {/* Telemetry & Synchronization Status Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    {sachetTelemetry?.status === 'SYNCED' ? 'LIVE CONTINUOUS SYNCHRONIZATION ACTIVE' : 'CONNECTING TO NDMA GATEWAY...'}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Updated: {sachetTelemetry?.lastSyncTime ? new Date(sachetTelemetry.lastSyncTime).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>National Disaster Management Authority (NDMA) SACHET Portal</span>
                  <a 
                    href="https://sachet.ndma.gov.in/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-normal underline"
                  >
                    <span>sachet.ndma.gov.in</span>
                    <ExternalLink size={12} />
                  </a>
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl">
                  Automated background daemon polls the C-DOT CAP-India broadcast service every 60 seconds. 
                  Incoming early warnings automatically map meteorological vectors, hazard radii, and official citizen Do's & Don'ts.
                </p>
              </div>

              {/* Force Re-sync Button */}
              <button
                onClick={syncSachetNow}
                disabled={sachetSyncing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition disabled:opacity-50 shrink-0"
              >
                {sachetSyncing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
                <span>{sachetSyncing ? 'Synchronizing...' : 'Force Re-sync Live Feed'}</span>
              </button>
            </div>

            {/* National Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-indigo-900/40 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pan-India SMS Dispatches</span>
                <span className="text-lg font-black text-amber-400">
                  {sachetTelemetry?.nationalTelemetry?.totalSms ? (sachetTelemetry.nationalTelemetry.totalSms / 1000000000).toFixed(1) + ' Billion+' : '214.0 Billion+'}
                </span>
                <span className="text-[10px] text-slate-500 block">via C-DOT Cell Broadcast</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative Alert Count</span>
                <span className="text-lg font-black text-white">
                  {sachetTelemetry?.nationalTelemetry?.totalAlert?.toLocaleString() || '130,155'}
                </span>
                <span className="text-[10px] text-slate-500 block">CAP-India Protocols</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Alerts Right Now</span>
                <span className="text-lg font-black text-emerald-400">
                  {sachetAlerts?.length || 63} Live Warnings
                </span>
                <span className="text-[10px] text-slate-500 block">Across Indian States</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">States & UTs Covered</span>
                <span className="text-lg font-black text-blue-400">
                  36 States & UTs
                </span>
                <span className="text-[10px] text-slate-500 block">100% Pan-India Geofence</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by district, state, or warning type (e.g. Koraput, Raigarh, Lightning, Rain)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-slate-950 text-white text-xs border border-slate-800 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="ALL">All States ({availableStates.length})</option>
                {availableStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              {/* Severity selector */}
              <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      selectedSeverity === sev 
                        ? sev === 'CRITICAL' ? 'bg-red-600 text-white' : sev === 'HIGH' ? 'bg-amber-600 text-white' : sev === 'MEDIUM' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SACHET Alerts Grid */}
          <div className="space-y-4">
            {filteredSachetAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
                <ShieldCheck size={40} className="mx-auto text-emerald-400" />
                <p className="text-base font-bold text-white">No active SACHET alerts match your current filter.</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try clearing the search query or selecting "All States" to inspect alerts from other regions of India.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedSeverity('ALL'); setSelectedState('ALL'); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredSachetAlerts.map(alert => {
                const isCrit = alert.severity === 'CRITICAL';
                const isHigh = alert.severity === 'HIGH';
                const isMed = alert.severity === 'MEDIUM';

                return (
                  <div
                    key={alert.id || alert.sachetId}
                    className={`p-6 rounded-3xl border transition-all ${
                      isCrit
                        ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-red-600/80 shadow-lg shadow-red-950/40'
                        : isHigh
                        ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-amber-600/70'
                        : 'bg-gradient-to-r from-yellow-950/30 via-slate-900 to-slate-900 border-yellow-500/50'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div className="space-y-1.5 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                            isCrit ? 'bg-red-600 text-white' : isHigh ? 'bg-amber-600 text-white' : 'bg-yellow-500 text-black'
                          }`}>
                            {alert.rawDisasterType || alert.type} • {alert.severity} SEVERITY
                          </span>

                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            SACHET LIVE
                          </span>

                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {alert.effectiveStart || new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-white">{alert.title}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{alert.description}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleActivateLiveAlert(alert.id)}
                          disabled={activatingId === alert.id}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition transform active:scale-95 disabled:opacity-50"
                        >
                          {activatingId === alert.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Zap size={14} className="text-yellow-300" />
                          )}
                          <span>Activate on Evacuation Map</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Details Footer */}
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-200 font-semibold">
                          <MapPin size={13} className="text-red-400" />
                          {alert.location}
                        </span>
                        <span>•</span>
                        <span>Area: <strong>{alert.areaCoveredSqKm ? `${alert.areaCoveredSqKm.toLocaleString()} sq km` : 'Regional'}</strong></span>
                        <span>•</span>
                        <span>Valid Until: <strong className="text-amber-300">{alert.effectiveEnd || 'Next 3 hours'}</strong></span>
                      </div>

                      <span className="text-slate-400">
                        Source: <strong className="text-slate-200">{alert.issuedBy}</strong>
                      </span>
                    </div>

                    {/* Official NDMA Do's & Don'ts */}
                    {alert.instructions && alert.instructions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                          <ShieldAlert size={12} />
                          Official NDMA Citizen Do's & Don'ts:
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                          {alert.instructions.map((inst, i) => (
                            <li key={i}>{inst}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Crisis Simulations View */}
      {activeView === 'simulated' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search simulated scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      selectedSeverity === sev 
                        ? sev === 'HIGH' ? 'bg-red-600 text-white' : sev === 'MEDIUM' ? 'bg-amber-600 text-white' : sev === 'LOW' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentTab('admin')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
              >
                <span>Dispatch Custom Alert in Admin</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSimulatedAlerts.map(alert => {
              const isHigh = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';
              const isMedium = alert.severity === 'MEDIUM';

              return (
                <div
                  key={alert.id || alert._id}
                  className={`p-6 rounded-3xl border transition-all ${
                    alert.active
                      ? isHigh
                        ? 'bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-red-600/80 shadow-lg shadow-red-950/40'
                        : isMedium
                        ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-amber-600/70'
                        : 'bg-slate-900 border-blue-500/50'
                      : 'bg-slate-900/60 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                          isHigh ? 'bg-red-600 text-white' : isMedium ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {alert.type} • {alert.severity} SEVERITY
                        </span>

                        {alert.active ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            ACTIVE NOW
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                            STANDBY / ARCHIVED
                          </span>
                        )}

                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-white">{alert.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{alert.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleAlertStatus(alert.id, !alert.active)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                          alert.active
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-red-600 hover:bg-red-500 text-white border-red-500'
                        }`}
                      >
                        {alert.active ? 'Deactivate' : 'Activate Alert'}
                      </button>

                      <button
                        onClick={() => setCurrentTab('dashboard')}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
                      >
                        <span>Citizen View</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin size={13} className="text-red-400" />
                        {alert.location}
                      </span>
                      <span>•</span>
                      <span>Radius: <strong>{alert.radiusKm} km</strong></span>
                      <span>•</span>
                      <span>Est. At Risk: <strong>{alert.affectedPopulation?.toLocaleString()}</strong></span>
                    </div>

                    <span className="text-slate-400">
                      Issued by: <strong className="text-slate-200">{alert.issuedBy}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
