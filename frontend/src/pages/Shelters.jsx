import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Droplet, 
  HeartPulse, 
  Zap, 
  Accessibility, 
  ArrowRight, 
  Phone, 
  Search, 
  SlidersHorizontal,
  Compass,
  Mountain
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function Shelters({ setCurrentTab }) {
  const { 
    shelters, 
    selectedShelter, 
    setSelectedShelter, 
    citizenLocation,
    detectRealLocation,
    isDetectingLocation,
    updateShelterSlots, 
    t 
  } = useEmergency();
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterMedical, setFilterMedical] = useState(false);
  const [filterFood, setFilterFood] = useState(false);
  const [filterWater, setFilterWater] = useState(false);
  const [filterAiDRR, setFilterAiDRR] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shelter.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccessible = !filterAccessible || shelter.accessible;
    const matchesMedical = !filterMedical || shelter.medical;
    const matchesFood = !filterFood || shelter.food;
    const matchesWater = !filterWater || shelter.water;
    const matchesAiDRR = !filterAiDRR || 
      (shelter.notes?.toLowerCase().includes('pet') || 
       shelter.notes?.toLowerCase().includes('animal') || 
       shelter.notes?.toLowerCase().includes('livestock') ||
       shelter.notes?.toLowerCase().includes('rcc') ||
       shelter.capacity >= 1000);
    const matchesAvailable = !availableOnly || (shelter.availableSlots > 0 && shelter.status !== 'FULL');
    return matchesSearch && matchesAccessible && matchesMedical && matchesFood && matchesWater && matchesAiDRR && matchesAvailable;
  });

  const totalSlots = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const availableSlots = shelters.reduce((acc, s) => acc + s.availableSlots, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Overview */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.safeShelters}</span>
            <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/40">
              {shelters.length} Verified Facilities
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span>Distances measured from: <strong>{citizenLocation.name}</strong></span>
            <button
              onClick={detectRealLocation}
              disabled={isDetectingLocation}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold underline"
            >
              {isDetectingLocation ? 'Updating...' : 'Update with my GPS'}
            </button>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total System Capacity</span>
            <span className="text-lg font-black text-white">{availableSlots} / {totalSlots} Beds Free</span>
          </div>
        </div>
      </div>

      {/* Filter and Facilities Toggles */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search shelters by name, neighborhood, or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 py-2 rounded-xl font-bold transition border ${
                availableOnly 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Available Slots Only
            </button>
          </div>
        </div>

        {/* Facility toggle buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
            <SlidersHorizontal size={14} /> Required Facilities:
          </span>

          <button
            onClick={() => setFilterAccessible(!filterAccessible)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
              filterAccessible
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Accessibility size={14} />
            <span>Wheelchair Ramp</span>
          </button>

          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
              filterMedical
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <HeartPulse size={14} />
            <span>24x7 Doctor / Medical</span>
          </button>

          <button
            onClick={() => setFilterFood(!filterFood)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
              filterFood
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Utensils size={14} />
            <span>Hot Meals</span>
          </button>

          <button
            onClick={() => setFilterWater(!filterWater)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
              filterWater
                ? 'bg-cyan-600 text-white border-cyan-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Droplet size={14} />
            <span>Purified Water</span>
          </button>

          <button
            onClick={() => setFilterAiDRR(!filterAiDRR)}
            title="Animal-inclusive Disaster Risk Reduction (NDMA May 2026 Guidelines)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
              filterAiDRR
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>🐾 Pets & Livestock (AiDRR 2026)</span>
          </button>
        </div>
      </div>


      {/* Shelters List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredShelters.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
            No shelters match your current filters. Try relaxing facility requirements.
          </div>
        ) : (
          filteredShelters.map(shelter => {
            const isSelected = selectedShelter?.id === shelter.id;
            const occupancyPct = Math.round(((shelter.capacity - shelter.availableSlots) / shelter.capacity) * 100);
            const isFull = shelter.status === 'FULL' || shelter.availableSlots === 0;
            const isFillingFast = shelter.status === 'FILLING_FAST';

            return (
              <div
                key={shelter.id || shelter._id}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-900 border-blue-500 shadow-xl shadow-blue-900/30'
                    : isFull
                    ? 'bg-slate-900/70 border-slate-800 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          isFull 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : isFillingFast 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isFull ? t.fullCapacity : isFillingFast ? t.fillingFast : t.openStatus}
                        </span>

                        {isSelected && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                            DESTINATION
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-white">{shelter.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span>{shelter.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xl font-black text-white block">{shelter.distanceKm} km</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Away</span>
                    </div>
                  </div>

                  {/* Elevation & Key Badges */}
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      <Mountain size={13} />
                      {shelter.elevationMeters}m Elevation (High Ground)
                    </span>
                    <span className="text-slate-500">•</span>
                    <span>Contact: <strong className="text-white">{shelter.contactPerson}</strong></span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Available Bed Capacity:</span>
                      <span className="font-mono font-bold text-white">
                        <strong className={isFull ? 'text-red-400' : 'text-emerald-400'}>
                          {shelter.availableSlots}
                        </strong> / {shelter.capacity} ({occupancyPct}% full)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isFull ? 'bg-red-500' : isFillingFast ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {shelter.food && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs">
                        <Utensils size={13} className="text-amber-400" />
                        <span>Food Rations</span>
                      </span>
                    )}
                    {shelter.water && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs">
                        <Droplet size={13} className="text-cyan-400" />
                        <span>Potable Water</span>
                      </span>
                    )}
                    {shelter.medical && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs">
                        <HeartPulse size={13} className="text-red-400" />
                        <span>Medical Station</span>
                      </span>
                    )}
                    {shelter.powerBackup && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs">
                        <Zap size={13} className="text-yellow-400" />
                        <span>Backup Power</span>
                      </span>
                    )}
                    {shelter.accessible && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs">
                        <Accessibility size={13} className="text-blue-400" />
                        <span>Wheelchair Ramp</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 italic">
                    "{shelter.notes}"
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-6 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${shelter.phone}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
                  >
                    <Phone size={14} className="text-emerald-400" />
                    <span>{shelter.phone}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedShelter(shelter);
                      setCurrentTab('routes');
                    }}
                    disabled={isFull}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Compass size={16} />
                    <span>{isSelected ? 'View Route on Map' : t.evacuateHere}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
