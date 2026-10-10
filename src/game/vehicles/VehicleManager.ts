import * as THREE from 'three';
import { CollisionBox } from '../world/DistrictBuilder';
import { sounds } from '../audio/soundManager';

export interface VehicleControlInput {
  forward: number;
  turn: number;
  brake: boolean;
  horn: boolean;
}

/**
 * Kenney Style Stylized Modular Vehicle (Image 3)
 * Featuring the iconic Ibadan Yellow & Blue Micra Taxi with rounded boxy geometry,
 * chunky black wheels, dark tinted windows, and white roof taxi signbox!
 */
export class VehicleManager {
  public scene: THREE.Scene;
  public group: THREE.Group;
  public vehicleType: 'micra_taxi' | 'okada_bike' = 'micra_taxi';

  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public rotationY: number = 0;
  public speed: number = 0;
  public maxSpeed: number = 24;
  public reverseMaxSpeed: number = -8;
  public acceleration: number = 22;
  public brakingForce: number = 34;
  public friction: number = 4.2;
  public turnSpeed: number = 2.6;

  private frontWheels: THREE.Group[] = [];
  private rearWheels: THREE.Group[] = [];
  private headlightLeft!: THREE.SpotLight;
  private headlightRight!: THREE.SpotLight;

  public isOccupied: boolean = false;
  public isLightsOn: boolean = false;

  constructor(scene: THREE.Scene, startX: number, startZ: number, type: 'micra_taxi' | 'okada_bike' = 'micra_taxi') {
    this.scene = scene;
    this.vehicleType = type;
    this.group = new THREE.Group();
    this.position.set(startX, 0, startZ);
    this.group.position.copy(this.position);

    this.buildKenneyStyleTaxi();
    this.scene.add(this.group);
  }

  /**
   * Build Kenney-style modular car model matching Image 3
   */
  private buildKenneyStyleTaxi() {
    // Kenney clean matte materials
    const matYellow = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Ibadan Taxi Yellow
      roughness: 0.45,
    });

    const matBlue = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Municipal Blue
      roughness: 0.45,
    });

    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark tinted glass
      roughness: 0.2,
      metalness: 0.8,
    });

    const matWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
    });

    const matDarkTrim = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
    });

    const matTyre = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Chunky black tyre
      roughness: 0.85,
    });

    const matRim = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.7,
    });

    // 1. Lower Body Chassis (Rounded Box)
    const bodyGeo = new THREE.BoxGeometry(2.1, 0.75, 3.8);
    const body = new THREE.Mesh(bodyGeo, matYellow);
    body.position.y = 0.65;
    body.castShadow = true;
    this.group.add(body);

    // Blue Municipal Side Stripe
    const stripeGeo = new THREE.BoxGeometry(2.12, 0.18, 3.7);
    const stripe = new THREE.Mesh(stripeGeo, matBlue);
    stripe.position.y = 0.72;
    this.group.add(stripe);

    // Front Bumper (Dark Trim)
    const fBufGeo = new THREE.BoxGeometry(2.0, 0.22, 0.2);
    const fBuf = new THREE.Mesh(fBufGeo, matDarkTrim);
    fBuf.position.set(0, 0.45, 1.95);
    this.group.add(fBuf);

    // Rear Bumper
    const rBuf = new THREE.Mesh(fBufGeo, matDarkTrim);
    rBuf.position.set(0, 0.45, -1.95);
    this.group.add(rBuf);

    // 2. Cabin & Roof (Kenney Rounded Cabin)
    const cabinGeo = new THREE.BoxGeometry(1.85, 0.75, 2.1);
    const cabin = new THREE.Mesh(cabinGeo, matBlue);
    cabin.position.set(0, 1.35, -0.2);
    cabin.castShadow = true;
    this.group.add(cabin);

    // Front Windshield (Sloped Dark Glass)
    const frontWindshieldGeo = new THREE.BoxGeometry(1.78, 0.65, 0.15);
    const frontWindshield = new THREE.Mesh(frontWindshieldGeo, matGlass);
    frontWindshield.position.set(0, 1.28, 0.85);
    frontWindshield.rotation.x = -0.4;
    this.group.add(frontWindshield);

    // Rear Windshield
    const rearWindshield = new THREE.Mesh(frontWindshieldGeo, matGlass);
    rearWindshield.position.set(0, 1.28, -1.25);
    rearWindshield.rotation.x = 0.4;
    this.group.add(rearWindshield);

    // Side Windows
    const sideWinGeo = new THREE.BoxGeometry(1.88, 0.5, 1.7);
    const sideWin = new THREE.Mesh(sideWinGeo, matGlass);
    sideWin.position.set(0, 1.32, -0.2);
    this.group.add(sideWin);

    // 3. White Roof Taxi Signbox (Like Image 3)
    const taxiSignGeo = new THREE.BoxGeometry(0.85, 0.28, 0.35);
    const taxiSign = new THREE.Mesh(taxiSignGeo, matWhite);
    taxiSign.position.set(0, 1.86, -0.2);
    this.group.add(taxiSign);

    // 4. Capsule Headlights & Spotlights
    const hlGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
    hlGeo.rotateX(Math.PI / 2);
    const matHeadlight = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    [-0.75, 0.75].forEach((hx) => {
      const hl = new THREE.Mesh(hlGeo, matHeadlight);
      hl.position.set(hx, 0.65, 1.95);
      this.group.add(hl);
    });

    this.headlightLeft = new THREE.SpotLight(0xfffbeb, 5, 45, Math.PI / 5, 0.4);
    this.headlightLeft.position.set(-0.75, 0.65, 2.0);
    this.headlightLeft.target.position.set(-0.75, 0.2, 20);
    this.group.add(this.headlightLeft);
    this.group.add(this.headlightLeft.target);

    this.headlightRight = new THREE.SpotLight(0xfffbeb, 5, 45, Math.PI / 5, 0.4);
    this.headlightRight.position.set(0.75, 0.65, 2.0);
    this.headlightRight.target.position.set(0.75, 0.2, 20);
    this.group.add(this.headlightRight);
    this.group.add(this.headlightRight.target);

    // 5. Chunky Kenney Wheels with Colored Rim Hubcaps (Image 3)
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 12);
    rimGeo.rotateZ(Math.PI / 2);

    const wheelPositions = [
      { x: -1.02, z: 1.15, isFront: true },
      { x: 1.02, z: 1.15, isFront: true },
      { x: -1.02, z: -1.15, isFront: false },
      { x: 1.02, z: -1.15, isFront: false },
    ];

    wheelPositions.forEach(({ x, z, isFront }) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, 0.38, z);

      const tyre = new THREE.Mesh(wheelGeo, matTyre);
      tyre.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, matRim);
      wGroup.add(tyre);
      wGroup.add(rim);

      this.group.add(wGroup);
      if (isFront) {
        this.frontWheels.push(wGroup);
      } else {
        this.rearWheels.push(wGroup);
      }
    });
  }

  public update(dt: number, input: VehicleControlInput, collisionBoxes: CollisionBox[]) {
    if (!this.isOccupied) {
      if (Math.abs(this.speed) > 0.05) {
        this.speed -= Math.sign(this.speed) * this.friction * dt;
      } else {
        this.speed = 0;
      }
      return;
    }

    if (input.forward > 0) {
      this.speed += this.acceleration * dt;
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    } else if (input.forward < 0) {
      if (this.speed > 0.5) {
        this.speed -= this.brakingForce * dt;
      } else {
        this.speed -= this.acceleration * 0.6 * dt;
        if (this.speed < this.reverseMaxSpeed) this.speed = this.reverseMaxSpeed;
      }
    } else {
      if (Math.abs(this.speed) > 0.1) {
        this.speed -= Math.sign(this.speed) * this.friction * dt;
      } else {
        this.speed = 0;
      }
    }

    if (input.brake) {
      if (Math.abs(this.speed) > 0.2) {
        this.speed -= Math.sign(this.speed) * this.brakingForce * dt;
      } else {
        this.speed = 0;
      }
    }

    sounds.updateEnginePitch(Math.abs(this.speed) / this.maxSpeed);

    if (Math.abs(this.speed) > 0.2) {
      const speedRatio = Math.min(Math.abs(this.speed) / 10, 1.0);
      const turnDir = this.speed >= 0 ? -input.turn : input.turn;
      this.rotationY += turnDir * this.turnSpeed * speedRatio * dt;
    }

    const targetSteerAngle = -input.turn * 0.45;
    this.frontWheels.forEach((w) => {
      w.rotation.y = THREE.MathUtils.lerp(w.rotation.y, targetSteerAngle, dt * 10);
      w.rotation.x += (this.speed / 0.38) * dt;
    });
    this.rearWheels.forEach((w) => {
      w.rotation.x += (this.speed / 0.38) * dt;
    });

    if (input.horn) {
      sounds.playHorn();
    }

    const moveX = Math.sin(this.rotationY) * this.speed * dt;
    const moveZ = Math.cos(this.rotationY) * this.speed * dt;

    const nextX = this.position.x + moveX;
    const nextZ = this.position.z + moveZ;

    const vehicleRadius = 1.3;
    let collided = false;

    for (const box of collisionBoxes) {
      if (box.height < 1.0) continue;

      if (
        nextX + vehicleRadius > box.minX &&
        nextX - vehicleRadius < box.maxX &&
        nextZ + vehicleRadius > box.minZ &&
        nextZ - vehicleRadius < box.maxZ
      ) {
        collided = true;
        break;
      }
    }

    if (!collided) {
      this.position.x = nextX;
      this.position.z = nextZ;
    } else {
      this.speed = -this.speed * 0.35;
    }

    this.position.x = THREE.MathUtils.clamp(this.position.x, -270, 270);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -270, 270);

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }
}
