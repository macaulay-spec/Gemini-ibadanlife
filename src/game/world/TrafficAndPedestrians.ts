import * as THREE from 'three';

interface AmbientCar {
  mesh: THREE.Group;
  lane: 'left' | 'right';
  x: number;
  z: number;
  speed: number;
  direction: number; // 1 or -1 along Z
  color: number;
}

interface AmbientPedestrian {
  group: THREE.Group;
  x: number;
  z: number;
  speed: number;
  direction: number;
  minZ: number;
  maxZ: number;
  animTimer: number;
  lArm: THREE.Mesh;
  rArm: THREE.Mesh;
  lLeg: THREE.Mesh;
  rLeg: THREE.Mesh;
}

export class TrafficAndPedestrians {
  private scene: THREE.Scene;
  private cars: AmbientCar[] = [];
  private pedestrians: AmbientPedestrian[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initAmbientTraffic();
    this.initAmbientPedestrians();
  }

  private initAmbientTraffic() {
    // Colors of Ibadan city vehicles: Yellow/Blue Micra, Danfo Yellow, White Sedan
    const carColors = [0xf59e0b, 0x1d4ed8, 0xfacc15, 0xe2e8f0, 0x059669];

    // Left Lane (Northbound, Z from 180 to -180)
    for (let i = 0; i < 5; i++) {
      const zPos = -160 + i * 75;
      const carGroup = this.createCarMesh(carColors[i % carColors.length]);
      carGroup.position.set(-5.5, 0, zPos);
      this.scene.add(carGroup);

      this.cars.push({
        mesh: carGroup,
        lane: 'left',
        x: -5.5,
        z: zPos,
        speed: 12 + Math.random() * 4,
        direction: -1,
        color: carColors[i % carColors.length],
      });
    }

    // Right Lane (Southbound, Z from -180 to 180)
    for (let i = 0; i < 5; i++) {
      const zPos = -130 + i * 70;
      const carGroup = this.createCarMesh(carColors[(i + 2) % carColors.length]);
      carGroup.rotation.y = Math.PI;
      carGroup.position.set(5.5, 0, zPos);
      this.scene.add(carGroup);

      this.cars.push({
        mesh: carGroup,
        lane: 'right',
        x: 5.5,
        z: zPos,
        speed: 11 + Math.random() * 4,
        direction: 1,
        color: carColors[(i + 2) % carColors.length],
      });
    }
  }

  private createCarMesh(color: number): THREE.Group {
    const group = new THREE.Group();
    const matBody = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
    const matTyre = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.9 });

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.8, 0.65, 3.8);
    const body = new THREE.Mesh(bodyGeo, matBody);
    body.position.y = 0.55;
    group.add(body);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(1.65, 0.65, 2.0);
    const cabin = new THREE.Mesh(cabinGeo, matGlass);
    cabin.position.set(0, 1.1, -0.2);
    group.add(cabin);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12);
    wheelGeo.rotateZ(Math.PI / 2);

    [-0.9, 0.9].forEach((wx) => {
      [-1.1, 1.1].forEach((wz) => {
        const wheel = new THREE.Mesh(wheelGeo, matTyre);
        wheel.position.set(wx, 0.32, wz);
        group.add(wheel);
      });
    });

    return group;
  }

  private initAmbientPedestrians() {
    const skinTones = [0x543621, 0x3d2314, 0x6e4529];
    const shirtColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xffffff];

    // Spawn 14 pedestrians along sidewalks
    for (let i = 0; i < 14; i++) {
      const isWestSide = i % 2 === 0;
      const x = isWestSide ? -13.5 : 13.5;
      const z = -170 + i * 26;
      const skinColor = skinTones[i % skinTones.length];
      const shirtColor = shirtColors[i % shirtColors.length];

      const pGroup = new THREE.Group();
      pGroup.position.set(x, 0, z);

      const matSkin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
      const matShirt = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.8 });
      const matPants = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });

      // Torso
      const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.3);
      const torso = new THREE.Mesh(torsoGeo, matShirt);
      torso.position.y = 1.15;
      pGroup.add(torso);

      // Head
      const headGeo = new THREE.BoxGeometry(0.32, 0.36, 0.32);
      const head = new THREE.Mesh(headGeo, matSkin);
      head.position.y = 1.7;
      pGroup.add(head);

      // Headwrap / Gele for market women on some pedestrians
      if (i % 3 === 0) {
        const geleGeo = new THREE.BoxGeometry(0.42, 0.22, 0.42);
        const gele = new THREE.Mesh(geleGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        gele.position.y = 1.95;
        pGroup.add(gele);
      }

      // Arms
      const armGeo = new THREE.BoxGeometry(0.14, 0.6, 0.14);
      armGeo.translate(0, -0.3, 0);

      const lArm = new THREE.Mesh(armGeo, matShirt);
      lArm.position.set(-0.35, 1.45, 0);
      pGroup.add(lArm);

      const rArm = new THREE.Mesh(armGeo, matShirt);
      rArm.position.set(0.35, 1.45, 0);
      pGroup.add(rArm);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.18, 0.75, 0.18);
      legGeo.translate(0, -0.35, 0);

      const lLeg = new THREE.Mesh(legGeo, matPants);
      lLeg.position.set(-0.15, 0.75, 0);
      pGroup.add(lLeg);

      const rLeg = new THREE.Mesh(legGeo, matPants);
      rLeg.position.set(0.15, 0.75, 0);
      pGroup.add(rLeg);

      this.scene.add(pGroup);

      this.pedestrians.push({
        group: pGroup,
        x,
        z,
        speed: 1.2 + Math.random() * 0.8,
        direction: Math.random() > 0.5 ? 1 : -1,
        minZ: z - 35,
        maxZ: z + 35,
        animTimer: Math.random() * 10,
        lArm,
        rArm,
        lLeg,
        rLeg,
      });
    }
  }

  public update(dt: number) {
    // 1. Move Ambient Road Traffic
    this.cars.forEach((car) => {
      car.z += car.direction * car.speed * dt;

      // Loop around road loop ends
      if (car.direction === -1 && car.z < -200) {
        car.z = 200;
      } else if (car.direction === 1 && car.z > 200) {
        car.z = -200;
      }

      car.mesh.position.set(car.x, 0, car.z);
    });

    // 2. Animate and Walk Pedestrians
    this.pedestrians.forEach((ped) => {
      ped.z += ped.direction * ped.speed * dt;
      if (ped.z > ped.maxZ) {
        ped.direction = -1;
        ped.group.rotation.y = Math.PI;
      } else if (ped.z < ped.minZ) {
        ped.direction = 1;
        ped.group.rotation.y = 0;
      }

      ped.group.position.set(ped.x, 0, ped.z);

      // Limb stride animation
      ped.animTimer += dt * 6;
      const angle = Math.sin(ped.animTimer) * 0.5;
      ped.lArm.rotation.x = angle;
      ped.rArm.rotation.x = -angle;
      ped.lLeg.rotation.x = -angle;
      ped.rLeg.rotation.x = angle;
    });
  }
}
