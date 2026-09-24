import React, { useState, useEffect } from 'react';
import { 
  Database, 
  MapPin, 
  Radio, 
  Waves, 
  Wind, 
  Building, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Globe, 
  Sparkles, 
  FileText, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function IndiaDatasetsHub({ onScenarioLoaded }) {
  const { citizenLocation, refetch } = useEmergency();

  const [catalogs, setCatalogs] = useState([]);
  const [presets, setPresets] = useState([]);
  const [activePresetKey, setActivePresetKey] = useState('DELHI_YAMUNA');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'feeds' | 'osm' | 'import'

  // OSM Search state
  const [osmLat, setOsmLat] = useState(citizenLocation.latitude || 28.6139);
  const [osmLng, setOsmLng] = useState(citizenLocation.longitude || 77.2090);
  const [osmRadius, setOsmRadius] = useState(4);
  const [osmSearching, setOsmSearching] = useState(false);

  // Custom Import state
  const [importFormat, setImportFormat] = useState('csv');
  const [rawText, setRawText] = useState('');
  const [regionLabel, setRegionLabel] = useState('Indian Regional Disaster Cell');
  const [importing, setImporting] = useState(false);

  // Fetch initial catalog and presets
  useEffect(() => {
    fetchCatalogsAndPresets();
  }, []);

  const fetchCatalogsAndPresets = async () => {
    try {
      const [catRes, preRes] = await Promise.all([
        fetch('/api/datasets/available').then(r => r.json()),
        fetch('/api/datasets/presets').then(r => r.json())
      ]);
      if (catRes.success) setCatalogs(catRes.data);
      if (preRes.success) setPresets(preRes.data);
    } catch (err) {
      console.warn('Failed to load datasets metadata:', err);
    }
  };

  const notify = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 5000);
  };

  // 1-Click Load Scenario
  const handleLoadPreset = async (presetKey) => {
    try {
      setLoading(true);
      const res = await fetch('/api/datasets/load-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetKey })
      });
      const data = await res.json();
      if (data.success) {
        setActivePresetKey(presetKey);
        notify(`✅ Loaded scenario: ${data.data.regionName} (${data.data.disasterType}) with ${data.data.sheltersCount} verified shelters!`);
        await refetch(data.data.citizenLocation.latitude, data.data.citizenLocation.longitude);
        if (onScenarioLoaded) onScenarioLoaded(data.data);
      } else {
        notify(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      notify(`❌ Network error loading preset: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Simulate NDMA CAP Alert Ingest
  const handleSimulateNdmaCap = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/datasets/ndma-cap-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        notify(`📡 Broadcasted live CAP-India alert: "${data.data.title}" from NDMA SACHET!`);
        await refetch();
      }
    } catch (err) {
      notify(`❌ CAP simulation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Query OpenStreetMap India Overpass API
  const handleQueryOsm = async () => {
    try {
      setOsmSearching(true);
      const res = await fetch('/api/datasets/fetch-osm-india', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: Number(osmLat),
          lng: Number(osmLng),
          radiusKm: Number(osmRadius)
        })
      });
      const data = await res.json();
      if (data.success) {
        notify(`🗺️ Discovered & added ${data.shelters?.length || 2} OSM public infrastructure facilities!`);
        await refetch(Number(osmLat), Number(osmLng));
      }
    } catch (err) {
      notify(`❌ OSM query failed: ${err.message}`);
    } finally {
      setOsmSearching(false);
    }
  };

  // Ingest Custom CSV or GeoJSON
  const handleImportCustom = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      notify('⚠️ Please paste or load CSV / GeoJSON text to import.');
      return;
    }

    try {
      setImporting(true);
      let payload = {
        format: importFormat,
        regionName: regionLabel
      };

      if (importFormat === 'csv') {
        payload.rawText = rawText;
      } else {
        payload.data = JSON.parse(rawText);
      }

      const res = await fetch('/api/datasets/import-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        notify(`🎉 ${data.message}`);
        setRawText('');
        await refetch();
      } else {
        notify(`❌ Import error: ${data.message}`);
      }
    } catch (err) {
      notify(`❌ Failed to parse data: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const loadSampleCsv = () => {
    setImportFormat('csv');
    setRegionLabel('Odisha Coastal Protection Zone');
    setRawText(`name,latitude,longitude,capacity,food,water,medical,address,contact_person
Puri Sea Beach High School Shelter,19.7990,85.8150,1100,true,true,true,Chakratirtha Road Puri,Prabhat Jena
Gop Multipurpose Cyclone Shelter,19.9950,86.0100,1400,true,true,true,Konark Bypass Gop Block,Sanjib Das
Brahmagiri Cyclone Relief Hall,19.8050,85.6700,850,true,true,false,Satapada Road Brahmagiri,Alok Swain`);
  };

  const loadSampleGeoJson = () => {
    setImportFormat('geojson');
    setRegionLabel('Kolkata Municipal Disaster Grid');
    setRawText(JSON.stringify({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [88.3639, 22.5726] },
          properties: {
            facility_name: "Netaji Indoor Stadium Relief Hub",
            district: "BBD Bagh, Kolkata",
            capacity: 2500,
            slots: 1800,
            food: true,
            water: true,
            medical: true,
            incharge: "KMC Disaster Cell"
          }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [88.4010, 22.5850] },
          properties: {
            facility_name: "Salt Lake Stadium Community Camp",
            district: "Bidhannagar Sector 3, Kolkata",
            capacity: 3500,
            slots: 2200,
            food: true,
            water: true,
            medical: true,
            incharge: "WB Disaster Management Dept"
          }
        }
      ]
    }, null, 2));
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🇮🇳</span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              India Disaster Datasets & Early Warning Integrations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              OFFICIAL FEEDS READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Seamlessly switch between authentic Indian regional disaster scenarios (NDMA, NCRMP, CWC, BMC) or ingest custom state-level CSV & GeoJSON datasets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'presets' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin size={13} />
            <span>State Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('feeds')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'feeds' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio size={13} />
            <span>Indian Feeds Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('osm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'osm' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe size={13} />
            <span>OSM India Live</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'import' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud size={13} />
            <span>Custom Ingest</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification */}
      {actionMsg && (
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{actionMsg}</span>
          </div>
          <button
            onClick={() => setActionMsg('')}
            className="text-slate-400 hover:text-white text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: 1-Click Regional Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>Select an Indian Disaster Region to Test Proximity & Shelter Routing:</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Active: <strong className="text-white">{activePresetKey}</strong>
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {presets.map((preset) => {
              const isActive = activePresetKey === preset.presetKey;
              const isCyclone = preset.disasterType === 'CYCLONE';

              return (
                <div
                  key={preset.presetKey}
                  className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                    isActive 
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            isCyclone ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {isCyclone ? '🌀 CYCLONE' : '🌊 MONSOON FLOOD'}
                          </span>
                          <span className="text-xs font-bold text-slate-300">{preset.state}</span>
                        </div>
                        <h4 className="text-base font-black text-white mt-1">
                          {preset.regionName}
                        </h4>
                      </div>

                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wide shrink-0">
                          ACTIVE LIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {preset.alertTitle}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-center">
                      <div className="p-2 rounded-xl bg-slate-900/60">
                        <span className="text-[10px] text-slate-500 block">Radius</span>
                        <span className="text-xs font-black text-slate-200">{preset.radiusKm} km</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/60">
                        <span className="text-[10px] text-slate-500 block">Shelters</span>
                        <span className="text-xs font-black text-emerald-400">{preset.sheltersCount} centers</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/60">
                        <span className="text-[10px] text-slate-500 block">Population</span>
                        <span className="text-xs font-black text-amber-400">{(preset.affectedPopulation / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">
                      Source: {preset.source}
                    </span>

                    <button
                      onClick={() => handleLoadPreset(preset.presetKey)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-800 text-slate-300 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {loading && isActive ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <Zap size={12} />
                      )}
                      <span>{isActive ? 'Current Scenario' : 'Deploy Scenario'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Indian Early Warning Feeds & Agency Catalogs */}
      {activeTab === 'feeds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300">
                Official Government Disaster Portals & Protocol Integration:
              </h3>
              <p className="text-xs text-slate-400">
                TRAANA ingests CAP (Common Alerting Protocol) alerts from NDMA Sachet and river telemetry from CWC.
              </p>
            </div>

            <button
              onClick={handleSimulateNdmaCap}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <Radio size={13} className="animate-pulse" />
              <span>Simulate NDMA CAP Alert</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {catalogs.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300">
                      {cat.tag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {cat.status}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white">
                    {cat.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-2 text-[11px] space-y-1 text-slate-400">
                    <div>
                      <strong className="text-slate-300">Agency:</strong> {cat.agency}
                    </div>
                    <div>
                      <strong className="text-slate-300">Protocol:</strong> {cat.protocol} ({cat.format})
                    </div>
                    <div>
                      <strong className="text-slate-300">Coverage:</strong> {cat.coverage}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Hazards: {cat.hazards?.join(', ')}
                  </span>
                  <a
                    href={cat.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Live OpenStreetMap India Overpass API */}
      {activeTab === 'osm' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <h3 className="text-sm font-black text-white">
                Live OpenStreetMap (OSM India) Shelter Discovery
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically query real-world public schools, community halls, and healthcare centers in any Indian coordinate boundary using the Overpass QL API and register them as emergency relief shelters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={osmLat}
                  onChange={(e) => setOsmLat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={osmLng}
                  onChange={(e) => setOsmLng(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Search Radius: {osmRadius} km
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={osmRadius}
                  onChange={(e) => setOsmRadius(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOsmLat(citizenLocation.latitude);
                    setOsmLng(citizenLocation.longitude);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                >
                  📍 Fill Current Coordinates
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setOsmLat(19.8135);
                    setOsmLng(85.8312);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Puri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOsmLat(26.1850);
                    setOsmLng(91.7450);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Guwahati
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOsmLat(19.0178);
                    setOsmLng(72.8478);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Mumbai
                </button>
              </div>

              <button
                onClick={handleQueryOsm}
                disabled={osmSearching}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
              >
                {osmSearching ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Querying Overpass API...</span>
                  </>
                ) : (
                  <>
                    <Search size={13} />
                    <span>Query Live OSM India Facilities</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Custom CSV / GeoJSON Ingestion */}
      {activeTab === 'import' && (
        <form onSubmit={handleImportCustom} className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <UploadCloud size={16} className="text-amber-400" />
                  <span>Import Custom State / Municipal Shelter Datasets</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste CSV or GeoJSON exported from state disaster management portals (SDMA, OGD India, GIS portals).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadSampleCsv}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
                >
                  ⚡ Load Sample CSV
                </button>
                <button
                  type="button"
                  onClick={loadSampleGeoJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition"
                >
                  ⚡ Load Sample GeoJSON
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Dataset Format</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImportFormat('csv')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      importFormat === 'csv'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    CSV (Comma Separated)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportFormat('geojson')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      importFormat === 'geojson'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    GeoJSON (FeatureCollection)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">State / District Label</label>
                <input
                  type="text"
                  value={regionLabel}
                  onChange={(e) => setRegionLabel(e.target.value)}
                  placeholder="e.g. Kerala Coastal Disaster Cell"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Data Content ({importFormat.toUpperCase()})
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={
                  importFormat === 'csv'
                    ? 'name,latitude,longitude,capacity,food,water,medical,address\nFacility A,19.82,85.84,1000,true,true,true,Beach Road'
                    : '{\n  "type": "FeatureCollection",\n  "features": [...]\n}'
                }
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={importing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
              >
                {importing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Parsing & Ingesting Dataset...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} />
                    <span>Ingest into Live Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
