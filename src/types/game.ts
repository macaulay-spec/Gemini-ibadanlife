export type OutfitType = 'agbada' | 'ankara_shirt' | 'street_hoodie' | 'casual_tshirt';
export type HairType = 'fade' | 'afro' | 'dreads' | 'cap_fila';
export type VehicleType = 'micra_taxi' | 'okada_bike' | 'danfo_bus';

export interface PlayerAvatar {
  name: string;
  skinTone: string; // hex
  outfit: OutfitType;
  hair: HairType;
  clothColor: string; // hex
  accessory: 'sunglasses' | 'coral_beads' | 'none';
}

export interface PlayerStats {
  cash: number;
  bank: number;
  health: number; // 0 - 100
  respect: number; // 0 - 100
  wantedLevel: number; // 0 - 5

  // Lagos Life & The Sims 6 Core Character Needs
  hunger: number; // 0 - 100 (100 is full, 0 is starving)
  energy: number; // 0 - 100 (100 is well rested, 0 is exhausted)
  fun: number; // 0 - 100 (100 is joyful, 0 is bored)
  social: number; // 0 - 100 (100 is connected, 0 is lonely)
  hygiene: number; // 0 - 100 (100 is squeaky clean, 0 is messy)
  bladder: number; // 0 - 100 (100 is relieved, 0 is critical)

  // 4D Dynamic World & Naija Realities
  moodlet: string;
  generatorFuel: number; // 0 - 100%
  nepaGridActive: boolean; // true = Light dey, false = NEPA don take light!
  gameHour: number; // 0 - 24 hours
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'drink' | 'clothing' | 'tool' | 'luxury';
  price: number;
  quantity: number;
  description: string;
  energyBonus?: number;
  hungerBonus?: number;
}

export interface RentedHome {
  id: string;
  name: string;
  district: string;
  address: string;
  rentPerDay: number;
  isRented: boolean;
  rentDueTimestamp: number;
  furniture: string[];
}

export interface VehicleInstance {
  id: string;
  type: VehicleType;
  name: string;
  plate: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  speed: number;
  isPlayerVehicle: boolean;
  isOccupied: boolean;
  fuel: number; // 0 - 100
  health: number; // 0 - 100
  color: string;
}

export interface JobMission {
  id: string;
  title: string;
  type: 'taxi_fare' | 'yam_delivery' | 'mama_put' | 'dispatch';
  clientName: string;
  pickupDistrict: string;
  pickupPos: [number, number, number];
  dropoffDistrict: string;
  dropoffPos: [number, number, number];
  rewardCash: number;
  rewardRespect: number;
  timeLimitSec: number;
  status: 'available' | 'active' | 'completed' | 'failed';
  description: string;
}

export interface InteractionPrompt {
  id: string;
  type: 'vehicle' | 'market_stall' | 'job' | 'home' | 'atm' | 'buka' | 'suya';
  title: string;
  subtitle: string;
  actionKey: string;
  distance: number;
  targetId?: string;
}

export interface RemotePlayer {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  isDriving: boolean;
  drivingVehicleId?: string;
  avatar: PlayerAvatar;
  lastSeen: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}
