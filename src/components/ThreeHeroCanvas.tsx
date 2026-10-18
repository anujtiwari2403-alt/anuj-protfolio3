import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeHeroCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 80);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 1. Interactive Dual-Tone Floating Particles (Blue & Orange)
    const particleCount = isMobile ? 120 : 360;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const blueColor = new THREE.Color(0x4d8eff);
    const orangeColor = new THREE.Color(0xffb690);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 160;
      positions[i3 + 1] = (Math.random() - 0.5) * 110;
      positions[i3 + 2] = (Math.random() - 0.5) * 90;

      // 70% blue accents, 30% warm orange accents
      const col = Math.random() > 0.3 ? blueColor : orangeColor;
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 1.4 : 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Interactive 3D Wireframe Geodesic Sphere & Gyroscopic Orbital System
    const heroObjectGroup = new THREE.Group();
    // Position slightly to the right to frame the hero content
    heroObjectGroup.position.set(isMobile ? 0 : 26, isMobile ? -5 : 4, -10);

    // Main 3D Wireframe Geodesic Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(isMobile ? 12 : 16, isMobile ? 1 : 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireframeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    heroObjectGroup.add(wireframeSphere);

    // Inner Concentric Polyhedron (Warm Orange Hue)
    const innerGeo = new THREE.OctahedronGeometry(isMobile ? 7 : 9, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffb690,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const innerPoly = new THREE.Mesh(innerGeo, innerMat);
    heroObjectGroup.add(innerPoly);

    // Outer Orbiting Gyroscopic Ring (Electric Blue)
    const torusGeo = new THREE.TorusGeometry(isMobile ? 16 : 22, 0.4, 12, 60);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x4d8eff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const orbitalRing1 = new THREE.Mesh(torusGeo, torusMat);
    orbitalRing1.rotation.x = Math.PI / 3;
    heroObjectGroup.add(orbitalRing1);

    // Secondary Inclined Ring
    const torusGeo2 = new THREE.TorusGeometry(isMobile ? 18 : 25, 0.3, 10, 50);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0xa4c9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const orbitalRing2 = new THREE.Mesh(torusGeo2, torusMat2);
    orbitalRing2.rotation.y = Math.PI / 4;
    heroObjectGroup.add(orbitalRing2);

    // Glowing Core Node
    const coreLight = new THREE.PointLight(0x4d8eff, 2.5, 35);
    heroObjectGroup.add(coreLight);

    scene.add(heroObjectGroup);

    // 3. Procedural Sinusoidal Flow Waves (Blue & Orange Cyber Streams)
    const wavePointsBlue: THREE.Vector3[] = [];
    const wavePointsOrange: THREE.Vector3[] = [];
    const waveSegments = 60;

    for (let i = 0; i <= waveSegments; i++) {
      const x = (i / waveSegments - 0.5) * 160;
      wavePointsBlue.push(new THREE.Vector3(x, 0, 0));
      wavePointsOrange.push(new THREE.Vector3(x, 0, 0));
    }

    const waveGeoBlue = new THREE.BufferGeometry().setFromPoints(wavePointsBlue);
    const waveMatBlue = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.35,
    });
    const waveLineBlue = new THREE.Line(waveGeoBlue, waveMatBlue);
    waveLineBlue.position.set(0, -18, -15);
    scene.add(waveLineBlue);

    const waveGeoOrange = new THREE.BufferGeometry().setFromPoints(wavePointsOrange);
    const waveMatOrange = new THREE.LineBasicMaterial({
      color: 0xffb690,
      transparent: true,
      opacity: 0.25,
    });
    const waveLineOrange = new THREE.Line(waveGeoOrange, waveMatOrange);
    waveLineOrange.position.set(0, -22, -20);
    scene.add(waveLineOrange);

    // Mouse Responsive Parallax Tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.0008;
      targetY = (e.clientY - window.innerHeight / 2) * 0.0008;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // 60FPS Render Loop with Dampening
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth exponential lerp
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const motionFactor = prefersReducedMotion ? 0.2 : 1.0;
      time += 0.01 * motionFactor;

      // Rotate Hero 3D Geometric Object with mouse response
      heroObjectGroup.rotation.y += (0.003 + currentX * 0.8) * motionFactor;
      heroObjectGroup.rotation.x += (0.0015 + currentY * 0.8) * motionFactor;
      innerPoly.rotation.y -= 0.005 * motionFactor;
      innerPoly.rotation.z += 0.003 * motionFactor;
      orbitalRing1.rotation.z += 0.004 * motionFactor;
      orbitalRing2.rotation.y -= 0.003 * motionFactor;

      // Parallax displacement of particles
      particles.rotation.y = currentX * 12 + time * 0.05;
      particles.rotation.x = -currentY * 12 + time * 0.02;

      // Undulate sinusoidal waves
      const bluePos = waveGeoBlue.attributes.position as THREE.BufferAttribute;
      const orangePos = waveGeoOrange.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i <= waveSegments; i++) {
        const u = i / waveSegments;
        const yBlue = Math.sin(u * 8 + time * 2 + currentX * 4) * 4.5 + Math.cos(u * 4 - time) * 2;
        bluePos.setY(i, yBlue);

        const yOrange = Math.cos(u * 6 - time * 1.5 - currentY * 3) * 3.5 + Math.sin(u * 3 + time) * 1.8;
        orangePos.setY(i, yOrange);
      }
      bluePos.needsUpdate = true;
      orangePos.needsUpdate = true;

      // Camera parallax
      camera.position.x = currentX * 35;
      camera.position.y = -currentY * 35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Clean disposal
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      particleGeo.dispose();
      particleMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      waveGeoBlue.dispose();
      waveMatBlue.dispose();
      waveGeoOrange.dispose();
      waveMatOrange.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    // Graceful CSS Fallback for unsupported devices
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40 bg-radial-gradient"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full border border-[#3b82f6]/30 animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full border border-[#ffb690]/25" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  );
};
