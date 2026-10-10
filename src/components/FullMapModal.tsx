import React from 'react';
import { X, MapPin, Navigation, Compass, Zap } from 'lucide-react';

interface FullMapModalProps {
  playerPos: { x: number; z: number };
  onFastTravel: (x: number, z: number) => void;
  onClose: () => void;
}

export const FullMapModal: React.FC<FullMapModalProps> = ({
  playerPos,
  onFastTravel,
  onClose,
}) => {
  // World bounds: X [-120, 120], Z [-220, 220]
  // SVG Canvas 600 x 800
  const worldToSvg = (x: number, z: number) => {
    const svgX = 300 + (x / 130) * 260;
    const svgY = 400 + (z / 230) * 360;
    return { x: svgX, y: svgY };
  };

  const landmarks = [
    {
      id: 'ui_gate',
      name: 'UI Main Gate & Campus',
      category: 'University',
      x: 0,
      z: -180,
      color: '#3b82f6',
      desc: 'Nigeria premier university entrance, clocktower & student taxi ranks',
    },
    {
      id: 'bodija_market',
      name: 'Bodija Wholesale Market',
      category: 'Market & Trade',
      x: 65,
      z: -40,
      color: '#f59e0b',
      desc: 'Iconic brown roofs, fresh yam sacks, pepper stalls & porter gigs',
    },
    {
      id: 'agbowo_strip',
      name: 'Agbowo Commercial Strip',
      category: 'Commercial',
      x: -55,
      z: -40,
      color: '#10b981',
      desc: 'Cyber cafes, printing press, student lodges & Amala Skye buka',
    },
    {
      id: 'ventura_mall',
      name: 'Ventura Plaza & Cinema',
      category: 'Entertainment',
      x: -65,
      z: 100,
      color: '#8b5cf6',
      desc: 'Modern shopping complex, cinema lounge & game center',
    },
    {
      id: 'bovas_fuel',
      name: 'Bovas Fuel Station & ATM',
      category: 'Services',
      x: 55,
      z: 85,
      color: '#ef4444',
      desc: '24/7 petrol pumps, mini-mart & Kuda/Opay cashout terminal',
    },
    {
      id: 'new_bodija',
      name: 'New Bodija Gated Estate',
      category: 'Residential',
      x: 70,
      z: 160,
      color: '#06b6d4',
      desc: 'Gated duplex compounds, generator houses & private rentals',
    },
  ];

  const playerSvg = worldToSvg(playerPos.x, playerPos.z);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md pointer-events-auto select-none">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-950 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-100">
                IBADAN METROPOLITAN MAP — BODIJA & UI AXIS
              </h2>
              <span className="text-xs text-amber-400 font-mono">
                Oyo State · Scale 1:1,000 · Live GPS Active
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Blueprint View */}
        <div className="relative flex-1 bg-[#10141d] overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 600 800" className="w-full h-full max-h-[65vh]">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="600" height="800" fill="url(#grid)" />

            {/* Main Corridor Highway (UI - Bodija - Secretariat Boulevard) */}
            <rect x="280" y="20" width="40" height="760" fill="#242830" rx="4" />
            <line x1="300" y1="20" x2="300" y2="780" stroke="#facc15" strokeWidth="2" strokeDasharray="10 10" />

            {/* Cross Avenues */}
            {/* Agbowo - Bodija Crossroad (Z = -40 -> Y ~ 337) */}
            <rect x="40" y="322" width="520" height="30" fill="#242830" rx="4" />
            <line x1="40" y1="337" x2="560" y2="337" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Sango - Ventura Crossroad (Z = 110 -> Y ~ 572) */}
            <rect x="40" y="557" width="520" height="30" fill="#242830" rx="4" />
            <line x1="40" y1="572" x2="560" y2="572" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Zone Districts Blobs */}
            {/* UI Campus Area */}
            <rect x="180" y="40" width="240" height="120" fill="rgba(59, 130, 246, 0.12)" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" rx="16" />
            <text x="300" y="105" fill="#93c5fd" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              UNIVERSITY OF IBADAN (PREMIER CAMPUS)
            </text>

            {/* Bodija Wholesale Market Area */}
            <rect x="360" y="270" width="210" height="150" fill="rgba(245, 158, 11, 0.14)" stroke="#f59e0b" strokeWidth="1.5" rx="16" />
            <text x="465" y="350" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              BODIJA WHOLESALE MARKET
            </text>
            <text x="465" y="368" fill="#d97706" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
              (BROWN ROOFS & YAM SHEDS)
            </text>

            {/* Agbowo Commercial Strip Area */}
            <rect x="40" y="270" width="200" height="150" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1.5" rx="16" />
            <text x="140" y="350" fill="#6ee7b7" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              AGBOWO COMMERCIAL STRIP
            </text>
            <text x="140" y="368" fill="#059669" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
              (STUDENT HOSTELS & BUKAS)
            </text>

            {/* Ventura & Fuel Strip */}
            <rect x="40" y="510" width="200" height="130" fill="rgba(139, 92, 246, 0.12)" stroke="#8b5cf6" strokeWidth="1.5" rx="16" />
            <text x="140" y="575" fill="#c4b5fd" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              VENTURA PLAZA & CINEMA
            </text>

            {/* New Bodija Residential Estate */}
            <rect x="360" y="600" width="210" height="150" fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="1.5" rx="16" />
            <text x="465" y="680" fill="#67e8f9" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              NEW BODIJA GATED ESTATE
            </text>

            {/* Map Click Area */}
            <rect
              width="600"
              height="800"
              fill="transparent"
              className="cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = ((e.clientX - rect.left) / rect.width) * 600;
                const clickY = ((e.clientY - rect.top) / rect.height) * 800;
                // Inverse worldToSvg:
                // svgX = 300 + (x / 130) * 260 => x = ((svgX - 300) / 260) * 130
                // svgY = 400 + (z / 230) * 360 => z = ((svgY - 400) / 360) * 230
                const targetWorldX = ((clickX - 300) / 260) * 130;
                const targetWorldZ = ((clickY - 400) / 360) * 230;
                onFastTravel(targetWorldX, targetWorldZ);
                onClose();
              }}
            />

            {/* Landmarks Pins */}
            {landmarks.map((lm) => {
              const pt = worldToSvg(lm.x, lm.z);
              return (
                <g
                  key={lm.id}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFastTravel(lm.x, lm.z);
                    onClose();
                  }}
                >
                  <circle cx={pt.x} cy={pt.y} r="14" fill={lm.color} fillOpacity="0.3" className="group-hover:scale-125 transition-transform" />
                  <circle cx={pt.x} cy={pt.y} r="7" fill={lm.color} stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={pt.x}
                    y={pt.y - 14}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    stroke="#000000"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    {lm.name}
                  </text>
                </g>
              );
            })}

            {/* LIVE PLAYER CURRENT LOCATION PIN */}
            <g transform={`translate(${playerSvg.x}, ${playerSvg.y})`}>
              <circle r="16" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
              <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              <polygon points="0,-14 5,-7 -5,-7" fill="#ffffff" />
              <text x="0" y="24" fill="#38bdf8" fontSize="11" fontWeight="black" textAnchor="middle" stroke="#000000" strokeWidth="3" paintOrder="stroke">
                YOU ARE HERE
              </text>
            </g>
          </svg>
        </div>

        {/* Bottom Fast Travel & Legend Bar */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Fast Travel:
            </span>
            {landmarks.map((lm) => (
              <button
                key={lm.id}
                onClick={() => {
                  onFastTravel(lm.x, lm.z);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 shrink-0 transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lm.color }} />
                <span>{lm.name}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono ml-auto">
            Press <strong className="text-amber-400">M</strong> anytime to toggle map
          </div>
        </div>
      </div>
    </div>
  );
};
