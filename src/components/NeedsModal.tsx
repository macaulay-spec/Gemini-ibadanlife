import React from 'react';
import {
  X,
  Utensils,
  Battery,
  Smile,
  Users,
  Sparkles,
  Heart,
  Zap,
  Flame,
  Radio,
  Coffee,
  CheckCircle,
} from 'lucide-react';
import { LifeSimulationEngine } from '../game/systems/LifeSimulationEngine';

interface NeedsModalProps {
  engine: LifeSimulationEngine;
  onClose: () => void;
  onRefresh: () => void;
}

export const NeedsModal: React.FC<NeedsModalProps> = ({
  engine,
  onClose,
  onRefresh,
}) => {
  const stats = engine.stats;

  const handleEat = () => {
    // If player has food in inventory, consume it, else buy a quick hot amala/suya
    const food = engine.inventory.find((i) => i.category === 'food' || i.category === 'drink');
    if (food) {
      engine.consumeItem(food.id);
    } else {
      if (engine.stats.cash >= 1400) {
        engine.buyItem('amala_plate');
      } else {
        engine.stats.hunger = Math.min(100, engine.stats.hunger + 30);
        engine.stats.moodlet = 'Ate roasted plantain (Boli) on credit';
      }
    }
    onRefresh();
  };

  const handleRest = () => {
    engine.stats.energy = Math.min(100, engine.stats.energy + 40);
    engine.stats.moodlet = 'Took a quick power nap';
    engine.saveState();
    onRefresh();
  };

  const handleFun = () => {
    engine.haveFun('Afrobeats Street Groove');
    onRefresh();
  };

  const handleSocial = () => {
    engine.socialize();
    onRefresh();
  };

  const handleHygiene = () => {
    engine.takeShower();
    onRefresh();
  };

  const handleBladder = () => {
    engine.useRestroom();
    onRefresh();
  };

  const handleBuyFuel = () => {
    engine.buyGeneratorFuel();
    onRefresh();
  };

  const handleToggleNepa = () => {
    engine.toggleNepaGrid();
    onRefresh();
  };

  const getNeedColor = (val: number) => {
    if (val > 65) return 'bg-emerald-500 text-emerald-400';
    if (val > 30) return 'bg-amber-500 text-amber-400';
    return 'bg-red-500 text-red-400';
  };

  const needsList = [
    {
      id: 'hunger',
      label: 'Hunger',
      value: Math.round(stats.hunger),
      icon: Utensils,
      color: 'bg-amber-500',
      actionText: 'Eat Amala / Suya',
      onAction: handleEat,
      sub: stats.hunger > 60 ? 'Satisfied' : stats.hunger > 30 ? 'Peckish' : 'Starving!',
    },
    {
      id: 'energy',
      label: 'Energy',
      value: Math.round(stats.energy),
      icon: Battery,
      color: 'bg-emerald-500',
      actionText: 'Nap / Sleep',
      onAction: handleRest,
      sub: stats.energy > 60 ? 'Energetic' : stats.energy > 30 ? 'Drowsy' : 'Exhausted!',
    },
    {
      id: 'fun',
      label: 'Fun',
      value: Math.round(stats.fun),
      icon: Smile,
      color: 'bg-purple-500',
      actionText: 'Vibe to Radio',
      onAction: handleFun,
      sub: stats.fun > 60 ? 'Buzzing' : stats.fun > 30 ? 'Normal' : 'Bored!',
    },
    {
      id: 'social',
      label: 'Social',
      value: Math.round(stats.social),
      icon: Users,
      color: 'bg-blue-500',
      actionText: 'Banter with Locals',
      onAction: handleSocial,
      sub: stats.social > 60 ? 'Popular' : stats.social > 30 ? 'Okay' : 'Lonely!',
    },
    {
      id: 'hygiene',
      label: 'Hygiene',
      value: Math.round(stats.hygiene),
      icon: Sparkles,
      color: 'bg-teal-500',
      actionText: 'Take Bath / Wash',
      onAction: handleHygiene,
      sub: stats.hygiene > 60 ? 'Sparkling Clean' : stats.hygiene > 30 ? 'Needs Wash' : 'Smelly!',
    },
    {
      id: 'bladder',
      label: 'Bladder',
      value: Math.round(stats.bladder),
      icon: Coffee,
      color: 'bg-cyan-500',
      actionText: 'Use Restroom',
      onAction: handleBladder,
      sub: stats.bladder > 60 ? 'Comfortable' : stats.bladder > 30 ? 'Need Toilet' : 'Critical Urgent!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/40 shadow-lg">
              <img
                src="/src/assets/images/marcus_character_portrait_1791664295622.jpg"
                alt="Marcus"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-100">
                  MARCUS "KING" CARTER
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full">
                  Lagos Life Sim v2.0
                </span>
              </div>
              <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Heart className="w-3.5 h-3.5 fill-amber-400" />
                <span>Moodlet: <strong>{stats.moodlet}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 6 Lagos Life Needs Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Core Character Needs (6 Systems)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Decays with Time · Refill by Living
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {needsList.map((need) => {
                const Icon = need.icon;
                return (
                  <div
                    key={need.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200">{need.label}</div>
                          <div className="text-[10px] text-slate-400">{need.sub}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black tabular-nums text-slate-200">
                        {need.value}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${need.color}`}
                        style={{ width: `${Math.max(5, need.value)}%` }}
                      />
                    </div>

                    <button
                      onClick={need.onAction}
                      className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-xs font-bold text-slate-200 hover:text-white border border-white/5 transition-all shadow"
                    >
                      {need.actionText}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4D World & Dynamic Realities: NEPA, Time, Weather, Politics */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              4D Dynamic World & Nigerian Realities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NEPA Grid Power & Generator */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Electricity & NEPA</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      stats.nepaGridActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {stats.nepaGridActive ? 'Grid Power ON' : 'Blackout! Genny'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {stats.nepaGridActive
                    ? 'Bodija substation live. Streetlights & AC running smoothly.'
                    : 'NEPA cut light! Generator is keeping essentials powered.'}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleToggleNepa}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  >
                    {stats.nepaGridActive ? 'Simulate Blackout' : 'Up NEPA (Restore)'}
                  </button>
                </div>
              </div>

              {/* Generator Fuel Tank */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Generator Petrol</span>
                  <span className="text-xs font-mono font-black text-amber-400">
                    {Math.round(stats.generatorFuel)}% Tank
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${stats.generatorFuel}%` }}
                  />
                </div>
                <button
                  onClick={handleBuyFuel}
                  className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow transition-all"
                >
                  Buy 5L Bovas Petrol (₦4,500)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
