import * as THREE from 'three';
import { RemotePlayer, ChatMessage, PlayerAvatar } from '../../types/game';

export class MultiplayerManager {
  private scene: THREE.Scene;
  private socket: WebSocket | null = null;
  public localId: string = 'player_' + Math.floor(Math.random() * 89999 + 10000);
  public remotePlayers: Map<string, { data: RemotePlayer; mesh: THREE.Group; nameTag: THREE.Sprite }> = new Map();
  public chatLog: ChatMessage[] = [];
  public onChatReceived?: (msg: ChatMessage) => void;
  public isConnected: boolean = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initNetwork();
    this.seedInitialLocalDistrictPeers();
  }

  private initNetwork() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'player_sync') {
            this.handleRemoteSync(payload.data);
          } else if (payload.type === 'chat') {
            this.handleIncomingChat(payload.data);
          }
        } catch {
          // resilient parsing
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
      };
    } catch {
      // Standalone browser client fallback
      this.isConnected = false;
    }
  }

  /**
   * Seed authentic Ibadan peer players across the district so the world has real social life immediately
   */
  private seedInitialLocalDistrictPeers() {
    const defaultPeers: RemotePlayer[] = [
      {
        id: 'peer_kunle_ui',
        name: 'Kunle (UI Final Year)',
        x: -9,
        y: 0,
        z: -155,
        rotationY: Math.PI / 2,
        isDriving: false,
        avatar: {
          name: 'Kunle',
          skinTone: '#3f2512',
          outfit: 'street_hoodie',
          hair: 'fade',
          clothColor: '#059669',
          accessory: 'sunglasses',
        },
        lastSeen: Date.now(),
      },
      {
        id: 'peer_moria_market',
        name: 'Iya Moria (Bodija)',
        x: 38,
        y: 0,
        z: -42,
        rotationY: -Math.PI / 4,
        isDriving: false,
        avatar: {
          name: 'Iya Moria',
          skinTone: '#4a2c1b',
          outfit: 'ankara_shirt',
          hair: 'cap_fila',
          clothColor: '#d97706',
          accessory: 'coral_beads',
        },
        lastSeen: Date.now(),
      },
      {
        id: 'peer_tayo_micra',
        name: 'Tayo Driver',
        x: -4,
        y: 0,
        z: 40,
        rotationY: Math.PI,
        isDriving: false,
        avatar: {
          name: 'Tayo',
          skinTone: '#543621',
          outfit: 'casual_tshirt',
          hair: 'fade',
          clothColor: '#2563eb',
          accessory: 'none',
        },
        lastSeen: Date.now(),
      },
    ];

    defaultPeers.forEach((p) => this.handleRemoteSync(p));

    this.chatLog.push({
      id: 'sys_welcome',
      sender: 'District Radio',
      text: 'E kaabo! Welcome to Ibadan Life (Bodija - UI District). Broadcast active.',
      timestamp: 'Just now',
      isSystem: true,
    });
  }

  public handleRemoteSync(data: RemotePlayer) {
    if (data.id === this.localId) return;

    if (!this.remotePlayers.has(data.id)) {
      // Spawn new remote player 3D avatar in scene
      const group = new THREE.Group();
      group.position.set(data.x, data.y, data.z);
      group.rotation.y = data.rotationY;

      // Body mesh
      const matSkin = new THREE.MeshStandardMaterial({ color: data.avatar.skinTone, roughness: 0.7 });
      const matCloth = new THREE.MeshStandardMaterial({ color: data.avatar.clothColor, roughness: 0.7 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.38), matCloth);
      torso.position.y = 1.25;
      group.add(torso);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.38), matSkin);
      head.position.y = 1.88;
      group.add(head);

      const pants = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.85, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      pants.position.y = 0.42;
      group.add(pants);

      // 3D Canvas NameTag Sprite
      const nameTag = this.createNameTagSprite(data.name);
      nameTag.position.y = 2.45;
      group.add(nameTag);

      this.scene.add(group);
      this.remotePlayers.set(data.id, { data, mesh: group, nameTag });
    } else {
      // Interpolate remote player position
      const playerRecord = this.remotePlayers.get(data.id)!;
      playerRecord.data = data;
      playerRecord.mesh.position.set(data.x, data.y, data.z);
      playerRecord.mesh.rotation.y = data.rotationY;
    }
  }

  private createNameTagSprite(name: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect(10, 10, 236, 44, 22);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  public sendPosition(x: number, y: number, z: number, rotationY: number, isDriving: boolean, avatar: PlayerAvatar) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'player_sync',
          data: {
            id: this.localId,
            name: avatar.name,
            x,
            y,
            z,
            rotationY,
            isDriving,
            avatar,
            lastSeen: Date.now(),
          },
        })
      );
    }
  }

  public sendChatMessage(sender: string, text: string) {
    const msg: ChatMessage = {
      id: 'chat_' + Date.now(),
      sender,
      text,
      timestamp: 'Now',
    };
    this.chatLog.push(msg);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'chat',
          data: msg,
        })
      );
    }

    if (this.onChatReceived) {
      this.onChatReceived(msg);
    }
  }

  private handleIncomingChat(msg: ChatMessage) {
    this.chatLog.push(msg);
    if (this.onChatReceived) {
      this.onChatReceived(msg);
    }
  }
}
