import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CursorFlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  hue: number;
}

export interface OrbitalSatellite {
  id: string;
  label: string;
  sublabel: string;
  route: string;
  color: string;
  screenX: number;
  screenY: number;
  isBehind: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cursorCanvas', { static: true }) cursorCanvasRef!: ElementRef<HTMLCanvasElement>;

  public detectedTimeString: string = '';
  public fpsCount: number = 60;
  public isLoading: boolean = true;
  public loadProgress: number = 0;
  public loadError: string | null = null;

  // 8 Interactive Celestial Gemstone Nodes (Each completely distinct across the color spectrum)
  public orbitalSatellites: OrbitalSatellite[] = [
    { id: 'world-data', label: 'World Data', sublabel: 'GIS & Indicators', route: '/world-data', color: '#00f2fe', screenX: 0, screenY: 0, isBehind: false },
    { id: 'empires', label: 'Empires', sublabel: 'Historical Cartography', route: '/empires', color: '#ef4444', screenX: 0, screenY: 0, isBehind: false },
    { id: 'maritime', label: 'Maritime', sublabel: 'Live AIS Radar', route: '/maritime', color: '#10b981', screenX: 0, screenY: 0, isBehind: false },
    { id: 'forex', label: 'Forex Matrix', sublabel: 'Global FX Rates', route: '/forex', color: '#f59e0b', screenX: 0, screenY: 0, isBehind: false },
    { id: 'quiz', label: 'Global Quiz', sublabel: 'World Trivia', route: '/quiz', color: '#a855f7', screenX: 0, screenY: 0, isBehind: false },
    { id: 'locate', label: 'Country Locator', sublabel: 'Map Finder Game', route: '/locate', color: '#ec4899', screenX: 0, screenY: 0, isBehind: false },
    { id: 'spatial-sql', label: 'Spatial SQL', sublabel: 'DuckDB In-Browser', route: '/spatial-sql', color: '#ff5722', screenX: 0, screenY: 0, isBehind: false },
    { id: 'fishing', label: 'Fishing Watch', sublabel: 'Ocean Telemetry', route: '/fishing', color: '#84cc16', screenX: 0, screenY: 0, isBehind: false }
  ];

  public hoveredSatId: string | null = null;
  public isOrbitPaused: boolean = false;
  public dockItemScales: number[] = [1, 1, 1, 1, 1, 1, 1, 1];
  public dockItemTranslateY: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  public get activeSatColor(): string | null {
    if (!this.hoveredSatId) return null;
    const sat = this.orbitalSatellites.find(s => s.id === this.hoveredSatId);
    return sat ? sat.color : null;
  }

  private orbitalGroup = new THREE.Group();
  private satelliteMeshItems: { id: string; group: THREE.Group; glowSprite: THREE.Sprite; baseAngle: number }[] = [];
  private orbitAngle: number = 0;
  private audioCtx: AudioContext | null = null;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private mixer?: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private earthGroup = new THREE.Group();
  private proceduralEarthGroup?: THREE.Group;
  private cloudsMesh?: THREE.Mesh;
  private starsField?: THREE.Points;

  // Hover & Drag State Tracking
  private mouseNormalizedX: number = 0;
  private mouseNormalizedY: number = 0;
  private hoverVelocityX: number = 0;
  private hoverVelocityY: number = 0;
  private isHovering: boolean = false;
  private isDragging: boolean = false;
  private lastMouseX: number | null = null;
  private lastMouseY: number | null = null;

  // Custom Blue & Rainbow Fire Tail Cursor
  private cursorCtx: CanvasRenderingContext2D | null = null;
  private cursorParticles: CursorFlameParticle[] = [];
  private rainbowHue: number = 0;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.detectUserLocalTime();
  }

  ngAfterViewInit(): void {
    this.initThreeScene();
    this.initCursorCanvas();
  }

  ngOnDestroy(): void {
    this.cleanupThreeScene();
  }

  private detectUserLocalTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    this.detectedTimeString = `${displayHours}:${mins} ${ampm}`;
  }

  public enterWorldData(): void {
    this.playTone(680, 'sine', 0.08);
    this.router.navigate(['/world-data']);
  }

  public navigateToSatellite(route: string): void {
    this.playTone(680, 'sine', 0.08);
    this.router.navigate([route]);
  }

  public onDockMouseMove(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLElement>('.stone-menu-item');
    const mouseX = event.clientX;
    const maxDistance = 90; // Influence radius in pixels (approx 2.5 items)
    const maxScaleBoost = 0.45; // Max 1.45x scale
    const maxTranslateY = 10; // Lift up 10px

    buttons.forEach((btn, index) => {
      const rect = btn.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - itemCenter);

      if (dist < maxDistance) {
        const factor = Math.cos((dist / maxDistance) * (Math.PI / 2));
        this.dockItemScales[index] = 1 + maxScaleBoost * factor;
        this.dockItemTranslateY[index] = -maxTranslateY * factor;
      } else {
        this.dockItemScales[index] = 1;
        this.dockItemTranslateY[index] = 0;
      }
    });
    this.cdr.markForCheck();
  }

  public onDockMouseLeave(): void {
    this.dockItemScales.fill(1);
    this.dockItemTranslateY.fill(0);
    this.hoveredSatId = null;
    this.cdr.markForCheck();
  }

  public onSatelliteHover(id: string): void {
    if (this.hoveredSatId !== id) {
      this.playTone(520, 'sine', 0.04);
    }
    this.hoveredSatId = id;

    const index = this.orbitalSatellites.findIndex(s => s.id === id);
    if (index !== -1) {
      for (let i = 0; i < this.orbitalSatellites.length; i++) {
        const d = Math.abs(i - index);
        if (d === 0) {
          this.dockItemScales[i] = 1.45;
          this.dockItemTranslateY[i] = -10;
        } else if (d === 1) {
          this.dockItemScales[i] = 1.25;
          this.dockItemTranslateY[i] = -5;
        } else if (d === 2) {
          this.dockItemScales[i] = 1.10;
          this.dockItemTranslateY[i] = -2;
        } else {
          this.dockItemScales[i] = 1.0;
          this.dockItemTranslateY[i] = 0;
        }
      }
    }
    this.cdr.markForCheck();
  }

  public onSatelliteLeave(): void {
    this.hoveredSatId = null;
    this.cdr.markForCheck();
  }

  public toggleOrbitPause(): void {
    this.isOrbitPaused = !this.isOrbitPaused;
    this.playTone(this.isOrbitPaused ? 340 : 680, 'triangle', 0.05);
    this.cdr.detectChanges();
  }

  private playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.05): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx && AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, this.audioCtx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  private initCursorCanvas(): void {
    const canvas = this.cursorCanvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.cursorCtx = canvas.getContext('2d');
  }

  private initThreeScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030712);
    this.scene.fog = new THREE.FogExp2(0x030712, 0.002);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 7.5);

    // 3. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 4. OrbitControls - seamless drag & rotate
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = false;
    this.controls.enablePan = false;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 16.0;

    this.controls.addEventListener('start', () => {
      this.isDragging = true;
      this.hoverVelocityX = 0;
      this.hoverVelocityY = 0;
    });

    this.controls.addEventListener('end', () => {
      this.isDragging = false;
      this.lastMouseX = null;
      this.lastMouseY = null;
    });

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(10, 10, 10);
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-10, -5, -8);
    this.scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.2);
    fillLight.position.set(0, 10, -5);
    this.scene.add(fillLight);

    // 6. Deep Cosmic Starfield
    this.createStarfield();

    // 7. Earth Group (Centered at 0, 0, 0)
    this.earthGroup.position.set(0, 0, 0);
    this.scene.add(this.earthGroup);

    // 7b. Create instant centered high-definition 3D Earth Globe (Continents, Oceans, Atmosphere, Clouds)
    this.createProceduralEarthGlobe();

    // 8. Load downloaded Earth Cartoon GLB with absolute root URL
    this.loadEarthModel();

    // 8b. Create 3D Celestial Orbital Gemstones Constellation
    this.createOrbitalSystem();

    // 9. Resize and Pointer Listeners
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('mouseleave', this.onPointerLeave);

    // 10. Run 60 FPS animation loop outside Angular Zone
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private createProceduralEarthGlobe(): void {
    if (typeof document === 'undefined') return;

    this.proceduralEarthGroup = new THREE.Group();

    // 1. High-Resolution Vector-rendered Earth Surface Texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Ocean deep royal blue & navy gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0, '#030a16');
      grad.addColorStop(0.18, '#061a33');
      grad.addColorStop(0.5, '#0b305b');
      grad.addColorStop(0.82, '#061a33');
      grad.addColorStop(1, '#030a16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Faint lat-long GIS coordinate grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 2048; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y <= 1024; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.stroke();
      }

      // Draw Continental Landmasses (Emerald & Sage Green)
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#059669';
      ctx.shadowBlur = 10;

      // North America
      ctx.beginPath();
      ctx.moveTo(280, 200);
      ctx.bezierCurveTo(340, 160, 480, 180, 520, 240);
      ctx.bezierCurveTo(560, 300, 500, 380, 450, 420);
      ctx.bezierCurveTo(400, 460, 360, 400, 300, 340);
      ctx.closePath();
      ctx.fill();

      // South America
      ctx.beginPath();
      ctx.moveTo(520, 480);
      ctx.bezierCurveTo(600, 520, 640, 620, 600, 750);
      ctx.bezierCurveTo(560, 850, 520, 820, 500, 700);
      ctx.bezierCurveTo(480, 600, 480, 520, 520, 480);
      ctx.closePath();
      ctx.fill();

      // Europe
      ctx.beginPath();
      ctx.moveTo(1020, 220);
      ctx.bezierCurveTo(1100, 200, 1180, 240, 1150, 320);
      ctx.bezierCurveTo(1100, 350, 1020, 340, 980, 300);
      ctx.closePath();
      ctx.fill();

      // Africa
      ctx.beginPath();
      ctx.moveTo(1020, 380);
      ctx.bezierCurveTo(1160, 380, 1220, 500, 1180, 650);
      ctx.bezierCurveTo(1140, 780, 1080, 760, 1040, 650);
      ctx.bezierCurveTo(980, 550, 960, 420, 1020, 380);
      ctx.closePath();
      ctx.fill();

      // Asia
      ctx.beginPath();
      ctx.moveTo(1200, 200);
      ctx.bezierCurveTo(1450, 160, 1680, 220, 1720, 360);
      ctx.bezierCurveTo(1700, 500, 1550, 520, 1420, 450);
      ctx.bezierCurveTo(1320, 480, 1250, 420, 1220, 320);
      ctx.closePath();
      ctx.fill();

      // India
      ctx.beginPath();
      ctx.moveTo(1400, 440);
      ctx.lineTo(1460, 440);
      ctx.lineTo(1430, 540);
      ctx.closePath();
      ctx.fill();

      // Australia
      ctx.beginPath();
      ctx.ellipse(1680, 720, 140, 95, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Golden Mountain Terrain Highlights
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.ellipse(380, 300, 30, 100, -0.4, 0, Math.PI * 2);
      ctx.ellipse(540, 650, 20, 120, 0.2, 0, Math.PI * 2);
      ctx.ellipse(1350, 380, 80, 25, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Night City Lights Clusters
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 5;
      const cities = [
        [360, 320], [420, 300], [480, 340], [1050, 260], [1120, 280],
        [1420, 480], [1620, 360], [1650, 400], [1100, 500], [580, 680], [1660, 740]
      ];
      cities.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const earthGeo = new THREE.SphereGeometry(2.1, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.35,
      metalness: 0.2,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.12
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.proceduralEarthGroup.add(earthMesh);

    // 2. Translucent Wispy Clouds Sphere
    const cloudsCanvas = document.createElement('canvas');
    cloudsCanvas.width = 1024;
    cloudsCanvas.height = 512;
    const cctx = cloudsCanvas.getContext('2d');
    if (cctx) {
      cctx.fillStyle = 'rgba(0,0,0,0)';
      cctx.fillRect(0, 0, 1024, 512);
      cctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 28; i++) {
        cctx.beginPath();
        const x = Math.random() * 1024;
        const y = 80 + Math.random() * 350;
        const rx = 40 + Math.random() * 80;
        const ry = 10 + Math.random() * 25;
        cctx.ellipse(x, y, rx, ry, Math.random() * 0.4, 0, Math.PI * 2);
        cctx.fill();
      }
    }
    const cloudsTex = new THREE.CanvasTexture(cloudsCanvas);
    const cloudsGeo = new THREE.SphereGeometry(2.14, 48, 48);
    const cloudsMat = new THREE.MeshBasicMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.45
    });
    this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    this.proceduralEarthGroup.add(this.cloudsMesh);

    // 3. Glowing Atmospheric Halo (Azure Rayleigh Scattering)
    const haloGeo = new THREE.SphereGeometry(2.28, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });
    const atmosphereHalo = new THREE.Mesh(haloGeo, haloMat);
    this.proceduralEarthGroup.add(atmosphereHalo);

    this.earthGroup.add(this.proceduralEarthGroup);
    this.isLoading = false;
    this.loadError = null;
    this.cdr.detectChanges();
  }

  private createStarfield(): void {
    const starCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.7) {
        colors[idx] = 0.5; colors[idx + 1] = 0.8; colors[idx + 2] = 1.0;
      } else if (tint > 0.4) {
        colors[idx] = 1.0; colors[idx + 1] = 0.9; colors[idx + 2] = 0.8;
      } else {
        colors[idx] = 0.9; colors[idx + 1] = 0.95; colors[idx + 2] = 1.0;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    this.starsField = new THREE.Points(geometry, material);
    this.scene.add(this.starsField);
  }

  private loadEarthModel(): void {
    const loader = new GLTFLoader();
    const modelUrl = '/assets/earth_cartoon.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetScale = 4.2 / maxDim;
          model.scale.setScalar(targetScale);
        }

        model.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness ?? 0.5, 0.35);
              child.material.metalness = Math.min(child.material.metalness ?? 0.1, 0.25);
            }
          }
        });

        // If procedural globe exists, replace with the loaded GLTF model
        if (this.proceduralEarthGroup) {
          this.earthGroup.remove(this.proceduralEarthGroup);
          this.proceduralEarthGroup = undefined;
          this.cloudsMesh = undefined;
        }

        this.earthGroup.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            this.mixer?.clipAction(clip).play();
          });
        }

        this.camera.position.set(0, 0.8, 7.2);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.isLoading = false;
        this.loadError = null;
        this.cdr.detectChanges();
      },
      (xhr) => {
        if (xhr.total > 0) {
          this.loadProgress = Math.round((xhr.loaded / xhr.total) * 100);
          this.cdr.detectChanges();
        }
      },
      (error) => {
        // Fallback procedural Earth globe is already active and revolving!
        console.warn('GLTF Earth model unavailable, retaining procedural 3D Earth:', error);
        this.isLoading = false;
        this.loadError = null;
        this.cdr.detectChanges();
      }
    );
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (e.pointerType === 'touch') return;

    this.isHovering = true;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const newNormX = (e.clientX / width) * 2 - 1;
    const newNormY = (e.clientY / height) * 2 - 1;

    if (this.lastMouseX !== null && this.lastMouseY !== null && !this.isDragging) {
      const deltaX = (e.clientX - this.lastMouseX) / width;
      const deltaY = (e.clientY - this.lastMouseY) / height;
      this.hoverVelocityX += deltaX * 2.2;
      this.hoverVelocityY += deltaY * 2.2;
      this.hoverVelocityX = Math.max(-0.08, Math.min(0.08, this.hoverVelocityX));
      this.hoverVelocityY = Math.max(-0.08, Math.min(0.08, this.hoverVelocityY));
    }

    // Spawn 2-3 blue & rainbow fire tail sparks
    this.rainbowHue = (this.rainbowHue + 14) % 360;
    const isElectricBlue = Math.random() > 0.45;
    const hue = isElectricBlue ? (195 + Math.random() * 25) : this.rainbowHue;

    for (let i = 0; i < 2; i++) {
      this.cursorParticles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0 - (Math.random() * 1.2 + 0.4),
        size: Math.random() * 6 + 4,
        life: 1.0,
        hue
      });
    }

    if (this.cursorParticles.length > 60) {
      this.cursorParticles.splice(0, this.cursorParticles.length - 60);
    }

    this.mouseNormalizedX = newNormX;
    this.mouseNormalizedY = newNormY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  private onPointerLeave = (): void => {
    this.isHovering = false;
    this.lastMouseX = null;
    this.lastMouseY = null;
    this.mouseNormalizedX = 0;
    this.mouseNormalizedY = 0;
    this.hoverVelocityX = 0;
    this.hoverVelocityY = 0;
  };

  private onWindowResize = (): void => {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    if (this.cursorCanvasRef?.nativeElement) {
      this.cursorCanvasRef.nativeElement.width = width;
      this.cursorCanvasRef.nativeElement.height = height;
    }
  };

  private renderCursorFireTail(): void {
    if (!this.cursorCtx || !this.cursorCanvasRef) return;
    const ctx = this.cursorCtx;
    const canvas = this.cursorCanvasRef.nativeElement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw fire tail sparks
    for (let i = this.cursorParticles.length - 1; i >= 0; i--) {
      const p = this.cursorParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.size *= 0.93;
      p.life -= 0.038;

      if (p.life <= 0 || p.size <= 0.4) {
        this.cursorParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = `hsl(${p.hue}, 100%, 65%)`;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw glowing blue & rainbow cursor pointer
    if (this.isHovering && this.lastMouseX !== null && this.lastMouseY !== null) {
      ctx.save();
      this.rainbowHue = (this.rainbowHue + 3) % 360;

      // Glow aura
      ctx.shadowColor = `hsl(${this.rainbowHue}, 100%, 60%)`;
      ctx.shadowBlur = 14;

      // Inner electric blue core
      ctx.beginPath();
      ctx.arc(this.lastMouseX, this.lastMouseY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.fill();

      // Outer shifting rainbow ring
      ctx.strokeStyle = `hsl(${this.rainbowHue}, 100%, 70%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.lastMouseX, this.lastMouseY, 8.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // 1. Controls update
    if (this.controls) {
      this.controls.update();
    }

    // 2. Continuous auto-revolution + interactive drag & tilt
    if (!this.isDragging) {
      // Steady forward revolution of the Earth globe around its Y axis
      const autoSpin = 0.0035;
      const hoverBias = this.isHovering ? (this.mouseNormalizedX * 0.012) : 0;
      this.earthGroup.rotation.y += autoSpin + hoverBias + this.hoverVelocityX;

      // Rotate cloud layer slightly faster for realistic atmospheric parallax
      if (this.cloudsMesh) {
        this.cloudsMesh.rotation.y += 0.002;
      }

      // Vertical tilt responding to mouse position
      const DEG_60 = (60 * Math.PI) / 180;
      const targetTiltX = this.isHovering ? (this.mouseNormalizedY * DEG_60 * 0.35) : 0;
      this.earthGroup.rotation.x += ((targetTiltX + this.hoverVelocityY) - this.earthGroup.rotation.x) * 0.06;

      // Diagonal roll responding to corners
      const targetTiltZ = this.isHovering ? (-this.mouseNormalizedX * (DEG_60 * 0.2)) : 0;
      this.earthGroup.rotation.z += (targetTiltZ - this.earthGroup.rotation.z) * 0.06;

      this.hoverVelocityX *= 0.94;
      this.hoverVelocityY *= 0.94;
    }

    // 3. Built-in model animations
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // 4. Stars rotation
    if (this.starsField) {
      this.starsField.rotation.y += 0.0002;
      if (this.isHovering && !this.isDragging) {
        this.starsField.rotation.x += (this.mouseNormalizedY * 0.05 - this.starsField.rotation.x) * 0.02;
      }
    }

    // 5. Update 3D Celestial Orbital Satellites System
    this.updateOrbitalSystem(delta);

    // 6. Render 3D scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // 7. Render custom blue & rainbow fire tail cursor
    this.renderCursorFireTail();
  };

  /**
   * Generates a 3D faceted concave diamond crystal geometry
   * derived from the user's exact mathematical Bézier curve:
   * Width 100, Height 196, path:
   * M 50 0 C 50 78, 100 98, 100 98 C 100 98, 50 118, 50 196 C 50 118, 0 98, 0 98 C 0 98, 50 78, 50 0 Z
   */
  private createConcaveDiamondGeometry(scale: number = 0.0016, depth: number = 0.048, segmentsPerQuadrant: number = 6): THREE.BufferGeometry {
    const bezierPoint = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
      const mt = 1 - t;
      return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
    };

    // 4 quadrants centered at (0, 0):
    // Top apex: (0, 98), Right tip: (50, 0), Bottom apex: (0, -98), Left tip: (-50, 0)
    const curves = [
      { p0: [0, 98], p1: [0, 20], p2: [50, 0], p3: [50, 0] },     // Top to Right
      { p0: [50, 0], p1: [50, 0], p2: [0, -20], p3: [0, -98] },   // Right to Bottom
      { p0: [0, -98], p1: [0, -20], p2: [-50, 0], p3: [-50, 0] }, // Bottom to Left
      { p0: [-50, 0], p1: [-50, 0], p2: [0, 20], p3: [0, 98] }    // Left to Top
    ];

    const perimeter: [number, number, number][] = [];
    for (let c = 0; c < 4; c++) {
      const cur = curves[c];
      for (let i = 0; i < segmentsPerQuadrant; i++) {
        const t = i / segmentsPerQuadrant;
        const x = bezierPoint(cur.p0[0], cur.p1[0], cur.p2[0], cur.p3[0], t) * scale;
        const y = bezierPoint(cur.p0[1], cur.p1[1], cur.p2[1], cur.p3[1], t) * scale;
        perimeter.push([x, y, 0]);
      }
    }

    const positions: number[] = [];
    const N = perimeter.length;
    const frontApex = [0, 0, depth];
    const backApex = [0, 0, -depth];

    for (let i = 0; i < N; i++) {
      const next = (i + 1) % N;
      const pCur = perimeter[i];
      const pNext = perimeter[next];

      // Front facet
      positions.push(...frontApex, ...pCur, ...pNext);

      // Back facet
      positions.push(...backApex, ...pNext, ...pCur);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }

  private createOrbitalSystem(): void {
    // 3. Build 8 Interactive Orbiting Celestial Gemstones (Exact Concave Diamond Shape)
    this.satelliteMeshItems = [];
    const count = this.orbitalSatellites.length;

    this.orbitalSatellites.forEach((sat, i) => {
      const satGroup = new THREE.Group();

      // Precision 3D Concave Diamond Crystal Geometry (exact user-specified curve)
      const gemGeo = this.createConcaveDiamondGeometry(0.0016, 0.048, 6);

      const gemColor = new THREE.Color(sat.color);

      // Gemstone crystal body with rich emissive radiance
      const gemMat = new THREE.MeshStandardMaterial({
        color: gemColor,
        emissive: gemColor,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.4
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      satGroup.add(gemMesh);

      // Delicate wireframe facet refraction cage
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: gemColor,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      const wireframeMesh = new THREE.Mesh(gemGeo.clone(), wireframeMat);
      wireframeMesh.scale.setScalar(1.18);
      satGroup.add(wireframeMesh);

      // Ethereal radial glow aura sprite surrounding each gemstone
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = 128;
      glowCanvas.height = 128;
      const gctx = glowCanvas.getContext('2d');
      if (gctx) {
        const gradient = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.2, sat.color);
        gradient.addColorStop(0.55, sat.color + '66');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        gctx.fillStyle = gradient;
        gctx.fillRect(0, 0, 128, 128);
      }
      const glowTex = new THREE.CanvasTexture(glowCanvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: new THREE.Color(sat.color),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9
      });
      const glowSprite = new THREE.Sprite(spriteMat);
      glowSprite.scale.set(0.65, 0.65, 1.0);
      satGroup.add(glowSprite);

      this.orbitalGroup.add(satGroup);
      this.satelliteMeshItems.push({
        id: sat.id,
        group: satGroup,
        glowSprite,
        baseAngle: (i * Math.PI * 2) / count
      });
    });

    this.scene.add(this.orbitalGroup);
  }

  private updateOrbitalSystem(delta: number): void {
    if (!this.isOrbitPaused) {
      // Continuous orbit revolution of the stones around Earth
      const currentSpeed = this.hoveredSatId ? 0.05 : 0.24;
      this.orbitAngle += delta * currentSpeed;
    }

    const R = 3.65;
    const inclination = 0.38; // ~22 degrees celestial tilt
    const tempVec = new THREE.Vector3();
    const cameraPos = this.camera ? this.camera.position : new THREE.Vector3(0, 0.8, 7.2);
    const earthDist = cameraPos.length();

    let hasChanged = false;

    this.satelliteMeshItems.forEach((item, index) => {
      const satData = this.orbitalSatellites[index];
      const angle = this.orbitAngle + item.baseAngle;

      const u = Math.cos(angle) * R;
      const v = Math.sin(angle) * R;

      const x = u;
      const y = v * Math.sin(inclination);
      const z = v * Math.cos(inclination);

      item.group.position.set(x, y, z);
      item.group.rotation.y += 0.03;
      item.group.rotation.z += 0.02;

      const isHovered = this.hoveredSatId === item.id;
      // Scale up 3D gemstone and intensify its radial glow aura when hovered
      item.group.scale.setScalar(isHovered ? 1.45 : 1.0);
      const targetGlow = isHovered ? 1.05 : (0.65 + Math.sin(this.orbitAngle * 4 + index) * 0.08);
      item.glowSprite.scale.set(targetGlow, targetGlow, 1.0);
      item.glowSprite.material.opacity = isHovered ? 1.0 : 0.85;

      // Project into 2D viewport coordinates
      item.group.getWorldPosition(tempVec);

      const distToCamera = tempVec.distanceTo(cameraPos);
      const isBehind = (distToCamera > earthDist + 0.3) && (Math.hypot(tempVec.x, tempVec.y) < 1.95);

      if (this.camera) {
        tempVec.project(this.camera);

        const screenX = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-(tempVec.y * 0.5) + 0.5) * window.innerHeight;

        if (Math.abs(satData.screenX - screenX) > 0.4 || Math.abs(satData.screenY - screenY) > 0.4 || satData.isBehind !== isBehind) {
          satData.screenX = Math.round(screenX);
          satData.screenY = Math.round(screenY);
          satData.isBehind = isBehind;
          hasChanged = true;
        }
      }
    });

    if (hasChanged) {
      this.cdr.detectChanges();
    }
  }

  private cleanupThreeScene(): void {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('mouseleave', this.onPointerLeave);

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.scene) {
      this.scene.traverse((obj: any) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat: any) => mat.dispose && mat.dispose());
          } else if (obj.material.dispose) {
            obj.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}
