# IBADAN LIFE — 3D Open-World Life Simulation Game

A mobile-first, browser-playable 3D open-world Nigerian life simulation set in the vibrant Bodija and University of Ibadan (UI) corridor of Ibadan, Oyo State. Built with high-fidelity WebGL 3D rendering, responsive dual-mode touch/keyboard controls, authentic Yoruba cultural urban geography, driveable vehicles, living economic loops, and a server-authoritative multiplayer roadmap.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core parameters were aligned during research and interview:

- **Primary Playable District**: **Bodija & UI Axis (Ibadan North)**. Anchored by the University of Ibadan Main Gate & Agbowo commercial strip, the bustling Bodija Wholesale Market, Ventura Mall corridor, Sango transport junction, and the quiet residential gated compounds of New Bodija.
- **Visual Aesthetic & Engine Target**: **High-Fidelity Realistic 3D (GTA-Style Urban Realism)** tailored specifically for mobile and desktop browser WebGL. Features physically calibrated standard materials, Ibadan's iconic "brown corrugated roofs", concrete open drainage gutters, electric poles with sagging wires, red laterite road verges, atmospheric tropical sunlight with warm dust haze, and dynamic day/night cycles.
- **Simulation Gameplay Scope**: **"Everything" — Full Interconnected Life Simulation**:
  1. *Hustle & Economy*: Drive iconic blue-and-yellow Nissan Micra taxis, deliver yam/pepper crates in Bodija Market, run mama-put food buka stalls, earn Naira (₦).
  2. *Housing & Interior Living*: Rent student single-rooms in Agbowo or duplex apartments in Old Bodija, customize furniture, sleep/rest to restore energy.
  3. *Driveable Vehicles*: Functional player-controlled vehicles (Micra taxi, Okada motorcycle, delivery pickup) with realistic physics, entry/exit animations, passenger pickups, and fuel costs.
  4. *Street Reputation & Law*: Community vigilante / police wanted rating, traffic infractions, civic respect.
  5. *Multiplayer Architecture*: Real-time WebSocket room networking syncing player avatars, chat, vehicle passengers, and server-authoritative economy.

---

## 1. Ibadan Geographic Research & World Reference Plan

### A. Real-World Grounding & Spatial Reference
Ibadan is the historic capital of Oyo State and one of Africa's largest metropolitan hubs. The selected game world zone—the **Bodija & UI Corridor**—provides a rich cross-section of academic, commercial, high-density market, and residential Nigerian life:

| Sector / Zone | Real-World Coordinate / Anchor | In-Game Visual & Functional Identity |
| :--- | :--- | :--- |
| **UI Gate & Agbowo Strip** | UI Main Gate (Premier University, est. 1948) opposite Agbowo shopping complexes | Cyber cafes, print shops, student hostels, bookshops, roadside kiosk stalls, bustling student foot traffic. |
| **Bodija Market Hub** | Secretariat-UI Road / Bodija Wholesale Market | Thousands of timber and zinc sheds, towering yam sacks, pepper grinding stations, Danfo loading bays, heavy porter traffic. |
| **Ventura & Transit Strip** | UI-Secretariat Road near Samonda / Ventura Mall | Modern shopping plaza, gaming center, bank ATMs, fuel station (Bovas/Total), car wash. |
| **Sango Junction & Motor Park** | Sango Flyover & transit intersection | Chaotic traffic hub, yellow/green Danfo buses, blue/white Micra taxi park, Okada motorcycle ranks, roadside fruit stands. |
| **New Bodija Residential** | Aare Ave, Ladoke Akintola Ave compounds | High perimeter walls with broken glass/razor wire, black iron gates, generator sheds, quiet paved streets, mango & palm trees. |

### B. Urban Morphology & Cultural Details
- **The Brown Roofs of Ibadan**: Sloped hipped roofs with weathered red-brown corrugated zinc sheets reflecting Ibadan's famous poetic landscape.
- **Road Infrastructure**: Dual-carriageway main roads with concrete median barriers, laterite (red clay) unpaved shoulders, open drainage gutters (*koroba*) along sidewalks with concrete access slabs across shop fronts.
- **Street Furniture & Commerce**:
  - Tangled overhead transformer cables and leaning wooden/concrete NEPA electricity poles.
  - POS cash-out umbrellas (yellow MTN, red Airtel, green Glo branded kiosks).
  - Suya night spots with glowing coal embers and smoky iron grills.
  - "Mama Put" bukateria wooden benches serving hot amala, ewedu, and jollof rice.
  - Generator houses (*I better pass my neighbour* small generator sets humming outside shops).

---

## 2. User Experience & Visual Design

### A. Visual Identity & Palette
- **Dominant Canvas (60%)**: Warm asphalt gray (`#1E2229`), dusty sun-baked laterite red (`#8C4328`), weathered zinc rust (`#7C4A3A`), and off-white concrete plaster (`#D4D0C8`).
- **Structural Surfaces (30%)**: Dark frosted HUD backing (`rgba(15, 23, 42, 0.85)`), hairline slate borders (`border-white/10`), and deep charcoal card backgrounds.
- **High-Intent Accents (10%)**: Ibadan Micra Taxi Ochre (`#F59E0B`), Lagos-Ibadan Green Accent (`#10B981`), and Wanted / Danger Crimson (`#EF4444`).
- **Typography Pairing**:
  - *Display / Headings / HUD*: `Plus Jakarta Sans` (bold, athletic, geometric legibility).
  - *Data & Currency*: `font-mono tabular-nums` (clean alignment for ₦ Naira transactions, speedometer, meters, clock).

### B. Dual-Mode Input & Mobile Touch HUD
- **Mobile Touch Layout**:
  - *Left Thumb*: Floating virtual analogue joystick for smooth 360° walking and vehicle steering.
  - *Right Thumb*: Swipe-to-look camera orbital control + dynamic action diamond:
    - **Sprint / Turbo** (Hold to run or floor vehicle accelerator).
    - **Interact / Enter** (Contextual: Enter Micra, Talk to Trader, Eat Amala, Rent Room).
    - **Horn / Brake / Jump** (Contextual depending on on-foot vs driving state).
- **Desktop Keyboard Layout**:
  - `W / A / S / D` or Arrow Keys for movement and steering.
  - `Shift` to sprint, `Space` to jump / handbrake.
  - `E` or `F` to interact / enter vehicles.
  - Mouse click-and-drag for orbit camera, `C` to switch camera mode (First-Person, Chase Close, Chase Wide).
  - `M` for World Map, `Tab` for Inventory & Phone, `P` for Pause / Settings.

### C. In-Game Smartphone (NaijaPhone HUD)
A slide-up smartphone interface provides seamless access to life-sim functions without breaking 3D immersion:
- **Kuda/Opay Banking App**: Check balance, transfer funds, pay rent, view income history.
- **Hustle / Gig App (Bolt / O-Taxi)**: Accept taxi passenger fares or delivery orders across Bodija.
- **Property Finder**: View available rooms in Agbowo or apartments in Bodija, pay daily/weekly rent.
- **Autos & Wheels**: Purchase or service vehicles, track garage location.
- **WhatsApp / Chat**: Local district proximity chat and multiplayer player messaging.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Alternatives Considered |
| :--- | :--- | :--- |
| **3D Engine Architecture** | **Modular Three.js with Custom Shaders & Systems Pipeline** | Lightweight, ultra-fast initialization on mobile browsers (zero WebAssembly bloat, sub-second boot), complete control over draw calls, geometry instancing, mobile LOD, and touch raycasting. Far superior startup latency on Android compared to heavy monolithic engines. |
| **Physics & Collision** | **Spatial Voxel Grid & Raycast Vehicle Suspension Physics** | Full Rapier/PhysX engines degrade mobile frame rates on low-end Androids; a dedicated raycast suspension vehicle model with swept-sphere character collision achieves 60 FPS rock-solid stability while delivering authentic drifting, acceleration, and tactile collision. |
| **World Streaming & Performance** | **Distance-Based Chunk Streaming & Instanced Mesh Batching** | Bodija & UI axis is divided into $64\text{m} \times 64\text{m}$ grid sectors. Distant buildings share instanced geometry batches; props (streetlights, gutters, zinc roofs) are dynamically culled beyond visible frustum. |
| **Real Multiplayer Networking** | **Authoritative Node/Express WebSocket Server on Port 3000** | Clients send timestamped input vectors and intent messages; the backend validates transactions (Naira transfers, vehicle boarding, job completion) and broadcasts positional deltas to clients in the same district room. |
| **Persistence** | **Hybrid Server Storage with Local Cache Fallback** | Instant local progress retention with backend JSON/database state synchronization for player profile, wallet, owned properties, vehicle inventory, and street reputation. |

---

## 4. Technical Architecture & System Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                   IBADAN LIFE CLIENT ARCHITECTURE                     │
├────────────────────────────────┬───────────────────────────────────────┤
│         3D VIEWPORT CANVAS     │             2D HUD & UI LAYER         │
│  ┌──────────────────────────┐  │  ┌──────────────────────────┐         │
│  │ Three.js Scene & Camera  │  │  │ Mini-map & Compass Radar │         │
│  │ - PBR Nigerian Lighting  │  │  │ Status (₦, Energy, HP)   │         │
│  │ - Day/Night Atmosphere   │  │  │ Context Action Prompts   │         │
│  │ - Bodija & UI World Mesh │  │  │ Touch Joystick & Buttons │         │
│  │ - Instanced Street Props │  │  │ NaijaPhone Slide-up HUD  │         │
│  └─────────────▲────────────┘  │  └──────────▲───────────────┘         │
│                │                             │                         │
├────────────────┴─────────────────────────────┴─────────────────────────┤
│                    GAMEPLAY & SIMULATION SUBSYSTEMS                    │
│  ┌─────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│  │ Character & Vehicle │ │ Economy & Inventory  │ │ Life & Housing   │ │
│  │ Controller System   │ │ - Jobs (Taxi, Cargo) │ │ - Apartments     │ │
│  │ - On-Foot Mechanics │ │ - Market Shopping    │ │ - Furniture      │ │
│  │ - Micra Car Physics │ │ - Wallet & Banking   │ │ - Energy / Rest  │ │
│  └──────────▲──────────┘ └──────────▲───────────┘ └────────▲─────────┘ │
├─────────────┴───────────────────────┴──────────────────────┴───────────┤
│            NETWORK RECONCILIATION & LOCAL DATA ENGINE                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Real-time WebSocket Client (Room Sync, Remote Avatars, Chat)      │ │
│  │ State Persistence Store (Local Profile & Server Session Sync)     │ │
│  └──────────────────────────────────▲────────────────────────────────┘ │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ ws:// + http://api
┌─────────────────────────────────────▼──────────────────────────────────┐
│              SERVER-AUTHORITATIVE BACKEND (Node.js/Express)            │
│  - WebSocket Connection & Room Manager (/ws)                           │
│  - Player Session & Position Delta Broadcaster                         │
│  - Authoritative Transaction Validator (₦ Currency & Job Rewards)      │
│  - Persistent World & Player State Storage                             │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
```typescript
interface PlayerProfile {
  id: string;
  name: string;
  avatarStyle: {
    skinTone: string;
    outfit: 'agbada' | 'casual_tshirt' | 'street_hoodie' | 'ankara_shirt';
    hairStyle: 'fade' | 'afro' | 'dreads' | 'cap';
    accessory: 'sunglasses' | 'beads' | 'none';
  };
  stats: {
    cash: number;           // On-hand ₦ Naira
    bank: number;           // Bank account ₦ Naira
    energy: number;         // 0 - 100
    respect: number;        // Local Bodija street reputation (0 - 100)
    wantedLevel: number;    // 0 - 5 stars
  };
  housing: {
    rentedPropertyId: string | null;
    rentDueTimestamp: number;
    ownedFurniture: string[];
  };
  vehicles: {
    ownedVehicleIds: string[];
    currentVehicleId: string | null;
  };
  inventory: Array<{ id: string; name: string; quantity: number; category: string }>;
}
```

---

## 5. Phased Implementation Roadmap

1. **Phase 1 — Core 3D World Engine & Bodija Geography**:
   - Establish Three.js high-performance rendering loop with mobile retina DPI scaling, exponential atmospheric fog, and dynamic Nigerian golden-hour lighting.
   - Build connected 3D geometry of the Bodija & UI Corridor: dual-carriageway roads, Agbowo junction, UI Memorial Tower/Gate, Bodija Market stalls with rusty zinc roofs, sidewalks, open gutters, kiosks, and palm/neem trees.
   - Implement low-draw-call instanced meshes for streetlights, electric poles, and market crates.

2. **Phase 2 — Character Controller, Camera & Mobile Touch Inputs**:
   - Create fully customizable 3D character mesh with Nigerian outfit options (Agbada, Ankara casual, streetwear).
   - Implement responsive third-person camera with collision avoidance and smooth damping.
   - Build touch joystick and action controls for Android alongside complete WASD desktop keyboard controls.

3. **Phase 3 — Driveable Vehicles (The Iconic Ibadan Micra & Okada)**:
   - Construct 3D model and physics rig for the Ibadan Nissan Micra taxi (yellow/blue colors, roof carrier, taxi markings) and motorcycle.
   - Implement vehicle entry/exit, realistic steering, acceleration, braking, headlight toggles, and horn sound/visual effects.

4. **Phase 4 — Complete Life Simulation Loops ("Everything")**:
   - **Economy & Hustle**: Bolt taxi fare missions (picking up passengers at UI Gate, dropping off at Bodija Market or Ventura), porter yam crate delivery gigs at Bodija Market, and mama-put restaurant jobs.
   - **Shopping & Inventory**: Bodija Market vendor stalls, cold drink kiosks, and electronics shops where players buy items, food, and clothes.
   - **Housing & Interiors**: Rentable rooms in Agbowo and New Bodija with functional doors, beds to sleep/restore energy, and furniture placement.
   - **Street Law & Vigilante System**: Traffic and conduct rules, wanted stars, and civic consequences.
   - **NaijaPhone HUD**: Interactive slide-up smartphone with functional banking, gig, map, and property apps.

5. **Phase 5 — Full-Stack Multiplayer Server & Live Testing**:
   - Configure Express HTTP + WebSocket server on port 3000.
   - Broadcast live player avatar movements, chat bubbles, and shared taxi rides.
   - Comprehensive performance testing on mobile viewport dimensions, ensuring consistent 60 FPS and zero dead-click interactions.
