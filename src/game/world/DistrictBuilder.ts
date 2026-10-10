import * as THREE from 'three';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  height: number;
}

export interface LandmarkLocation {
  name: string;
  type: string;
  x: number;
  z: number;
  color: string;
}

/**
 * Kenney City / Urban Modular Kit World Builder (Images 1 & 2)
 * Clean modular roads, zebra crosswalks, highway overpasses, pastel/terracotta buildings,
 * manicured lawns, water fountain plazas, and iconic Ibadan landmarks!
 */
export class DistrictBuilder {
  public scene: THREE.Scene;
  public collisionBoxes: CollisionBox[] = [];
  public landmarks: LandmarkLocation[] = [];
  public interactiveHotspots: Array<{
    id: string;
    type: string;
    label: string;
    subLabel: string;
    x: number;
    z: number;
    radius: number;
  }> = [];

  // Kenney Color Palette Materials
  private matRoad: THREE.MeshStandardMaterial;
  private matRoadLine: THREE.MeshBasicMaterial;
  private matZebraLine: THREE.MeshBasicMaterial;
  private matSidewalk: THREE.MeshStandardMaterial;
  private matLawn: THREE.MeshStandardMaterial;
  private matLawnBorder: THREE.MeshStandardMaterial;
  private matWallOrange: THREE.MeshStandardMaterial;
  private matWallTeal: THREE.MeshStandardMaterial;
  private matWallPurple: THREE.MeshStandardMaterial;
  private matWallWhite: THREE.MeshStandardMaterial;
  private matRoofTerracotta: THREE.MeshStandardMaterial;
  private matRoofTeal: THREE.MeshStandardMaterial;
  private matRoofIbadanBrown: THREE.MeshStandardMaterial;
  private matWindowDark: THREE.MeshStandardMaterial;
  private matTreePine: THREE.MeshStandardMaterial;
  private matTreeTrunk: THREE.MeshStandardMaterial;
  private matWater: THREE.MeshStandardMaterial;
  private matConcretePillar: THREE.MeshStandardMaterial;
  private matStreetLamp: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Kenney Matte PBR Materials
    this.matRoad = new THREE.MeshStandardMaterial({
      color: 0x333842, // Clean dark charcoal asphalt
      roughness: 0.75,
      metalness: 0.1,
    });

    this.matRoadLine = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.matZebraLine = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.matSidewalk = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Clean light gray curb/sidewalk
      roughness: 0.65,
    });

    this.matLawn = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7, // Vibrant pastel mint green grass
      roughness: 0.8,
    });

    this.matLawnBorder = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.8,
    });

    this.matWallOrange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    this.matWallTeal = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.6 });
    this.matWallPurple = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.6 });
    this.matWallWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });

    this.matRoofTerracotta = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.5 });
    this.matRoofTeal = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.5 });
    this.matRoofIbadanBrown = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.5 });

    this.matWindowDark = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8,
    });

    this.matTreePine = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
    this.matTreeTrunk = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    this.matWater = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8 });
    this.matConcretePillar = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    this.matStreetLamp = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
  }

  public buildDistrict() {
    this.buildGroundAndKenneyRoads();
    this.buildElevatedHighwayFlyover();
    this.buildCityPlazaAndFountain();
    this.buildModularKenneyBuildings();
    this.buildUIGateMonument();
    this.buildBodijaMarketHub();
    this.buildLawnParksAndTrees();
    this.buildStreetFurniture();
  }

  private addCollision(x: number, z: number, width: number, depth: number, height = 5) {
    this.collisionBoxes.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
      height,
    });
  }

  /**
   * 1. Ground & Kenney Modular Road Network with Zebra Crossings
   */
  private buildGroundAndKenneyRoads() {
    // Vast clean slate baseplate
    const baseGeo = new THREE.PlaneGeometry(600, 600);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e222a, roughness: 0.9 });
    const ground = new THREE.Mesh(baseGeo, baseMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Main Avenue (North-South, Z: -220 to 220, Width: 18m)
    const mainRoadGeo = new THREE.PlaneGeometry(18, 440);
    const mainRoad = new THREE.Mesh(mainRoadGeo, this.matRoad);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0, 0);
    this.scene.add(mainRoad);

    // Center Dashed White Lines
    const dashGeo = new THREE.PlaneGeometry(0.4, 3.5);
    for (let z = -200; z <= 200; z += 7) {
      const dash = new THREE.Mesh(dashGeo, this.matRoadLine);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.015, z);
      this.scene.add(dash);
    }

    // Sidewalk slabs with raised bevel
    [-10.2, 10.2].forEach((xSide) => {
      const swGeo = new THREE.BoxGeometry(2.4, 0.25, 440);
      const sw = new THREE.Mesh(swGeo, this.matSidewalk);
      sw.position.set(xSide, 0.125, 0);
      this.scene.add(sw);
    });

    // Crossroad 1 (Bodija Market Avenue at Z = -40, Width: 16m)
    const cross1Geo = new THREE.PlaneGeometry(360, 16);
    const cross1 = new THREE.Mesh(cross1Geo, this.matRoad);
    cross1.rotation.x = -Math.PI / 2;
    cross1.position.set(0, 0.005, -40);
    this.scene.add(cross1);

    // Crossroad 2 (Ventura / Sango Avenue at Z = 110, Width: 16m)
    const cross2Geo = new THREE.PlaneGeometry(360, 16);
    const cross2 = new THREE.Mesh(cross2Geo, this.matRoad);
    cross2.rotation.x = -Math.PI / 2;
    cross2.position.set(0, 0.005, 110);
    this.scene.add(cross2);

    // Zebra Crossings at Intersections (Iconic Kenney detail)
    [-40, 110].forEach((zPos) => {
      // North & South zebra crossings
      [-10, 10].forEach((offsetZ) => {
        for (let x = -7; x <= 7; x += 1.8) {
          const zStripe = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 3.2), this.matZebraLine);
          zStripe.rotation.x = -Math.PI / 2;
          zStripe.position.set(x, 0.02, zPos + offsetZ);
          this.scene.add(zStripe);
        }
      });

      // East & West zebra crossings
      [-10, 10].forEach((offsetX) => {
        for (let z = -6; z <= 6; z += 1.8) {
          const zStripe = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.0), this.matZebraLine);
          zStripe.rotation.x = -Math.PI / 2;
          zStripe.position.set(offsetX, 0.02, zPos + z);
          this.scene.add(zStripe);
        }
      });
    });
  }

  /**
   * 2. Elevated Highway Overpass (Flyover like Image 1 & 2)
   */
  private buildElevatedHighwayFlyover() {
    // Sango / Mokola Flyover inspired elevated curved ramp
    const bridgeY = 6.5;
    const bridgeGeo = new THREE.BoxGeometry(14, 0.8, 160);
    const bridge = new THREE.Mesh(bridgeGeo, this.matRoad);
    bridge.position.set(50, bridgeY, 60);
    bridge.rotation.y = 0.35;
    this.scene.add(bridge);

    // Guard rails
    [-7.2, 7.2].forEach((side) => {
      const railGeo = new THREE.BoxGeometry(0.4, 1.1, 160);
      const rail = new THREE.Mesh(railGeo, this.matConcretePillar);
      rail.position.set(50 + side * Math.cos(0.35), bridgeY + 0.6, 60 - side * Math.sin(0.35));
      rail.rotation.y = 0.35;
      this.scene.add(rail);
    });

    // Concrete Support Piers
    for (let i = -60; i <= 60; i += 30) {
      const px = 50 + Math.sin(0.35) * i;
      const pz = 60 + Math.cos(0.35) * i;

      const pierGeo = new THREE.CylinderGeometry(0.8, 0.9, bridgeY, 12);
      const pier = new THREE.Mesh(pierGeo, this.matConcretePillar);
      pier.position.set(px, bridgeY / 2, pz);
      this.scene.add(pier);
      this.addCollision(px, pz, 2, 2, bridgeY);
    }
  }

  /**
   * 3. City Plaza & Water Fountain (Image 1)
   */
  private buildCityPlazaAndFountain() {
    const plazaX = 35;
    const plazaZ = -110;

    // Stepped circular plaza
    const plazaGeo = new THREE.CylinderGeometry(15, 15, 0.3, 24);
    const plaza = new THREE.Mesh(plazaGeo, this.matSidewalk);
    plaza.position.set(plazaX, 0.15, plazaZ);
    this.scene.add(plaza);

    // Circular Fountain Basin
    const basinGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.9, 20);
    const basin = new THREE.Mesh(basinGeo, this.matConcretePillar);
    basin.position.set(plazaX, 0.6, plazaZ);
    this.scene.add(basin);
    this.addCollision(plazaX, plazaZ, 11, 11, 2);

    // Water Surface
    const waterGeo = new THREE.CylinderGeometry(4.8, 4.8, 0.1, 20);
    const water = new THREE.Mesh(waterGeo, this.matWater);
    water.position.set(plazaX, 0.95, plazaZ);
    this.scene.add(water);

    // Center fountain nozzle / spray column
    const nozzleGeo = new THREE.CylinderGeometry(0.4, 0.5, 2.4, 12);
    const nozzle = new THREE.Mesh(nozzleGeo, this.matWater);
    nozzle.position.set(plazaX, 1.8, plazaZ);
    this.scene.add(nozzle);
  }

  /**
   * 4. Modular Kenney Buildings (Images 1 & 2)
   */
  private buildModularKenneyBuildings() {
    // Row of colorful modular houses & apartment blocks
    const buildingConfigs = [
      // West Side (Agbowo Commercial Strip)
      { x: -35, z: -80, w: 12, h: 9, d: 14, wall: this.matWallOrange, roof: this.matRoofTerracotta, type: 'commercial' },
      { x: -35, z: -55, w: 14, h: 12, d: 14, wall: this.matWallPurple, roof: this.matRoofTeal, type: 'apartments' },
      { x: -35, z: -25, w: 12, h: 8, d: 12, wall: this.matWallWhite, roof: this.matRoofIbadanBrown, type: 'buka' },
      { x: -35, z: 0, w: 14, h: 11, d: 14, wall: this.matWallTeal, roof: this.matRoofTerracotta, type: 'hostel' },
      { x: -35, z: 25, w: 12, h: 8, d: 12, wall: this.matWallOrange, roof: this.matRoofTeal, type: 'shops' },

      // East Side (Bodija Residential & Offices)
      { x: 35, z: -10, w: 14, h: 10, d: 14, wall: this.matWallTeal, roof: this.matRoofIbadanBrown, type: 'duplex' },
      { x: 35, z: 20, w: 12, h: 8, d: 12, wall: this.matWallWhite, roof: this.matRoofTerracotta, type: 'residential' },
      { x: 35, z: 45, w: 14, h: 12, d: 14, wall: this.matWallOrange, roof: this.matRoofTeal, type: 'apartments' },
      { x: 35, z: 80, w: 16, h: 14, d: 16, wall: this.matWallPurple, roof: this.matRoofIbadanBrown, type: 'plaza' },
    ];

    buildingConfigs.forEach((cfg) => {
      // Main block
      const bodyGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const body = new THREE.Mesh(bodyGeo, cfg.wall);
      body.position.set(cfg.x, cfg.h / 2, cfg.z);
      body.castShadow = true;
      this.scene.add(body);
      this.addCollision(cfg.x, cfg.z, cfg.w + 0.5, cfg.d + 0.5, cfg.h);

      // Pitched or Beveled Roof (Kenney style)
      const roofGeo = new THREE.ConeGeometry(cfg.w * 0.72, 3.2, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, cfg.roof);
      roof.position.set(cfg.x, cfg.h + 1.6, cfg.z);
      this.scene.add(roof);

      // Inset dark windows on facades
      const winGeo = new THREE.BoxGeometry(0.1, 1.6, 1.4);
      [-cfg.w / 2 - 0.05, cfg.w / 2 + 0.05].forEach((wx) => {
        for (let y = 3; y < cfg.h; y += 3.5) {
          for (let zOffset = -cfg.d / 3; zOffset <= cfg.d / 3; zOffset += cfg.d / 3) {
            const win = new THREE.Mesh(winGeo, this.matWindowDark);
            win.position.set(cfg.x + wx, y, cfg.z + zOffset);
            this.scene.add(win);
          }
        }
      });
    });

    // Hotspot - Agbowo Student Hostel
    this.interactiveHotspots.push({
      id: 'hotspot_agbowo_hostel',
      type: 'home',
      label: 'Agbowo Student Lodge',
      subLabel: 'Rent Room with Bed & Wardrobe (₦15,000/wk)',
      x: -24,
      z: 0,
      radius: 5,
    });

    // Hotspot - Amala Skye Buka
    this.interactiveHotspots.push({
      id: 'hotspot_amala_buka',
      type: 'buka',
      label: 'Amala Skye & Buka Kitchen',
      subLabel: 'Eat hot Amala, Ewedu & Gbegiri to restore 100% Energy',
      x: -24,
      z: -25,
      radius: 5,
    });

    // Hotspot - Bodija Duplex Residence
    this.interactiveHotspots.push({
      id: 'hotspot_bodija_duplex_home',
      type: 'home',
      label: 'New Bodija 2-Bed Flat',
      subLabel: 'Rent duplex with compound parking (₦60,000/wk)',
      x: 24,
      z: 20,
      radius: 5,
    });
  }

  /**
   * 5. University of Ibadan (UI) Premier Entrance Monument
   */
  private buildUIGateMonument() {
    const baseZ = -170;
    this.landmarks.push({
      name: 'UI Main Gate',
      type: 'landmark',
      x: 0,
      z: baseZ,
      color: '#3b82f6',
    });

    // Blue & White Arch Columns
    [-8, 8].forEach((px) => {
      const colGeo = new THREE.BoxGeometry(3, 9, 3);
      const col = new THREE.Mesh(colGeo, this.matWallPurple);
      col.position.set(px, 4.5, baseZ);
      this.scene.add(col);
      this.addCollision(px, baseZ, 3.5, 3.5, 9);
    });

    // Arch Beam
    const beamGeo = new THREE.BoxGeometry(19, 2.2, 2.6);
    const beam = new THREE.Mesh(beamGeo, this.matWallWhite);
    beam.position.set(0, 9.5, baseZ);
    this.scene.add(beam);

    // Clocktower
    const towerGeo = new THREE.BoxGeometry(4.2, 22, 4.2);
    const tower = new THREE.Mesh(towerGeo, this.matWallWhite);
    tower.position.set(0, 11, baseZ - 35);
    this.scene.add(tower);
    this.addCollision(0, baseZ - 35, 5, 5, 22);

    // Clockface
    const clockGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 16);
    clockGeo.rotateX(Math.PI / 2);
    const clock = new THREE.Mesh(clockGeo, this.matRoadLine);
    clock.position.set(0, 19, baseZ - 32.8);
    this.scene.add(clock);

    // UI Taxi Rank Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_ui_gate_taxi',
      type: 'job',
      label: 'UI Taxi Rank Dispatch',
      subLabel: 'Pick up campus students & professors heading to Bodija',
      x: -6,
      z: baseZ + 15,
      radius: 5.5,
    });
  }

  /**
   * 6. Bodija Wholesale Food Market Hub (Iconic Ibadan Sheds)
   */
  private buildBodijaMarketHub() {
    const marketX = 60;
    const marketZ = -40;

    this.landmarks.push({
      name: 'Bodija Market',
      type: 'market',
      x: marketX,
      z: marketZ,
      color: '#f59e0b',
    });

    // Clean market concrete pad
    const padGeo = new THREE.BoxGeometry(80, 0.25, 75);
    const pad = new THREE.Mesh(padGeo, this.matSidewalk);
    pad.position.set(marketX, 0.125, marketZ);
    this.scene.add(pad);

    // Rows of clean modular sheds with terracotta / brown roofs
    for (let r = -22; r <= 22; r += 15) {
      for (let c = 35; c <= 85; c += 16) {
        const shedGeo = new THREE.BoxGeometry(8, 3.2, 7);
        const shed = new THREE.Mesh(shedGeo, this.matWallOrange);
        shed.position.set(c, 1.6, marketZ + r);
        this.scene.add(shed);
        this.addCollision(c, marketZ + r, 8.5, 7.5, 3.5);

        const roofGeo = new THREE.ConeGeometry(5.8, 2.0, 4);
        roofGeo.rotateY(Math.PI / 4);
        const roof = new THREE.Mesh(roofGeo, this.matRoofIbadanBrown);
        roof.position.set(c, 4.2, marketZ + r);
        this.scene.add(roof);

        // Crates
        const crateGeo = new THREE.BoxGeometry(1.4, 1.0, 1.4);
        const crate = new THREE.Mesh(crateGeo, this.matRoofTerracotta);
        crate.position.set(c - 3, 0.5, marketZ + r + 3);
        this.scene.add(crate);
      }
    }

    // Market Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_bodija_market_trader',
      type: 'market_stall',
      label: 'Bodija Market Foodstuffs',
      subLabel: 'Buy wholesale rice, yam, palm oil & cold drinks',
      x: 35,
      z: marketZ,
      radius: 5,
    });

    this.interactiveHotspots.push({
      id: 'hotspot_bodija_yam_porter_job',
      type: 'job',
      label: 'Yam Crate Porter Gig',
      subLabel: 'Load & haul heavy food sacks for instant ₦ Cash',
      x: 48,
      z: marketZ - 18,
      radius: 5,
    });
  }

  /**
   * 7. Stepped Lawn Parks & Low-Poly Trees (Image 1 & 2)
   */
  private buildLawnParksAndTrees() {
    // Stepped green grass islands
    const lawnPositions = [
      { x: -55, z: -110, w: 28, d: 35 },
      { x: 55, z: -110, w: 26, d: 32 },
      { x: -55, z: 65, w: 30, d: 35 },
      { x: 55, z: 140, w: 32, d: 38 },
    ];

    lawnPositions.forEach((l) => {
      // Stepped lawn slab
      const lawnGeo = new THREE.BoxGeometry(l.w, 0.28, l.d);
      const lawn = new THREE.Mesh(lawnGeo, this.matLawn);
      lawn.position.set(l.x, 0.14, l.z);
      this.scene.add(lawn);

      // Low-poly Pine & Round Trees on lawns (like Kenney)
      for (let i = 0; i < 4; i++) {
        const tx = l.x - l.w / 3 + (i % 2) * (l.w * 0.6);
        const tz = l.z - l.d / 3 + Math.floor(i / 2) * (l.d * 0.6);

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.5, 8);
        const trunk = new THREE.Mesh(trunkGeo, this.matTreeTrunk);
        trunk.position.set(tx, 1.25, tz);
        this.scene.add(trunk);
        this.addCollision(tx, tz, 1.2, 1.2, 4);

        // Cone Pine Foliage
        const coneGeo = new THREE.ConeGeometry(2.2, 4.2, 7);
        const cone = new THREE.Mesh(coneGeo, this.matTreePine);
        cone.position.set(tx, 4.2, tz);
        this.scene.add(cone);
      }
    });
  }

  /**
   * 8. Street Furniture (Streetlamps, Suya Spot, ATM)
   */
  private buildStreetFurniture() {
    // Streetlamps along main road
    for (let z = -180; z <= 180; z += 30) {
      [-10.2, 10.2].forEach((xSide) => {
        const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8);
        const pole = new THREE.Mesh(poleGeo, this.matStreetLamp);
        pole.position.set(xSide, 3.75, z);
        this.scene.add(pole);

        const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 1.2), this.matSidewalk);
        lampHead.position.set(xSide + (xSide > 0 ? -0.4 : 0.4), 7.4, z);
        this.scene.add(lampHead);
      });
    }

    // Suya Spot
    const suyaX = -12;
    const suyaZ = 20;
    const cartGeo = new THREE.BoxGeometry(2.4, 1.1, 1.4);
    const cart = new THREE.Mesh(cartGeo, this.matWallOrange);
    cart.position.set(suyaX, 0.55, suyaZ);
    this.scene.add(cart);
    this.addCollision(suyaX, suyaZ, 2.8, 1.8, 1.5);

    const suyaLight = new THREE.PointLight(0xff4400, 2.5, 9);
    suyaLight.position.set(suyaX, 1.6, suyaZ);
    this.scene.add(suyaLight);

    this.interactiveHotspots.push({
      id: 'hotspot_suya_night_spot',
      type: 'suya',
      label: 'Alhaji Suya Night Grill',
      subLabel: 'Spicy beef suya with sliced onions (₦1,500)',
      x: suyaX,
      z: suyaZ,
      radius: 4.5,
    });

    // ATM Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_fuel_atm',
      type: 'atm',
      label: 'Kuda & Opay ATM Terminal',
      subLabel: 'Deposit or withdraw ₦ Naira cash anytime',
      x: 12,
      z: -10,
      radius: 4.5,
    });
  }
}
