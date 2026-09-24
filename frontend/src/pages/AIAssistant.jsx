import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Mic, 
  MicOff,
  ShieldAlert, 
  Radio, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Compass,
  MapPin,
  ShieldCheck,
  Bike,
  Wind,
  Waves,
  Activity,
  Zap,
  Flame,
  Sun,
  Snowflake,
  CloudRain,
  ExternalLink
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function AIAssistant({ setCurrentTab }) {
  const { 
    activeAlert, 
    shelters, 
    citizenLocation, 
    isCitizenInDanger, 
    threatDistanceKm, 
    language,
    t 
  } = useEmergency();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello. I am **TRAANA Neural Disaster AI**, your emergency disaster response advisor.\n\nI am actively monitoring the current **${activeAlert ? (activeAlert.rawDisasterType || activeAlert.type) : 'Emergency'}** alert for your sector (${activeAlert ? activeAlert.location : citizenLocation?.name || 'Monitored Area'}).\n\nHow can I assist you with immediate evacuation, safe travel routes (walk / 2-wheeler / car), shelter availability, or life-safety protocols?`,
      disclaimer: "⚠️ TRAANA MVP: Answers are informational. Prioritize official loudspeaker sirens and directives from civil defense personnel."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const messagesEndRef = useRef(null);

  const [selectedCalamityCategory, setSelectedCalamityCategory] = useState('LIVE');

  // Multi-calamity questions database covering all natural disasters & live situation
  const calamityPrompts = {
    LIVE: [
      `What are the official NDMA instructions for this active ${activeAlert ? activeAlert.type : 'emergency'}?`,
      "Am I currently in the danger zone for this alert?",
      "Can I evacuate using a 2-wheeler or car right now?",
      "Where is the nearest safe shelter with available beds?",
      "What should I pack in my emergency 72h go-bag?",
      "How do I protect my pets, cattle, and livestock right now?",
      "What are the national emergency helpline numbers (112, 1070)?"
    ],
    FLOOD: [
      "What should I do right now during this flood emergency?",
      "Can a 2-wheeler or scooter drive through 10 cm of water?",
      "Is tap water safe to drink, and how to disinfect it?",
      "What to do if there is a downed electrical power cable in water?",
      "When is it safe to return to a flooded home?"
    ],
    CYCLONE: [
      "What is the pre-landfall home reinforcement checklist?",
      "What should I do during the calm 'eye' of the cyclone?",
      "How to tape and board windows against 130 km/h wind gusts?",
      "Why is outdoor travel by two-wheeler strictly prohibited in cyclones?",
      "When is it safe to venture outside after cyclone landfall?"
    ],
    EARTHQUAKE: [
      "What is the exact 'Drop, Cover, and Hold On' protocol?",
      "Should I run outside a multi-story building during active shaking?",
      "Why must I never use elevators during or after an earthquake?",
      "What to do if trapped under earthquake debris?",
      "How to inspect gas lines and structural damage after a tremor?"
    ],
    TSUNAMI: [
      "How far inland or to what elevation must I evacuate for a tsunami?",
      "If the sea water suddenly recedes rapidly, what should I do?",
      "Is a coastal multi-storey RCC building safe during a tsunami?",
      "How long after the first wave do subsequent tsunami waves arrive?",
      "Can boats in deep ocean water survive a tsunami?"
    ],
    THUNDERSTORM: [
      "What is the 30-30 lightning safety rule?",
      "What is the safe 'Lightning Crouch' position in open fields?",
      "Are cars or metal bus shelters safe during severe lightning?",
      "What to do if hair stands on end in an open field during a storm?",
      "Can I use mobile phones or plug-in appliances during thunderstorms?"
    ],
    LANDSLIDE: [
      "What are early acoustic warning signs of imminent mountain slope failure?",
      "If caught near a cloudburst or debris flow, which way should I run?",
      "Why are valley bottoms and culverts lethal during mountain cloudbursts?",
      "What should mountain road motorists do if boulders begin falling?",
      "How to identify ground cracks before a hillside gives way?"
    ],
    HEATWAVE: [
      "How to treat sudden heat stroke and high body temperature?",
      "What fluids should I drink besides water (ORS, buttermilk)?",
      "What are the dangerous symptoms of heat exhaustion vs heat stroke?",
      "Why is leaving children or pets in parked cars fatal during heatwaves?",
      "How to protect outdoor construction workers during 45°C+ heatwaves?"
    ],
    WILDFIRE: [
      "Which direction should I evacuate during an advancing forest fire?",
      "Why must I never attempt to run uphill away from wildfire flames?",
      "What type of face mask filters toxic wildfire smoke?",
      "How to create a 10-meter defensible space around my house?",
      "What items to pack in a 10-minute wildfire evacuation go-bag?"
    ],
    COLDWAVE: [
      "What is the fatal carbon monoxide warning for room heaters & angithi?",
      "How to recognize early hypothermia and safely rewarm victims?",
      "How many layers of clothing are recommended in severe cold waves?",
      "How to protect livestock and domestic animals from ground frost?",
      "What precautions for heart patients during sudden cold snaps?"
    ],
    TRAVEL: [
      "Can two-wheelers navigate flooded streets or storm debris?",
      "What water depth causes motorcycle engine airbox hydrolock?",
      "At what water depth do 4-wheeler passenger cars float?",
      "Why should car windows be cracked 2 cm when driving near flood zones?",
      "Is it safe to cross submerged causeways or bridge culverts?"
    ],
    ANIMALS: [
      "Why is leaving cattle or pets tied up during evacuation illegal & fatal?",
      "What should be included in a pet emergency disaster kit?",
      "How to move farm cattle to elevated cyclone or flood shelter stilt pens?",
      "How to prevent waterborne foot-rot disease in cattle post-disaster?",
      "Where are animal-friendly emergency shelters located in TRAANA?"
    ]
  };

  const quickPrompts = calamityPrompts[selectedCalamityCategory] || calamityPrompts.LIVE;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Input Speech-to-Text Setup
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition not supported in this browser. Please type your query.");
      setTimeout(() => setSpeechError(''), 4000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        bn: 'bn-IN',
        ta: 'ta-IN'
      };
      recognition.lang = langMap[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSend(transcript);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setSpeechError(`Voice error: ${e.error}. Try speaking clearly into mic.`);
        setTimeout(() => setSpeechError(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSend = async (queryText = null) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend || !textToSend.trim()) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          activeAlertId: activeAlert?.id
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: json.data.answer,
            disclaimer: json.data.disclaimer,
            provider: json.provider
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: "Emergency response telemetry currently unavailable. Seek high ground immediately and call **112** (Universal SOS) or **1070** (Disaster Control Room).",
            disclaimer: "⚠️ Call emergency services directly."
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "Communication timeout. Seek high ground immediately and call **112** or **1070**.",
          disclaimer: "⚠️ Emergency priority."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const copyAnswer = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const resetChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `Session reset. I am **TRAANA Neural Disaster AI**.\n\nMonitoring **${activeAlert ? (activeAlert.rawDisasterType || activeAlert.type) : 'Emergency'}** alert. Ask any question on live evacuation, weather impact, road safety, or shelter capacity.`,
        disclaimer: "⚠️ TRAANA MVP: Prioritize official emergency loudspeakers and sirens."
      }
    ]);
  };

  const nearestShelter = shelters.find(s => s.status !== 'FULL') || shelters[0];

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.aiTitle}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
              <Sparkles size={12} /> TRAANA Neural Disaster AI
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            24/7 Contextual Emergency Reasoning Engine • Sourced from NDMA SOPs & Live SACHET Feed
          </p>
        </div>

        <button
          onClick={resetChat}
          title="Reset conversation stream"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition"
        >
          <RotateCcw size={13} />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Active Calamity Live Telemetry HUD Bar */}
      <div className={`p-4 rounded-3xl border-2 transition-all shadow-xl ${
        isCitizenInDanger
          ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-red-500/80'
          : 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-blue-950/70 border-indigo-500/50'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-red-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Disaster Grounded In:
              </span>
              <strong className="text-sm text-white block">
                {activeAlert ? activeAlert.title : "Pan-India Multi-Hazard Monitoring"}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
              isCitizenInDanger ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
            }`}>
              {isCitizenInDanger ? '⚠️ In Hazard Radius' : '🛡️ Safe Perimeter'}
            </span>

            <button
              onClick={() => setCurrentTab('alerts')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition"
            >
              Change Alert
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Disaster Type</span>
            <span className="font-extrabold text-white text-xs block truncate mt-0.5">
              {activeAlert ? (activeAlert.rawDisasterType || activeAlert.type) : 'All-Hazards'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Threat Epicenter</span>
            <span className="font-black text-amber-400 text-xs block mt-0.5">
              {threatDistanceKm} km away
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Nearest Open Shelter</span>
            <span className="font-bold text-white text-xs block truncate mt-0.5">
              {nearestShelter?.name || "North Ridge Shelter"}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Free Beds</span>
            <span className="font-black text-emerald-400 text-xs block mt-0.5">
              {nearestShelter?.availableSlots || 240} Beds Open
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Calamity Category Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select Disaster Category or Topic:
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">100% Calamity Spectrum Active</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'LIVE', label: '🚨 Live Alert Context', special: true },
            { id: 'FLOOD', label: '🌊 Flood' },
            { id: 'CYCLONE', label: '🌀 Cyclone' },
            { id: 'EARTHQUAKE', label: '🌋 Earthquake' },
            { id: 'TSUNAMI', label: '🌊 Tsunami' },
            { id: 'THUNDERSTORM', label: '⚡ Lightning' },
            { id: 'LANDSLIDE', label: '⛰️ Landslide & Cloudburst' },
            { id: 'HEATWAVE', label: '☀️ Heatwave' },
            { id: 'WILDFIRE', label: '🔥 Wildfire' },
            { id: 'COLDWAVE', label: '❄️ Cold Wave' },
            { id: 'TRAVEL', label: '🛵 2-Wheeler / Routes' },
            { id: 'ANIMALS', label: '🐾 Pets & Cattle (AiDRR)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCalamityCategory(cat.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedCalamityCategory === cat.id
                  ? cat.special 
                    ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-600/30'
                    : 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Prompts Chips for Selected Calamity */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Recommended Life-Safety Inquiries ({selectedCalamityCategory}):
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition text-left shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 h-[520px] flex flex-col shadow-2xl overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md mt-1">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 text-sm leading-relaxed ${
                  isBot
                    ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-blue-600 text-white font-medium shadow-md'
                }`}>
                  <div className="whitespace-pre-line text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {isBot && msg.disclaimer && (
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-normal">
                      {msg.disclaimer}
                    </div>
                  )}

                  {isBot && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
                      <span className="font-mono text-[10px] text-slate-400">
                        {msg.provider || 'TRAANA Disaster Resilience Core'}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyAnswer(msg.text, idx)}
                          title="Copy response to clipboard"
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                        >
                          {copiedIdx === idx ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => speakText(msg.text)}
                          title="Read aloud via Speech Synthesis"
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                        >
                          <Volume2 size={13} className="text-blue-400" />
                          <span>Listen</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={18} />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                <span>TRAANA AI is assessing active calamity telemetry and synthesizing life-safety advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Feedback Notification */}
        {speechError && (
          <div className="px-4 py-1.5 bg-red-950 text-red-300 text-xs border-t border-red-800 flex items-center gap-2">
            <AlertTriangle size={13} />
            <span>{speechError}</span>
          </div>
        )}

        {isListening && (
          <div className="px-4 py-2 bg-red-600/20 text-red-200 text-xs border-t border-red-600/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold">Listening... Speak your emergency question clearly.</span>
            </div>
            <button
              onClick={() => setIsListening(false)}
              className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            title={isListening ? "Stop Voice Input" : "Speak Emergency Question (Voice Input)"}
            className={`p-3 rounded-xl border transition ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} className="text-cyan-400" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : t.askPlaceholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold transition shadow-lg shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
