import * as THREE from 'three';

/**
 * High-definition procedural PBR texture generators for authentic Nigerian architectural assets
 */
export class TextureGenerator {
  // Weathered Asphalt with lane markings, aggregate grain & oil stains
  public static createAsphaltTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base asphalt dark gray
    ctx.fillStyle = '#1e2228';
    ctx.fillRect(0, 0, 1024, 1024);

    // Aggregate noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 24;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle road wear & oil spots
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = 20 + Math.random() * 50;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(12, 14, 18, 0.45)');
      grad.addColorStop(1, 'rgba(12, 14, 18, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 24);
    return texture;
  }

  // Famous Rusted Corrugated Iron Roof ("Brown roofs of Ibadan")
  public static createRustyRoofTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base weathered terracotta rust
    ctx.fillStyle = '#65311e';
    ctx.fillRect(0, 0, 512, 512);

    // Vertical corrugation ridges
    for (let x = 0; x < 512; x += 16) {
      const grad = ctx.createLinearGradient(x, 0, x + 16, 0);
      grad.addColorStop(0, '#4a2113');
      grad.addColorStop(0.5, '#7c3e27');
      grad.addColorStop(1, '#3f1c10');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 16, 512);
    }

    // Rust oxidation patches, rain streaks & dust
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const w = 40 + Math.random() * 90;
      const h = 50 + Math.random() * 120;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
      grad.addColorStop(0, 'rgba(180, 75, 40, 0.7)');
      grad.addColorStop(0.6, 'rgba(100, 48, 28, 0.45)');
      grad.addColorStop(1, 'rgba(70, 32, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - w / 2, y - h / 2, w, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }

  // Authentic Nigerian Sandcrete Block & Plaster Wall Texture
  public static createSandcreteWallTexture(baseColor = '#d6cdb7'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle horizontal block mortar courses
    ctx.strokeStyle = 'rgba(70, 60, 50, 0.15)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      // Staggered vertical joints
      const offset = (y / 42) % 2 === 0 ? 0 : 42;
      for (let x = offset; x < 512; x += 84) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 42);
        ctx.stroke();
      }
    }

    // Damp base stains / rain wash
    const dampGrad = ctx.createLinearGradient(0, 400, 0, 512);
    dampGrad.addColorStop(0, 'rgba(50, 45, 40, 0)');
    dampGrad.addColorStop(1, 'rgba(40, 35, 30, 0.35)');
    ctx.fillStyle = dampGrad;
    ctx.fillRect(0, 400, 512, 112);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  // Laterite Soil (Red-brown clay ground along Nigerian roadsides)
  public static createLateriteSoilTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich terracotta reddish-brown earth
    ctx.fillStyle = '#8f4a2b';
    ctx.fillRect(0, 0, 512, 512);

    // Grain & soil stones
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 35;
      data[i] = Math.max(0, Math.min(255, data[i] + n + 8));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n - 4));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  }

  // Wrought Iron Security Gate & Burglar Bars Texture
  public static createSecurityGateTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Dark charcoal / black painted iron
    ctx.fillStyle = '#14171d';
    ctx.fillRect(0, 0, 256, 256);

    // Diagonal decorative diamond bars
    ctx.strokeStyle = '#282f3a';
    ctx.lineWidth = 4;
    for (let x = -256; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 256, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + 256, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }

    // Outer frame & center plate
    ctx.fillStyle = '#0f1217';
    ctx.fillRect(0, 0, 256, 12);
    ctx.fillRect(0, 244, 256, 12);
    ctx.fillRect(0, 0, 12, 256);
    ctx.fillRect(244, 0, 12, 256);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Nigerian Commercial Signboard (Amala Skye, Bodija Market, Bovas, Kuda Bank)
  public static createSignboardTexture(
    title: string,
    subtitle: string,
    bgColor = '#1e3a8a',
    textColor = '#ffffff',
    accentColor = '#f59e0b'
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    // Board background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 160);

    // Decorative border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 148);

    // Top Title
    ctx.fillStyle = textColor;
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 256, 60);

    // Subtitle
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(subtitle, 256, 110);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Provision Kiosk Branded Steel Shutter
  public static createKioskTexture(brand: 'yellow_mtn' | 'red_airtel'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const baseColor = brand === 'yellow_mtn' ? '#f59e0b' : '#dc2626';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 256);

    // Horizontal corrugated shutter slats
    for (let y = 0; y < 256; y += 12) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, y, 256, 3);
    }

    // Logo / Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand === 'yellow_mtn' ? 'MTN MOMO' : 'AIRTEL MONEY', 128, 120);
    ctx.font = 'bold 14px monospace';
    ctx.fillText('AIRTIME & TRANSFERS', 128, 150);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Realistic Human Skin Texture
  public static createSkinTexture(baseHex: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      data[i] = Math.max(0, Math.min(255, data[i] + n + 4));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n - 2));
    }
    ctx.putImageData(imgData, 0, 0);

    return new THREE.CanvasTexture(canvas);
  }
}
