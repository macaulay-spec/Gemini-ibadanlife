import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { PlayerAvatar, OutfitType, HairType } from '../types/game';

interface CharacterCustomizerModalProps {
  initialAvatar: PlayerAvatar;
  onSave: (avatar: PlayerAvatar) => void;
  onClose?: () => void;
}

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  initialAvatar,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialAvatar.name);
  const [skinTone, setSkinTone] = useState(initialAvatar.skinTone);
  const [outfit, setOutfit] = useState<OutfitType>(initialAvatar.outfit);
  const [hair, setHair] = useState<HairType>(initialAvatar.hair);
  const [clothColor, setClothColor] = useState(initialAvatar.clothColor);
  const [accessory, setAccessory] = useState<'sunglasses' | 'coral_beads' | 'none'>(initialAvatar.accessory);

  const skinTones = ['#3d2314', '#4a2c1b', '#5c3826', '#6e4529', '#8a5a36'];
  const clothColors = ['#1e3a8a', '#059669', '#d97706', '#b91c1c', '#18181b', '#7c3aed'];

  const handleConfirm = () => {
    onSave({
      name: name.trim() || 'Babatunde',
      skinTone,
      outfit,
      hair,
      clothColor,
      accessory,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto select-none">
      <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="text-center pb-4 border-b border-white/10">
          <div className="inline-flex p-2 rounded-2xl bg-amber-500/10 text-amber-400 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-100">Character & Attire Setup</h2>
          <p className="text-xs text-slate-400 mt-0.5">Customize your resident avatar for Ibadan city</p>
        </div>

        <div className="py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Resident Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Babatunde, Adebayo, Chioma"
              className="w-full mt-1.5 bg-slate-950 border border-white/15 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white outline-none focus:border-amber-400"
            />
          </div>

          {/* Skin Tone */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Skin Tone</label>
            <div className="flex gap-3 mt-1.5">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSkinTone(tone)}
                  className={`w-9 h-9 rounded-full transition-all border-2 ${
                    skinTone === tone ? 'scale-110 border-amber-400 shadow-lg' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>
          </div>

          {/* Outfit Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Traditional & Modern Attire</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {[
                { id: 'agbada', label: 'Grand Agbada Kaftan' },
                { id: 'ankara_shirt', label: 'Ankara Casual Shirt' },
                { id: 'street_hoodie', label: 'Streetwear Hoodie' },
                { id: 'casual_tshirt', label: 'Campus T-Shirt' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setOutfit(opt.id as OutfitType)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                    outfit === opt.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cloth Color */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Fabric Color</label>
            <div className="flex gap-3 mt-1.5">
              {clothColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setClothColor(color)}
                  className={`w-8 h-8 rounded-full transition-all border-2 ${
                    clothColor === color ? 'scale-110 border-white shadow-lg' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Hair & Headwear */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Hair & Headpiece</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {[
                { id: 'cap_fila', label: 'Traditional Fila Cap' },
                { id: 'fade', label: 'Clean Fade Haircut' },
                { id: 'afro', label: 'Classic Afro' },
                { id: 'dreads', label: 'Street Dreads' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setHair(opt.id as HairType)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                    hair === opt.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950/60 border-white/10 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Accessories</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {[
                { id: 'coral_beads', label: 'Coral Beads' },
                { id: 'sunglasses', label: 'Sunglasses' },
                { id: 'none', label: 'None' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAccessory(opt.id as 'sunglasses' | 'coral_beads' | 'none')}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    accessory === opt.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950/60 border-white/10 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-white/10 flex gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs active:scale-95"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-2xl text-sm shadow-xl flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Enter Ibadan City
          </button>
        </div>
      </div>
    </div>
  );
};
