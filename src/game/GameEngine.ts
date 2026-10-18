import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gameAudio } from './gameAudio';

export interface GameStats {
  score: number;
  shield: number;
  crystals: number;
  speed: number;
  combo: number;
  distance: number;
  state: 'title' | 'playing' | 'paused' | 'gameover' | 'victory';
}

export interface GameEngineCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onStateChange: (state: GameStats['state']) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId: number = 0;
  private clock: THREE.Clock = new THREE.Clock();

  // State
  public stats: GameStats = {
    score: 0,
    shield: 100,
    crystals: 0,
    speed: 35,
    combo: 1,
    distance: 0,
    state: 'title',
  };

  private callbacks: GameEngineCallbacks;

  // Player & Game Entities
  private playerGroup!: THREE.Group;
  private playerShadow!: THREE.Mesh;
  private thrusterGlow!: THREE.PointLight;
  private shieldMesh!: THREE.Mesh;
  private shieldActiveUntil: number = 0;

  // Track & Environment
  private trackGroup!: THREE.Group;
  private trackSegments: THREE.Mesh[] = [];
  private readonly trackSegmentLength = 60;
  private readonly trackSegmentCount = 7;
  private readonly trackWidth = 24;

  // Hazards & Collectibles Pools
  private obstacles: Array<{
    mesh: THREE.Group;
    active: boolean;
    type: 'bug' | 'pillar';
    box: THREE.Box3;
  }> = [];

  private collectibles: Array<{
    mesh: THREE.Group;
    active: boolean;
    topic: string;
    box: THREE.Box3;
  }> = [];

  // Particles Pool
  private particleGroup!: THREE.Group;
  private particles: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
    active: boolean;
  }> = [];

  // Camera Shake & Hitstop
  private cameraShakeIntensity: number = 0;
  private hitstopUntil: number = 0;
  private targetPlayerX: number = 0;
  private currentPlayerX: number = 0;

  // Input Tracking
  private keysHeld: Record<string, boolean> = {};

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.initThree();
    this.initEnvironment();
    this.initTrack();
    this.initPlayer();
    this.initObstaclesPool();
    this.initCollectiblesPool();
    this.initParticlesPool();
    this.bindInputs();

    this.animate();
  }

  private initThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0c);
    this.scene.fog = new THREE.FogExp2(0x0a0a0c, 0.012);

    this.camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 800);
    this.camera.position.set(0, 5, 14);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();
  }

  private initEnvironment() {
    // 3-Point Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(20, 45, 30);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 120;
    keyLight.shadow.camera.left = -25;
    keyLight.shadow.camera.right = 25;
    keyLight.shadow.camera.top = 25;
    keyLight.shadow.camera.bottom = -25;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x4d8eff, 0x111116, 0.9);
    this.scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.4);
    rimLight.position.set(-20, 15, -40);
    this.scene.add(rimLight);
  }

  private initTrack() {
    this.trackGroup = new THREE.Group();
    this.scene.add(this.trackGroup);

    // Procedural Grid Texture for the data highway
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0e0e14';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(77, 142, 255, 0.25)';
    ctx.lineWidth = 4;
    // Lane markings
    for (let x = 64; x < 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    // Horizontal data pulses
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let y = 32; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    const trackTexture = new THREE.CanvasTexture(canvas);
    trackTexture.wrapS = THREE.RepeatWrapping;
    trackTexture.wrapT = THREE.RepeatWrapping;
    trackTexture.repeat.set(1, 4);

    const trackMaterial = new THREE.MeshStandardMaterial({
      map: trackTexture,
      roughness: 0.35,
      metalness: 0.2,
    });

    const sideBarGeo = new THREE.BoxGeometry(0.8, 1.2, this.trackSegmentLength);
    const sideBarMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
    });

    for (let i = 0; i < this.trackSegmentCount; i++) {
      const segGroup = new THREE.Group();

      const floorGeo = new THREE.PlaneGeometry(this.trackWidth, this.trackSegmentLength);
      const floor = new THREE.Mesh(floorGeo, trackMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      segGroup.add(floor);

      // Left guardrail
      const leftRail = new THREE.Mesh(sideBarGeo, sideBarMat);
      leftRail.position.set(-this.trackWidth / 2 - 0.4, 0.6, 0);
      segGroup.add(leftRail);

      // Right guardrail
      const rightRail = new THREE.Mesh(sideBarGeo, sideBarMat);
      rightRail.position.set(this.trackWidth / 2 + 0.4, 0.6, 0);
      segGroup.add(rightRail);

      segGroup.position.z = -i * this.trackSegmentLength;
      this.trackGroup.add(segGroup);
      this.trackSegments.push(floor);
    }
  }

  // Composite 8-Part Procedural Player Vessel
  private initPlayer() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(0, 0.65, 0);

    // 1. Central Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 1.8);
    hullShape.lineTo(0.9, -0.9);
    hullShape.lineTo(0.3, -1.4);
    hullShape.lineTo(-0.3, -1.4);
    hullShape.lineTo(-0.9, -0.9);
    hullShape.closePath();

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    hullGeo.center();
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.9,
      roughness: 0.2,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.x = Math.PI / 2;
    hull.castShadow = true;
    this.playerGroup.add(hull);

    // 2. Left Swept Wing
    const wingGeo = new THREE.BoxGeometry(1.6, 0.08, 1.4);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.25,
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-1.4, 0.05, 0.2);
    leftWing.rotation.y = -Math.PI / 10;
    this.playerGroup.add(leftWing);

    // 3. Right Swept Wing
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(1.4, 0.05, 0.2);
    rightWing.rotation.y = Math.PI / 10;
    this.playerGroup.add(rightWing);

    // 4. Cockpit Canopy (Transmissive style)
    const cockpitGeo = new THREE.ConeGeometry(0.38, 1.2, 4);
    const cockpitMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 0.5,
      clearcoat: 1.0,
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.35, 0.1);
    cockpit.rotation.x = -Math.PI / 2;
    this.playerGroup.add(cockpit);

    // 5. Thruster Exhaust Nozzle
    const thrusterGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.45, 12);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.0,
      metalness: 0.95,
      roughness: 0.1,
    });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.set(0, 0.05, 1.2);
    this.playerGroup.add(thruster);

    // 6. Dynamic Thruster Light
    this.thrusterGlow = new THREE.PointLight(0x38bdf8, 3, 7);
    this.thrusterGlow.position.set(0, 0.05, 1.5);
    this.playerGroup.add(this.thrusterGlow);

    // 7. Pulse Shield Sphere (Invisible until active)
    const shieldGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.playerGroup.add(this.shieldMesh);

    // 8. Ground Soft Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0,0,0,0.65)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    this.playerShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.playerShadow.rotation.x = -Math.PI / 2;
    this.playerShadow.position.y = -0.63;
    this.playerGroup.add(this.playerShadow);

    this.scene.add(this.playerGroup);
  }

  // Composite 4-Part Hazard Obstacles Pool (Bug Blocks & Gate Pillars)
  private initObstaclesPool() {
    const obstacleCount = 14;

    const bugCoreGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const bugCoreMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0x9f1239,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.8,
    });

    const wireGeo = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff4d6d,
      wireframe: true,
    });

    for (let i = 0; i < obstacleCount; i++) {
      const group = new THREE.Group();

      const core = new THREE.Mesh(bugCoreGeo, bugCoreMat);
      core.castShadow = true;
      group.add(core);

      const wire = new THREE.Mesh(wireGeo, wireMat);
      group.add(wire);

      // Red warning beacon point light
      const beacon = new THREE.PointLight(0xe11d48, 1.5, 6);
      beacon.position.y = 1.2;
      group.add(beacon);

      group.position.set(0, -50, 0); // hidden
      this.scene.add(group);

      this.obstacles.push({
        mesh: group,
        active: false,
        type: 'bug',
        box: new THREE.Box3(),
      });
    }
  }

  // Composite 3-Part Collectible Algorithm Crystal Pool
  private initCollectiblesPool() {
    const crystalCount = 16;
    const crystalGeo = new THREE.OctahedronGeometry(0.85, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.8,
      thickness: 1.0,
      clearcoat: 1.0,
    });

    const ringGeo = new THREE.TorusGeometry(1.3, 0.05, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
    });

    const topics = ['Array', 'HashMap', 'Tree', 'Graph', 'DP', 'OOP'];

    for (let i = 0; i < crystalCount; i++) {
      const group = new THREE.Group();

      const mesh = new THREE.Mesh(crystalGeo, crystalMat);
      mesh.castShadow = true;
      group.add(mesh);

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      const light = new THREE.PointLight(0x38bdf8, 2, 5);
      group.add(light);

      group.position.set(0, -50, 0);
      this.scene.add(group);

      this.collectibles.push({
        mesh: group,
        active: false,
        topic: topics[i % topics.length],
        box: new THREE.Box3(),
      });
    }
  }

  // Pooled Particle Burst System
  private initParticlesPool() {
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    const pGeo = new THREE.TetrahedronGeometry(0.2, 0);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < 40; i++) {
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.visible = false;
      this.particleGroup.add(mesh);
      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        active: false,
      });
    }
  }

  public emitBurst(pos: THREE.Vector3, color: number = 0x38bdf8, count: number = 16) {
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active && spawned < count) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.45 + Math.random() * 0.35;
        p.mesh.position.copy(pos);
        (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
        p.velocity.set(
          (Math.random() - 0.5) * 14,
          (Math.random() * 8) + 2,
          (Math.random() - 0.5) * 14
        );
        p.mesh.visible = true;
        spawned++;
      }
    }
  }

  private bindInputs() {
    window.addEventListener('keydown', (e) => {
      this.keysHeld[e.code] = true;

      // Handle Title Start
      if (this.stats.state === 'title' && (e.code === 'Space' || e.code === 'Enter')) {
        this.startGame();
      }

      // Handle Escape for Pause Toggle
      if (e.code === 'Escape') {
        if (this.stats.state === 'playing') {
          this.pauseGame();
        } else if (this.stats.state === 'paused') {
          this.resumeGame();
        }
      }

      // Handle Space for Pulse Shield during play
      if (this.stats.state === 'playing' && e.code === 'Space') {
        this.activatePulseShield();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysHeld[e.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keysHeld = {};
    });

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  public startGame() {
    this.stats = {
      score: 0,
      shield: 100,
      crystals: 0,
      speed: 38,
      combo: 1,
      distance: 0,
      state: 'playing',
    };
    this.targetPlayerX = 0;
    this.currentPlayerX = 0;
    this.playerGroup.position.set(0, 0.65, 0);

    // Reset pools
    this.obstacles.forEach((o) => {
      o.active = false;
      o.mesh.position.set(0, -50, 0);
    });
    this.collectibles.forEach((c) => {
      c.active = false;
      c.mesh.position.set(0, -50, 0);
    });

    gameAudio.playShieldPulse();
    this.callbacks.onStateChange('playing');
    this.callbacks.onStatsUpdate(this.stats);
  }

  public pauseGame() {
    this.stats.state = 'paused';
    this.callbacks.onStateChange('paused');
  }

  public resumeGame() {
    this.stats.state = 'playing';
    this.clock.getDelta(); // flush delta
    this.callbacks.onStateChange('playing');
  }

  public activatePulseShield() {
    const now = performance.now();
    if (now < this.shieldActiveUntil) return; // already active

    this.shieldActiveUntil = now + 2400; // 2.4 seconds duration
    (this.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0.55;
    gameAudio.playShieldPulse();
    this.emitBurst(this.playerGroup.position, 0x38bdf8, 8);
  }

  private spawnSpacedWave() {
    // Spawn ahead on track (e.g. z = -140 to -220)
    const spawnZ = -180 - Math.random() * 40;
    const laneX = [-7, 0, 7];

    // Spawn 1-2 Obstacles
    const emptyLane = laneX[Math.floor(Math.random() * laneX.length)];
    for (const lane of laneX) {
      if (lane !== emptyLane && Math.random() > 0.3) {
        const obs = this.obstacles.find((o) => !o.active);
        if (obs) {
          obs.active = true;
          obs.mesh.position.set(lane, 1.0, spawnZ);
        }
      }
    }

    // Spawn 1 Collectible Crystal in the open lane
    const cry = this.collectibles.find((c) => !c.active);
    if (cry) {
      cry.active = true;
      cry.mesh.position.set(emptyLane, 1.2, spawnZ + (Math.random() - 0.5) * 15);
    }
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05); // clamped dt for stable 60fps

    // Check hitstop pause
    if (performance.now() < this.hitstopUntil) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const time = performance.now() * 0.001;

    // TITLE SCREEN IDLE PAN
    if (this.stats.state === 'title') {
      this.camera.position.x = Math.sin(time * 0.5) * 4;
      this.camera.position.y = 4.5 + Math.cos(time * 0.4) * 0.5;
      this.camera.position.z = 13 + Math.sin(time * 0.3) * 1.5;
      this.camera.lookAt(0, 1.2, -8);

      // Gentle floating player ship
      this.playerGroup.position.y = 1.0 + Math.sin(time * 2) * 0.15;
      this.playerGroup.rotation.z = Math.sin(time * 1.5) * 0.08;

      this.renderer.render(this.scene, this.camera);
      return;
    }

    // PLAYING STATE UPDATE
    if (this.stats.state === 'playing') {
      // 1. Process continuous inputs
      const moveSpeed = 18;
      if (this.keysHeld['KeyA'] || this.keysHeld['ArrowLeft']) {
        this.targetPlayerX -= moveSpeed * dt;
      }
      if (this.keysHeld['KeyD'] || this.keysHeld['ArrowRight']) {
        this.targetPlayerX += moveSpeed * dt;
      }

      // Clamp player within road boundaries
      const maxRoadX = 9.5;
      this.targetPlayerX = Math.max(-maxRoadX, Math.min(maxRoadX, this.targetPlayerX));

      // Damped spring interpolation for player X
      this.currentPlayerX += (this.targetPlayerX - this.currentPlayerX) * (1 - Math.exp(-12 * dt));
      this.playerGroup.position.x = this.currentPlayerX;

      // Dynamic bank roll based on lateral movement
      const rollTarget = (this.currentPlayerX - this.targetPlayerX) * 0.12;
      this.playerGroup.rotation.z += (rollTarget - this.playerGroup.rotation.z) * 0.15;
      this.playerGroup.rotation.y = (this.targetPlayerX - this.currentPlayerX) * 0.08;

      // Distance and speed progression
      const forwardDelta = this.stats.speed * dt;
      this.stats.distance += forwardDelta;
      this.stats.score += Math.round(forwardDelta * this.stats.combo);
      this.stats.speed = Math.min(75, 38 + this.stats.distance * 0.015);

      // Pulse shield decay
      const isShieldActive = performance.now() < this.shieldActiveUntil;
      if (!isShieldActive) {
        (this.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0;
      } else {
        this.shieldMesh.rotation.y += 0.06;
      }

      // Update Track Segments (infinite scrolling illusion)
      this.trackGroup.children.forEach((seg) => {
        seg.position.z += forwardDelta;
        if (seg.position.z > this.trackSegmentLength) {
          seg.position.z -= this.trackSegmentLength * this.trackSegmentCount;
        }
      });

      // Periodically spawn new wave
      if (Math.random() < dt * 1.6) {
        this.spawnSpacedWave();
      }

      // Update and collide Hazards
      const playerBox = new THREE.Box3().setFromObject(this.playerGroup);

      this.obstacles.forEach((obs) => {
        if (!obs.active) return;
        obs.mesh.position.z += forwardDelta;
        obs.mesh.rotation.x += dt * 1.5;
        obs.mesh.rotation.y += dt * 2.0;

        obs.box.setFromObject(obs.mesh);

        // Check collision with player
        if (playerBox.intersectsBox(obs.box)) {
          obs.active = false;
          obs.mesh.position.set(0, -50, 0);

          if (isShieldActive) {
            // Shield absorbs hit
            gameAudio.playShieldPulse();
            this.emitBurst(obs.mesh.position, 0x38bdf8, 20);
            this.cameraShakeIntensity = 0.4;
          } else {
            // Take damage
            gameAudio.playHazardHit();
            this.hitstopUntil = performance.now() + 45; // 45ms simulation hitstop
            this.cameraShakeIntensity = 1.1;
            this.stats.shield -= 25;
            this.stats.combo = 1;
            this.emitBurst(this.playerGroup.position, 0xe11d48, 24);

            if (this.stats.shield <= 0) {
              this.stats.shield = 0;
              this.stats.state = 'gameover';
              gameAudio.playGameOver();
              this.callbacks.onStateChange('gameover');
            }
          }
        }

        // Deactivate behind camera
        if (obs.mesh.position.z > 20) {
          obs.active = false;
          obs.mesh.position.set(0, -50, 0);
        }
      });

      // Update and collect Crystals
      this.collectibles.forEach((c) => {
        if (!c.active) return;
        c.mesh.position.z += forwardDelta;
        c.mesh.rotation.y += dt * 3.5;
        c.mesh.position.y = 1.2 + Math.sin(time * 5) * 0.25;

        c.box.setFromObject(c.mesh);

        if (playerBox.intersectsBox(c.box)) {
          c.active = false;
          c.mesh.position.set(0, -50, 0);

          this.stats.crystals += 1;
          this.stats.score += 250 * this.stats.combo;
          this.stats.combo = Math.min(8, this.stats.combo + 1);

          gameAudio.playCrystalCollect();
          this.emitBurst(c.mesh.position, 0x38bdf8, 14);

          // Check for Victory milestone (e.g. 50 crystals collected)
          if (this.stats.crystals >= 50) {
            this.stats.state = 'victory';
            gameAudio.playVictory();
            this.callbacks.onStateChange('victory');
          }
        }

        if (c.mesh.position.z > 20) {
          c.active = false;
          c.mesh.position.set(0, -50, 0);
        }
      });

      // Particles Physics
      this.particles.forEach((p) => {
        if (!p.active) return;
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          p.mesh.visible = false;
          return;
        }
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.y -= 9.8 * dt; // gravity
        p.mesh.rotation.x += dt * 4;
      });

      // Dynamic Camera with Decay Shake
      const targetCamX = this.currentPlayerX * 0.45;
      this.camera.position.x += (targetCamX - this.camera.position.x) * 0.12;

      let shakeX = 0;
      let shakeY = 0;
      if (this.cameraShakeIntensity > 0.01) {
        shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity * 1.5;
        shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity * 1.5;
        this.cameraShakeIntensity *= Math.exp(-8 * dt); // decay
      }

      this.camera.position.set(
        targetCamX + shakeX,
        4.8 + Math.sin(time * 4) * 0.05 + shakeY,
        12.5
      );
      this.camera.lookAt(this.currentPlayerX * 0.7, 1.2, -25);

      // Push telemetry stats to UI
      this.callbacks.onStatsUpdate(this.stats);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);

    // Dispose Three.js objects
    this.scene.clear();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
