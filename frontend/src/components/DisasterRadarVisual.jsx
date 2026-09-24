import React, { useEffect, useRef, useState } from 'react';
import { 
  Radio, 
  Wind, 
  Waves, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Navigation,
  Compass,
  AlertTriangle
} from 'lucide-react';

export default function DisasterRadarVisual({ activeCalamity = 'ALL', onSelectCalamity }) {
  const canvasRef = useRef(null);
  const [selectedHazard, setSelectedHazard] = useState(activeCalamity || 'ALL');

  // Multi-calamity live target beacons (Indian disaster coordinates simulated on early warning radar grid)
  const calamityTargets = [
    { id: 'CYCLONE', name: 'Cyclone Vortex (Bay of Bengal)', angle: 0.85, distance: 0.65, color: '#06b6d4', icon: Wind, severity: 'CRITICAL', label: '145 km/h Wind' },
    { id: 'FLOOD', name: 'Riverfront Inundation (Yamuna Basin)', angle: 2.1, distance: 0.42, color: '#3b82f6', icon: Waves, severity: 'HIGH', label: '+2.4m Flood Level' },
    { id: 'EARTHQUAKE', name: 'Seismic Tremor (Himalayan Fault)', angle: 3.7, distance: 0.72, color: '#f59e0b', icon: Activity, severity: 'MEDIUM', label: 'M 5.4 Tremor' },
    { id: 'THUNDERSTORM', name: 'Severe Squall & Lightning (East India)', angle: 4.9, distance: 0.52, color: '#a855f7', icon: Zap, severity: 'HIGH', label: '62 kts Lightning' },
    { id: 'TSUNAMI', name: 'Coastal Surge Vector (Indian Ocean)', angle: 5.8, distance: 0.78, color: '#ef4444', icon: ShieldAlert, severity: 'CRITICAL', label: '3.2m Tidal Wave' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;
    let pulse = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 15;

      // Clear with 100% transparency
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Concentric Radar Early Warning Rings (Transparent Neon)
      const ringCount = 4;
      for (let i = 1; i <= ringCount; i++) {
        const r = (maxRadius / ringCount) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = i === ringCount ? 'rgba(56, 189, 248, 0.4)' : 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = i === ringCount ? 1.5 : 1;
        ctx.setLineDash(i % 2 === 0 ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ring distance annotations
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(`${i * 15} KM`, centerX + 4, centerY - r + 11);
      }

      // 2. Draw Crosshairs & Bearing Marks
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();

      // Cardinal direction letters
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('N (0°)', centerX, centerY - maxRadius - 4);
      ctx.fillText('S (180°)', centerX, centerY + maxRadius + 12);
      ctx.fillText('E (90°)', centerX + maxRadius + 14, centerY + 3);
      ctx.fillText('W (270°)', centerX - maxRadius - 14, centerY + 3);
      ctx.textAlign = 'left';

      // 3. Draw Rotating Radar Sweep Line & Phosphor Glow
      angle = (angle + 0.025) % (Math.PI * 2);
      pulse = (pulse + 0.04) % (Math.PI * 2);

      const sweepGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, maxRadius
      );
      sweepGradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      sweepGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

      // Draw fading phosphor sector behind sweep
      const sectorAngle = Math.PI / 4; // 45 degree tail
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, angle - sectorAngle, angle, false);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Bright sweep leading edge
      const sweepX = centerX + Math.cos(angle) * maxRadius;
      const sweepY = centerY + Math.sin(angle) * maxRadius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Center Citizen Hub Beacon (Radar Emitter)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8 + Math.sin(pulse) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.stroke();

      // 5. Draw Calamity Target Beacons
      calamityTargets.forEach((target) => {
        const isHighlight = selectedHazard === 'ALL' || selectedHazard === target.id;
        const targetRadius = maxRadius * target.distance;
        const tx = centerX + Math.cos(target.angle) * targetRadius;
        const ty = centerY + Math.sin(target.angle) * targetRadius;

        // Calculate angular distance to sweep beam for ping illumination
        let diff = (angle - target.angle + Math.PI * 2) % (Math.PI * 2);
        const isPinged = diff < 0.35;

        // Expanding shockwave pulse ring
        const rippleR = 6 + ((pulse * 4 + target.angle * 2) % 20);
        const rippleAlpha = Math.max(0, 1 - rippleR / 20) * (isHighlight ? 0.7 : 0.25);

        ctx.beginPath();
        ctx.arc(tx, ty, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = target.color;
        ctx.globalAlpha = rippleAlpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Target core beacon
        ctx.beginPath();
        ctx.arc(tx, ty, isPinged ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.shadowColor = target.color;
        ctx.shadowBlur = isPinged ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Target Label (if highlighted or near sweep)
        if (isHighlight) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(target.id, tx + 8, ty - 4);
          ctx.fillStyle = target.color;
          ctx.font = '8px monospace';
          ctx.fillText(target.label, tx + 8, ty + 6);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [selectedHazard]);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* HUD Header Telemetry */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-400 px-3 py-1.5 rounded-t-2xl bg-cyan-950/40 border-t border-x border-cyan-800/40 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <Radio size={13} className="animate-pulse text-cyan-400" />
          <span className="font-bold tracking-wider">EARLY WARNING RADAR</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>360° SWEEP LIVE</span>
        </div>
      </div>

      {/* Transparent Canvas Container */}
      <div className="relative w-full aspect-square bg-slate-950/40 backdrop-blur-sm rounded-b-2xl border border-cyan-800/40 shadow-2xl overflow-hidden flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          title="Interactive Calamity Radar. Click calamity pills below to isolate beacons."
        />

        {/* Live Weather Isobar / Satellite scanlines effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>

        {/* Overlay Calamity Radar Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 border border-slate-700/70 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-1.5 shadow-md">
          <Navigation size={10} className="text-cyan-400 rotate-45" />
          <span>NDMA SACHET GRID</span>
        </div>
      </div>

      {/* Interactive Calamity Filter Chips */}
      <div className="w-full mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => {
            setSelectedHazard('ALL');
            if (onSelectCalamity) onSelectCalamity('ALL');
          }}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition border ${
            selectedHazard === 'ALL'
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          ALL (360°)
        </button>

        {calamityTargets.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedHazard === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedHazard(c.id);
                if (onSelectCalamity) onSelectCalamity(c.id);
              }}
              style={{
                borderColor: isSelected ? c.color : undefined,
                backgroundColor: isSelected ? `${c.color}25` : undefined,
                color: isSelected ? '#ffffff' : undefined
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition border ${
                isSelected ? 'shadow-sm' : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Icon size={11} style={{ color: c.color }} />
              <span>{c.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
