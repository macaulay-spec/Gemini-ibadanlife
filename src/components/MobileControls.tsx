import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Car,
  Volume2,
  Footprints,
  Map,
  Smile,
  Smartphone,
} from 'lucide-react';

interface MobileControlsProps {
  isDriving: boolean;
  canEnterVehicle: boolean;
  onDirectionInput: (dx: number, dy: number) => void;
  onSprintToggle: (sprinting: boolean) => void;
  onJumpOrBrake: () => void;
  onVehicleToggle: () => void;
  onHorn: () => void;
  onOpenMap: () => void;
  onOpenNeeds?: () => void;
  onOpenPhone?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  isDriving,
  canEnterVehicle,
  onDirectionInput,
  onSprintToggle,
  onJumpOrBrake,
  onVehicleToggle,
  onHorn,
  onOpenMap,
  onOpenNeeds,
  onOpenPhone,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const activePointerId = useRef<number | null>(null);

  // Directional button helpers
  const handleButtonDir = (forward: number, strafe: number, e?: React.PointerEvent) => {
    if (e) e.stopPropagation();
    onDirectionInput(strafe, forward);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointerId.current = e.pointerId;
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isDragging || !joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = rect.width / 2 - 12;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Normalize: -1 to 1. Note: deltaY is positive downwards, so forward is negative deltaY!
    const normX = knobX / maxRadius;
    const normY = -knobY / maxRadius;

    onDirectionInput(normX, normY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    activePointerId.current = null;
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onDirectionInput(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 font-sans">
      {/* 1. LEFT CONTROLS: DUAL ANALOG JOYSTICK & D-PAD */}
      <div className="absolute bottom-24 left-4 pointer-events-auto flex items-end gap-3">
        {/* Floating Virtual 360 Analog Thumbpad */}
        <div
          ref={joystickRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-36 h-36 rounded-full bg-slate-950/80 backdrop-blur-md border-2 border-amber-500/30 shadow-2xl flex items-center justify-center touch-none cursor-grab active:cursor-grabbing hover:border-amber-400 transition-colors"
        >
          {/* Outer ring guidelines */}
          <div className="absolute inset-3 rounded-full border border-dashed border-white/10" />
          <div className="absolute text-[9px] font-black uppercase text-amber-500/60 tracking-wider">
            DRAG TO WALK
          </div>

          {/* Dynamic Draggable Knob */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-white/80 shadow-lg shadow-amber-500/40 flex items-center justify-center transform transition-transform"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Quick D-Pad Buttons for tap-based movement */}
        <div className="hidden sm:flex flex-col items-center gap-1 bg-slate-950/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl">
          <button
            onPointerDown={() => handleButtonDir(1, 0)}
            onPointerUp={() => handleButtonDir(0, 0)}
            className="w-9 h-9 rounded-xl bg-slate-800 active:bg-amber-500 text-slate-100 flex items-center justify-center shadow"
            title="Walk Forward (W)"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex gap-1">
            <button
              onPointerDown={() => handleButtonDir(0, -1)}
              onPointerUp={() => handleButtonDir(0, 0)}
              className="w-9 h-9 rounded-xl bg-slate-800 active:bg-amber-500 text-slate-100 flex items-center justify-center shadow"
              title="Step Left (A)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onPointerDown={() => handleButtonDir(-1, 0)}
              onPointerUp={() => handleButtonDir(0, 0)}
              className="w-9 h-9 rounded-xl bg-slate-800 active:bg-amber-500 text-slate-100 flex items-center justify-center shadow"
              title="Walk Backward (S)"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onPointerDown={() => handleButtonDir(0, 1)}
              onPointerUp={() => handleButtonDir(0, 0)}
              className="w-9 h-9 rounded-xl bg-slate-800 active:bg-amber-500 text-slate-100 flex items-center justify-center shadow"
              title="Step Right (D)"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. RIGHT ACTION BUTTON CLUSTER */}
      <div className="absolute bottom-20 right-4 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Drive Taxi Button */}
        {(canEnterVehicle || isDriving) && (
          <button
            onClick={onVehicleToggle}
            className="w-16 h-16 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-90 text-slate-950 font-black shadow-2xl flex flex-col items-center justify-center transition-all border-2 border-white/60 animate-bounce"
            title={isDriving ? 'Exit Micra Taxi' : 'Enter Micra Taxi'}
          >
            <Car className="w-7 h-7" />
            <span className="text-[10px] font-black -mt-0.5 uppercase tracking-tighter">
              {isDriving ? 'EXIT' : 'DRIVE'}
            </span>
          </button>
        )}

        {isDriving && (
          <button
            onClick={onHorn}
            className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-90 text-white shadow-xl flex items-center justify-center transition-all border border-white/30"
            title="Taxi Horn"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {/* Sprint / Turbo Pedal */}
          <button
            onPointerDown={() => onSprintToggle(true)}
            onPointerUp={() => onSprintToggle(false)}
            onPointerCancel={() => onSprintToggle(false)}
            className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-90 text-white font-bold shadow-2xl flex flex-col items-center justify-center transition-all border-2 border-white/30"
            title={isDriving ? 'Accelerate' : 'Sprint (Hold)'}
          >
            {isDriving ? <ArrowUp className="w-6 h-6" /> : <Footprints className="w-6 h-6" />}
            <span className="text-[9px] font-black uppercase tracking-tighter">
              {isDriving ? 'GAS' : 'SPRINT'}
            </span>
          </button>

          {/* Jump / Handbrake */}
          <button
            onClick={onJumpOrBrake}
            className="w-14 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-90 text-slate-100 font-black shadow-2xl flex flex-col items-center justify-center transition-all border-2 border-white/20"
          >
            <span className="text-xs font-black tracking-wider">
              {isDriving ? 'BRAKE' : 'JUMP'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
