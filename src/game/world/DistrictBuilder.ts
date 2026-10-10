import * as THREE from 'three';
import { LandmarkLocation } from '../../types/game';
import { TextureGenerator } from '../textures/TextureGenerator';

export interface CollisionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  height: number;
}

/**
 * Authentic Ibadan Metropolitan World Builder
 * Faithfully captures southwestern Nigerian architecture:
 * - Weathered asphalt roads with drainage gutters and concrete pedestrian crossing slabs
 * - Famous rusty corrugated iron "brown roofs of Ibadan" with hipped eave rafters
 * - Gated residential compounds with sandcrete perimeter walls and black iron security gates
 * - Rooftop black GeePee water tanks on steel towers and backup generator houses
 * - Amala Skye Buka with open timber sheds, firewood hearths and plastic chairs
 * - Bodija wholesale market with yam sheds, produce baskets and porter barrows
 * - Bovas fuel station with fuel pumps, billboard and ATM cash terminal
 * - Concrete NEPA / IBEDC electric utility poles with transformers and overhead power lines
 * - University of Ibadan (UI) Premier Monument & Clocktower
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

  // PBR Authentic Materials
  private matRoad: THREE.MeshStandardMaterial;
  private matRoadLine: THREE.MeshBasicMaterial;
  private matZebraLine: THREE.MeshBasicMaterial;
  private matSidewalk: THREE.MeshStandardMaterial;
  private matGutter: THREE.MeshStandardMaterial;
  private matLateriteSoil: THREE.MeshStandardMaterial;
  private matWallSandcrete: THREE.MeshStandardMaterial;
  private matWallCream: THREE.MeshStandardMaterial;
  private matWallOchre: THREE.MeshStandardMaterial;
  private matRoofRustedIron: THREE.MeshStandardMaterial;
  private matSecurityGate: THREE.MeshStandardMaterial;
  private matWaterTank: THREE.MeshStandardMaterial;
  private matWoodTimber: THREE.MeshStandardMaterial;
  private matWindowDark: THREE.MeshStandardMaterial;
  private matTreeTrunk: THREE.MeshStandardMaterial;
  private matTreeLeaf: THREE.MeshStandardMaterial;
  private matConcretePole: THREE.MeshStandardMaterial;
  private matPowerCable: THREE.MeshBasicMaterial;
  private matGeneratorYellow: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // 1. Textures & Materials
    const texAsphalt = TextureGenerator.createAsphaltTexture();
    const texRoof = TextureGenerator.createRustyRoofTexture();
    const texWallSandcrete = TextureGenerator.createSandcreteWallTexture('#cfc5b0');
    const texWallCream = TextureGenerator.createSandcreteWallTexture('#e2dac9');
    const texWallOchre = TextureGenerator.createSandcreteWallTexture('#c9a27e');
    const texSoil = TextureGenerator.createLateriteSoilTexture();
    const texGate = TextureGenerator.createSecurityGateTexture();

    this.matRoad = new THREE.MeshStandardMaterial({
      map: texAsphalt,
      roughness: 0.8,
      metalness: 0.1,
    });

    this.matRoadLine = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.matZebraLine = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.matSidewalk = new THREE.MeshStandardMaterial({
      color: 0x9e978e, // Weathered concrete sidewalk slab
      roughness: 0.75,
    });

    this.matGutter = new THREE.MeshStandardMaterial({
      color: 0x3d3834, // Dark damp concrete drainage channel
      roughness: 0.85,
    });

    this.matLateriteSoil = new THREE.MeshStandardMaterial({
      map: texSoil,
      roughness: 0.95,
    });

    this.matWallSandcrete = new THREE.MeshStandardMaterial({
      map: texWallSandcrete,
      roughness: 0.75,
    });

    this.matWallCream = new THREE.MeshStandardMaterial({
      map: texWallCream,
      roughness: 0.75,
    });

    this.matWallOchre = new THREE.MeshStandardMaterial({
      map: texWallOchre,
      roughness: 0.75,
    });

    this.matRoofRustedIron = new THREE.MeshStandardMaterial({
      map: texRoof,
      roughness: 0.65,
      metalness: 0.25,
    });

    this.matSecurityGate = new THREE.MeshStandardMaterial({
      map: texGate,
      roughness: 0.45,
      metalness: 0.6,
    });

    this.matWaterTank = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Black cylindrical GeePee poly-tank
      roughness: 0.35,
    });

    this.matWoodTimber = new THREE.MeshStandardMaterial({
      color: 0x5c381e,
      roughness: 0.85,
    });

    this.matWindowDark = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.7,
    });

    this.matTreeTrunk = new THREE.MeshStandardMaterial({
      color: 0x4a2e1b,
      roughness: 0.9,
    });

    this.matTreeLeaf = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Tropical deep green foliage
      roughness: 0.75,
    });

    this.matConcretePole = new THREE.MeshStandardMaterial({
      color: 0x78716c,
      roughness: 0.7,
    });

    this.matPowerCable = new THREE.MeshBasicMaterial({
      color: 0x171717,
    });

    this.matGeneratorYellow = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.4,
      metalness: 0.5,
    });
  }

  public buildDistrict() {
    this.buildGroundAndRoadNetwork();
    this.buildUIGateMonument();
    this.buildResidentialCompounds();
    this.buildAmalaSkyeBuka();
    this.buildBodijaMarketHub();
    this.buildBovasPetrolStation();
    this.buildRoadsideKiosks();
    this.buildUtilityPolesAndCables();
    this.buildVegetationAndProps();
  }

  public addCollision(x: number, z: number, width: number, depth: number, height = 5) {
    this.collisionBoxes.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
      height,
    });
  }

  /**
   * 1. Ground, Connected Road Network, Drainage Channels & Kerbs
   */
  private buildGroundAndRoadNetwork() {
    // Large base ground with Nigerian laterite earth
    const baseGeo = new THREE.PlaneGeometry(600, 600);
    const ground = new THREE.Mesh(baseGeo, this.matLateriteSoil);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Main Asphalt Boulevard (UI - Bodija - Secretariat Axis: Z -230 to +230, Width 16m)
    const mainRoadGeo = new THREE.PlaneGeometry(16, 460);
    const mainRoad = new THREE.Mesh(mainRoadGeo, this.matRoad);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0, 0);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);

    // Center Dashed Yellow & White Lines
    const dashGeo = new THREE.PlaneGeometry(0.35, 4.0);
    for (let z = -210; z <= 210; z += 7.5) {
      const dash = new THREE.Mesh(dashGeo, this.matRoadLine);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.015, z);
      this.scene.add(dash);
    }

    // Cross-Junction Road at Z = -40 (Bodija Market - Agbowo Street: X -140 to +140, Width 14m)
    const crossRoadGeo = new THREE.PlaneGeometry(280, 14);
    const crossRoad = new THREE.Mesh(crossRoadGeo, this.matRoad);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(0, 0.005, -40);
    crossRoad.receiveShadow = true;
    this.scene.add(crossRoad);

    // Second Cross-Junction Road at Z = 100 (Ventura - Bovas Avenue)
    const crossRoad2Geo = new THREE.PlaneGeometry(280, 14);
    const crossRoad2 = new THREE.Mesh(crossRoad2Geo, this.matRoad);
    crossRoad2.rotation.x = -Math.PI / 2;
    crossRoad2.position.set(0, 0.005, 100);
    crossRoad2.receiveShadow = true;
    this.scene.add(crossRoad2);

    // Concrete Sidewalks and Open Drainage Channels (Gutters) along Main Avenue
    [-9.0, 9.0].forEach((xSide) => {
      // Open Drainage Gutter (0.8m wide, recessed into curb)
      const gutterGeo = new THREE.BoxGeometry(0.9, 0.45, 440);
      const gutter = new THREE.Mesh(gutterGeo, this.matGutter);
      gutter.position.set(xSide, -0.15, 0);
      this.scene.add(gutter);

      // Elevated concrete sidewalk slab (2.8m wide)
      const walkGeo = new THREE.BoxGeometry(3.0, 0.22, 440);
      const sidewalk = new THREE.Mesh(walkGeo, this.matSidewalk);
      const sideX = xSide > 0 ? xSide + 2.0 : xSide - 2.0;
      sidewalk.position.set(sideX, 0.1, 0);
      this.scene.add(sidewalk);

      // Concrete Pedestrian Gutter Crossing Slabs at intervals
      for (let z = -200; z <= 200; z += 25) {
        const slabGeo = new THREE.BoxGeometry(1.6, 0.18, 2.2);
        const slab = new THREE.Mesh(slabGeo, this.matSidewalk);
        slab.position.set(xSide, 0.1, z);
        this.scene.add(slab);
      }
    });

    // Pedestrian Zebra Crossings
    const zebraZs = [-110, -48, -32, 40, 92, 108];
    zebraZs.forEach((z) => {
      for (let x = -6.5; x <= 6.5; x += 1.6) {
        const stripeGeo = new THREE.PlaneGeometry(1.0, 3.5);
        const stripe = new THREE.Mesh(stripeGeo, this.matZebraLine);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(x, 0.02, z);
        this.scene.add(stripe);
      }
    });
  }

  /**
   * 2. University of Ibadan (UI) Premier Monument & Clocktower (North Axis, Z: -175)
   */
  private buildUIGateMonument() {
    const baseZ = -175;
    this.landmarks.push({
      name: 'UI Main Gate & Campus',
      type: 'landmark',
      x: 0,
      z: baseZ,
      color: '#3b82f6',
    });

    // Ceremonial Entrance Pylons
    [-8.5, 8.5].forEach((px) => {
      const pylonGeo = new THREE.BoxGeometry(3.2, 10, 3.2);
      const pylon = new THREE.Mesh(pylonGeo, this.matWallCream);
      pylon.position.set(px, 5.0, baseZ);
      pylon.castShadow = true;
      this.scene.add(pylon);
      this.addCollision(px, baseZ, 3.6, 3.6, 10);
    });

    // Arch Overhead Lintel with Premier University Motto
    const lintelGeo = new THREE.BoxGeometry(20.5, 2.4, 2.8);
    const lintel = new THREE.Mesh(lintelGeo, this.matWallCream);
    lintel.position.set(0, 10.2, baseZ);
    this.scene.add(lintel);

    // University of Ibadan Blue Signboard
    const uiSignTex = TextureGenerator.createSignboardTexture(
      'UNIVERSITY OF IBADAN',
      'RECTE SAPERE FONS · FIRST AND BEST',
      '#1e3a8a',
      '#ffffff',
      '#fbbf24'
    );
    const signMat = new THREE.MeshStandardMaterial({ map: uiSignTex });
    const signGeo = new THREE.BoxGeometry(16, 1.8, 0.2);
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 10.2, baseZ + 1.45);
    this.scene.add(sign);

    // Iconic UI Campus Clocktower in the background
    const towerGeo = new THREE.BoxGeometry(4.5, 24, 4.5);
    const tower = new THREE.Mesh(towerGeo, this.matWallCream);
    tower.position.set(0, 12, baseZ - 35);
    tower.castShadow = true;
    this.scene.add(tower);
    this.addCollision(0, baseZ - 35, 5.2, 5.2, 24);

    // Clock Face Dial
    const clockGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 20);
    clockGeo.rotateX(Math.PI / 2);
    const clockMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const clock = new THREE.Mesh(clockGeo, clockMat);
    clock.position.set(0, 20, baseZ - 32.7);
    this.scene.add(clock);

    // UI Student & Taxi Dispatch Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_ui_gate_taxi',
      type: 'job',
      label: 'UI Gate Taxi & Student Rank',
      subLabel: 'Pick up campus students & lecturers going to Bodija (₦2,500)',
      x: -6,
      z: baseZ + 15,
      radius: 5.5,
    });
  }

  /**
   * 3. Authentic Nigerian Residential Family Compounds & Usable Player Home
   * Features: Sandcrete perimeter wall, black iron security gate, 2-storey duplex,
   * rooftop GeePee tank on steel tower, balcony, generator house with Mikano/Tiger generator.
   */
  private buildResidentialCompounds() {
    // Compound A: MARCUS'S RENTED BODIJA RESIDENTIAL DUPLEX (East side, X: 36, Z: 24)
    this.buildGatedCompound(36, 24, 'Marcus Bodija Residence', true);

    // Compound B: Agbowo Residential Flats (West side, X: -38, Z: 24)
    this.buildGatedCompound(-38, 24, 'Agbowo Family Compound', false);

    // Compound C: New Bodija Modern Duplex (East side, X: 42, Z: 75)
    this.buildGatedCompound(42, 75, 'Bodija Green Estate Lodge', false);

    // Compound D: Agbowo Student Lodge (West side, X: -42, Z: -80)
    this.buildGatedCompound(-42, -80, 'UI Scholar Flats', false);
  }

  private buildGatedCompound(
    centerX: number,
    centerZ: number,
    name: string,
    isPlayerHome: boolean
  ) {
    const compW = 28;
    const compD = 32;

    // 1. Perimeter Sandcrete Boundary Wall (2.0m high)
    const wallH = 2.0;
    const wallThickness = 0.45;

    // North Wall
    const nWallGeo = new THREE.BoxGeometry(compW, wallH, wallThickness);
    const nWall = new THREE.Mesh(nWallGeo, this.matWallSandcrete);
    nWall.position.set(centerX, wallH / 2, centerZ - compD / 2);
    this.scene.add(nWall);
    this.addCollision(centerX, centerZ - compD / 2, compW, wallThickness + 0.2, wallH);

    // South Wall
    const sWallGeo = new THREE.BoxGeometry(compW, wallH, wallThickness);
    const sWall = new THREE.Mesh(sWallGeo, this.matWallSandcrete);
    sWall.position.set(centerX, wallH / 2, centerZ + compD / 2);
    this.scene.add(sWall);
    this.addCollision(centerX, centerZ + compD / 2, compW, wallThickness + 0.2, wallH);

    // Back Wall (East or West depending on sign)
    const backX = centerX > 0 ? centerX + compW / 2 : centerX - compW / 2;
    const bWallGeo = new THREE.BoxGeometry(wallThickness, wallH, compD);
    const bWall = new THREE.Mesh(bWallGeo, this.matWallSandcrete);
    bWall.position.set(backX, wallH / 2, centerZ);
    this.scene.add(bWall);
    this.addCollision(backX, centerZ, wallThickness + 0.2, compD, wallH);

    // Front Wall with Security Gate Opening facing street
    const frontX = centerX > 0 ? centerX - compW / 2 : centerX + compW / 2;
    const gateGap = 5.5; // Gap for security gate

    const halfWallLen = (compD - gateGap) / 2;
    // Front Wall Left Wing
    const fw1Geo = new THREE.BoxGeometry(wallThickness, wallH, halfWallLen);
    const fw1 = new THREE.Mesh(fw1Geo, this.matWallSandcrete);
    fw1.position.set(frontX, wallH / 2, centerZ - halfWallLen / 2 - gateGap / 2);
    this.scene.add(fw1);
    this.addCollision(frontX, centerZ - halfWallLen / 2 - gateGap / 2, wallThickness + 0.2, halfWallLen, wallH);

    // Front Wall Right Wing
    const fw2 = new THREE.Mesh(fw1Geo, this.matWallSandcrete);
    fw2.position.set(frontX, wallH / 2, centerZ + halfWallLen / 2 + gateGap / 2);
    this.scene.add(fw2);
    this.addCollision(frontX, centerZ + halfWallLen / 2 + gateGap / 2, wallThickness + 0.2, halfWallLen, wallH);

    // Concrete Gate Pillars
    [-gateGap / 2, gateGap / 2].forEach((pzOffset) => {
      const pierGeo = new THREE.BoxGeometry(0.7, 2.4, 0.7);
      const pier = new THREE.Mesh(pierGeo, this.matWallCream);
      pier.position.set(frontX, 1.2, centerZ + pzOffset);
      this.scene.add(pier);
      this.addCollision(frontX, centerZ + pzOffset, 0.8, 0.8, 2.4);
    });

    // Black Iron Double Security Gate (Left leaf + Right leaf)
    const gateLeafGeo = new THREE.BoxGeometry(0.08, 1.9, gateGap * 0.48);
    const gateLeaf1 = new THREE.Mesh(gateLeafGeo, this.matSecurityGate);
    gateLeaf1.position.set(frontX, 0.95, centerZ - gateGap * 0.24);
    this.scene.add(gateLeaf1);

    const gateLeaf2 = new THREE.Mesh(gateLeafGeo, this.matSecurityGate);
    gateLeaf2.position.set(frontX, 0.95, centerZ + gateGap * 0.24);
    this.scene.add(gateLeaf2);

    // 2. Main 2-Storey Residential Duplex / Flat inside the compound
    const houseW = 14;
    const houseH = 8.5; // 2 storeys
    const houseD = 16;
    const houseX = centerX > 0 ? centerX + 3.5 : centerX - 3.5;
    const houseZ = centerZ;

    const houseBodyGeo = new THREE.BoxGeometry(houseW, houseH, houseD);
    const houseBody = new THREE.Mesh(houseBodyGeo, this.matWallCream);
    houseBody.position.set(houseX, houseH / 2, houseZ);
    houseBody.castShadow = true;
    this.scene.add(houseBody);
    this.addCollision(houseX, houseZ, houseW + 0.4, houseD + 0.4, houseH);

    // Second Storey Balcony with metal railing
    const balconyX = centerX > 0 ? houseX - houseW / 2 - 1.2 : houseX + houseW / 2 + 1.2;
    const balconyGeo = new THREE.BoxGeometry(2.4, 0.3, 6.0);
    const balcony = new THREE.Mesh(balconyGeo, this.matSidewalk);
    balcony.position.set(balconyX, 4.3, houseZ);
    this.scene.add(balcony);

    // Balcony Railing
    const railGeo = new THREE.BoxGeometry(2.4, 0.9, 0.08);
    const rail = new THREE.Mesh(railGeo, this.matSecurityGate);
    rail.position.set(balconyX, 4.8, houseZ + 2.95);
    this.scene.add(rail);

    // Rusted Corrugated Iron Hipped Roof ("Brown Roof of Ibadan")
    const roofGeo = new THREE.ConeGeometry(houseW * 0.8, 3.8, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, this.matRoofRustedIron);
    roof.position.set(houseX, houseH + 1.8, houseZ);
    roof.castShadow = true;
    this.scene.add(roof);

    // Burglar-proof Windows with Dark Glass
    const winGeo = new THREE.BoxGeometry(0.1, 1.5, 1.4);
    const winFaces = [
      { x: houseX - houseW / 2 - 0.06, z: houseZ - 4, y: 2.2 },
      { x: houseX - houseW / 2 - 0.06, z: houseZ + 4, y: 2.2 },
      { x: houseX - houseW / 2 - 0.06, z: houseZ - 4, y: 6.0 },
      { x: houseX - houseW / 2 - 0.06, z: houseZ + 4, y: 6.0 },
      { x: houseX + houseW / 2 + 0.06, z: houseZ - 4, y: 2.2 },
      { x: houseX + houseW / 2 + 0.06, z: houseZ + 4, y: 2.2 },
    ];
    winFaces.forEach((wf) => {
      const win = new THREE.Mesh(winGeo, this.matWindowDark);
      win.position.set(wf.x, wf.y, wf.z);
      this.scene.add(win);
    });

    // 3. Rooftop Overhead Black GeePee Water Tank & Steel Tower
    const tankX = houseX + 2.5;
    const tankZ = houseZ + 4.5;
    const tankStandGeo = new THREE.BoxGeometry(1.6, 2.0, 1.6);
    const tankStand = new THREE.Mesh(tankStandGeo, this.matConcretePole);
    tankStand.position.set(tankX, houseH + 1.0, tankZ);
    this.scene.add(tankStand);

    const tankGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.6, 16);
    const tank = new THREE.Mesh(tankGeo, this.matWaterTank);
    tank.position.set(tankX, houseH + 2.8, tankZ);
    this.scene.add(tank);

    // 4. Generator House with Tiger/Mikano Generator (Corner of Compound)
    const genHouseX = centerX > 0 ? centerX - compW / 2 + 2.5 : centerX + compW / 2 - 2.5;
    const genHouseZ = centerZ + compD / 2 - 3.0;

    const genHGeo = new THREE.BoxGeometry(3.0, 2.2, 3.0);
    const genH = new THREE.Mesh(genHGeo, this.matWallSandcrete);
    genH.position.set(genHouseX, 1.1, genHouseZ);
    this.scene.add(genH);
    this.addCollision(genHouseX, genHouseZ, 3.2, 3.2, 2.2);

    // Slanted zinc roof on generator shed
    const genRoofGeo = new THREE.BoxGeometry(3.4, 0.15, 3.4);
    const genRoof = new THREE.Mesh(genRoofGeo, this.matRoofRustedIron);
    genRoof.position.set(genHouseX, 2.25, genHouseZ);
    genRoof.rotation.z = 0.1;
    this.scene.add(genRoof);

    // Yellow Generator inside / adjacent
    const genUnitGeo = new THREE.BoxGeometry(1.1, 0.8, 0.9);
    const genUnit = new THREE.Mesh(genUnitGeo, this.matGeneratorYellow);
    genUnit.position.set(genHouseX, 0.5, genHouseZ);
    this.scene.add(genUnit);

    // Generator Exhaust Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(genHouseX + 0.8, 2.5, genHouseZ);
    this.scene.add(pipe);

    // Interactive Hotspot for Marcus's Rented Home
    if (isPlayerHome) {
      this.landmarks.push({
        name: 'Marcus Bodija Flat',
        type: 'home',
        x: frontX,
        z: centerZ,
        color: '#06b6d4',
      });

      this.interactiveHotspots.push({
        id: 'hotspot_bodija_duplex_home',
        type: 'home',
        label: "Marcus's Bodija Compound Flat",
        subLabel: 'Rest, Sleep, Shower & Manage Fuel / NEPA Power',
        x: frontX,
        z: centerZ,
        radius: 5.5,
      });
    }
  }

  /**
   * 4. Famous Amala Skye Buka (West Side, X: -28, Z: -25)
   * Open wooden pavilion with rusted zinc sheets, food basins, wooden benches, plastic chairs
   */
  private buildAmalaSkyeBuka() {
    const bukaX = -28;
    const bukaZ = -25;

    this.landmarks.push({
      name: 'Amala Skye Buka',
      type: 'buka',
      x: bukaX,
      z: bukaZ,
      color: '#f59e0b',
    });

    // 1. Open Pavilion Floor (Concrete slab)
    const floorGeo = new THREE.BoxGeometry(14, 0.25, 12);
    const floor = new THREE.Mesh(floorGeo, this.matSidewalk);
    floor.position.set(bukaX, 0.12, bukaZ);
    this.scene.add(floor);

    // 2. Timber Support Pillars
    const pillarGeo = new THREE.BoxGeometry(0.35, 4.2, 0.35);
    [-6.2, 6.2].forEach((px) => {
      [-5.2, 5.2].forEach((pz) => {
        const pillar = new THREE.Mesh(pillarGeo, this.matWoodTimber);
        pillar.position.set(bukaX + px, 2.1, bukaZ + pz);
        this.scene.add(pillar);
        this.addCollision(bukaX + px, bukaZ + pz, 0.6, 0.6, 4.2);
      });
    });

    // 3. Low Sandcrete Half-Walls along sides
    const halfWallGeo = new THREE.BoxGeometry(13.6, 1.1, 0.3);
    const halfWall = new THREE.Mesh(halfWallGeo, this.matWallOchre);
    halfWall.position.set(bukaX, 0.65, bukaZ - 5.5);
    this.scene.add(halfWall);
    this.addCollision(bukaX, bukaZ - 5.5, 14, 0.5, 1.2);

    // 4. Sloped Rusted Zinc Roof
    const roofGeo = new THREE.BoxGeometry(15.2, 0.2, 13.5);
    const roof = new THREE.Mesh(roofGeo, this.matRoofRustedIron);
    roof.position.set(bukaX, 4.3, bukaZ);
    roof.rotation.x = 0.08;
    this.scene.add(roof);

    // 5. Authentic Buka Signboard
    const bukaSignTex = TextureGenerator.createSignboardTexture(
      'AMALA SKYE BUKA & KITCHEN',
      'HOT AMALA · EWEDU · GBEGIRI · OGUNFE & ASSORTED',
      '#78350f',
      '#ffffff',
      '#f59e0b'
    );
    const signMat = new THREE.MeshStandardMaterial({ map: bukaSignTex });
    const signGeo = new THREE.BoxGeometry(8, 1.6, 0.15);
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(bukaX, 4.2, bukaZ + 6.1);
    this.scene.add(sign);

    // 6. Food Service Counter with Metal Basins
    const counterGeo = new THREE.BoxGeometry(6.5, 1.0, 1.4);
    const counter = new THREE.Mesh(counterGeo, this.matWoodTimber);
    counter.position.set(bukaX - 2.5, 0.6, bukaZ - 3.2);
    this.scene.add(counter);
    this.addCollision(bukaX - 2.5, bukaZ - 3.2, 7, 1.6, 1.2);

    // Large Silver Aluminum Food Basins
    for (let i = -2; i <= 2; i += 1.3) {
      const basinGeo = new THREE.CylinderGeometry(0.45, 0.35, 0.4, 14);
      const basinMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });
      const basin = new THREE.Mesh(basinGeo, basinMat);
      basin.position.set(bukaX - 2.5 + i, 1.3, bukaZ - 3.2);
      this.scene.add(basin);
    }

    // 7. Dining Tables & Plastic Chairs
    const tableGeo = new THREE.BoxGeometry(2.4, 0.85, 1.2);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 }); // Blue plastic chairs

    [
      { x: bukaX + 2.5, z: bukaZ + 1.5 },
      { x: bukaX - 2.5, z: bukaZ + 2.0 },
    ].forEach((tbl) => {
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(tbl.x, 0.52, tbl.z);
      this.scene.add(table);
      this.addCollision(tbl.x, tbl.z, 2.6, 1.4, 1.0);

      // Chairs around table
      [-1.1, 1.1].forEach((cx) => {
        const chairGeo = new THREE.BoxGeometry(0.55, 0.75, 0.55);
        const chair = new THREE.Mesh(chairGeo, chairMat);
        chair.position.set(tbl.x + cx, 0.45, tbl.z);
        this.scene.add(chair);
      });
    });

    // Interactive Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_amala_buka',
      type: 'buka',
      label: 'Amala Skye Buka',
      subLabel: 'Eat Hot Amala, Ewedu & Gbegiri (Restores 100% Hunger & Energy)',
      x: bukaX,
      z: bukaZ + 4.5,
      radius: 6.0,
    });
  }

  /**
   * 5. Bodija Wholesale Produce Market Hub (East Side, X: 34, Z: -42)
   * Real market sheds with stacks of yams, pepper baskets, porter wheelbarrows
   */
  private buildBodijaMarketHub() {
    const mktX = 34;
    const mktZ = -42;

    this.landmarks.push({
      name: 'Bodija Wholesale Market',
      type: 'market',
      x: mktX,
      z: mktZ,
      color: '#f59e0b',
    });

    // Market Signboard
    const mktSignTex = TextureGenerator.createSignboardTexture(
      'BODIJA WHOLESALE PRODUCE MARKET',
      'YAM TUBERS · PEPPER · PALM OIL · WHOLESALE GRAINS',
      '#1e3a8a',
      '#ffffff',
      '#f59e0b'
    );
    const signMat = new THREE.MeshStandardMaterial({ map: mktSignTex });
    const signGeo = new THREE.BoxGeometry(10, 1.8, 0.2);
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(mktX, 4.5, mktZ + 12);
    this.scene.add(sign);

    // Row of 3 Wooden Shed Pavilions
    [-8, 0, 8].forEach((zOff) => {
      const shedZ = mktZ + zOff;

      // Wooden Posts
      [-4.5, 4.5].forEach((px) => {
        [-2.5, 2.5].forEach((pz) => {
          const postGeo = new THREE.BoxGeometry(0.25, 3.5, 0.25);
          const post = new THREE.Mesh(postGeo, this.matWoodTimber);
          post.position.set(mktX + px, 1.75, shedZ + pz);
          this.scene.add(post);
        });
      });

      // Rusted Corrugated Roof
      const sRoofGeo = new THREE.BoxGeometry(10, 0.15, 6);
      const sRoof = new THREE.Mesh(sRoofGeo, this.matRoofRustedIron);
      sRoof.position.set(mktX, 3.6, shedZ);
      sRoof.rotation.x = 0.05;
      this.scene.add(sRoof);

      // Wooden Stalls & Tables
      const stallGeo = new THREE.BoxGeometry(8.2, 0.9, 2.2);
      const stall = new THREE.Mesh(stallGeo, this.matWoodTimber);
      stall.position.set(mktX, 0.45, shedZ);
      this.scene.add(stall);
      this.addCollision(mktX, shedZ, 8.6, 2.6, 1.0);

      // Stacks of Brown Yam Tubers
      for (let yx = -3.2; yx <= 3.2; yx += 1.1) {
        const yamGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.85, 8);
        yamGeo.rotateZ(Math.PI / 2);
        const yamMat = new THREE.MeshStandardMaterial({ color: 0x593a22, roughness: 0.9 });
        const yam = new THREE.Mesh(yamGeo, yamMat);
        yam.position.set(mktX + yx, 1.05, shedZ);
        this.scene.add(yam);
      }
    });

    // Jute Grain Sacks on ground
    for (let i = 0; i < 6; i++) {
      const sackGeo = new THREE.BoxGeometry(0.8, 1.0, 0.6);
      const sackMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.9 });
      const sack = new THREE.Mesh(sackGeo, sackMat);
      sack.position.set(mktX - 5.5 + (i % 3) * 0.9, 0.5, mktZ - 3 + Math.floor(i / 3) * 0.9);
      this.scene.add(sack);
    }

    // Interactive Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_bodija_market_trade',
      type: 'market_stall',
      label: 'Bodija Market Trade & Goods',
      subLabel: 'Buy food provisions, groceries & accept market porter jobs',
      x: mktX - 3.0,
      z: mktZ + 6.0,
      radius: 6.5,
    });
  }

  /**
   * 6. Bovas Petroleum Fuel Station & ATM (East Side, X: 32, Z: 95)
   * Canopy, fuel pump islands, price signboard, and Kuda/Opay ATM booth
   */
  private buildBovasPetrolStation() {
    const stnX = 32;
    const stnZ = 95;

    this.landmarks.push({
      name: 'Bovas Fuel & ATM',
      type: 'services',
      x: stnX,
      z: stnZ,
      color: '#ef4444',
    });

    // 1. Concrete Forecourt Base
    const fcGeo = new THREE.BoxGeometry(22, 0.15, 20);
    const fc = new THREE.Mesh(fcGeo, this.matSidewalk);
    fc.position.set(stnX, 0.08, stnZ);
    this.scene.add(fc);

    // 2. High Fuel Station Canopy (Red & Yellow)
    const canopyGeo = new THREE.BoxGeometry(16, 0.6, 12);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(stnX, 5.5, stnZ);
    this.scene.add(canopy);

    // Canopy Pillars
    [-5.5, 5.5].forEach((px) => {
      const pilGeo = new THREE.CylinderGeometry(0.4, 0.4, 5.5, 12);
      const pilMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
      const pil = new THREE.Mesh(pilGeo, pilMat);
      pil.position.set(stnX + px, 2.75, stnZ);
      this.scene.add(pil);
      this.addCollision(stnX + px, stnZ, 1.0, 1.0, 5.5);
    });

    // 3. Fuel Pump Islands
    [-3.0, 3.0].forEach((px) => {
      const islandGeo = new THREE.BoxGeometry(1.2, 0.35, 4.0);
      const island = new THREE.Mesh(islandGeo, this.matSidewalk);
      island.position.set(stnX + px, 0.25, stnZ);
      this.scene.add(island);

      // Double-sided Fuel Dispenser Pump
      const pumpGeo = new THREE.BoxGeometry(0.8, 1.8, 1.2);
      const pumpMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.3 });
      const pump = new THREE.Mesh(pumpGeo, pumpMat);
      pump.position.set(stnX + px, 1.15, stnZ);
      this.scene.add(pump);
      this.addCollision(stnX + px, stnZ, 1.4, 2.0, 2.0);
    });

    // 4. ATM Cash Terminal Booth
    const atmX = stnX + 8.5;
    const atmZ = stnZ - 6.5;
    const atmGeo = new THREE.BoxGeometry(2.4, 2.8, 2.2);
    const atmMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const atm = new THREE.Mesh(atmGeo, atmMat);
    atm.position.set(atmX, 1.4, atmZ);
    this.scene.add(atm);
    this.addCollision(atmX, atmZ, 2.8, 2.6, 2.8);

    // ATM Screen Glow
    const scrGeo = new THREE.PlaneGeometry(0.9, 0.7);
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const scr = new THREE.Mesh(scrGeo, scrMat);
    scr.position.set(atmX - 1.22, 1.6, atmZ);
    scr.rotation.y = -Math.PI / 2;
    this.scene.add(scr);

    // Interactive ATM Hotspot
    this.interactiveHotspots.push({
      id: 'hotspot_bovas_atm',
      type: 'atm',
      label: 'Kuda / Opay ATM Terminal',
      subLabel: 'Withdraw cash or deposit money into your secure account',
      x: atmX - 1.8,
      z: atmZ,
      radius: 4.0,
    });
  }

  /**
   * 7. Roadside Commercial Kiosks & Provision Stores
   * Branded MTN Yellow & Airtel Red shipping containers with display flaps
   */
  private buildRoadsideKiosks() {
    const kiosks = [
      { x: -16, z: 12, brand: 'yellow_mtn' as const, label: 'MTN MoMo Kiosk' },
      { x: -16, z: 55, brand: 'red_airtel' as const, label: 'Airtel Money Booth' },
      { x: 16, z: -75, brand: 'yellow_mtn' as const, label: 'Bodija SIM & Airtime' },
    ];

    kiosks.forEach((k) => {
      const kioskGeo = new THREE.BoxGeometry(2.4, 2.2, 2.0);
      const tex = TextureGenerator.createKioskTexture(k.brand);
      const kMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
      const kiosk = new THREE.Mesh(kioskGeo, kMat);
      kiosk.position.set(k.x, 1.1, k.z);
      this.scene.add(kiosk);
      this.addCollision(k.x, k.z, 2.6, 2.2, 2.2);

      // Wooden display shelf in front with snacks/biscuits
      const shelfGeo = new THREE.BoxGeometry(1.8, 0.8, 0.6);
      const shelf = new THREE.Mesh(shelfGeo, this.matWoodTimber);
      shelf.position.set(k.x + (k.x < 0 ? 1.4 : -1.4), 0.4, k.z);
      this.scene.add(shelf);
    });

    // Suya Spot at Night (X: -18, Z: -5)
    this.buildSuyaSpot(-18, -5);
  }

  private buildSuyaSpot(x: number, z: number) {
    // Charcoal Grill Stand
    const grillGeo = new THREE.BoxGeometry(2.0, 0.9, 0.8);
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7, roughness: 0.6 });
    const grill = new THREE.Mesh(grillGeo, grillMat);
    grill.position.set(x, 0.45, z);
    this.scene.add(grill);
    this.addCollision(x, z, 2.2, 1.2, 1.0);

    // Charcoal Ember Glow
    const emberGeo = new THREE.BoxGeometry(1.8, 0.05, 0.6);
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const ember = new THREE.Mesh(emberGeo, emberMat);
    ember.position.set(x, 0.92, z);
    this.scene.add(ember);

    // Suya Signboard
    const suyaSignTex = TextureGenerator.createSignboardTexture(
      'MALLAM BASHIR SUYA SPOT',
      'SPICY BEEF · TOZO · CHICKEN & KILISHI',
      '#7f1d1d',
      '#ffffff',
      '#fbbf24'
    );
    const signMat = new THREE.MeshStandardMaterial({ map: suyaSignTex });
    const signGeo = new THREE.BoxGeometry(4.0, 1.1, 0.1);
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(x, 2.2, z);
    this.scene.add(sign);

    this.interactiveHotspots.push({
      id: 'hotspot_suya_spot',
      type: 'suya',
      label: 'Mallam Bashir Suya Spot',
      subLabel: 'Spicy Beef & Tozo Suya wrapped in newsprint (₦2,000)',
      x: x,
      z: z + 2.0,
      radius: 4.5,
    });
  }

  /**
   * 8. NEPA / IBEDC Concrete Utility Poles & Overhead Power Cables
   * Iconic Nigerian concrete street poles with crossarms and sagging power lines
   */
  private buildUtilityPolesAndCables() {
    const poleSpacing = 35;
    const startZ = -190;
    const endZ = 190;
    const poleHeight = 8.5;

    // Build along both west and east sidewalks
    [-11.5, 11.5].forEach((poleX) => {
      let lastPolePos: THREE.Vector3 | null = null;

      for (let z = startZ; z <= endZ; z += poleSpacing) {
        // Concrete Pole
        const poleGeo = new THREE.CylinderGeometry(0.2, 0.25, poleHeight, 10);
        const pole = new THREE.Mesh(poleGeo, this.matConcretePole);
        pole.position.set(poleX, poleHeight / 2, z);
        this.scene.add(pole);
        this.addCollision(poleX, z, 0.6, 0.6, poleHeight);

        // Wooden / Metal Crossarm
        const crossGeo = new THREE.BoxGeometry(2.2, 0.12, 0.12);
        const cross = new THREE.Mesh(crossGeo, this.matWoodTimber);
        cross.position.set(poleX, poleHeight - 0.4, z);
        this.scene.add(cross);

        // Ceramic Insulators
        [-0.9, 0, 0.9].forEach((cx) => {
          const insGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 8);
          const insMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const ins = new THREE.Mesh(insGeo, insMat);
          ins.position.set(poleX + cx, poleHeight - 0.2, z);
          this.scene.add(ins);
        });

        // Pole-Mounted High-Voltage Transformer at selected poles
        if (Math.abs(z) === 50) {
          const transGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.4, 12);
          const transMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
          const trans = new THREE.Mesh(transGeo, transMat);
          trans.position.set(poleX + (poleX > 0 ? 0.7 : -0.7), poleHeight - 2.5, z);
          this.scene.add(trans);
        }

        // Sagging Overhead Power Cables connecting to previous pole
        if (lastPolePos) {
          const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, poleSpacing, 6);
          cableGeo.rotateX(Math.PI / 2);
          const cable = new THREE.Mesh(cableGeo, this.matPowerCable);
          cable.position.set(poleX, poleHeight - 0.25, z - poleSpacing / 2);
          this.scene.add(cable);
        }

        lastPolePos = pole.position.clone();
      }
    });
  }

  /**
   * 9. Nigerian Tropical Trees & Environmental Clutter
   * Neem (Dongoyaro) trees, umbrella terminalia trees, concrete curbs
   */
  private buildVegetationAndProps() {
    // Trees spaced naturally along road shoulders
    const treePositions = [
      { x: -14, z: -140 },
      { x: 14, z: -140 },
      { x: -14, z: -90 },
      { x: 14, z: -90 },
      { x: -14, z: -60 },
      { x: -14, z: 40 },
      { x: 14, z: 45 },
      { x: -14, z: 120 },
      { x: 14, z: 125 },
      { x: -14, z: 160 },
      { x: 14, z: 160 },
    ];

    treePositions.forEach((pos) => {
      // Tree Trunk
      const trunkH = 3.6 + Math.random() * 1.0;
      const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, trunkH, 8);
      const trunk = new THREE.Mesh(trunkGeo, this.matTreeTrunk);
      trunk.position.set(pos.x, trunkH / 2, pos.z);
      this.scene.add(trunk);
      this.addCollision(pos.x, pos.z, 0.8, 0.8, trunkH);

      // Layered Umbrella Canopy
      for (let l = 0; l < 3; l++) {
        const rad = 2.4 - l * 0.5;
        const leafGeo = new THREE.ConeGeometry(rad, 1.8, 8);
        const leaf = new THREE.Mesh(leafGeo, this.matTreeLeaf);
        leaf.position.set(pos.x, trunkH + l * 1.1, pos.z);
        leaf.castShadow = true;
        this.scene.add(leaf);
      }
    });
  }
}
