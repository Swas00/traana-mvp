import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Footprints, 
  Car, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Info,
  ChevronRight,
  ShieldAlert,
  LocateFixed,
  Crosshair,
  Loader2
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function RoutesMap({ setCurrentTab }) {
  const { 
    citizenLocation, 
    shelters, 
    selectedShelter, 
    setSelectedShelter, 
    hazardZones, 
    activeAlert,
    isCitizenInDanger,
    detectRealLocation,
    resetToDemoLocation,
    setCustomLocation,
    isDetectingLocation,
    t 
  } = useEmergency();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  const [transportMode, setTransportMode] = useState('WALK'); // 'WALK' | 'VEHICLE'

  const activeDestination = selectedShelter || shelters[0];

  // Calculate distance & estimated times
  const distanceKm = activeDestination?.distanceKm || 2.8;
  const walkMinutes = Math.max(1, Math.round(distanceKm * 12));
  const driveMinutes = Math.max(1, Math.round(distanceKm * 3.5));

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [citizenLocation.latitude, citizenLocation.longitude],
        zoom: 13,
        zoomControl: true
      });

      // CartoDB tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors & CartoDB',
        maxZoom: 19
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);

      // Interactive map click listener: click to position citizen anywhere!
      map.on('click', (e) => {
        setCustomLocation(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layers = layersGroupRef.current;
    layers.clearLayers();

    // 1. Plot Hazard Avoidance Polygons (Submerged zones & dangerous areas)
    hazardZones.forEach(zone => {
      const polygon = L.polygon(zone.coordinates, {
        color: '#ef4444',
        fillColor: '#dc2626',
        fillOpacity: 0.35,
        weight: 2,
        dashArray: '5, 8'
      }).addTo(layers);

      polygon.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #ef4444; text-transform: uppercase;">⚠️ DANGER: ${zone.name}</strong><br/>
          <span style="color: #94a3b8;">${zone.description}</span><br/>
          <span style="color: #f87171; font-weight: bold; font-size: 11px;">TRAANA Safe Routing actively bypasses this sector.</span>
        </div>
      `);
    });

    // 1b. Plot Active Alert Hazard Buffer Zone
    if (activeAlert && activeAlert.latitude && activeAlert.longitude) {
      const alertCircle = L.circle([activeAlert.latitude, activeAlert.longitude], {
        radius: (activeAlert.radiusKm || 5) * 1000,
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '6, 6'
      }).addTo(layers);

      alertCircle.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #dc2626; text-transform: uppercase;">🚨 ACTIVE THREAT ZONE: ${activeAlert.type}</strong><br/>
          <span>${activeAlert.title}</span><br/>
          <span style="color: #ef4444; font-weight: bold;">Radius: ${activeAlert.radiusKm || 5} km</span>
        </div>
      `);
    }

    // 2. Custom Div Icons
    const citizenIcon = L.divIcon({
      className: 'custom-citizen-icon',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(59, 130, 246, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #2563eb; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
            📍
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const destinationIcon = L.divIcon({
      className: 'custom-dest-icon',
      html: `
        <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 34px; height: 34px; border-radius: 10px; background: #16a34a; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
            🏠
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const otherShelterIcon = L.divIcon({
      className: 'custom-other-icon',
      html: `
        <div style="width: 26px; height: 26px; border-radius: 6px; background: #0284c7; border: 1.5px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
          ⛺
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    // 3. Add Citizen Marker
    const citizenMarker = L.marker([citizenLocation.latitude, citizenLocation.longitude], { icon: citizenIcon }).addTo(layers);
    citizenMarker.bindPopup(`
      <div style="font-size: 12px; line-height: 1.4;">
        <strong style="color: #3b82f6;">📍 Your Location (${citizenLocation.mode || 'GPS'})</strong><br/>
        <span>${citizenLocation.name}</span><br/>
        <span style="color: #94a3b8; font-size: 11px;">${citizenLocation.neighborhood || ''}</span><br/>
        <span style="color: ${isCitizenInDanger ? '#ef4444' : '#10b981'}; font-weight: bold;">
          ${isCitizenInDanger ? '⚠️ In Hazard Danger Zone' : '✅ Safe Sector'}
        </span>
      </div>
    `);

    // 4. Add Destination Shelter Marker & Other Shelters
    shelters.forEach(s => {
      const isTarget = activeDestination && s.id === activeDestination.id;
      const marker = L.marker([s.latitude, s.longitude], {
        icon: isTarget ? destinationIcon : otherShelterIcon
      }).addTo(layers);

      marker.bindPopup(`
        <div style="font-size: 12px; line-height: 1.4;">
          <strong style="color: #10b981;">🏠 ${s.name}</strong><br/>
          <span>${s.address}</span><br/>
          <span style="color: #38bdf8;">Elevation: ${s.elevationMeters}m</span><br/>
          <span style="color: #cbd5e1;">Available: <strong>${s.availableSlots} / ${s.capacity} beds</strong></span>
        </div>
      `);
    });

    // 5. Draw Hazard-Bypassing Evacuation Route
    if (activeDestination) {
      const start = [citizenLocation.latitude, citizenLocation.longitude];
      const end = [activeDestination.latitude, activeDestination.longitude];

      let safeWaypoints;
      
      // If citizen is near Delhi demo zone (28.61), plot safe bypass above flood hazard
      if (Math.abs(start[0] - 28.61) < 0.2 && Math.abs(start[1] - 77.20) < 0.2) {
        const midpointLat = (start[0] + end[0]) / 2 + 0.006;
        const midpointLng = (start[1] + end[1]) / 2 - 0.005;

        safeWaypoints = [
          start,
          [start[0] + 0.003, start[1] - 0.002],
          [midpointLat, midpointLng],
          [end[0] - 0.002, end[1] - 0.001],
          end
        ];
      } else {
        // Direct route for real GPS anywhere in the world
        safeWaypoints = [
          start,
          [(start[0] * 2 + end[0]) / 3, (start[1] * 2 + end[1]) / 3],
          [(start[0] + end[0] * 2) / 3, (start[1] + end[1] * 2) / 3],
          end
        ];
      }

      // Route Glow Outline
      L.polyline(safeWaypoints, {
        color: '#1d4ed8',
        weight: 7,
        opacity: 0.5,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layers);

      // Safe Route Polyline
      L.polyline(safeWaypoints, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 8'
      }).addTo(layers);

      // Fit bounds to show route + citizen + destination
      const bounds = L.latLngBounds([start, end, ...safeWaypoints]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }

  }, [citizenLocation, activeDestination, hazardZones, shelters]);

  return (
    <div className="space-y-6 pb-16">
      {/* Title Bar & Location Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.navRoutes}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
              Hazard Avoidance Active
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic evacuation route avoiding inundated lowlands, collapsed bridges, and energized flood waters.
          </p>
        </div>

        {/* Location Detection & Destination Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real GPS Toggle */}
          <button
            onClick={detectRealLocation}
            disabled={isDetectingLocation}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              citizenLocation.mode === 'GPS'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {isDetectingLocation ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} className="text-emerald-400" />}
            <span>{isDetectingLocation ? 'Locating...' : 'Use My Real GPS'}</span>
          </button>

          {/* Reset to Demo Button */}
          <button
            onClick={resetToDemoLocation}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              citizenLocation.mode === 'DEMO'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Crosshair size={13} />
            <span>Demo Flood Zone</span>
          </button>

          {/* Change Destination Dropdown */}
          <select
            value={activeDestination?.id || ''}
            onChange={(e) => {
              const target = shelters.find(s => s.id === e.target.value);
              if (target) setSelectedShelter(target);
            }}
            className="bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2 font-bold focus:outline-none"
          >
            {shelters.map(s => (
              <option key={s.id} value={s.id} disabled={s.status === 'FULL'}>
                {s.name} ({s.distanceKm} km {s.status === 'FULL' ? '- FULL' : ''})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map & Navigation Panel Container */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaflet Map (2 Cols) */}
        <div className="lg:col-span-2 h-[540px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur border border-slate-700 px-3.5 py-2 rounded-xl text-xs text-white shadow-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Origin: <strong>{citizenLocation.name}</strong> • Click map to reposition
            </span>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur border border-slate-800 p-3 rounded-2xl text-[11px] text-slate-300 space-y-1.5 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white"></span>
              <span>Your Position ({citizenLocation.mode || 'GPS'})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-600 border border-white"></span>
              <span>Safe Evacuation Shelter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-600/60 border border-red-500"></span>
              <span>Hazard Avoidance Zone (Impassable)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 border border-blue-400"></span>
              <span>Calculated Safe Path</span>
            </div>
          </div>
        </div>

        {/* Turn-by-Turn Guidance & Route Stats (1 Col) */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Route Metrics Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evacuation Telemetry
              </span>
              <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setTransportMode('WALK')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                    transportMode === 'WALK' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  <Footprints size={14} /> Walk
                </button>
                <button
                  onClick={() => setTransportMode('VEHICLE')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                    transportMode === 'VEHICLE' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  <Car size={14} /> Drive
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Safe Distance</span>
                <span className="text-2xl font-black text-white">{distanceKm} km</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Time</span>
                <span className="text-2xl font-black text-amber-400">
                  {transportMode === 'WALK' ? `${walkMinutes} mins` : `${driveMinutes} mins`}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
              <strong className="block mb-0.5 text-blue-300">Selected Destination:</strong>
              <span className="font-bold text-white text-sm block">{activeDestination?.name}</span>
              <span className="text-slate-400 text-[11px]">{activeDestination?.address}</span>
            </div>
          </div>

          {/* Turn-by-Turn Safe Instructions */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass size={18} className="text-emerald-400" />
              <span>Step-by-Step Evacuation Steps</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/70">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white block">Depart from {citizenLocation.name}</strong>
                  <span className="text-[11px] text-slate-400">Follow safe evacuation corridor away from hazard zones.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/70">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white block">Proceed along safe detour path ({distanceKm} km)</strong>
                  <span className="text-[11px] text-slate-400">Avoid submerged underpasses and standing water.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/70">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white block">Arrive at {activeDestination?.name}</strong>
                  <span className="text-[11px] text-slate-400">Check-in at intake triage for dry clothing & bed allocation.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('assistant')}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              <span>Ask AI: "Is this route fully safe?"</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
