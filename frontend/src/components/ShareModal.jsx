import React, { useState } from 'react';
import { Share2, X, Copy, Check, QrCode, Wifi, Globe, Smartphone, Laptop } from 'lucide-react';

export default function ShareModal({ isOpen, onClose }) {
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState(false);

  if (!isOpen) return null;

  const wifiUrl = "http://172.20.10.3:3000";
  const localUrl = "http://localhost:3000";

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'wifi') {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 3000);
    } else {
      setCopiedLocal(true);
      setTimeout(() => setCopiedLocal(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-950 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Share TRAANA with Friends</h3>
              <p className="text-xs text-slate-300">Let your friends test and suggest improvements</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Method 1: Local Wi-Fi / Hotspot (Instant) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Wifi size={14} /> Method 1: Same Wi-Fi or Phone Hotspot
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                READY NOW
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If your friends are connected to the same Wi-Fi router or your mobile hotspot, they can open this URL directly on their phone or laptop:
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
              <code className="text-xs font-mono text-emerald-300 flex-1 truncate px-1">
                {wifiUrl}
              </code>
              <button
                onClick={() => copyToClipboard(wifiUrl, 'wifi')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                {copiedWifi ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedWifi ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Method 2: Public Internet Tunnel */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Globe size={14} /> Method 2: Public HTTPS Link (Anywhere / Cellular)
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                ACTIVE NOW
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Share this live HTTPS link with friends anywhere in the world (works on mobile phones over cellular or different Wi-Fi):
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
              <code className="text-xs font-mono text-blue-300 flex-1 truncate px-1">
                https://fifty-moles-feel.loca.lt
              </code>
              <button
                onClick={() => copyToClipboard('https://fifty-moles-feel.loca.lt', 'public')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                {copiedLocal ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLocal ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              ℹ️ If prompted for a tunnel password on first open, enter your IP: <strong className="text-amber-300 font-mono">171.48.102.71</strong>
            </p>
          </div>


          {/* In-App Feedback Feature Note */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 mt-0.5">
              💡
            </div>
            <div>
              <strong className="block text-white">Built-in Feedback Collector</strong>
              Your friends can click the floating <strong>"Suggest Changes"</strong> button on any page to submit feature requests. You can view all their feedback in your <strong>Admin Dispatch</strong> tab!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
