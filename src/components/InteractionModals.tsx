import React, { useState } from 'react';
import { X, Utensils, ShoppingBag, Bed, CreditCard, Sparkles, Home } from 'lucide-react';
import { LifeSimulationEngine } from '../game/systems/LifeSimulationEngine';

interface InteractionModalProps {
  type: 'market_stall' | 'buka' | 'home' | 'atm' | 'suya';
  engine: LifeSimulationEngine;
  onClose: () => void;
  onRefresh: () => void;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  type,
  engine,
  onClose,
  onRefresh,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    onRefresh();
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto select-none">
      <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-2xl p-5 text-slate-100 flex flex-col max-h-[85vh]">
        {/* Feedback alert */}
        {feedback && (
          <div className="mb-3 bg-amber-500 text-slate-950 font-bold text-xs p-2.5 rounded-xl text-center shadow-lg animate-fade-in">
            {feedback}
          </div>
        )}

        {/* 1. BUKA EATERY (AMALA SKYE) */}
        {type === 'buka' && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Amala Skye & Buka Kitchen</h3>
                  <p className="text-[11px] text-amber-400">"E kaabo! Hot fluffy Amala, Ewedu & Gbegiri ready!"</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 flex-1 overflow-y-auto">
              <div className="bg-slate-950/70 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Piping Hot Amala + Goat Meat</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Ewedu, gbegiri soup, fresh pepper stew</p>
                  <span className="text-xs font-mono font-bold text-emerald-400 mt-1 inline-block">₦1,400</span>
                </div>
                <button
                  onClick={() => {
                    const res = engine.buyItem('amala_plate');
                    if (res.success) {
                      engine.stats.energy = 100;
                      notify('Ate hot Amala! Restored 100% Energy.');
                    } else {
                      notify(res.message);
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Eat Now
                </button>
              </div>

              <div className="bg-slate-950/70 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Firewood Jollof & Fried Chicken</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Smoky party rice with plantain (dodo)</p>
                  <span className="text-xs font-mono font-bold text-emerald-400 mt-1 inline-block">₦2,200</span>
                </div>
                <button
                  onClick={() => {
                    const res = engine.buyItem('jollof_party');
                    if (res.success) {
                      engine.stats.energy = 100;
                      notify('Delicious Jollof! Restored 100% Energy.');
                    } else {
                      notify(res.message);
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Eat Now
                </button>
              </div>
            </div>
          </>
        )}

        {/* 2. SUYA NIGHT SPOT */}
        {type === 'suya' && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Alhaji Suya Night Grill</h3>
                  <p className="text-[11px] text-amber-400">"Hot spicy beef suya from the charcoal embers!"</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="bg-slate-950/70 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Spicy Beef Suya Wrap</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Sliced tender beef, yaji spice, onion rings</p>
                  <span className="text-xs font-mono font-bold text-emerald-400 mt-1 inline-block">₦1,500</span>
                </div>
                <button
                  onClick={() => {
                    if (engine.stats.cash < 1500) {
                      notify('Need ₦1,500 cash for Suya!');
                      return;
                    }
                    engine.stats.cash -= 1500;
                    engine.stats.energy = Math.min(100, engine.stats.energy + 45);
                    notify('Ate fresh hot Suya! Restored Energy.');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Buy Suya
                </button>
              </div>
            </div>
          </>
        )}

        {/* 3. BODIJA MARKET STALL */}
        {type === 'market_stall' && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Bodija Market Trader Stall</h3>
                  <p className="text-[11px] text-amber-300">"Customer daadaa! Wetin you wan buy today?"</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 flex-1 overflow-y-auto">
              {engine.marketCatalog.map((item) => (
                <div key={item.id} className="bg-slate-950/70 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.description}</p>
                    <span className="text-xs font-mono font-bold text-amber-400 mt-0.5 inline-block">₦{item.price.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      const res = engine.buyItem(item.id);
                      notify(res.message);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-md whitespace-nowrap"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 4. RENTED HOME INTERIOR / SLEEP */}
        {type === 'home' && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Bodija Residence / Apartment</h3>
                  <p className="text-[11px] text-slate-400">Safehouse, rest, and energy replenishment</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {engine.homes.some((h) => h.isRented) ? (
                <>
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">Your Rented Bodija Flat</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        Fuel: {engine.stats.generatorFuel}% · {engine.stats.nepaGridActive ? 'Grid Power' : 'Genny'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const res = engine.sleepAndRest();
                          notify(res.message);
                        }}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Bed className="w-4 h-4" />
                        Sleep (100% Energy)
                      </button>

                      <button
                        onClick={() => {
                          const res = engine.takeShower();
                          notify(res.message);
                        }}
                        className="py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        Take Shower (Hygiene)
                      </button>

                      <button
                        onClick={() => {
                          const res = engine.useRestroom();
                          notify(res.message);
                        }}
                        className="py-2.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                      >
                        Restroom (Bladder)
                      </button>

                      <button
                        onClick={() => {
                          const res = engine.buyGeneratorFuel();
                          notify(res.message);
                        }}
                        className="py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                      >
                        Fuel Genny (₦4,500)
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-white/10 p-2.5 rounded-2xl text-[11px] text-slate-400">
                    Compound Features: Water Tank, Security Gate, Safe Parking, Mikano Generator.
                  </div>
                </>
              ) : (
                <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl space-y-3 text-center">
                  <p className="text-xs text-slate-300">
                    You have not rented this property yet! Rent a flat in New Bodija or Agbowo lodge to unlock a safehouse, sleep, and shower.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const res = engine.rentHome('home_bodija');
                        notify(res.message);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
                    >
                      Rent Bodija 2-Bed Duplex Flat (₦60,000/wk)
                    </button>
                    <button
                      onClick={() => {
                        const res = engine.rentHome('home_agbowo');
                        notify(res.message);
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
                    >
                      Rent Budget Agbowo Student Room (₦17,500/wk)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* 5. ATM CASH TERMINAL */}
        {type === 'atm' && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Kuda & Opay ATM Terminal</h3>
                  <p className="text-[11px] text-slate-400">24/7 Cash deposit and cashout</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-4 rounded-2xl border border-blue-500/30">
                <div className="text-xs text-blue-200">Bank Account Balance</div>
                <div className="text-2xl font-black text-white font-mono mt-1">₦{engine.stats.bank.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 mt-1">Pocket Cash: ₦{engine.stats.cash.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    if (engine.bankWithdraw(10000)) notify('Withdrew ₦10,000 cash!');
                    else notify('Insufficient bank balance!');
                  }}
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Withdraw ₦10,000
                </button>
                <button
                  onClick={() => {
                    if (engine.bankDeposit(10000)) notify('Deposited ₦10,000 into Bank!');
                    else notify('Insufficient pocket cash!');
                  }}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Deposit ₦10,000
                </button>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs active:scale-95"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
