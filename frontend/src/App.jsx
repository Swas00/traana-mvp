import React, { useState } from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import Navbar from './components/Navbar';
import AlertTicker from './components/AlertTicker';
import PresentationDeck from './components/PresentationDeck';
import DemoTourModal from './components/DemoTourModal';
import FeedbackModal from './components/FeedbackModal';
import ShareModal from './components/ShareModal';
import NdmaGuidelinesModal from './components/NdmaGuidelinesModal';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Shelters from './pages/Shelters';
import RoutesMap from './pages/RoutesMap';
import AIAssistant from './pages/AIAssistant';
import Resources from './pages/Resources';
import Admin from './pages/Admin';

import { ShieldAlert, Heart, ShieldCheck, Radio, MessageSquarePlus, Share2 } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNdmaOpen, setIsNdmaOpen] = useState(false);

  const { highContrast, t } = useEmergency();

  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home setCurrentTab={setCurrentTab} />;
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'alerts':
        return <Alerts setCurrentTab={setCurrentTab} />;
      case 'shelters':
        return <Shelters setCurrentTab={setCurrentTab} />;
      case 'routes':
        return <RoutesMap setCurrentTab={setCurrentTab} />;
      case 'assistant':
        return <AIAssistant setCurrentTab={setCurrentTab} />;
      case 'resources':
        return <Resources setCurrentTab={setCurrentTab} />;
      case 'admin':
        return <Admin setCurrentTab={setCurrentTab} />;
      default:
        return <Home setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      highContrast 
        ? 'bg-black text-yellow-300 font-sans' 
        : 'bg-slate-950 text-slate-100 font-sans'
    }`}>
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenShare={() => setIsShareOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenNdma={() => setIsNdmaOpen(true)}
      />

      {/* Urgent Broadcast Bar */}
      <AlertTicker setCurrentTab={setCurrentTab} />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      {/* Floating Action Buttons for Feedback & Share */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 transition transform hover:scale-105 active:scale-95"
        >
          <MessageSquarePlus size={16} />
          <span>Suggest Changes</span>
        </button>

        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/40 border border-emerald-400/30 transition transform hover:scale-105 active:scale-95"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Modals */}
      <PresentationDeck />
      <DemoTourModal setCurrentTab={setCurrentTab} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <NdmaGuidelinesModal isOpen={isNdmaOpen} onClose={() => setIsNdmaOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
              T
            </div>
            <span className="font-bold text-slate-300">TRAANA MVP</span>
            <span>• Threat Response & Assistance Network for Alerts and Navigation</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsShareOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold"
            >
              Share with Friends
            </button>
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className="hover:text-white transition"
            >
              Feedback
            </button>
            <button 
              onClick={() => setCurrentTab('admin')} 
              className="hover:text-white transition"
            >
              Admin Dispatch
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-mono">v1.0.0-PROTOTYPE ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}
