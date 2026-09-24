import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Waves, 
  Wind, 
  Flame, 
  Sun, 
  Compass, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export default function NdmaGuidelinesModal({ isOpen, onClose }) {
  const [selectedHazard, setSelectedHazard] = useState('FLOOD');
  const [guidelinesData, setGuidelinesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const hazardTabs = [
    { id: 'FLOOD', label: '🌊 Floods & Inundation', icon: Waves },
    { id: 'CYCLONE', label: '🌀 Cyclones & Storm Surges', icon: Wind },
    { id: 'EARTHQUAKE', label: '🏚️ Earthquakes', icon: Flame },
    { id: 'LANDSLIDE', label: '⛰️ Landslides & Mudflows', icon: Compass },
    { id: 'TSUNAMI', label: '🌊 Tsunamis & Marine Surges', icon: Waves },
    { id: 'THUNDERSTORM', label: '⚡ Thunderstorms & Lightning', icon: Sparkles },
    { id: 'HEATWAVE', label: '☀️ Heatwaves', icon: Sun },
    { id: 'WILDFIRE', label: '🔥 Forest Fires', icon: Flame },
    { id: 'CLOUDBURST', label: '🌧️ Cloudbursts & Flash Floods', icon: Waves },
    { id: 'COLDWAVE', label: '❄️ Cold Waves & Avalanches', icon: Wind },
    { id: 'DROUGHT', label: '🌾 Drought & Water Scarcity', icon: Sun },
    { id: 'AIDRR_ANIMALS', label: '🐾 Animals & Livestock (AiDRR)', icon: HeartHandshake }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchGuidelines(selectedHazard);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen, selectedHazard]);

  const fetchGuidelines = async (hazard) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/datasets/ndma-guidelines?hazard=${hazard}`);
      const json = await res.json();
      if (json.success) {
        setGuidelinesData(json.data);
      }
    } catch (e) {
      console.warn('Failed to load NDMA guidelines:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis || !guidelinesData) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const dosText = guidelinesData.dos.slice(0, 3).join('. ');
    const dontsText = guidelinesData.donts.slice(0, 2).join('. ');
    const fullText = `National Disaster Management Authority guidelines for ${guidelinesData.title}. Key things you must do: ${dosText}. Critical things you must avoid: ${dontsText}.`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-500/40">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">NDMA Citizen Safety SOPs & Guidelines</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  GOVT. OF INDIA
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Authoritative Do's & Don'ts from the National Disaster Management Authority (ndma.gov.in)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              title="Read guidelines aloud"
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isSpeaking 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Hazard Selector Pills */}
        <div className="p-3 bg-slate-950 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 shrink-0">
          {hazardTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedHazard(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedHazard === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading || !guidelinesData ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading official NDMA survival protocols...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white">
                    {guidelinesData.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Source: {guidelinesData.source}
                  </span>
                </div>

                <a
                  href={guidelinesData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
                >
                  <span>ndma.gov.in Official Doc</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Two Column Grid: DO's vs DONT's */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* DO's */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/40 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <h4 className="text-sm font-black text-emerald-300 uppercase tracking-wide">
                      Things You MUST Do (Do's)
                    </h4>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-200">
                    {guidelinesData.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DONT's */}
                <div className="p-5 rounded-2xl bg-red-950/20 border-2 border-red-500/40 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
                    <XCircle size={18} className="text-red-400" />
                    <h4 className="text-sm font-black text-red-300 uppercase tracking-wide">
                      Things You MUST Avoid (Don'ts)
                    </h4>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-200">
                    {guidelinesData.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          ✕
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Special Note on Aapda Mitra Community Responders */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300 shrink-0">
                  <HeartHandshake size={18} />
                </div>
                <div>
                  <strong className="text-white block font-bold">
                    Need on-ground assistance? Connect with Aapda Mitra Volunteers
                  </strong>
                  <span>
                    Under NDMA's Aapda Mitra scheme, certified community volunteers with life jackets, stretchers, and first-aid kits are active in 350+ multi-hazard districts across India. Check the <strong>Emergency Resources</strong> page for contact details.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Source: Ministry of Home Affairs, Government of India (ndma.gov.in)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
