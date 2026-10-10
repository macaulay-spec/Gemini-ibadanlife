import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { DistrictBuilder } from './game/world/DistrictBuilder';
import { VehicleManager } from './game/vehicles/VehicleManager';
import { CharacterController } from './game/character/CharacterController';
import { TrafficAndPedestrians } from './game/world/TrafficAndPedestrians';
import { LifeSimulationEngine } from './game/systems/LifeSimulationEngine';
import { MultiplayerManager } from './game/network/MultiplayerManager';
import { sounds } from './game/audio/soundManager';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { NaijaPhone } from './components/NaijaPhone';
import { InventoryModal } from './components/InventoryModal';
import { InteractionModal } from './components/InteractionModals';
import { CharacterCustomizerModal } from './components/CharacterCustomizerModal';
import { FullMapModal } from './components/FullMapModal';
import { NeedsModal } from './components/NeedsModal';
import { InteractionPrompt, PlayerAvatar } from './types/game';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Engine references
  const engineRef = useRef<LifeSimulationEngine>(new LifeSimulationEngine());
  const characterRef = useRef<CharacterController | null>(null);
  const vehicleRef = useRef<VehicleManager | null>(null);
  const districtRef = useRef<DistrictBuilder | null>(null);
  const trafficRef = useRef<TrafficAndPedestrians | null>(null);
  const multiplayerRef = useRef<MultiplayerManager | null>(null);

  // Input states
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchDirectionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const touchSprintRef = useRef<boolean>(false);
  const cameraOrbitRef = useRef<{ angleY: number; angleX: number; distance: number }>({
    angleY: 0,
    angleX: 0.35,
    distance: 8.5,
  });
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reactive UI States
  const [stats, setStats] = useState(engineRef.current.stats);
  const [currentDistrict, setCurrentDistrict] = useState('UI Main Gate & Campus Axis');
  const [isDriving, setIsDriving] = useState(false);
  const [vehicleSpeed, setVehicleSpeed] = useState(0);
  const [prompt, setPrompt] = useState<InteractionPrompt | null>(null);
  const [canEnterVehicle, setCanEnterVehicle] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [playerPos, setPlayerPos] = useState({ x: -6, z: -135 });

  // Modals
  const [showPhone, setShowPhone] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showNeeds, setShowNeeds] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState<
    'market_stall' | 'buka' | 'home' | 'atm' | 'suya' | null
  >(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [, setForceUpdate] = useState(0);

  const refreshUI = useCallback(() => {
    setStats({ ...engineRef.current.stats });
    setForceUpdate((prev) => prev + 1);
  }, []);

  // 1. Initialize Three.js Game World
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x8a705e, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.2,
      600
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Illumination
    const ambientLight = new THREE.AmbientLight(0xffedd5, 1.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.4);
    sunLight.position.set(80, 120, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Sky Dome with high-res Ibadan skyline panorama
    const texLoader = new THREE.TextureLoader();
    const skyGeo = new THREE.SphereGeometry(450, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xffeedd,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    texLoader.load('/src/assets/images/gta_ibadan_skyline_1791663065924.jpg', (skyTex) => {
      skyTex.colorSpace = THREE.SRGBColorSpace;
      skyMat.map = skyTex;
      skyMat.needsUpdate = true;
    });

    // World District (Bodija & UI Axis)
    const district = new DistrictBuilder(scene);
    district.buildDistrict();
    districtRef.current = district;

    // Ibadan Nissan Micra Taxi
    const micra = new VehicleManager(scene, -8, -145, 'micra_taxi');
    vehicleRef.current = micra;

    // Spawn Player Avatar on open lane in front of UI Gate
    const character = new CharacterController(scene, -6, -135, engineRef.current.avatar);
    characterRef.current = character;

    // Ambient Traffic & Walking Pedestrians
    const traffic = new TrafficAndPedestrians(scene);
    trafficRef.current = traffic;

    // Multiplayer Networking
    const multiplayer = new MultiplayerManager(scene);
    multiplayerRef.current = multiplayer;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

      if (e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'f') {
        handleContextInteract();
      } else if (e.key.toLowerCase() === 'tab') {
        e.preventDefault();
        setShowPhone((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        setShowMap((prev) => !prev);
      } else if (e.key.toLowerCase() === 'c') {
        cycleCameraMode();
      } else if (e.key.toLowerCase() === 'h') {
        sounds.playHorn();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse / Pointer Camera Orbit & Tap-to-Move
    const pointerDownPos = { x: 0, y: 0 };
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, input, form, [role="button"]')) return;
      isPointerDownRef.current = true;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
      pointerDownPos.x = e.clientX;
      pointerDownPos.y = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const deltaX = e.clientX - lastPointerPosRef.current.x;
      const deltaY = e.clientY - lastPointerPosRef.current.y;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      cameraOrbitRef.current.angleY -= deltaX * 0.005;
      cameraOrbitRef.current.angleX = THREE.MathUtils.clamp(
        cameraOrbitRef.current.angleX - deltaY * 0.004,
        0.05,
        1.1
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isPointerDownRef.current) {
        const movedDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        // If it was a quick click/tap without drag, Raycast to walk to ground position!
        if (movedDist < 10 && characterRef.current && !characterRef.current.isDriving) {
          const mouse = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
          );
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const intersectPoint = new THREE.Vector3();
          if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
            const targetX = THREE.MathUtils.clamp(intersectPoint.x, -260, 260);
            const targetZ = THREE.MathUtils.clamp(intersectPoint.z, -260, 260);
            characterRef.current.setDestination(targetX, targetZ);
            sounds.playFootstep();
          }
        }
      }
      isPointerDownRef.current = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Main Game Loop
    let clock = new THREE.Clock();
    let animFrameId: number;

    const gameLoop = () => {
      animFrameId = requestAnimationFrame(gameLoop);
      const dt = Math.min(clock.getDelta(), 0.06);

      // Advance 4D life simulation needs & time advancement
      engineRef.current.tickNeeds(dt);

      // Dynamic 4D Day/Night Sun & Sky Lighting Modulation
      const curHour = engineRef.current.stats.gameHour || 14;
      const sunRad = ((curHour - 6) / 12) * Math.PI;
      const sunElev = Math.sin(sunRad);

      if (sunElev > 0) {
        sunLight.intensity = Math.max(0.4, sunElev * 2.4);
        sunLight.position.set(80 * Math.cos(sunRad), 120 * sunElev, 60);
        ambientLight.intensity = Math.max(0.6, sunElev * 1.25);
        ambientLight.color.setHex(0xffedd5);
      } else {
        sunLight.intensity = 0.25;
        sunLight.position.set(-60, 80, -60);
        ambientLight.intensity = 0.4;
        ambientLight.color.setHex(0x1e293b);
      }

      if (!engineRef.current.stats.nepaGridActive) {
        ambientLight.intensity *= 0.65;
      }

      // Aggregate Desktop + On-Screen Touch Input
      const forwardInput =
        (keysRef.current['w'] || keysRef.current['arrowup'] ? 1 : 0) -
        (keysRef.current['s'] || keysRef.current['arrowdown'] ? 1 : 0) +
        touchDirectionRef.current.dy;

      const strafeInput =
        (keysRef.current['d'] || keysRef.current['arrowright'] ? 1 : 0) -
        (keysRef.current['a'] || keysRef.current['arrowleft'] ? 1 : 0) +
        touchDirectionRef.current.dx;

      const isSprinting = keysRef.current['shift'] || touchSprintRef.current;
      const jumpPressed = keysRef.current[' '] || false;

      // Update Character / Vehicle
      if (character.isDriving && vehicleRef.current) {
        const veh = vehicleRef.current;
        veh.update(
          dt,
          {
            forward: THREE.MathUtils.clamp(forwardInput, -1, 1),
            turn: THREE.MathUtils.clamp(strafeInput, -1, 1),
            brake: jumpPressed,
            horn: keysRef.current['h'] || false,
          },
          district.collisionBoxes
        );
        character.update(dt, { forward: 0, strafe: 0, sprint: false, jump: false }, 0, []);

        setVehicleSpeed(veh.speed);
        setPlayerPos({ x: veh.position.x, z: veh.position.z });
      } else {
        character.update(
          dt,
          {
            forward: THREE.MathUtils.clamp(forwardInput, -1, 1),
            strafe: THREE.MathUtils.clamp(strafeInput, -1, 1),
            sprint: isSprinting,
            jump: jumpPressed,
          },
          cameraOrbitRef.current.angleY,
          district.collisionBoxes
        );

        setVehicleSpeed(0);
        setPlayerPos({ x: character.position.x, z: character.position.z });
      }

      traffic.update(dt);

      // Camera Chase Tracking
      const targetPos = character.isDriving && vehicleRef.current
        ? vehicleRef.current.position
        : character.position;

      const camDistance = character.isDriving ? cameraOrbitRef.current.distance + 3.2 : cameraOrbitRef.current.distance;
      const camYOffset = character.isDriving ? 3.8 : 2.4;

      const camX =
        targetPos.x -
        Math.sin(cameraOrbitRef.current.angleY) *
          Math.cos(cameraOrbitRef.current.angleX) *
          camDistance;
      const camY = targetPos.y + Math.sin(cameraOrbitRef.current.angleX) * camDistance + camYOffset;
      const camZ =
        targetPos.z -
        Math.cos(cameraOrbitRef.current.angleY) *
          Math.cos(cameraOrbitRef.current.angleX) *
          camDistance;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(targetPos.x, targetPos.y + (character.isDriving ? 1.4 : 1.7), targetPos.z);

      checkInteractionPrompts(targetPos);

      // Active Job Dropoff Check
      if (engineRef.current.activeJob) {
        const job = engineRef.current.activeJob;
        const dx = targetPos.x - job.dropoffPos[0];
        const dz = targetPos.z - job.dropoffPos[2];
        const distToDropoff = Math.sqrt(dx * dx + dz * dz);
        if (distToDropoff < 9) {
          const reward = engineRef.current.completeActiveJob();
          if (reward) refreshUI();
        }
      }

      multiplayer.sendPosition(
        targetPos.x,
        targetPos.y,
        targetPos.z,
        character.rotationY,
        character.isDriving,
        engineRef.current.avatar
      );

      updateDistrictName(targetPos);
      renderer.render(scene, camera);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [refreshUI]);

  const checkInteractionPrompts = (pos: THREE.Vector3) => {
    if (vehicleRef.current) {
      const vehPos = vehicleRef.current.position;
      const dX = pos.x - vehPos.x;
      const dZ = pos.z - vehPos.z;
      const distToVeh = Math.sqrt(dX * dX + dZ * dZ);

      if (distToVeh < 3.8 && !characterRef.current?.isDriving) {
        setCanEnterVehicle(true);
        setPrompt({
          id: 'prompt_enter_vehicle',
          type: 'vehicle',
          title: 'Ibadan Nissan Micra Taxi',
          subtitle: 'Enter driver seat to cruise Bodija & UI axis',
          actionKey: 'E',
          distance: distToVeh,
        });
        return;
      } else {
        setCanEnterVehicle(false);
      }
    }

    if (characterRef.current?.isDriving) {
      setPrompt({
        id: 'prompt_exit_vehicle',
        type: 'vehicle',
        title: 'Exit Micra Taxi',
        subtitle: 'Step out onto Ibadan street',
        actionKey: 'E',
        distance: 0,
      });
      return;
    }

    if (districtRef.current) {
      let nearestPrompt: InteractionPrompt | null = null;
      let minDistance = 999;

      districtRef.current.interactiveHotspots.forEach((spot) => {
        const dX = pos.x - spot.x;
        const dZ = pos.z - spot.z;
        const dist = Math.sqrt(dX * dX + dZ * dZ);

        if (dist <= spot.radius && dist < minDistance) {
          minDistance = dist;
          nearestPrompt = {
            id: spot.id,
            type: spot.type as any,
            title: spot.label,
            subtitle: spot.subLabel,
            actionKey: 'E',
            distance: dist,
            targetId: spot.id,
          };
        }
      });

      setPrompt(nearestPrompt);
    }
  };

  const updateDistrictName = (pos: THREE.Vector3) => {
    if (pos.z < -100) {
      setCurrentDistrict('UI Main Gate & Campus Axis');
    } else if (pos.x > 30 && pos.z < 20) {
      setCurrentDistrict('Bodija Wholesale Food Market');
    } else if (pos.x < -30 && pos.z < 20) {
      setCurrentDistrict('Agbowo Commercial Strip');
    } else if (pos.x > 30 && pos.z > 80) {
      setCurrentDistrict('New Bodija Residential Estate');
    } else if (pos.x < -30 && pos.z > 50) {
      setCurrentDistrict('Ventura & Bovas Strip');
    } else {
      setCurrentDistrict('UI - Secretariat Boulevard');
    }
  };

  const handleContextInteract = () => {
    const char = characterRef.current;
    const veh = vehicleRef.current;

    if (char && char.isDriving) {
      char.exitVehicle();
      setIsDriving(false);
      sounds.stopEngine();
      sounds.playInteract();
      return;
    }

    if (canEnterVehicle && char && veh) {
      char.enterVehicle(veh);
      setIsDriving(true);
      sounds.startEngine();
      sounds.playInteract();
      return;
    }

    if (prompt) {
      sounds.playInteract();
      if (prompt.type === 'market_stall') {
        setShowInteractionModal('market_stall');
      } else if (prompt.type === 'buka') {
        setShowInteractionModal('buka');
      } else if (prompt.type === 'suya') {
        setShowInteractionModal('suya');
      } else if (prompt.type === 'home') {
        setShowInteractionModal('home');
      } else if (prompt.type === 'atm') {
        setShowInteractionModal('atm');
      } else if (prompt.type === 'job') {
        if (prompt.id.includes('yam')) {
          engineRef.current.acceptJob('job_yam_porter');
        } else {
          engineRef.current.acceptJob('job_taxi_1');
        }
        refreshUI();
      }
    }
  };

  const handleFastTravel = (targetX: number, targetZ: number) => {
    const char = characterRef.current;
    const veh = vehicleRef.current;
    if (char) {
      char.position.set(targetX, 0, targetZ);
      char.group.position.copy(char.position);
      if (char.isDriving && veh) {
        veh.position.set(targetX, 0, targetZ);
        veh.speed = 0;
        veh.group.position.copy(veh.position);
      }
      setPlayerPos({ x: targetX, z: targetZ });
      sounds.playInteract();
    }
  };

  const cycleCameraMode = () => {
    if (cameraOrbitRef.current.distance <= 6.0) {
      // Switch to Kenney Isometric 45-degree City View (Images 1 & 2)
      cameraOrbitRef.current.distance = 26.0;
      cameraOrbitRef.current.angleX = 0.65;
      cameraOrbitRef.current.angleY = Math.PI / 4;
    } else if (cameraOrbitRef.current.distance > 20.0) {
      // Switch to Third-Person Chase Cam
      cameraOrbitRef.current.distance = 8.8;
      cameraOrbitRef.current.angleX = 0.35;
    } else {
      // Switch to Close Shoulder Cam
      cameraOrbitRef.current.distance = 5.0;
      cameraOrbitRef.current.angleX = 0.25;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    sounds.setMuted(newMuted);
    setIsMuted(newMuted);
  };

  return (
    <div
      onClick={() => window.focus()}
      className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none"
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Floating 2D HUD */}
      <HUD
        stats={stats}
        currentDistrict={currentDistrict}
        isDriving={isDriving}
        vehicleSpeed={vehicleSpeed}
        prompt={prompt}
        activeJob={engineRef.current.activeJob}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenPhone={() => setShowPhone(true)}
        onOpenInventory={() => setShowInventory(true)}
        onOpenMap={() => setShowMap(true)}
        onOpenNeeds={() => setShowNeeds(true)}
        onTriggerInteract={handleContextInteract}
        onCycleCamera={cycleCameraMode}
        playerPos={playerPos}
      />

      {/* On-Screen D-Pad and Action Controls */}
      <MobileControls
        isDriving={isDriving}
        canEnterVehicle={canEnterVehicle}
        onDirectionInput={(dx, dy) => {
          touchDirectionRef.current = { dx, dy };
        }}
        onSprintToggle={(sprinting) => {
          touchSprintRef.current = sprinting;
        }}
        onJumpOrBrake={() => {
          keysRef.current[' '] = true;
          setTimeout(() => {
            keysRef.current[' '] = false;
          }, 200);
        }}
        onVehicleToggle={handleContextInteract}
        onHorn={() => sounds.playHorn()}
        onOpenMap={() => setShowMap(true)}
        onOpenNeeds={() => setShowNeeds(true)}
        onOpenPhone={() => setShowPhone(true)}
      />

      {/* Lagos Life 6 Character Needs & 4D Systems Modal */}
      {showNeeds && (
        <NeedsModal
          engine={engineRef.current}
          onClose={() => {
            setShowNeeds(false);
            refreshUI();
          }}
          onRefresh={refreshUI}
        />
      )}

      {/* Full-Screen Cartographic District Map */}
      {showMap && (
        <FullMapModal
          playerPos={playerPos}
          onFastTravel={handleFastTravel}
          onClose={() => setShowMap(false)}
        />
      )}

      {/* NaijaPhone Interactive Smartphone */}
      {showPhone && (
        <NaijaPhone
          engine={engineRef.current}
          chatLog={multiplayerRef.current?.chatLog || []}
          onSendMessage={(text) => {
            multiplayerRef.current?.sendChatMessage(engineRef.current.avatar.name, text);
            refreshUI();
          }}
          onClose={() => {
            setShowPhone(false);
            refreshUI();
          }}
        />
      )}

      {/* Inventory & Bag Modal */}
      {showInventory && (
        <InventoryModal
          engine={engineRef.current}
          onClose={() => {
            setShowInventory(false);
            refreshUI();
          }}
          onRefresh={refreshUI}
        />
      )}

      {/* Contextual Interaction Modal (Market, Buka, Home, ATM) */}
      {showInteractionModal && (
        <InteractionModal
          type={showInteractionModal}
          engine={engineRef.current}
          onClose={() => {
            setShowInteractionModal(null);
            refreshUI();
          }}
          onRefresh={refreshUI}
        />
      )}

      {/* Character Wardrobe & Attire Customizer */}
      {showCustomizer && (
        <CharacterCustomizerModal
          initialAvatar={engineRef.current.avatar}
          onSave={(newAvatar: PlayerAvatar) => {
            engineRef.current.avatar = newAvatar;
            engineRef.current.saveState();
            if (characterRef.current) {
              characterRef.current.updateAvatarStyle(newAvatar);
            }
            setShowCustomizer(false);
            refreshUI();
          }}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}
