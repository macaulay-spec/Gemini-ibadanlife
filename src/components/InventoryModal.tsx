import React from 'react';
import { X, Package, ShieldAlert, Sparkles } from 'lucide-react';
import { LifeSimulationEngine } from '../game/systems/LifeSimulationEngine';

interface InventoryModalProps {
  engine: LifeSimulationEngine;
  onClose: () => void;
  onRefresh: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  engine,
  onClose,
  onRefresh,
}) => {
  const handleConsume = (itemId: string) => {
    engine.consumeItem(itemId);
    onRefresh();
  };

  const handlePayBribe = () => {
    engine.payBribeOrFine();
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto select-none">
      <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-2xl p-5 text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Pocket & Bag Inventory</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wanted Level Alert & Police Fine Settle */}
        {engine.stats.wantedLevel > 0 && (
          <div className="mt-3 bg-red-950/60 border border-red-500/40 p-3 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-200">
                  {engine.stats.wantedLevel} Star Police Wanted Record
                </div>
                <div className="text-[10px] text-red-300">
                  Fine: ₦{(engine.stats.wantedLevel * 5000).toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={handlePayBribe}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 whitespace-nowrap"
            >
              Settle Fine
            </button>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {engine.inventory.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Your bag is empty! Visit Bodija Market to buy food and supplies.
            </div>
          ) : (
            engine.inventory.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{item.name}</span>
                    <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  {item.energyBonus && (
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">
                      +{item.energyBonus}% Energy Boost
                    </span>
                  )}
                </div>

                {item.energyBonus && (
                  <button
                    onClick={() => handleConsume(item.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md whitespace-nowrap flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Use
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Cash on hand: <strong className="text-emerald-400 font-mono">₦{engine.stats.cash.toLocaleString()}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
