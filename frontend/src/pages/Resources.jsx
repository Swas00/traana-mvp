import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Shield, 
  Flame, 
  Truck, 
  Utensils, 
  Anchor, 
  PhoneCall, 
  MapPin, 
  Compass, 
  Search, 
  ExternalLink, 
  Phone, 
  AlertCircle,
  HeartHandshake,
  Building,
  BookOpen,
  CheckCircle2,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function Resources({ setCurrentTab }) {
  const { resources, contacts, setCitizenLocation, t } = useEmergency();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // NDMA datasets
  const [aapdaMitraList, setAapdaMitraList] = useState([]);
  const [sdmaList, setSdmaList] = useState([]);

  useEffect(() => {
    fetch('/api/datasets/aapda-mitra')
      .then(r => r.json())
      .then(d => { if (d.success) setAapdaMitraList(d.data); })
      .catch(e => console.warn('Aapda Mitra fetch error', e));

    fetch('/api/datasets/sdma-directory')
      .then(r => r.json())
      .then(d => { if (d.success) setSdmaList(d.data); })
      .catch(e => console.warn('SDMA fetch error', e));
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.availability.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || res.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAapdaMitra = aapdaMitraList.filter(item => {
    return item.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.specialization.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredSdma = sdmaList.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.state.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'HOSPITAL': return <HeartPulse className="text-red-400" size={20} />;
      case 'POLICE': return <Shield className="text-blue-400" size={20} />;
      case 'FIRE': return <Flame className="text-amber-400" size={20} />;
      case 'AMBULANCE': return <Truck className="text-cyan-400" size={20} />;
      case 'RELIEF': return <Utensils className="text-emerald-400" size={20} />;
      case 'RESCUE': return <Anchor className="text-orange-400" size={20} />;
      default: return <AlertCircle className="text-slate-400" size={20} />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.emergencyResources}</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
              {resources.length + aapdaMitraList.length} Verified Stations
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Trauma centers, NDRF rescue battalions, Aapda Mitra community responder cohorts, and all-India SDMA disaster cells.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-400 shrink-0" />
          <span>Integrated with NDMA Aapda Mitra Scheme & All-India SDMA Directory</span>
        </div>
      </div>

      {/* Emergency Helplines Direct-Dial Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
          Universal Emergency Dispatch Hotlines (ERSS / NDMA)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {contacts.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.number}`}
              className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition block text-center group"
            >
              <span className="text-xl font-black text-red-400 group-hover:scale-105 transition-transform block">
                {contact.number}
              </span>
              <strong className="text-xs text-white block mt-1 line-clamp-1">{contact.serviceName}</strong>
              <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{contact.description}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search hospitals, Aapda Mitra volunteers, rescue teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: t.filterAll },
            { id: 'HOSPITAL', label: 'Hospitals' },
            { id: 'RESCUE', label: 'NDRF Fleet' },
            { id: 'FIRE', label: 'Fire & Rescue' },
            { id: 'POLICE', label: 'Police' },
            { id: 'AMBULANCE', label: 'Ambulance' },
            { id: 'AAPDA_MITRA', label: '🇮🇳 Aapda Mitra (NDMA)' },
            { id: 'SDMA', label: '🏛️ SDMAs (36 States)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: Aapda Mitra Community Responders */}
      {selectedCategory === 'AAPDA_MITRA' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-3">
            <HeartHandshake size={20} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold text-sm">
                About the NDMA Aapda Mitra Scheme
              </strong>
              <span>
                Aapda Mitra is a flagship initiative of the National Disaster Management Authority (ndma.gov.in) to train over 100,000 community volunteers in 350 multi-hazard prone districts of India with immediate flood rescue, first-aid, evacuation, and basic life support.
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredAapdaMitra.map(am => (
              <div
                key={am.id}
                className="p-6 rounded-3xl bg-slate-900 border border-blue-500/30 hover:border-blue-500/60 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black tracking-wider uppercase">
                      NDMA CERTIFIED COHORT
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Users size={12} />
                      <span>{am.volunteersActive} Active Volunteers</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{am.unitName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-slate-500 shrink-0" />
                      <span>{am.district}, {am.state}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Certified Lead Volunteer</span>
                      <strong className="text-white">{am.leadVolunteer}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Specialization</span>
                      <span className="text-amber-300 font-semibold">{am.specialization}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Standard Equipment Kit</span>
                      <div className="flex flex-wrap gap-1.5">
                        {am.equipmentStock.map((eq, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    HQ: {am.headquarters}
                  </span>
                  <a
                    href={`tel:${am.phone.split('/')[0].trim()}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                  >
                    <Phone size={13} />
                    <span>Call Unit</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedCategory === 'SDMA' ? (
        /* VIEW 2: All-India State Disaster Authorities Directory */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-3">
            <Building size={20} className="text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold text-sm">
                State Disaster Management Authorities (SDMAs) Institutional Roster
              </strong>
              <span>
                Under Section 14 of the Disaster Management Act 2005, each State and Union Territory maintains an apex SDMA headed by the Chief Minister / Lt. Governor, operating 24x7 State Emergency Operations Centers (SEOC).
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSdma.map((sdma, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    {sdma.state}
                  </span>
                  <h4 className="text-sm font-black text-white leading-snug">{sdma.name}</h4>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <a
                    href={`tel:${sdma.helpline.split('/')[0].trim()}`}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <Phone size={12} />
                    <span>{sdma.helpline}</span>
                  </a>
                  <a
                    href={sdma.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW 3: Standard Resource Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length === 0 ? (
            <div className="col-span-3 p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
              No emergency resources found matching your query.
            </div>
          ) : (
            filteredResources.map(res => (
              <div
                key={res.id || res._id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {getResourceIcon(res.type)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                      {res.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{res.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-slate-500 shrink-0" />
                      <span>{res.address}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <strong className="text-slate-400 block text-[10px] uppercase font-bold">Operational Status:</strong>
                    <p className="text-white font-medium">{res.availability}</p>

                    {/* Contextual telemetry badges */}
                    <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                      {res.bedsAvailable && (
                        <span className="text-emerald-400">🛏️ {res.bedsAvailable} Beds Free</span>
                      )}
                      {res.ambulanceOnStandby && (
                        <span className="text-blue-400">🚑 {res.ambulanceOnStandby} Ambulances</span>
                      )}
                      {res.waterLiters && (
                        <span className="text-cyan-400">💧 {res.waterLiters.toLocaleString()}L Water</span>
                      )}
                      {res.boatUnits && (
                        <span className="text-orange-400">🚤 {res.boatUnits} Rescue Rafts</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${res.contact.split('/')[0].trim()}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
                  >
                    <Phone size={13} className="text-emerald-400" />
                    <span className="line-clamp-1">{res.contact}</span>
                  </a>

                  <button
                    onClick={() => {
                      setCurrentTab('routes');
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                  >
                    <Compass size={13} />
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
