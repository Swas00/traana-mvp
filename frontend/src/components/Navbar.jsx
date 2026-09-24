import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Home, 
  Bell, 
  Navigation, 
  Bot, 
  PhoneCall, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sun, 
  Eye, 
  Presentation,
  PlayCircle,
  LocateFixed,
  Loader2,
  Crosshair,
  AlertTriangle,
  ShieldCheck,
  Share2,
  MessageSquarePlus,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function Navbar({ currentTab, setCurrentTab, onOpenShare, onOpenFeedback, onOpenNdma }) {

  const { 
    activeAlert, 
    citizenLocation,
    isCitizenInDanger,
    threatDistanceKm,
    isDetectingLocation,
    locationMessage,
    detectRealLocation,
    resetToDemoLocation,
    sachetAlerts,
    sachetTelemetry,
    sachetSyncing,
    syncSachetNow,
    language, 
    setLanguage, 
    highContrast, 
    setHighContrast, 
    isAudioAlertActive, 
    toggleAudioSiren,
    setPresentationOpen,
    setDemoTourOpen,
    t 
  } = useEmergency();

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'dashboard', label: t.navDashboard, icon: Radio, badge: activeAlert ? 'LIVE' : null },
    { id: 'alerts', label: t.navAlerts, icon: Bell },
    { id: 'shelters', label: t.navShelters, icon: ShieldAlert },
    { id: 'routes', label: t.navRoutes, icon: Navigation },
    { id: 'assistant', label: t.navAssistant, icon: Bot },
    { id: 'resources', label: t.navResources, icon: PhoneCall },
    { id: 'admin', label: t.navAdmin, icon: Settings }
  ];

  return (
    <header className={`border-b sticky top-0 z-50 transition-colors backdrop-blur-md ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : 'bg-slate-900/95 border-slate-800 text-slate-100'
    }`}>
      {/* Top emergency & location bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        {/* Threat Status & Location Indicator */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {activeAlert ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold tracking-wide uppercase">
                {t.activeEmergency}: {activeAlert.type} ({activeAlert.severity})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold">{t.allClear}</span>
            </div>
          )}

          {/* Location status badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
            <MapPin size={12} className={citizenLocation.mode === 'GPS' ? 'text-emerald-400' : 'text-amber-400'} />
            <span className="max-w-[160px] sm:max-w-[240px] truncate">
              {citizenLocation.name}
            </span>
            <span className="text-slate-500">•</span>
            {isCitizenInDanger ? (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertTriangle size={11} /> Hazard Zone
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck size={11} /> Safe Sector ({threatDistanceKm}km away)
              </span>
            )}
          </div>

          {/* NDMA SACHET Live Sync Indicator */}
          <button
            onClick={syncSachetNow}
            disabled={sachetSyncing}
            title="Real-time synchronization with https://sachet.ndma.gov.in/ (Click to force refresh)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold transition shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden md:inline text-indigo-300">NDMA SACHET:</span>
            <span className="text-white font-extrabold">{sachetAlerts.length || 60} LIVE ALERTS</span>
            {sachetSyncing ? (
              <Loader2 size={11} className="animate-spin text-indigo-400 ml-0.5" />
            ) : (
              <RefreshCw size={10} className="text-indigo-400 hover:rotate-180 transition-transform ml-0.5" />
            )}
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Detection Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={detectRealLocation}
              disabled={isDetectingLocation}
              title="Detect real user location via browser GPS"
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
                citizenLocation.mode === 'GPS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isDetectingLocation ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : (
                <LocateFixed size={12} className="text-emerald-400" />
              )}
              <span>{isDetectingLocation ? 'Detecting...' : 'My Real GPS'}</span>
            </button>

            <button
              onClick={resetToDemoLocation}
              title="Switch to Demo Flood Scenario Location"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition ${
                citizenLocation.mode === 'DEMO'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crosshair size={11} />
              <span className="hidden sm:inline">Demo Zone</span>
            </button>
          </div>

          {/* Siren sound alert toggle */}
          <button
            onClick={toggleAudioSiren}
            title="Toggle emergency audio warning siren"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              isAudioAlertActive 
                ? 'bg-red-600 text-white animate-bounce' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isAudioAlertActive ? <Volume2 size={14} className="text-white" /> : <VolumeX size={14} />}
            <span className="hidden md:inline">{isAudioAlertActive ? 'Siren Active' : 'Siren'}</span>
          </button>

          {/* High Contrast Mode */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Toggle High Contrast for Disaster Readability"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
              highContrast 
                ? 'bg-yellow-400 text-black' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Eye size={14} />
            <span className="hidden md:inline">{highContrast ? 'Normal' : 'High Contrast'}</span>
          </button>

          {/* Language selector */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'es' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ES
            </button>
          </div>

          {/* Demo Tour Button */}
          <button
            onClick={() => setDemoTourOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
          >
            <PlayCircle size={14} />
            <span className="hidden sm:inline">{t.demoTour}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* NDMA Guidelines Button */}
          <button
            onClick={onOpenNdma}
            title="Official NDMA Citizen Do's & Don'ts"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition shadow-sm"
          >
            <BookOpen size={13} className="text-amber-400" />
            <span className="hidden sm:inline">NDMA SOPs</span>
          </button>

          {/* Presentation Deck Modal */}
          <button
            onClick={() => setPresentationOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm"
          >
            <Presentation size={14} />
            <span className="hidden sm:inline">{t.presentation}</span>
          </button>
        </div>

      </div>


      {/* Location notification toast if active */}
      {locationMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500 text-emerald-200 px-4 py-1.5 text-xs text-center font-bold flex items-center justify-center gap-2 animate-in fade-in">
          <span>{locationMessage}</span>
        </div>
      )}

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors">
                TRAANA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Threat Response & Assistance Network
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? highContrast
                      ? 'bg-yellow-400 text-black font-black'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 overflow-x-auto border-t border-slate-800 bg-slate-950/80 scrollbar-none">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 bg-slate-900/60 hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
