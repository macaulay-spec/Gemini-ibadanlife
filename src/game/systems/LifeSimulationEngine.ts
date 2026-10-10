import {
  PlayerAvatar,
  PlayerStats,
  InventoryItem,
  RentedHome,
  JobMission,
} from '../../types/game';
import { sounds } from '../audio/soundManager';

const STORAGE_KEY = 'ibadan_life_player_save_v1';

export class LifeSimulationEngine {
  public avatar: PlayerAvatar = {
    name: 'Babatunde',
    skinTone: '#4a2c1b',
    outfit: 'agbada',
    hair: 'cap_fila',
    clothColor: '#1e3a8a',
    accessory: 'coral_beads',
  };

  public stats: PlayerStats = {
    cash: 25000, // ₦25,000 starting pocket money
    bank: 150000, // ₦150,000 in Kuda/Opay account
    health: 100,
    respect: 45,
    wantedLevel: 0,

    // Lagos Life & The Sims 6 Core Character Needs
    hunger: 85, // 0 - 100 (100 is full, 0 is starving)
    energy: 90, // 0 - 100 (100 is well rested, 0 is exhausted)
    fun: 80, // 0 - 100 (100 is joyful, 0 is bored)
    social: 75, // 0 - 100 (100 is connected, 0 is lonely)
    hygiene: 90, // 0 - 100 (100 is fresh, 0 is dirty)
    bladder: 95, // 0 - 100 (100 is relieved, 0 is urgent)

    // 4D Dynamic World & Time
    moodlet: 'Vibing along Bodija & UI Axis',
    generatorFuel: 65, // 65% tank
    nepaGridActive: true, // Grid power ON
    gameHour: 14.5, // 2:30 PM afternoon
  };

  public inventory: InventoryItem[] = [
    {
      id: 'pure_water_pack',
      name: 'Chilled Pure Water',
      category: 'drink',
      price: 100,
      quantity: 4,
      description: 'Refreshing sachet water from Bodija cold room',
      energyBonus: 12,
    },
    {
      id: 'suya_wrap',
      name: 'Spicy Beef Suya',
      category: 'food',
      price: 1500,
      quantity: 1,
      description: 'Hot suya wrapped in newsprint with sliced onions and yaji pepper',
      energyBonus: 35,
    },
  ];

  public homes: RentedHome[] = [
    {
      id: 'home_agbowo',
      name: 'Agbowo Student Lodge',
      district: 'Agbowo (UI Gate Axis)',
      address: 'No. 14 University Crescent, Agbowo',
      rentPerDay: 2500,
      isRented: false,
      rentDueTimestamp: 0,
      furniture: ['Foam Mattress', 'Study Table', 'Standing Fan'],
    },
    {
      id: 'home_bodija',
      name: 'New Bodija 2-Bed Luxury Flat',
      district: 'New Bodija Housing Estate',
      address: 'Plot 8 Ladoke Akintola Avenue, Bodija',
      rentPerDay: 8500,
      isRented: false,
      rentDueTimestamp: 0,
      furniture: ['King Bed', 'Leather Sofa', 'LG Smart TV', 'Inverter Battery', 'Soundbar'],
    },
  ];

  public activeJob: JobMission | null = null;
  public availableJobs: JobMission[] = [];

  // Market Goods Catalog
  public marketCatalog: Array<{
    id: string;
    name: string;
    category: 'food' | 'drink' | 'clothing' | 'tool' | 'luxury';
    price: number;
    description: string;
    energyBonus?: number;
    respectBonus?: number;
  }> = [
    {
      id: 'amala_plate',
      name: 'Hot Amala & Gbegiri / Ewedu',
      category: 'food',
      price: 1400,
      description: 'Piping hot fluffy amala with goat meat from Mama Put buka',
      energyBonus: 50,
    },
    {
      id: 'jollof_party',
      name: 'Smoky Party Jollof & Dodo',
      category: 'food',
      price: 2200,
      description: 'Firewood jollof rice served with fried plantain and chicken',
      energyBonus: 65,
    },
    {
      id: 'malt_bottle',
      name: 'Chilled Malta Guinness',
      category: 'drink',
      price: 600,
      description: 'Ice-cold nourishing malt drink',
      energyBonus: 25,
    },
    {
      id: 'fila_cap_red',
      name: 'Embroidered Fila Gobi Cap',
      category: 'clothing',
      price: 4500,
      description: 'Hand-woven Yoruba traditional headpiece',
      respectBonus: 10,
    },
    {
      id: 'coral_bead_royal',
      name: 'Royal Oyo Coral Neck Beads',
      category: 'luxury',
      price: 16000,
      description: 'Polished red coral stones signifying prestige and street respect',
      respectBonus: 25,
    },
    {
      id: 'generator_small',
      name: 'Tiger 950W Generator ("I Pass My Neighbour")',
      category: 'tool',
      price: 65000,
      description: 'Compact petrol generator to power lights and soundbar during outages',
      respectBonus: 20,
    },
  ];

  constructor() {
    this.loadState();
    this.generateFreshJobs();
  }

  public generateFreshJobs() {
    this.availableJobs = [
      {
        id: 'job_taxi_1',
        title: 'UI Student Taxi Run',
        type: 'taxi_fare',
        clientName: 'Dr. Adeleke (UI Lecturer)',
        pickupDistrict: 'UI Main Gate',
        pickupPos: [-7, 0, -164],
        dropoffDistrict: 'Bodija Market',
        dropoffPos: [35, 0, -40],
        rewardCash: 4500,
        rewardRespect: 15,
        timeLimitSec: 180,
        status: 'available',
        description: 'Drop university lecturer and his research papers at Bodija market depot safely.',
      },
      {
        id: 'job_taxi_2',
        title: 'Ventura Mall Night Ride',
        type: 'taxi_fare',
        clientName: 'Funmi & Tobi',
        pickupDistrict: 'Ventura Plaza',
        pickupPos: [-45, 0, 100],
        dropoffDistrict: 'New Bodija Estate',
        dropoffPos: [65, 0, 160],
        rewardCash: 6200,
        rewardRespect: 20,
        timeLimitSec: 210,
        status: 'available',
        description: 'Fast private ride from cinema lounge to residential compound.',
      },
      {
        id: 'job_yam_porter',
        title: 'Bodija Market Yam Crate Haul',
        type: 'yam_delivery',
        clientName: 'Iya Moria (Market Elder)',
        pickupDistrict: 'Bodija Loading Bay',
        pickupPos: [48, 0, -58],
        dropoffDistrict: 'Amala Skye Buka',
        dropoffPos: [-28, 0, -22],
        rewardCash: 3800,
        rewardRespect: 12,
        timeLimitSec: 150,
        status: 'available',
        description: 'Offload and deliver freshly harvested Abuja yams to the buka restaurant.',
      },
    ];
  }

  // Accept a Job
  public acceptJob(jobId: string): boolean {
    const job = this.availableJobs.find((j) => j.id === jobId);
    if (!job) return false;
    job.status = 'active';
    this.activeJob = job;
    sounds.playInteract();
    this.saveState();
    return true;
  }

  // Complete active job
  public completeActiveJob(): { cash: number; respect: number } | null {
    if (!this.activeJob) return null;
    const reward = {
      cash: this.activeJob.rewardCash,
      respect: this.activeJob.rewardRespect,
    };

    this.stats.cash += reward.cash;
    this.stats.respect = Math.min(100, this.stats.respect + reward.respect);
    this.stats.energy = Math.max(10, this.stats.energy - 15);
    this.activeJob.status = 'completed';
    this.activeJob = null;

    sounds.playCashSound();
    this.generateFreshJobs();
    this.saveState();
    return reward;
  }

  // Buy Item from Bodija Market
  public buyItem(catalogId: string, qty = 1): { success: boolean; message: string } {
    const item = this.marketCatalog.find((i) => i.id === catalogId);
    if (!item) return { success: false, message: 'Item not found' };

    const totalCost = item.price * qty;
    if (this.stats.cash < totalCost) {
      return { success: false, message: `Insufficient ₦ Cash! You need ₦${totalCost.toLocaleString()}` };
    }

    this.stats.cash -= totalCost;
    sounds.playCashSound();

    if (item.respectBonus) {
      this.stats.respect = Math.min(100, this.stats.respect + item.respectBonus);
    }

    // Add to inventory
    const existing = this.inventory.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.inventory.push({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: qty,
        description: item.description,
        energyBonus: item.energyBonus,
      });
    }

    this.saveState();
    return { success: true, message: `Purchased ${item.name} for ₦${totalCost.toLocaleString()}!` };
  }

  // Use / Consume Inventory Item
  public consumeItem(itemId: string): { success: boolean; message: string } {
    const itemIndex = this.inventory.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return { success: false, message: 'Item not in inventory' };

    const item = this.inventory[itemIndex];
    if (item.energyBonus) {
      this.stats.energy = Math.min(100, this.stats.energy + item.energyBonus);
    }

    item.quantity -= 1;
    if (item.quantity <= 0) {
      this.inventory.splice(itemIndex, 1);
    }

    sounds.playInteract();
    this.saveState();
    return { success: true, message: `Consumed ${item.name}! Restored Energy.` };
  }

  // Bank Deposit & Withdrawal
  public bankDeposit(amount: number): boolean {
    if (amount <= 0 || this.stats.cash < amount) return false;
    this.stats.cash -= amount;
    this.stats.bank += amount;
    sounds.playCashSound();
    this.saveState();
    return true;
  }

  public bankWithdraw(amount: number): boolean {
    if (amount <= 0 || this.stats.bank < amount) return false;
    this.stats.bank -= amount;
    this.stats.cash += amount;
    sounds.playCashSound();
    this.saveState();
    return true;
  }

  // Rent Property
  public rentHome(homeId: string): { success: boolean; message: string } {
    const home = this.homes.find((h) => h.id === homeId);
    if (!home) return { success: false, message: 'Property not found' };
    if (home.isRented) return { success: false, message: 'Already rented!' };

    const upfrontRent = home.rentPerDay * 7; // 1 week rent upfront
    if (this.stats.bank < upfrontRent && this.stats.cash < upfrontRent) {
      return { success: false, message: `Insufficient funds! Need ₦${upfrontRent.toLocaleString()} for 1 week rent.` };
    }

    if (this.stats.bank >= upfrontRent) {
      this.stats.bank -= upfrontRent;
    } else {
      this.stats.cash -= upfrontRent;
    }

    home.isRented = true;
    home.rentDueTimestamp = Date.now() + 7 * 86400000;
    this.stats.respect = Math.min(100, this.stats.respect + 20);

    sounds.playCashSound();
    this.saveState();
    return { success: true, message: `Successfully rented ${home.name}! Key collected.` };
  }

  // Sleep in rented home (Restores 100% Energy & Health)
  public sleepAndRest(): { success: boolean; message: string } {
    const hasRentedHome = this.homes.some((h) => h.isRented);
    if (!hasRentedHome) {
      return { success: false, message: 'You need to rent a room or apartment in Bodija first!' };
    }

    this.stats.energy = 100;
    this.stats.health = 100;
    this.stats.moodlet = 'Fully Rested from Deep Sleep';
    if (this.stats.wantedLevel > 0) {
      this.stats.wantedLevel = Math.max(0, this.stats.wantedLevel - 1);
    }

    sounds.playInteract();
    this.saveState();
    return { success: true, message: 'Deep sleep refreshed your energy and health to 100%!' };
  }

  // Lagos Life Needs Replenish Actions
  public takeShower(): { success: boolean; message: string } {
    this.stats.hygiene = 100;
    this.stats.moodlet = 'Sparkling Clean & Fresh!';
    sounds.playInteract();
    this.saveState();
    return { success: true, message: 'Took a refreshing bath! Hygiene restored to 100%.' };
  }

  public useRestroom(): { success: boolean; message: string } {
    this.stats.bladder = 100;
    this.stats.moodlet = 'Relieved & Comfortable';
    sounds.playInteract();
    this.saveState();
    return { success: true, message: 'Used the restroom. Bladder relieved!' };
  }

  public haveFun(activityName: string): { success: boolean; message: string } {
    this.stats.fun = Math.min(100, this.stats.fun + 35);
    this.stats.moodlet = `Enjoying ${activityName}!`;
    sounds.playInteract();
    this.saveState();
    return { success: true, message: `Had a blast with ${activityName}! Fun boosted.` };
  }

  public socialize(): { success: boolean; message: string } {
    this.stats.social = Math.min(100, this.stats.social + 30);
    this.stats.respect = Math.min(100, this.stats.respect + 2);
    this.stats.moodlet = 'Bantering with Bodija locals';
    sounds.playInteract();
    this.saveState();
    return { success: true, message: 'Chatted with Ibadan friends. Social meter refilled!' };
  }

  public buyGeneratorFuel(): { success: boolean; message: string } {
    const cost = 4500;
    if (this.stats.cash < cost && this.stats.bank < cost) {
      return { success: false, message: 'Need ₦4,500 for 5L petrol at Bovas station!' };
    }
    if (this.stats.cash >= cost) {
      this.stats.cash -= cost;
    } else {
      this.stats.bank -= cost;
    }
    this.stats.generatorFuel = 100;
    sounds.playCashSound();
    this.saveState();
    return { success: true, message: 'Filled 5L jerrycan with Bovas petrol! Generator ready.' };
  }

  public toggleNepaGrid(): boolean {
    this.stats.nepaGridActive = !this.stats.nepaGridActive;
    if (!this.stats.nepaGridActive) {
      this.stats.moodlet = 'NEPA don take light! Generator roaring!';
    } else {
      this.stats.moodlet = 'Up NEPA! Grid light restored!';
    }
    sounds.playInteract();
    this.saveState();
    return this.stats.nepaGridActive;
  }

  // 4D Dynamic Needs Decay & Time Advancement Loop
  public tickNeeds(dt: number) {
    // 1 real minute = 1 game hour, dt is in seconds
    const hourDelta = dt / 60;
    this.stats.gameHour = (this.stats.gameHour + hourDelta) % 24;

    // Slow natural decay rates (similar to Lagos Life / The Sims)
    this.stats.hunger = Math.max(0, this.stats.hunger - dt * 0.04);
    this.stats.energy = Math.max(0, this.stats.energy - dt * 0.025);
    this.stats.fun = Math.max(0, this.stats.fun - dt * 0.03);
    this.stats.social = Math.max(0, this.stats.social - dt * 0.02);
    this.stats.hygiene = Math.max(0, this.stats.hygiene - dt * 0.015);
    this.stats.bladder = Math.max(0, this.stats.bladder - dt * 0.035);

    // Health drops if starving
    if (this.stats.hunger <= 0) {
      this.stats.health = Math.max(10, this.stats.health - dt * 0.2);
    }
  }

  // Wanted Level trigger & settlement
  public addCrimeInfraction(stars = 1) {
    this.stats.wantedLevel = Math.min(5, this.stats.wantedLevel + stars);
    sounds.playPoliceSiren();
    this.saveState();
  }

  public payBribeOrFine(): { success: boolean; message: string } {
    if (this.stats.wantedLevel === 0) return { success: false, message: 'No active police wanted record!' };
    const fine = this.stats.wantedLevel * 5000;
    if (this.stats.cash < fine) {
      return { success: false, message: `Need ₦${fine.toLocaleString()} cash to settle police record!` };
    }

    this.stats.cash -= fine;
    this.stats.wantedLevel = 0;
    sounds.playCashSound();
    this.saveState();
    return { success: true, message: `Paid ₦${fine.toLocaleString()} fine. Police record cleared!` };
  }

  // Save & Load
  public saveState() {
    try {
      const data = {
        avatar: this.avatar,
        stats: this.stats,
        inventory: this.inventory,
        homes: this.homes,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Local storage resilience
    }
  }

  public loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.avatar) this.avatar = parsed.avatar;
        if (parsed.stats) this.stats = parsed.stats;
        if (parsed.inventory) this.inventory = parsed.inventory;
        if (parsed.homes) this.homes = parsed.homes;
      }
    } catch {
      // Safe fallback
    }
  }
}
