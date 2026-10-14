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
    // Limit pixel ratio to 1.5 for ultra-smooth dragging on all devices & low FPS
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 4. OrbitControls - buttery drag & rotation
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.8;
    this.controls.enablePan = false;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 16.0;

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

    // 9. Resize listener
    window.addEventListener('resize', this.onWindowResize);

    // 10. Run 60 FPS animation loop outside Angular Zone to prevent change detection lag
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

        // Auto-center and fit model nicely
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        // Normalize model size to a comfortable diameter (~4.2 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetScale = 4.2 / maxDim;
          model.scale.setScalar(targetScale);
        }

        // Optimize materials for smooth rendering
        model.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness ?? 0.5, 0.35);
              child.material.metalness = Math.min(child.material.metalness ?? 0.1, 0.25);
            }
          }
        });

        this.earthGroup.add(model);

        // Play animations if present in the model
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

  private onWindowResize = (): void => {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // 1. Smooth controls damping & auto-rotate
    if (this.controls) {
      this.controls.update();
    }

    // 2. Built-in model animations (if any)
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // 3. Subtle cosmic stars rotation
    if (this.starsField) {
      this.starsField.rotation.y += 0.0002;
    }

    // 4. Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private cleanupThreeScene(): void {
    window.removeEventListener('resize', this.onWindowResize);

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
