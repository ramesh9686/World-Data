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
import { DecryptedTextComponent, CountUpComponent, SpotlightDirective } from '../shared/react-bits';

interface CursorFlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  hue: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DecryptedTextComponent, CountUpComponent, SpotlightDirective],
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

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private mixer?: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private earthGroup = new THREE.Group();
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
    this.router.navigate(['/world-data']);
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

    // 7. Earth Group
    this.scene.add(this.earthGroup);

    // 8. Load downloaded Earth Cartoon GLB
    this.loadEarthModel();

    // 9. Resize and Pointer Listeners
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('mouseleave', this.onPointerLeave);

    // 10. Run 60 FPS animation loop outside Angular Zone
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
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
    const modelUrl = 'assets/earth_cartoon.glb';

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

        this.earthGroup.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            this.mixer?.clipAction(clip).play();
          });
        }

        this.camera.position.set(0, 1.2, 7.5);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (xhr) => {
        if (xhr.total > 0) {
          this.loadProgress = Math.round((xhr.loaded / xhr.total) * 100);
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Failed to load 3D Earth model:', error);
        this.loadError = 'Failed to load 3D Earth model.';
        this.isLoading = false;
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

    // 2. Hover revolution & 60-degree all-sides dynamic tilt
    if (!this.isDragging) {
      const DEG_60 = (60 * Math.PI) / 180; // ~1.047 rad (full 60 degrees tilt)

      // Horizontal Yaw (Left-Right)
      const hoverSpeed = this.isHovering ? (this.mouseNormalizedX * 0.025) : 0.005;
      const totalRotationDeltaY = hoverSpeed + this.hoverVelocityX;
      this.earthGroup.rotation.y += totalRotationDeltaY;

      // Vertical Pitch (Up-Down) - full 60-degree range on hover + vertical glide momentum
      const targetTiltX = this.isHovering ? (this.mouseNormalizedY * DEG_60) : 0;
      this.earthGroup.rotation.x += ((targetTiltX + this.hoverVelocityY) - this.earthGroup.rotation.x) * 0.08;

      // Diagonal 3D Roll (Z-axis tilt) - responds to corner hover
      const targetTiltZ = this.isHovering ? (-this.mouseNormalizedX * (DEG_60 * 0.4)) : 0;
      this.earthGroup.rotation.z += (targetTiltZ - this.earthGroup.rotation.z) * 0.08;

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

    // 5. Render 3D scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // 6. Render custom blue & rainbow fire tail cursor
    this.renderCursorFireTail();
  };

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
