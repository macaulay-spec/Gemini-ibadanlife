import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Briefcase,
  Home,
  ShoppingBag,
  MessageSquare,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  BatteryCharging,
  Wifi,
  ChevronLeft,
} from 'lucide-react';
import { LifeSimulationEngine } from '../game/systems/LifeSimulationEngine';
import { ChatMessage } from '../types/game';

interface NaijaPhoneProps {
  engine: LifeSimulationEngine;
  chatLog: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export const NaijaPhone: React.FC<NaijaPhoneProps> = ({
  engine,
  chatLog,
  onSendMessage,
  onClose,
}) => {
  const [activeApp, setActiveApp] = useState<'home' | 'bank' | 'jobs' | 'property' | 'market' | 'chat'>('home');
  const [chatInput, setChatInput] = useState('');
  const [bankAmount, setBankAmount] = useState('5000');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeposit = () => {
    const val = parseInt(bankAmount, 10);
    if (isNaN(val) || val <= 0) return;
    if (engine.bankDeposit(val)) {
      showToast(`Deposited ₦${val.toLocaleString()} to Kuda/Opay!`);
    } else {
      showToast('Insufficient cash on hand!');
    }
  };

  const handleWithdraw = () => {
    const val = parseInt(bankAmount, 10);
    if (isNaN(val) || val <= 0) return;
    if (engine.bankWithdraw(val)) {
      showToast(`Withdrew ₦${val.toLocaleString()} cash from Bank!`);
    } else {
      showToast('Insufficient bank balance!');
    }
  };

  const handleAcceptJob = (jobId: string) => {
    if (engine.acceptJob(jobId)) {
      showToast('Hustle Accepted! Check mini-map waypoint.');
      onClose();
    }
  };

  const handleRentProperty = (homeId: string) => {
    const res = engine.rentHome(homeId);
    showToast(res.message);
  };

  const handleBuyItem = (itemId: string) => {
    const res = engine.buyItem(itemId);
    showToast(res.message);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm pointer-events-auto select-none">
      {/* Phone Shell */}
      <div className="relative w-full max-w-sm h-[580px] sm:h-[640px] bg-slate-950 border-4 border-slate-800 rounded-[44px] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Dynamic Island / Notch & Top Bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-400 bg-slate-950/80">
          <span className="font-mono font-bold text-slate-200">14:35</span>
          <div className="w-20 h-4 bg-black rounded-full" />
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Toast alert banner */}
        {toastMsg && (
          <div className="absolute top-12 left-4 right-4 bg-amber-500 text-slate-950 font-bold text-xs p-2.5 rounded-xl shadow-lg z-50 animate-fade-in text-center">
            {toastMsg}
          </div>
        )}

        {/* Header App Bar */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-white/10 bg-slate-900/60">
          {activeApp !== 'home' ? (
            <button
              onClick={() => setActiveApp('home')}
              className="flex items-center gap-1 text-xs text-amber-400 font-semibold active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              NaijaPhone OS
            </span>
          )}

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* HOME SCREEN */}
          {activeApp === 'home' && (
            <div className="flex flex-col h-full justify-between py-2">
              <div>
                {/* Balance Widget */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-white/10 rounded-2xl p-4 shadow-lg mb-6">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Net Balance (₦ Naira)
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1 tabular-nums">
                    ₦{(engine.stats.cash + engine.stats.bank).toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-400 pt-3 border-t border-white/10">
                    <span>Cash: ₦{engine.stats.cash.toLocaleString()}</span>
                    <span>Bank: ₦{engine.stats.bank.toLocaleString()}</span>
                  </div>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveApp('bank')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 active:scale-95 border border-white/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Kuda Bank</span>
                  </button>

                  <button
                    onClick={() => setActiveApp('jobs')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 active:scale-95 border border-white/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-slate-950" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Bolt Hustle</span>
                  </button>

                  <button
                    onClick={() => setActiveApp('property')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 active:scale-95 border border-white/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">PropertyNG</span>
                  </button>

                  <button
                    onClick={() => setActiveApp('market')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 active:scale-95 border border-white/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">BodijaMart</span>
                  </button>

                  <button
                    onClick={() => setActiveApp('chat')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 active:scale-95 border border-white/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-6 h-6 text-slate-950" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">WakaChat</span>
                  </button>
                </div>
              </div>

              {/* Street Respect Rank */}
              <div className="bg-slate-900/50 border border-white/5 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Bodija Street Respect
                </span>
                <div className="text-sm font-bold text-amber-400 mt-0.5">
                  Level {Math.floor(engine.stats.respect / 20) + 1} · {engine.stats.respect}/100 RP
                </div>
              </div>
            </div>
          )}

          {/* 1. BANK APP */}
          {activeApp === 'bank' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 rounded-2xl border border-blue-500/30">
                <span className="text-xs text-blue-200 font-semibold">Available Bank Balance</span>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  ₦{engine.stats.bank.toLocaleString()}
                </div>
                <span className="text-[11px] text-blue-300">Pocket Cash: ₦{engine.stats.cash.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Transaction Amount (₦)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['2000', '5000', '15000', '50000'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBankAmount(amt)}
                      className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                        bankAmount === amt
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-900 border-white/10 text-slate-300'
                      }`}
                    >
                      ₦{parseInt(amt, 10).toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 px-3 py-2 rounded-xl text-sm font-mono text-white outline-none focus:border-blue-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDeposit}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  Deposit Cash
                </button>
                <button
                  onClick={handleWithdraw}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw Cash
                </button>
              </div>
            </div>
          )}

          {/* 2. JOBS / GIG APP */}
          {activeApp === 'jobs' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available Gigs in Bodija & UI
              </span>

              {engine.availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-white/10 p-3.5 rounded-2xl space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{job.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{job.description}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                      ₦{job.rewardCash.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5">
                    <span>Route: {job.pickupDistrict} ➔ {job.dropoffDistrict}</span>
                    <button
                      onClick={() => handleAcceptJob(job.id)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-lg transition-all"
                    >
                      Accept Ride
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. PROPERTY APP */}
          {activeApp === 'property' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Rental Listings in Ibadan North
              </span>

              {engine.homes.map((home) => (
                <div
                  key={home.id}
                  className="bg-slate-900 border border-white/10 p-3.5 rounded-2xl space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{home.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{home.address}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ₦{(home.rentPerDay * 7).toLocaleString()}
                      </span>
                      <div className="text-[9px] text-slate-500">/ week</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300">
                    Includes: {home.furniture.join(', ')}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {home.isRented ? 'Currently Rented by You' : 'Key available immediately'}
                    </span>
                    {!home.isRented ? (
                      <button
                        onClick={() => handleRentProperty(home.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md"
                      >
                        Rent 1 Wk
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400">Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. MARKET CATALOG APP */}
          {activeApp === 'market' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bodija Market Online Order
              </span>

              {engine.marketCatalog.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.description}</p>
                    <span className="text-xs font-mono font-bold text-amber-400 mt-1 inline-block">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyItem(item.id)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs rounded-lg shrink-0"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 5. WAKACHAT DISTRICT MESSAGING */}
          {activeApp === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
                {chatLog.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-xl text-xs ${
                      msg.isSystem
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                        : 'bg-slate-900 border border-white/5 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-slate-300">{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Quick phrases in Pidgin/Yoruba */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {['How far!', 'E kaabo!', 'Who dey market?', 'UI Gate now!'].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => onSendMessage(phrase)}
                    className="px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-[10px] text-slate-300 whitespace-nowrap active:scale-95"
                  >
                    {phrase}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type message to Bodija..."
                  className="flex-1 bg-slate-900 border border-white/15 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Home Navigation Indicator Bar */}
        <div className="py-2 flex justify-center bg-slate-950">
          <div
            onClick={() => setActiveApp('home')}
            className="w-28 h-1 bg-slate-600 rounded-full cursor-pointer hover:bg-slate-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
