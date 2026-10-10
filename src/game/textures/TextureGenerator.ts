import * as THREE from 'three';

/**
 * High-definition procedural PBR texture generators for realistic GTA-grade assets
 */
export class TextureGenerator {
  // Weathered Asphalt with lane markings, aggregate grain & oil stains
  public static createAsphaltTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base asphalt dark gray
    ctx.fillStyle = '#22262c';
    ctx.fillRect(0, 0, 1024, 1024);

    // Aggregate noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle road wear & oil spots
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = 20 + Math.random() * 60;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(15, 18, 22, 0.4)');
      grad.addColorStop(1, 'rgba(15, 18, 22, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 20);
    return texture;
  }

  // Weathered Rusty Corrugated Iron Roof ("Brown roofs of Ibadan")
  public static createRustyRoofTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base terracotta rust
    ctx.fillStyle = '#6b3624';
    ctx.fillRect(0, 0, 512, 512);

    // Vertical corrugation ridges
    for (let x = 0; x < 512; x += 16) {
      const grad = ctx.createLinearGradient(x, 0, x + 16, 0);
      grad.addColorStop(0, '#53291b');
      grad.addColorStop(0.5, '#87452f');
      grad.addColorStop(1, '#452015');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 16, 512);
    }

    // Rust oxidation patches & streaks
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const w = 40 + Math.random() * 100;
      const h = 60 + Math.random() * 140;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
      grad.addColorStop(0, 'rgba(168, 70, 38, 0.6)');
      grad.addColorStop(0.6, 'rgba(92, 45, 27, 0.4)');
      grad.addColorStop(1, 'rgba(92, 45, 27, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - w / 2, y - h / 2, w, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  // Denim Jacket & Fabric texture
  public static createDenimTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#273b54';
    ctx.fillRect(0, 0, 256, 256);

    // Twill diagonal weave lines
    ctx.strokeStyle = 'rgba(74, 107, 148, 0.35)';
    ctx.lineWidth = 1;
    for (let i = -256; i < 512; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }

    // Faded wash streaks
    const wash = ctx.createLinearGradient(0, 0, 256, 0);
    wash.addColorStop(0, 'rgba(100, 140, 190, 0.15)');
    wash.addColorStop(0.5, 'rgba(100, 140, 190, 0.35)');
    wash.addColorStop(1, 'rgba(100, 140, 190, 0.15)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Nigerian Ankara Fabric Pattern Texture (Geometric traditional print)
  public static createAnkaraTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rich gold base
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 256, 256);

    // Indigo blue geometric motifs
    ctx.fillStyle = '#1e3a8a';
    for (let x = 0; x < 256; x += 64) {
      for (let y = 0; y < 256; y += 64) {
        ctx.beginPath();
        ctx.arc(x + 32, y + 32, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(x + 24, y + 24, 16, 16);
        ctx.fillStyle = '#1e3a8a';
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  // Realistic Human Skin Texture with subtle warmth
  public static createSkinTexture(baseHex: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    // Micro skin texture grain
    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      data[i] = Math.max(0, Math.min(255, data[i] + n + 4)); // warmer red tone
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n - 2));
    }
    ctx.putImageData(imgData, 0, 0);

    return new THREE.CanvasTexture(canvas);
  }

  // Concrete building facade with windows
  public static createBuildingFacadeTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Plaster wall
    ctx.fillStyle = '#dcd7cd';
    ctx.fillRect(0, 0, 512, 512);

    // Grime & weathered concrete bands
    ctx.fillStyle = 'rgba(60, 50, 45, 0.12)';
    for (let y = 0; y < 512; y += 64) {
      ctx.fillRect(0, y, 512, 3);
    }

    // Windows with reflections and curtains
    for (let y = 40; y < 480; y += 110) {
      for (let x = 35; x < 480; x += 110) {
        // Frame
        ctx.fillStyle = '#27272a';
        ctx.fillRect(x, y, 70, 70);

        // Glass reflection
        const glassGrad = ctx.createLinearGradient(x, y, x + 70, y + 70);
        glassGrad.addColorStop(0, '#1e293b');
        glassGrad.addColorStop(0.5, '#334155');
        glassGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = glassGrad;
        ctx.fillRect(x + 4, y + 4, 62, 62);

        // Glare stripe
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 60);
        ctx.lineTo(x + 60, y + 10);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }
}
