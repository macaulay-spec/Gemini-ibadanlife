import * as THREE from 'three';
import { PlayerAvatar } from '../../types/game';
import { CollisionBox } from '../world/DistrictBuilder';
import { VehicleManager } from '../vehicles/VehicleManager';

export interface MovementInput {
  forward: number;
  strafe: number;
  sprint: boolean;
  jump: boolean;
}

/**
 * Realistic 3D Character Controller modeled after Marcus "King" Carter
 * (Black bomber jacket with gold zip, white tee, silver chain, crossbody strap, distressed jeans, combat boots)
 */
export class CharacterController {
  public scene: THREE.Scene;
  public group: THREE.Group;
  public avatar: PlayerAvatar;

  // Transform & Physics
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public rotationY: number = 0;
  public velocityY: number = 0;
  public isGrounded: boolean = true;
  public isDriving: boolean = false;
  public currentVehicle: VehicleManager | null = null;

  public walkSpeed: number = 6.2;
  public sprintSpeed: number = 10.5;
  public jumpStrength: number = 7.0;
  public gravity: number = 20.0;
  public targetDestination: { x: number; z: number } | null = null;

  public setDestination(x: number, z: number) {
    this.targetDestination = { x, z };
  }

  public clearDestination() {
    this.targetDestination = null;
  }

  // Hierarchical Body Rig
  private pelvisGroup: THREE.Group = new THREE.Group();
  private spineGroup: THREE.Group = new THREE.Group();
  private headGroup: THREE.Group = new THREE.Group();
  private leftUpperArm: THREE.Group = new THREE.Group();
  private leftForearm: THREE.Group = new THREE.Group();
  private rightUpperArm: THREE.Group = new THREE.Group();
  private rightForearm: THREE.Group = new THREE.Group();
  private leftThigh: THREE.Group = new THREE.Group();
  private leftCalf: THREE.Group = new THREE.Group();
  private rightThigh: THREE.Group = new THREE.Group();
  private rightCalf: THREE.Group = new THREE.Group();

  private animTimer: number = 0;

  constructor(scene: THREE.Scene, startX: number, startZ: number, avatar: PlayerAvatar) {
    this.scene = scene;
    this.avatar = avatar;
    this.group = new THREE.Group();
    this.position.set(startX, 0, startZ);
    this.group.position.copy(this.position);

    this.buildMarcusCarterRig();
    this.scene.add(this.group);
  }

  public updateAvatarStyle(newAvatar: PlayerAvatar) {
    this.avatar = newAvatar;
  }

  /**
   * Build Marcus "King" Carter Rig
   */
  private buildMarcusCarterRig() {
    // Premium materials
    const matSkin = new THREE.MeshStandardMaterial({
      color: 0x4a2e1d, // Natural warm African skin tone
      roughness: 0.6,
      metalness: 0.05,
    });

    const matBomberJacket = new THREE.MeshStandardMaterial({
      color: 0x1f242d, // Charcoal black bomber leather/nylon
      roughness: 0.45,
      metalness: 0.15,
    });

    const matWhiteTee = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Crisp white undershirt
      roughness: 0.8,
    });

    const matGoldZip = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Golden zipper
      roughness: 0.3,
      metalness: 0.9,
    });

    const matSilverChain = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Silver necklace
      roughness: 0.2,
      metalness: 0.95,
    });

    const matCrossbodyStrap = new THREE.MeshStandardMaterial({
      color: 0x111827, // Black webbing strap
      roughness: 0.7,
    });

    const matDarkJeans = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark washed denim jeans
      roughness: 0.75,
    });

    const matCombatBoots = new THREE.MeshStandardMaterial({
      color: 0x09090b, // Black tactical combat boots
      roughness: 0.4,
      metalness: 0.2,
    });

    const matWatch = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.3,
      metalness: 0.8,
    });

    const matHair = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.95,
    });

    // 1. Pelvis / Hips (Root)
    this.pelvisGroup.position.y = 0.96;
    this.group.add(this.pelvisGroup);

    const pelvisMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.18, 12), matDarkJeans);
    this.pelvisGroup.add(pelvisMesh);

    // 2. Spine & Torso (Bomber Jacket with white tee & gold zip)
    this.spineGroup.position.y = 0.09;
    this.pelvisGroup.add(this.spineGroup);

    // Torso Base (Bomber Jacket)
    const jacketGeo = new THREE.BoxGeometry(0.44, 0.52, 0.28);
    const jacket = new THREE.Mesh(jacketGeo, matBomberJacket);
    jacket.position.y = 0.26;
    jacket.castShadow = true;
    this.spineGroup.add(jacket);

    // White V-neck / crew-neck undershirt inset in center
    const teeGeo = new THREE.BoxGeometry(0.16, 0.44, 0.04);
    const tee = new THREE.Mesh(teeGeo, matWhiteTee);
    tee.position.set(0, 0.28, 0.13);
    this.spineGroup.add(tee);

    // Gold Zipper stripe along front
    const zipGeo = new THREE.BoxGeometry(0.025, 0.48, 0.02);
    const zip = new THREE.Mesh(zipGeo, matGoldZip);
    zip.position.set(0, 0.26, 0.145);
    this.spineGroup.add(zip);

    // Thin Silver Chain Necklace
    const chainGeo = new THREE.TorusGeometry(0.09, 0.012, 8, 16);
    chainGeo.rotateX(Math.PI / 2.2);
    const chain = new THREE.Mesh(chainGeo, matSilverChain);
    chain.position.set(0, 0.47, 0.08);
    this.spineGroup.add(chain);

    // Crossbody Shoulder Strap (runs diagonally from right shoulder to left hip)
    const strapGeo = new THREE.BoxGeometry(0.05, 0.62, 0.02);
    const strap = new THREE.Mesh(strapGeo, matCrossbodyStrap);
    strap.position.set(-0.02, 0.26, 0.14);
    strap.rotation.z = 0.52; // diagonal cross
    this.spineGroup.add(strap);

    // Crossbody Utility Bag / Satchel hanging at left hip
    const bagGeo = new THREE.BoxGeometry(0.12, 0.18, 0.1);
    const bag = new THREE.Mesh(bagGeo, matCrossbodyStrap);
    bag.position.set(-0.25, 0.04, 0.02);
    this.spineGroup.add(bag);

    // 3. Neck & Sculpted Head with Fade Hair & Beard
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
    const neck = new THREE.Mesh(neckGeo, matSkin);
    neck.position.y = 0.56;
    this.spineGroup.add(neck);

    this.headGroup.position.set(0, 0.7, 0);
    this.spineGroup.add(this.headGroup);

    // Cranium
    const headGeo = new THREE.SphereGeometry(0.165, 16, 16);
    headGeo.scale(1.0, 1.15, 1.05);
    const head = new THREE.Mesh(headGeo, matSkin);
    head.castShadow = true;
    this.headGroup.add(head);

    // Jaw & Chin
    const jawGeo = new THREE.BoxGeometry(0.18, 0.14, 0.18);
    const jaw = new THREE.Mesh(jawGeo, matSkin);
    jaw.position.set(0, -0.06, 0.04);
    this.headGroup.add(jaw);

    // Beard & Goatee (Dark textured beard)
    const beardGeo = new THREE.BoxGeometry(0.185, 0.11, 0.19);
    const beard = new THREE.Mesh(beardGeo, matHair);
    beard.position.set(0, -0.08, 0.045);
    this.headGroup.add(beard);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.035, 0.07, 5);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, matSkin);
    nose.position.set(0, 0.01, 0.18);
    this.headGroup.add(nose);

    // Short Textured Fade Haircut
    const hairGeo = new THREE.SphereGeometry(0.172, 14, 14);
    hairGeo.scale(1.01, 1.1, 1.05);
    const hair = new THREE.Mesh(hairGeo, matHair);
    hair.position.set(0, 0.05, -0.015);
    this.headGroup.add(hair);

    // 4. Arms (Bomber Sleeves, Forearms, Tactical Watch, Hands)
    const upperArmGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.28, 8);
    upperArmGeo.translate(0, -0.14, 0);
    const forearmGeo = new THREE.CylinderGeometry(0.055, 0.045, 0.25, 8);
    forearmGeo.translate(0, -0.12, 0);
    const handGeo = new THREE.BoxGeometry(0.06, 0.09, 0.035);
    handGeo.translate(0, -0.04, 0);

    // Left Arm (with Smartwatch)
    this.leftUpperArm.position.set(-0.28, 0.46, 0);
    this.leftUpperArm.add(new THREE.Mesh(upperArmGeo, matBomberJacket));
    this.spineGroup.add(this.leftUpperArm);

    this.leftForearm.position.set(0, -0.28, 0);
    this.leftForearm.add(new THREE.Mesh(forearmGeo, matSkin));

    // Tactical Wristwatch on Left Wrist
    const watchGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.04, 10);
    const watch = new THREE.Mesh(watchGeo, matWatch);
    watch.position.y = -0.18;
    this.leftForearm.add(watch);

    this.leftForearm.add(new THREE.Mesh(handGeo, matSkin));
    this.leftUpperArm.add(this.leftForearm);

    // Right Arm
    this.rightUpperArm.position.set(0.28, 0.46, 0);
    this.rightUpperArm.add(new THREE.Mesh(upperArmGeo, matBomberJacket));
    this.spineGroup.add(this.rightUpperArm);

    this.rightForearm.position.set(0, -0.28, 0);
    this.rightForearm.add(new THREE.Mesh(forearmGeo, matSkin));
    this.rightForearm.add(new THREE.Mesh(handGeo, matSkin));
    this.rightUpperArm.add(this.rightForearm);

    // 5. Legs & Feet (Distressed Jeans & Combat Boots)
    const thighGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.44, 8);
    thighGeo.translate(0, -0.22, 0);
    const calfGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.42, 8);
    calfGeo.translate(0, -0.21, 0);

    // Distressed knee patch detail
    const kneeRipGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
    const matRip = new THREE.MeshBasicMaterial({ color: 0x4a2e1d });

    // Left Leg
    this.leftThigh.position.set(-0.12, 0, 0);
    this.leftThigh.add(new THREE.Mesh(thighGeo, matDarkJeans));

    const lRip = new THREE.Mesh(kneeRipGeo, matRip);
    lRip.position.set(0, -0.42, 0.08);
    this.leftThigh.add(lRip);

    this.pelvisGroup.add(this.leftThigh);

    this.leftCalf.position.set(0, -0.44, 0);
    this.leftCalf.add(new THREE.Mesh(calfGeo, matDarkJeans));

    // Combat Boot Left
    const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.24), matCombatBoots);
    lBoot.position.set(0, -0.38, 0.05);
    this.leftCalf.add(lBoot);
    this.leftThigh.add(this.leftCalf);

    // Right Leg
    this.rightThigh.position.set(0.12, 0, 0);
    this.rightThigh.add(new THREE.Mesh(thighGeo, matDarkJeans));

    const rRip = new THREE.Mesh(kneeRipGeo, matRip);
    rRip.position.set(0, -0.42, 0.08);
    this.rightThigh.add(rRip);

    this.pelvisGroup.add(this.rightThigh);

    this.rightCalf.position.set(0, -0.44, 0);
    this.rightCalf.add(new THREE.Mesh(calfGeo, matDarkJeans));

    // Combat Boot Right
    const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.24), matCombatBoots);
    rBoot.position.set(0, -0.38, 0.05);
    this.rightCalf.add(rBoot);
    this.rightThigh.add(this.rightCalf);
  }

  public enterVehicle(vehicle: VehicleManager) {
    this.isDriving = true;
    this.currentVehicle = vehicle;
    vehicle.isOccupied = true;
    this.group.visible = false;
  }

  public exitVehicle() {
    if (!this.currentVehicle) return;
    this.isDriving = false;
    this.currentVehicle.isOccupied = false;
    const exitOffset = new THREE.Vector3(-1.8, 0, 0);
    exitOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.currentVehicle.rotationY);
    this.position.copy(this.currentVehicle.position).add(exitOffset);
    this.group.position.copy(this.position);
    this.group.visible = true;
    this.currentVehicle = null;
  }

  /**
   * Smooth, Responsive Character Movement & Animation
   */
  public update(
    dt: number,
    input: MovementInput,
    cameraAngle: number,
    collisionBoxes: CollisionBox[]
  ) {
    if (this.isDriving && this.currentVehicle) {
      this.position.copy(this.currentVehicle.position);
      this.rotationY = this.currentVehicle.rotationY;
      this.group.position.copy(this.position);
      return;
    }

    const hasManualInput = Math.abs(input.forward) > 0.05 || Math.abs(input.strafe) > 0.05;
    if (hasManualInput) {
      this.targetDestination = null; // Manual control cancels auto-walk
    }

    let isMoving = false;
    let targetAngle = this.rotationY;
    let currentSpeed = input.sprint ? this.sprintSpeed : this.walkSpeed;

    if (hasManualInput) {
      isMoving = true;
      const inputAngle = Math.atan2(input.strafe, input.forward);
      targetAngle = cameraAngle + inputAngle;
    } else if (this.targetDestination) {
      const dX = this.targetDestination.x - this.position.x;
      const dZ = this.targetDestination.z - this.position.z;
      const dist = Math.sqrt(dX * dX + dZ * dZ);

      if (dist < 0.8) {
        this.targetDestination = null;
        isMoving = false;
      } else {
        isMoving = true;
        targetAngle = Math.atan2(dX, dZ);
        currentSpeed = this.walkSpeed;
      }
    }

    if (isMoving) {
      const diff = Math.atan2(Math.sin(targetAngle - this.rotationY), Math.cos(targetAngle - this.rotationY));
      this.rotationY += diff * Math.min(dt * 18, 1);

      const moveX = Math.sin(this.rotationY) * currentSpeed * dt;
      const moveZ = Math.cos(this.rotationY) * currentSpeed * dt;

      const nextX = this.position.x + moveX;
      const nextZ = this.position.z + moveZ;

      // Generous swept-sphere collision allowing fluid movement
      const radius = 0.4;
      let collidesX = false;
      let collidesZ = false;

      for (const box of collisionBoxes) {
        if (box.height < 1.0) continue; // Walk smoothly over curbs & dividers

        const isCurrentlyInside =
          this.position.x + radius > box.minX &&
          this.position.x - radius < box.maxX &&
          this.position.z + radius > box.minZ &&
          this.position.z - radius < box.maxZ;

        if (
          nextX + radius > box.minX &&
          nextX - radius < box.maxX &&
          this.position.z + radius > box.minZ &&
          this.position.z - radius < box.maxZ
        ) {
          if (!isCurrentlyInside) collidesX = true;
        }
        if (
          this.position.x + radius > box.minX &&
          this.position.x - radius < box.maxX &&
          nextZ + radius > box.minZ &&
          nextZ - radius < box.maxZ
        ) {
          if (!isCurrentlyInside) collidesZ = true;
        }
      }

      if (!collidesX) this.position.x = nextX;
      if (!collidesZ) this.position.z = nextZ;

      // Realistic Athletic Walk & Sprint Kinematics
      this.animTimer += dt * (input.sprint ? 14 : 9);
      const stride = Math.sin(this.animTimer) * (input.sprint ? 0.8 : 0.5);

      this.leftThigh.rotation.x = stride;
      this.leftCalf.rotation.x = Math.max(0, -stride * 1.1);

      this.rightThigh.rotation.x = -stride;
      this.rightCalf.rotation.x = Math.max(0, stride * 1.1);

      this.leftUpperArm.rotation.x = -stride * 0.85;
      this.leftForearm.rotation.x = -Math.abs(stride) * 0.35;

      this.rightUpperArm.rotation.x = stride * 0.85;
      this.rightForearm.rotation.x = -Math.abs(stride) * 0.35;

      this.pelvisGroup.position.y = 0.96 + Math.abs(Math.sin(this.animTimer * 2)) * 0.04;
      this.spineGroup.rotation.y = Math.sin(this.animTimer) * 0.06;
    } else {
      // Natural idle stance
      this.leftThigh.rotation.x = THREE.MathUtils.lerp(this.leftThigh.rotation.x, 0, dt * 10);
      this.leftCalf.rotation.x = THREE.MathUtils.lerp(this.leftCalf.rotation.x, 0, dt * 10);
      this.rightThigh.rotation.x = THREE.MathUtils.lerp(this.rightThigh.rotation.x, 0, dt * 10);
      this.rightCalf.rotation.x = THREE.MathUtils.lerp(this.rightCalf.rotation.x, 0, dt * 10);
      this.leftUpperArm.rotation.x = THREE.MathUtils.lerp(this.leftUpperArm.rotation.x, 0, dt * 10);
      this.leftForearm.rotation.x = THREE.MathUtils.lerp(this.leftForearm.rotation.x, 0, dt * 10);
      this.rightUpperArm.rotation.x = THREE.MathUtils.lerp(this.rightUpperArm.rotation.x, 0, dt * 10);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, 0, dt * 10);
      this.pelvisGroup.position.y = 0.96;
      this.spineGroup.rotation.y = 0;
    }

    if (input.jump && this.isGrounded) {
      this.velocityY = this.jumpStrength;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    this.position.x = THREE.MathUtils.clamp(this.position.x, -280, 280);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -280, 280);

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }
}
