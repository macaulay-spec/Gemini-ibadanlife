import React, { useState } from 'react';
import {
  Wallet,
  Building,
  Star,
  Smartphone,
  Package,
  Volume2,
  VolumeX,
  Car,
  Camera,
  Radio,
  Map,
  Smile,
  Zap,
  Briefcase,
  Utensils,
  Battery,
  Sparkles,
  Users,
} from 'lucide-react';
import { PlayerStats, InteractionPrompt, JobMission } from '../types/game';

interface HUDProps {
  stats: PlayerStats;
  currentDistrict: string;
  isDriving: boolean;
  vehicleSpeed: number;
  prompt: InteractionPrompt | null;
  activeJob: JobMission | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPhone: () => void;
  onOpenInventory: () => void;
  onOpenMap: () => void;
  onOpenNeeds: () => void;
  onTriggerInteract: () => void;
  onCycleCamera: () => void;
  playerPos: { x: number; z: number };
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  currentDistrict,
  isDriving,
  vehicleSpeed,
  prompt,
  activeJob,
  isMuted,
  onToggleMute,
  onOpenPhone,
  onOpenInventory,
  onOpenMap,
  onOpenNeeds,
  onTriggerInteract,
  onCycleCamera,
  playerPos,
}) => {
  const [activeRadio, setActiveRadio] = useState('Splash FM 105.5 (Ibadan)');

  const speedKmh = Math.round(Math.abs(vehicleSpeed) * 3.6);

  // Radar scale and center
  const radarRadius = 46;
  const radarScale = 0.4;
  const radarCenterX = 50;
  const radarCenterY = 50;

  const radarLandmarks = [
    { name: 'UI', x: 0, z: -180, color: '#3b82f6' },
    { name: 'MKT', x: 65, z: -40, color: '#f59e0b' },
    { name: 'AGB', x: -55, z: -40, color: '#10b981' },
    { name: 'EST', x: 70, z: 160, color: '#06b6d4' },
  ];

  const radioStations = [
    'Splash FM 105.5 (Ibadan)',
    'Premier Afrobeat Radio',
    'Amala Skye Fuji Beats',
    'Space FM 90.1 Bodija',
  ];

  // 4D Game Time Formatter (e.g., 14.5 -> "14:30")
  const hour = Math.floor(stats.gameHour || 14);
  const minute = Math.floor(((stats.gameHour || 14) % 1) * 60);
  const timeFormatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const isNight = hour >= 19 || hour < 6;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-sans">
      {/* 1. TOP BAR — GTA & SIMS HUD STATUS STRIP */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
        {/* Character Portrait & Moodlet (clickable to open Sims Needs) */}
        <div
          onClick={onOpenNeeds}
          className="flex items-center gap-2.5 bg-slate-950/90 backdrop-blur-md border border-white/15 hover:border-amber-400/60 p-1.5 pr-3.5 rounded-2xl shadow-2xl pointer-events-auto cursor-pointer transition-all active:scale-95"
          title="Click to view 6 Character Needs & Mood"
        >
          <img
            src="/src/assets/images/marcus_character_portrait_1791664295622.jpg"
            alt="Marcus King Carter"
            className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 shadow"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-100 leading-tight">
                MARCUS CARTER
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 font-mono font-bold px-1.5 py-0.2 rounded">
                SIMS
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium leading-tight truncate max-w-[130px]">
              {stats.moodlet}
            </span>
          </div>
        </div>

        {/* Currency in Bold GTA Green/White */}
        <div className="flex items-center gap-3 bg-slate-950/90 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Cash</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono tabular-nums leading-none">
                ₦{stats.cash.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-white/15" />

          <div className="flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Bank</span>
              <span className="text-xs sm:text-sm font-black text-blue-400 font-mono tabular-nums leading-none">
                ₦{stats.bank.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 4D Time of Day & NEPA Status Badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">4D TIME</span>
            <span className="text-xs font-black font-mono text-amber-400">
              {timeFormatted} {isNight ? '🌙 Night' : '☀️ Day'}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/15" />
          <div className="flex items-center gap-1">
            <Zap className={`w-3.5 h-3.5 ${stats.nepaGridActive ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`} />
            <span className="text-[10px] font-bold text-slate-200">
              {stats.nepaGridActive ? 'NEPA ON' : 'GENNY'}
            </span>
          </div>
        </div>

        {/* Top Action Buttons (Mute, Camera, Map, Needs) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-white shadow-xl active:scale-95"
            title="Mute / Unmute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onCycleCamera}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-white shadow-xl active:scale-95"
            title="Cycle Camera View"
          >
            <Camera className="w-4 h-4 text-amber-400" />
          </button>

          {/* UNMISSABLE GLOWING MAP BUTTON */}
          <button
            onClick={onOpenMap}
            className="h-10 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xl shadow-emerald-500/30 active:scale-95 border border-white/30 cursor-pointer"
            title="Open Full Map & GPS (M)"
          >
            <Map className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span className="font-black uppercase tracking-wider">MAP</span>
          </button>
        </div>
      </div>

      {/* 2. GTA WANTED STARS (Top Right) */}
      <div className="absolute top-18 right-3 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-xl">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 transition-all ${
              s <= stats.wantedLevel
                ? 'text-red-500 fill-red-500 animate-pulse scale-110'
                : 'text-slate-700'
            }`}
          />
        ))}
      </div>

      {/* 3. ACTIVE HUSTLE BANNER (GTA Mission Card) */}
      {activeJob && (
        <div className="absolute top-28 right-3 max-w-xs bg-slate-950/90 backdrop-blur-md border border-amber-500/50 p-3 rounded-2xl shadow-2xl z-10 pointer-events-auto">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
              MISSION IN PROGRESS
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              +₦{activeJob.rewardCash.toLocaleString()}
            </span>
          </div>
          <div className="text-xs font-bold text-slate-100">{activeJob.title}</div>
          <div className="text-[11px] text-slate-300 mt-0.5">{activeJob.description}</div>
          <div className="text-[10px] text-amber-400 mt-2 font-mono flex items-center justify-between">
            <span>Destination: {activeJob.dropoffDistrict}</span>
            <span>Check Radar ➔</span>
          </div>
        </div>
      )}

      {/* 4. SPEEDOMETER & RADIO WHEN DRIVING */}
      {isDriving && (
        <div className="absolute bottom-28 right-4 flex flex-col items-end gap-2 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-xs text-slate-200 shadow-xl">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{activeRadio}</span>
            <button
              onClick={() => {
                const curIdx = radioStations.indexOf(activeRadio);
                setActiveRadio(radioStations[(curIdx + 1) % radioStations.length]);
              }}
              className="text-[10px] font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded active:scale-95"
            >
              Tune
            </button>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/90 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center">
              <Car className="w-5 h-5 text-amber-400" />
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">MICRA</span>
            </div>
            <div className="w-[1px] h-8 bg-white/15" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
                {speedKmh}
              </span>
              <span className="text-[9px] uppercase text-slate-400 font-mono -mt-1">KM/H</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. CIRCULAR MINI-MAP & HEALTH/ENERGY BARS */}
      <div className="absolute bottom-16 left-4 z-20 pointer-events-auto flex flex-col gap-1.5">
        <div className="bg-slate-950/90 backdrop-blur-md border border-white/15 px-3 py-1 rounded-xl shadow-xl max-w-[200px]">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-100 truncate">
            {currentDistrict}
          </div>
          <div className="text-[9px] text-amber-400 font-mono uppercase tracking-widest -mt-0.5">
            IBADAN NORTH · OYO
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Circular Radar */}
          <div
            onClick={onOpenMap}
            className="relative w-24 h-24 rounded-full bg-slate-950/90 backdrop-blur-md border-2 border-slate-700/80 shadow-2xl overflow-hidden cursor-pointer hover:border-amber-400 transition-colors"
            title="Click to open full map (M)"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx={radarCenterX} cy={radarCenterY} r="45" fill="none" stroke="#334155" strokeWidth="1" />
              <circle cx={radarCenterX} cy={radarCenterY} r="25" fill="none" stroke="#1e293b" strokeWidth="1" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="#1e293b" strokeWidth="1" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="#1e293b" strokeWidth="1" />

              {/* Landmarks */}
              {radarLandmarks.map((lm) => {
                const relX = (lm.x - playerPos.x) * radarScale;
                const relZ = (lm.z - playerPos.z) * radarScale;
                const dist = Math.sqrt(relX * relX + relZ * relZ);
                const clampedDist = Math.min(dist, radarRadius - 6);
                const angle = Math.atan2(relZ, relX);
                const drawX = radarCenterX + Math.cos(angle) * clampedDist;
                const drawY = radarCenterY + Math.sin(angle) * clampedDist;

                return (
                  <g key={lm.name}>
                    <circle cx={drawX} cy={drawY} r="3" fill={lm.color} />
                    <text
                      x={drawX}
                      y={drawY - 4}
                      fill="#ffffff"
                      fontSize="6"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {lm.name}
                    </text>
                  </g>
                );
              })}

              {/* Player Arrow */}
              <circle cx={radarCenterX} cy={radarCenterY} r="4" fill="#38bdf8" />
              <circle cx={radarCenterX} cy={radarCenterY} r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
            </svg>
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-300 font-mono">
              N
            </span>
          </div>

          {/* Quick Health & Energy Bars */}
          <div className="flex flex-col gap-1.5 w-20">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
                <span className="font-bold">HP</span>
                <span>{stats.health}</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${stats.health}%` }}
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px] font-mono text-blue-400">
                <span className="font-bold">NRG</span>
                <span>{Math.round(stats.energy)}</span>
              </div>
              <div className="w-full bg-slate-900 border border-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${stats.energy}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CONTEXT ACTION PROMPT (Center Lower Third) */}
      {prompt && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/95 backdrop-blur-md border border-amber-500/60 px-5 py-3 rounded-2xl shadow-2xl z-30 pointer-events-auto animate-bounce-subtle">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
            {prompt.actionKey}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-100">{prompt.title}</span>
            <span className="text-xs text-amber-300">{prompt.subtitle}</span>
          </div>
          <button
            onClick={onTriggerInteract}
            className="ml-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            Interact
          </button>
        </div>
      )}

      {/* 7. PERSISTENT BOTTOM NAVIGATION DOCK (Lagos Life & Mobile Sim Style) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/95 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl z-20 pointer-events-auto">
        <button
          onClick={onOpenMap}
          className="flex flex-col items-center px-3 py-1 rounded-xl hover:bg-white/10 active:scale-95 text-slate-200 hover:text-emerald-400 transition-all cursor-pointer"
        >
          <Map className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black uppercase mt-0.5 tracking-tight">Map (M)</span>
        </button>

        <button
          onClick={onOpenNeeds}
          className="flex flex-col items-center px-3 py-1 rounded-xl hover:bg-white/10 active:scale-95 text-slate-200 hover:text-amber-400 transition-all cursor-pointer"
        >
          <Smile className="w-4 h-4 text-amber-400" />
          <span className="text-[9px] font-black uppercase mt-0.5 tracking-tight">Sims Needs</span>
        </button>

        <button
          onClick={onOpenPhone}
          className="flex flex-col items-center px-3 py-1 rounded-xl hover:bg-white/10 active:scale-95 text-slate-200 hover:text-blue-400 transition-all cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span className="text-[9px] font-black uppercase mt-0.5 tracking-tight">Phone (Tab)</span>
        </button>

        <button
          onClick={onOpenInventory}
          className="flex flex-col items-center px-3 py-1 rounded-xl hover:bg-white/10 active:scale-95 text-slate-200 hover:text-purple-400 transition-all cursor-pointer"
        >
          <Package className="w-4 h-4 text-purple-400" />
          <span className="text-[9px] font-black uppercase mt-0.5 tracking-tight">Bag (I)</span>
        </button>
      </div>
    </div>
  );
};
