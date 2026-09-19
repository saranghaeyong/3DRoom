import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

interface RoomSceneProps {
  onSelectObject: (objectId: string) => void;
  selectedObjectId: string | null;
  isDarkMode: boolean;
  onHoverObjectChange: (objectInfo: { id: string; label: string; hint: string; x: number; y: number } | null) => void;
  resetViewTrigger: number;
}

export const RoomScene: React.FC<RoomSceneProps> = ({
  onSelectObject,
  selectedObjectId,
  isDarkMode,
  onHoverObjectChange,
  resetViewTrigger,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const interactiveMeshesRef = useRef<THREE.Mesh[]>([]);
  const lampLightRef = useRef<THREE.PointLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const windowPlaneRef = useRef<THREE.Mesh | null>(null);
  const deskLampStateRef = useRef<boolean>(true);

  // Camera targets for smooth glide
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(7.2, 5.8, 7.8));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));
  const defaultCamPos = new THREE.Vector3(7.2, 5.8, 7.8);
  const defaultLookAt = new THREE.Vector3(0, 1.2, 0);

  // Focal positions for clicking or selecting objects
  const focusTargets: Record<string, { cam: THREE.Vector3; look: THREE.Vector3 }> = {
    computer: { cam: new THREE.Vector3(1.2, 2.5, 3.2), look: new THREE.Vector3(-0.2, 1.8, 0.4) },
    laptop: { cam: new THREE.Vector3(0.5, 2.3, 2.8), look: new THREE.Vector3(-0.8, 1.7, 0.5) },
    desk: { cam: new THREE.Vector3(2.5, 3.2, 3.8), look: new THREE.Vector3(-0.2, 1.5, 0.2) },
    bookshelf: { cam: new THREE.Vector3(3.8, 3.0, 1.2), look: new THREE.Vector3(2.5, 2.2, -1.8) },
    certificate: { cam: new THREE.Vector3(2.4, 3.2, 2.2), look: new THREE.Vector3(1.0, 3.3, -2.4) },
    resume: { cam: new THREE.Vector3(0.8, 2.2, 2.2), look: new THREE.Vector3(0.1, 1.5, 0.9) },
    phone: { cam: new THREE.Vector3(1.2, 2.0, 2.4), look: new THREE.Vector3(0.4, 1.5, 0.9) },
    camera: { cam: new THREE.Vector3(2.8, 2.8, 1.8), look: new THREE.Vector3(2.5, 2.4, -0.6) },
    github: { cam: new THREE.Vector3(3.2, 2.6, 1.2), look: new THREE.Vector3(2.3, 2.1, -1.8) },
    lamp: { cam: new THREE.Vector3(1.4, 2.4, 2.8), look: new THREE.Vector3(-0.1, 1.8, 0.1) },
    window: { cam: new THREE.Vector3(3.8, 3.4, 4.2), look: new THREE.Vector3(-3.0, 2.8, 0) },
  };

  // Reset to overview
  const resetCamera = useCallback(() => {
    targetCamPos.current.copy(defaultCamPos);
    targetLookAt.current.copy(defaultLookAt);
  }, []);

  useEffect(() => {
    resetCamera();
  }, [resetViewTrigger, resetCamera]);

  // When selectedObjectId changes from UI
  useEffect(() => {
    if (selectedObjectId && focusTargets[selectedObjectId]) {
      targetCamPos.current.copy(focusTargets[selectedObjectId].cam);
      targetLookAt.current.copy(focusTargets[selectedObjectId].look);
    } else if (!selectedObjectId) {
      resetCamera();
    }
  }, [selectedObjectId, resetCamera]);

  // Handle Dark / Light mode lighting updates
  useEffect(() => {
    if (!ambientLightRef.current || !sunLightRef.current || !windowPlaneRef.current) return;

    if (isDarkMode) {
      // Cozy evening developer room
      ambientLightRef.current.color.setHex(0x2a2838);
      ambientLightRef.current.intensity = 0.8;

      sunLightRef.current.color.setHex(0x526085);
      sunLightRef.current.intensity = 0.5;

      if (lampLightRef.current) {
        lampLightRef.current.intensity = 2.4;
        lampLightRef.current.color.setHex(0xffaa55);
      }

      (windowPlaneRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x181e30);
    } else {
      // Warm soft daylight aesthetic
      ambientLightRef.current.color.setHex(0xfff6ea);
      ambientLightRef.current.intensity = 1.35;

      sunLightRef.current.color.setHex(0xfff0d8);
      sunLightRef.current.intensity = 1.6;

      if (lampLightRef.current) {
        lampLightRef.current.intensity = 1.2;
        lampLightRef.current.color.setHex(0xffe6b8);
      }

      (windowPlaneRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xe8f0f8);
    }
  }, [isDarkMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isDarkMode ? 0x121118 : 0xfcfaf7);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.copy(defaultCamPos);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(defaultLookAt);
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go under floor
    controls.minPolarAngle = Math.PI / 8;
    controls.minDistance = 2.5;
    controls.maxDistance = 15;
    controls.enablePan = false;

    // Lighting
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x2a2838 : 0xfff6ea, isDarkMode ? 0.8 : 1.35);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Sunlight through window
    const sunLight = new THREE.DirectionalLight(isDarkMode ? 0x526085 : 0xfff0d8, isDarkMode ? 0.5 : 1.6);
    sunLight.position.set(-8, 9, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Fill bounce light (soft peach/cream)
    const fillLight = new THREE.DirectionalLight(0xffecd6, 0.45);
    fillLight.position.set(6, 6, 6);
    scene.add(fillLight);

    // Desk lamp point light
    const lampLight = new THREE.PointLight(0xffe6b8, 1.2, 5, 1.2);
    lampLight.position.set(-0.1, 2.25, 0.15);
    lampLight.castShadow = true;
    lampLight.shadow.bias = -0.001;
    scene.add(lampLight);
    lampLightRef.current = lampLight;

    // Materials Palette (Warm Ivory, Soft Cream, Beige, Light Oak, Sage, Muted Blue)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdfd2c0, // Light oak / warm birch
      roughness: 0.55,
      metalness: 0.05,
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f1eb, // Soft cream / warm ivory
      roughness: 0.9,
    });

    const woodDeskMat = new THREE.MeshStandardMaterial({
      color: 0xc8b293, // Natural birch / light oak desk
      roughness: 0.45,
      metalness: 0.02,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x383533,
      roughness: 0.35,
      metalness: 0.8,
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8f7f5,
      roughness: 0.5,
    });

    const sageMat = new THREE.MeshStandardMaterial({
      color: 0x8ea89d, // Soft sage green
      roughness: 0.6,
    });

    const peachMat = new THREE.MeshStandardMaterial({
      color: 0xe6b9a8, // Soft peach accent
      roughness: 0.7,
    });

    const pastelBlueMat = new THREE.MeshStandardMaterial({
      color: 0x9cb4c9, // Muted pastel blue
      roughness: 0.6,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd6b77e, // Warm brass
      roughness: 0.25,
      metalness: 0.7,
    });

    const terracottaMat = new THREE.MeshStandardMaterial({
      color: 0xc87d55,
      roughness: 0.8,
    });

    const plantGreenMat = new THREE.MeshStandardMaterial({
      color: 0x4a7c59,
      roughness: 0.6,
    });

    // Array to collect interactive objects for raycasting
    const interactives: THREE.Mesh[] = [];

    // Helper to register interactive object
    const registerInteractive = (mesh: THREE.Mesh, id: string, name: string, hint: string) => {
      mesh.userData = {
        isInteractive: true,
        interactiveId: id,
        label: name,
        hint: hint,
        initialScale: mesh.scale.clone(),
      };
      interactives.push(mesh);
    };

    // --- 1. Room Floor & Walls (Cutaway Isometric Architecture) ---
    const roomSize = 6;
    const wallHeight = 4.2;

    // Floor
    const floorGeo = new THREE.BoxGeometry(roomSize, 0.2, roomSize);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Baseboard trim
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const trimBack = new THREE.Mesh(new THREE.BoxGeometry(roomSize, 0.15, 0.05), trimMat);
    trimBack.position.set(0, 0.075, -roomSize / 2 + 0.025);
    scene.add(trimBack);
    const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, roomSize), trimMat);
    trimLeft.position.set(-roomSize / 2 + 0.025, 0.075, 0);
    scene.add(trimLeft);

    // Back Wall (Z = -roomSize / 2)
    const backWallGeo = new THREE.BoxGeometry(roomSize, wallHeight, 0.15);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, wallHeight / 2, -roomSize / 2 - 0.075);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall with Window cutout (X = -roomSize / 2)
    const leftWallGeo = new THREE.BoxGeometry(0.15, wallHeight, roomSize);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-roomSize / 2 - 0.075, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // --- 2. Window with Sunlight & Curtains ---
    const winWidth = 2.4;
    const winHeight = 2.2;
    const winX = -roomSize / 2 - 0.02;
    const winY = 2.4;
    const winZ = 0.2;

    // Window glass / sky background
    const windowSkyGeo = new THREE.PlaneGeometry(winWidth, winHeight);
    const windowSkyMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x181e30 : 0xe8f0f8,
      side: THREE.DoubleSide,
    });
    const windowPlane = new THREE.Mesh(windowSkyGeo, windowSkyMat);
    windowPlane.rotation.y = Math.PI / 2;
    windowPlane.position.set(winX + 0.04, winY, winZ);
    scene.add(windowPlane);
    windowPlaneRef.current = windowPlane;

    // Window Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const winFrameOuter = new THREE.Mesh(new THREE.BoxGeometry(0.08, winHeight + 0.1, winWidth + 0.1), frameMat);
    winFrameOuter.position.set(winX + 0.06, winY, winZ);
    scene.add(winFrameOuter);

    // Window Panes divider
    const winMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.09, winHeight, 0.05), frameMat);
    winMullionV.position.set(winX + 0.06, winY, winZ);
    scene.add(winMullionV);
    const winMullionH = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, winWidth), frameMat);
    winMullionH.position.set(winX + 0.06, winY, winZ);
    scene.add(winMullionH);

    // Window Sill
    const winSill = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, winWidth + 0.3), woodDeskMat);
    winSill.position.set(winX + 0.14, winY - winHeight / 2 - 0.04, winZ);
    winSill.castShadow = true;
    scene.add(winSill);

    // Small succulent on window sill
    const sillPot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16), terracottaMat);
    sillPot.position.set(winX + 0.14, winY - winHeight / 2 + 0.06, winZ + 0.5);
    sillPot.castShadow = true;
    scene.add(sillPot);
    const sillPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), plantGreenMat);
    sillPlant.position.set(winX + 0.14, winY - winHeight / 2 + 0.16, winZ + 0.5);
    scene.add(sillPlant);

    // Curtains (Soft Cream Linen)
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0xf5eee4,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const curtainLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, winHeight + 0.4, 16, 1, false, 0, Math.PI), curtainMat);
    curtainLeft.rotation.y = Math.PI / 2;
    curtainLeft.position.set(winX + 0.16, winY - 0.1, winZ - winWidth / 2 - 0.05);
    curtainLeft.castShadow = true;
    scene.add(curtainLeft);

    const curtainRight = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, winHeight + 0.4, 16, 1, false, 0, Math.PI), curtainMat);
    curtainRight.rotation.y = Math.PI / 2;
    curtainRight.position.set(winX + 0.16, winY - 0.1, winZ + winWidth / 2 + 0.05);
    curtainRight.castShadow = true;
    scene.add(curtainRight);

    // Curtain Rod
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, winWidth + 0.7, 12), brassMat);
    rod.rotation.x = Math.PI / 2;
    rod.position.set(winX + 0.16, winY + winHeight / 2 + 0.15, winZ);
    scene.add(rod);

    // --- 3. Cozy Rug on Floor ---
    const rugGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.02, 32);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0xeee6da,
      roughness: 0.95,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0.1, 0.01, 1.2);
    rug.receiveShadow = true;
    scene.add(rug);

    // --- 4. Modern Workstation / Desk ---
    // Desk Surface
    const deskWidth = 2.2;
    const deskDepth = 1.05;
    const deskHeight = 1.35;
    const deskThickness = 0.07;
    const deskX = -0.4;
    const deskZ = 0.5;

    const deskTopGeo = new THREE.BoxGeometry(deskWidth, deskThickness, deskDepth);
    const deskTop = new THREE.Mesh(deskTopGeo, woodDeskMat);
    deskTop.position.set(deskX, deskHeight, deskZ);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    registerInteractive(deskTop, 'desk', 'Developer Desk', 'Technical Stack & Skills');

    // Desk Legs (Minimalist white/metallic A-frame style)
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, deskHeight - deskThickness / 2, 12);
    const legPositions = [
      [deskX - deskWidth / 2 + 0.09, (deskHeight - deskThickness / 2) / 2, deskZ - deskDepth / 2 + 0.09],
      [deskX + deskWidth / 2 - 0.09, (deskHeight - deskThickness / 2) / 2, deskZ - deskDepth / 2 + 0.09],
      [deskX - deskWidth / 2 + 0.09, (deskHeight - deskThickness / 2) / 2, deskZ + deskDepth / 2 - 0.09],
      [deskX + deskWidth / 2 - 0.09, (deskHeight - deskThickness / 2) / 2, deskZ + deskDepth / 2 - 0.09],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, whiteMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      scene.add(leg);
    });

    // Desk Cable management bar
    const bar = new THREE.Mesh(new THREE.BoxGeometry(deskWidth - 0.3, 0.04, 0.04), darkMetalMat);
    bar.position.set(deskX, deskHeight - 0.25, deskZ - deskDepth / 2 + 0.15);
    scene.add(bar);

    // Felt Desk Mat
    const matGeo = new THREE.BoxGeometry(1.4, 0.008, 0.65);
    const deskPadMat = new THREE.MeshStandardMaterial({ color: 0x4a4846, roughness: 0.85 });
    const deskPad = new THREE.Mesh(matGeo, deskPadMat);
    deskPad.position.set(deskX - 0.1, deskHeight + deskThickness / 2 + 0.004, deskZ + 0.05);
    deskPad.receiveShadow = true;
    scene.add(deskPad);

    // --- 5. Desktop Computer Setup (Interactive: ABOUT) ---
    // Monitor Stand
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.015, 0.22), darkMetalMat);
    standBase.position.set(deskX - 0.2, deskHeight + deskThickness / 2 + 0.01, deskZ - 0.22);
    standBase.castShadow = true;
    scene.add(standBase);

    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 16), darkMetalMat);
    standPole.position.set(deskX - 0.2, deskHeight + deskThickness / 2 + 0.18, deskZ - 0.24);
    standPole.castShadow = true;
    scene.add(standPole);

    // Main Monitor Body
    const monitorWidth = 1.0;
    const monitorHeight = 0.6;
    const monitorGeo = new THREE.BoxGeometry(monitorWidth, monitorHeight, 0.04);
    const monitorBezel = new THREE.Mesh(monitorGeo, darkMetalMat);
    monitorBezel.position.set(deskX - 0.2, deskHeight + deskThickness / 2 + 0.44, deskZ - 0.22);
    monitorBezel.castShadow = true;
    scene.add(monitorBezel);

    // Glowing Screen with canvas code texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 300;
    const sctx = screenCanvas.getContext('2d');
    if (sctx) {
      sctx.fillStyle = '#1e2433';
      sctx.fillRect(0, 0, 512, 300);
      sctx.fillStyle = '#61afef';
      sctx.font = 'bold 22px monospace';
      sctx.fillText('// SARANG R N — MCA Graduate', 24, 45);
      sctx.fillStyle = '#98c379';
      sctx.font = '17px monospace';
      sctx.fillText('const developer = {', 24, 85);
      sctx.fillText('  status: "Ready for Software Engineering",', 44, 115);
      sctx.fillText('  degree: "MCA (CUSAT) - First Class",', 44, 145);
      sctx.fillText('  stack: ["Python", "Java", "SQL", "ML"]', 44, 175);
      sctx.fillText('};', 24, 205);
      sctx.fillStyle = '#e5c07b';
      sctx.fillText('developer.buildInnovativeApps();', 24, 250);
    }
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: new THREE.Color(0x6688aa),
      emissiveIntensity: 0.45,
      roughness: 0.2,
    });
    const screenGeo = new THREE.PlaneGeometry(monitorWidth - 0.04, monitorHeight - 0.04);
    const monitorScreen = new THREE.Mesh(screenGeo, screenMat);
    monitorScreen.position.set(deskX - 0.2, deskHeight + deskThickness / 2 + 0.44, deskZ - 0.198);
    scene.add(monitorScreen);

    // Register Monitor for About section
    registerInteractive(monitorBezel, 'computer', 'Main Computer', 'Profile & About Me');
    registerInteractive(monitorScreen, 'computer', 'Main Computer', 'Profile & About Me');

    // Mechanical Keyboard
    const kbGeo = new THREE.BoxGeometry(0.48, 0.02, 0.16);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0xdedbd5, roughness: 0.4 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(deskX - 0.2, deskHeight + deskThickness / 2 + 0.016, deskZ + 0.08);
    keyboard.castShadow = true;
    scene.add(keyboard);

    // Mouse
    const mouseGeo = new THREE.BoxGeometry(0.08, 0.025, 0.12);
    const computerMouse = new THREE.Mesh(mouseGeo, whiteMat);
    computerMouse.position.set(deskX + 0.22, deskHeight + deskThickness / 2 + 0.018, deskZ + 0.08);
    computerMouse.castShadow = true;
    scene.add(computerMouse);

    // --- 6. Laptop on Stand (Interactive: PROJECTS) ---
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(deskX + 0.65, deskHeight + deskThickness / 2 + 0.02, deskZ - 0.05);
    laptopGroup.rotation.y = -Math.PI / 7;

    // Laptop Base
    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.3), darkMetalMat);
    lapBase.castShadow = true;
    laptopGroup.add(lapBase);

    // Laptop Screen angled
    const lapScreenGroup = new THREE.Group();
    lapScreenGroup.position.set(0, 0.01, -0.14);
    lapScreenGroup.rotation.x = -Math.PI / 10;

    const lapLid = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.012), darkMetalMat);
    lapLid.position.set(0, 0.14, 0);
    lapLid.castShadow = true;
    lapScreenGroup.add(lapLid);

    // Laptop glowing display
    const lapCanvas = document.createElement('canvas');
    lapCanvas.width = 256;
    lapCanvas.height = 180;
    const lctx = lapCanvas.getContext('2d');
    if (lctx) {
      lctx.fillStyle = '#0f172a';
      lctx.fillRect(0, 0, 256, 180);
      lctx.fillStyle = '#38bdf8';
      lctx.font = 'bold 20px sans-serif';
      lctx.fillText('PROJECTS', 20, 45);
      lctx.fillStyle = '#e2e8f0';
      lctx.font = '14px sans-serif';
      lctx.fillText('• Sarang3DRoom Portfolio', 20, 80);
      lctx.fillText('• Three.js 3D Workspace', 20, 105);
      lctx.fillStyle = '#4ade80';
      lctx.fillText('> Click to View Projects', 20, 145);
    }
    const lapTexture = new THREE.CanvasTexture(lapCanvas);
    const lapScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.39, 0.25),
      new THREE.MeshStandardMaterial({
        map: lapTexture,
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 0.4,
      })
    );
    lapScreen.position.set(0, 0.14, 0.008);
    lapScreenGroup.add(lapScreen);
    laptopGroup.add(lapScreenGroup);

    scene.add(laptopGroup);
    registerInteractive(lapBase, 'laptop', 'Developer Laptop', 'Interactive Projects');
    registerInteractive(lapLid, 'laptop', 'Developer Laptop', 'Interactive Projects');

    // --- 7. Desk Lamp (Interactive Switch) ---
    const lampGroup = new THREE.Group();
    lampGroup.position.set(deskX - 0.75, deskHeight + deskThickness / 2 + 0.01, deskZ - 0.25);

    const lampBaseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.02, 24), brassMat);
    lampBaseMesh.castShadow = true;
    lampGroup.add(lampBaseMesh);

    // Lamp curved stem
    const lampStem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12), brassMat);
    lampStem1.position.set(0, 0.17, 0);
    lampStem1.rotation.z = -0.2;
    lampGroup.add(lampStem1);

    const lampStem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 12), brassMat);
    lampStem2.position.set(0.07, 0.42, 0);
    lampStem2.rotation.z = 0.55;
    lampGroup.add(lampStem2);

    // Lamp Shade
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.16, 24, 1, true), brassMat);
    lampShade.position.set(0.19, 0.48, 0);
    lampShade.rotation.z = -1.2;
    lampShade.castShadow = true;
    lampGroup.add(lampShade);

    // Glowing bulb inside
    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfff3d6,
        emissive: 0xffd999,
        emissiveIntensity: 1.5,
      })
    );
    lampBulb.position.set(0.18, 0.46, 0);
    lampGroup.add(lampBulb);

    scene.add(lampGroup);
    registerInteractive(lampShade, 'lamp', 'Warm Desk Lamp', 'Toggle Lamp Illumination');
    registerInteractive(lampBaseMesh, 'lamp', 'Warm Desk Lamp', 'Toggle Lamp Illumination');

    // --- 8. Resume Document on Desk (Interactive: RESUME) ---
    const resumePaper = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.005, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    resumePaper.position.set(deskX - 0.65, deskHeight + deskThickness / 2 + 0.006, deskZ + 0.2);
    resumePaper.rotation.y = 0.25;
    resumePaper.castShadow = true;
    resumePaper.receiveShadow = true;
    scene.add(resumePaper);

    // Red ribbon / CV badge on the paper
    const cvBadge = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.008, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 })
    );
    cvBadge.position.set(deskX - 0.65, deskHeight + deskThickness / 2 + 0.01, deskZ + 0.15);
    cvBadge.rotation.y = 0.25;
    scene.add(cvBadge);

    registerInteractive(resumePaper, 'resume', 'Official Resume', 'View & Download CV');

    // --- 9. Smartphone on Desk (Interactive: CONTACT) ---
    const phoneMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.01, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.2, metalness: 0.6 })
    );
    phoneMesh.position.set(deskX + 0.38, deskHeight + deskThickness / 2 + 0.008, deskZ + 0.25);
    phoneMesh.rotation.y = -0.3;
    phoneMesh.castShadow = true;
    scene.add(phoneMesh);

    // Glowing message notification screen on phone
    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.15),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
      })
    );
    phoneScreen.rotation.x = -Math.PI / 2;
    phoneScreen.rotation.z = 0.3;
    phoneScreen.position.set(deskX + 0.38, deskHeight + deskThickness / 2 + 0.014, deskZ + 0.25);
    scene.add(phoneScreen);

    registerInteractive(phoneMesh, 'phone', 'Smartphone', 'Contact, Email & Phone');
    registerInteractive(phoneScreen, 'phone', 'Smartphone', 'Contact, Email & Phone');

    // Coffee Mug with subtle steam
    const mugMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.045, 0.11, 20),
      new THREE.MeshStandardMaterial({ color: 0xf4eee6, roughness: 0.3 })
    );
    mugMesh.position.set(deskX - 0.55, deskHeight + deskThickness / 2 + 0.055, deskZ - 0.15);
    mugMesh.castShadow = true;
    scene.add(mugMesh);

    // Mug handle
    const handleMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.03, 0.008, 12, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xf4eee6, roughness: 0.3 })
    );
    handleMesh.rotation.z = -Math.PI / 2;
    handleMesh.position.set(deskX - 0.6, deskHeight + deskThickness / 2 + 0.055, deskZ - 0.15);
    scene.add(handleMesh);

    // Headphones on wooden stand
    const standArc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.28, 16),
      brassMat
    );
    standArc.position.set(deskX + 0.85, deskHeight + deskThickness / 2 + 0.14, deskZ - 0.25);
    standArc.castShadow = true;
    scene.add(standArc);

    const hpBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.014, 12, 24, Math.PI),
      darkMetalMat
    );
    hpBand.position.set(deskX + 0.85, deskHeight + deskThickness / 2 + 0.28, deskZ - 0.25);
    scene.add(hpBand);

    // --- 10. Developer Ergonomic Desk Chair ---
    const chairGroup = new THREE.Group();
    chairGroup.position.set(deskX - 0.1, 0, deskZ + 0.95);
    chairGroup.rotation.y = Math.PI - 0.2;

    // Chair base & 5 caster wheels
    const chairHub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16), darkMetalMat);
    chairHub.position.set(0, 0.15, 0);
    chairGroup.add(chairHub);

    const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16), darkMetalMat);
    chairPole.position.set(0, 0.38, 0);
    chairGroup.add(chairPole);

    // Chair seat cushion (cozy sage linen)
    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.1, 0.55), sageMat);
    seatMesh.position.set(0, 0.65, 0);
    seatMesh.castShadow = true;
    chairGroup.add(seatMesh);

    // Chair backrest (curved ergonomic lumbar)
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.65, 0.08), sageMat);
    backMesh.position.set(0, 1.05, -0.24);
    backMesh.rotation.x = -0.1;
    backMesh.castShadow = true;
    chairGroup.add(backMesh);

    scene.add(chairGroup);

    // --- 11. Tall Aesthetic Bookshelf (Interactive: EDUCATION) ---
    const shelfWidth = 1.3;
    const shelfHeight = 3.2;
    const shelfDepth = 0.42;
    const shelfX = 2.1;
    const shelfZ = -roomSize / 2 + 0.35;

    const shelfFrameMat = new THREE.MeshStandardMaterial({ color: 0xdec8ad, roughness: 0.5 });
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(shelfX, shelfHeight / 2, shelfZ);

    // Left and Right wooden side panels
    const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.05, shelfHeight, shelfDepth), shelfFrameMat);
    panelL.position.set(-shelfWidth / 2, 0, 0);
    panelL.castShadow = true;
    shelfGroup.add(panelL);

    const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.05, shelfHeight, shelfDepth), shelfFrameMat);
    panelR.position.set(shelfWidth / 2, 0, 0);
    panelR.castShadow = true;
    shelfGroup.add(panelR);

    // 5 Shelf tiers
    const tierHeights = [-1.4, -0.7, 0, 0.7, 1.4];
    tierHeights.forEach((th, i) => {
      const tier = new THREE.Mesh(new THREE.BoxGeometry(shelfWidth, 0.04, shelfDepth), shelfFrameMat);
      tier.position.set(0, th, 0);
      tier.castShadow = true;
      tier.receiveShadow = true;
      shelfGroup.add(tier);

      // Add neat books on tiers
      const bookColors = [0x9cb4c9, 0xe6b9a8, 0x8ea89d, 0xd6b77e, 0x5a6d80, 0xb88b72];
      const count = 4 + (i % 3);
      for (let b = 0; b < count; b++) {
        const bHeight = 0.26 + (b % 3) * 0.04;
        const bWidth = 0.05;
        const bDepth = 0.26;
        const bookMat = new THREE.MeshStandardMaterial({
          color: bookColors[(b + i) % bookColors.length],
          roughness: 0.6,
        });
        const book = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bDepth), bookMat);
        book.position.set(-shelfWidth / 2 + 0.15 + b * 0.065, th + bHeight / 2 + 0.02, 0);
        book.castShadow = true;
        shelfGroup.add(book);
      }
    });

    // Decorative Retro Camera & plant on top tier
    const cameraBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.12, 0.09),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.4 })
    );
    cameraBody.position.set(0.3, 1.4 + 0.08, 0);
    cameraBody.castShadow = true;
    shelfGroup.add(cameraBody);

    const cameraLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16),
      brassMat
    );
    cameraLens.rotation.x = Math.PI / 2;
    cameraLens.position.set(0.3, 1.4 + 0.08, 0.06);
    shelfGroup.add(cameraLens);

    // Trailing pothos plant on middle tier
    const potSmall = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.14, 16), terracottaMat);
    potSmall.position.set(0.35, 0.02 + 0.07, 0);
    shelfGroup.add(potSmall);

    const vineMat = new THREE.MeshStandardMaterial({ color: 0x477852, roughness: 0.7 });
    for (let v = 0; v < 4; v++) {
      const vine = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), vineMat);
      vine.position.set(0.35 + (v % 2) * 0.04, 0.02 - v * 0.08, 0.12);
      shelfGroup.add(vine);
    }

    // 3D GitHub Cube / Octocat Emblem on Shelf
    const gitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.14, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x181717, roughness: 0.3, metalness: 0.8 })
    );
    gitBox.position.set(-0.35, 0.02 + 0.09, 0);
    gitBox.rotation.y = 0.4;
    shelfGroup.add(gitBox);

    scene.add(shelfGroup);

    // Register Shelf for Education, Camera for Gallery, GitHub for GitHub Profile
    registerInteractive(panelL, 'bookshelf', 'Academic Bookshelf', 'Education & Academics');
    registerInteractive(panelR, 'bookshelf', 'Academic Bookshelf', 'Education & Academics');
    registerInteractive(cameraBody, 'camera', 'Aesthetic Camera', 'Personal Workspace Gallery');
    registerInteractive(gitBox, 'github', 'GitHub Icon', 'GitHub Profile & Code');

    // --- 12. Framed Degree Certificate on Wall (Interactive: CERTIFICATIONS) ---
    const certFrameW = 0.7;
    const certFrameH = 0.52;
    const certFrameGeo = new THREE.BoxGeometry(certFrameW, certFrameH, 0.04);
    const certFrame = new THREE.Mesh(certFrameGeo, brassMat);
    certFrame.position.set(0.5, 3.1, -roomSize / 2 + 0.03);
    certFrame.castShadow = true;
    scene.add(certFrame);

    // Canvas texture for Certificate
    const certCanvas = document.createElement('canvas');
    certCanvas.width = 512;
    certCanvas.height = 380;
    const cctx = certCanvas.getContext('2d');
    if (cctx) {
      cctx.fillStyle = '#fdfbf7';
      cctx.fillRect(0, 0, 512, 380);
      cctx.strokeStyle = '#c5a059';
      cctx.lineWidth = 8;
      cctx.strokeRect(16, 16, 480, 348);
      cctx.fillStyle = '#2c2523';
      cctx.font = 'bold 24px serif';
      cctx.textAlign = 'center';
      cctx.fillText('COCHIN UNIVERSITY (CUSAT)', 256, 75);
      cctx.font = '18px sans-serif';
      cctx.fillText('Master of Computer Applications', 256, 125);
      cctx.font = 'bold 22px serif';
      cctx.fillStyle = '#b45309';
      cctx.fillText('SARANG R N', 256, 180);
      cctx.fillStyle = '#374151';
      cctx.font = '16px sans-serif';
      cctx.fillText('CGPA: 7.66 / 10 • First Class', 256, 225);
      cctx.fillText('Diploma in Web Designing & DTP', 256, 260);
      cctx.font = 'italic 14px serif';
      cctx.fillText('Click to view full certifications', 256, 320);
    }
    const certTexture = new THREE.CanvasTexture(certCanvas);
    const certPaper = new THREE.Mesh(
      new THREE.PlaneGeometry(certFrameW - 0.06, certFrameH - 0.06),
      new THREE.MeshStandardMaterial({ map: certTexture, roughness: 0.3 })
    );
    certPaper.position.set(0.5, 3.1, -roomSize / 2 + 0.055);
    scene.add(certPaper);

    registerInteractive(certFrame, 'certificate', 'Framed CUSAT Degree & Certifications', 'View Official Certifications');
    registerInteractive(certPaper, 'certificate', 'Framed CUSAT Degree & Certifications', 'View Official Certifications');

    // Minimalist Modern Wall Art Frame next to certificate
    const artFrameW = 0.55;
    const artFrameH = 0.75;
    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(artFrameW, artFrameH, 0.03),
      darkMetalMat
    );
    artFrame.position.set(-1.1, 3.2, -roomSize / 2 + 0.03);
    scene.add(artFrame);

    const artCanvas = document.createElement('canvas');
    artCanvas.width = 300;
    artCanvas.height = 400;
    const actx = artCanvas.getContext('2d');
    if (actx) {
      actx.fillStyle = '#f8f5f0';
      actx.fillRect(0, 0, 300, 400);
      // Modern geometric minimalist shapes (sage circle, peach arc, muted blue rectangle)
      actx.fillStyle = '#8ea89d';
      actx.beginPath();
      actx.arc(150, 160, 90, 0, Math.PI * 2);
      actx.fill();
      actx.fillStyle = '#e6b9a8';
      actx.beginPath();
      actx.arc(150, 240, 70, Math.PI, 0);
      actx.fill();
      actx.fillStyle = '#9cb4c9';
      actx.fillRect(80, 260, 140, 50);
    }
    const artPaper = new THREE.Mesh(
      new THREE.PlaneGeometry(artFrameW - 0.04, artFrameH - 0.04),
      new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(artCanvas), roughness: 0.4 })
    );
    artPaper.position.set(-1.1, 3.2, -roomSize / 2 + 0.05);
    scene.add(artPaper);

    // --- 13. Cozy Daybed / Lounge Corner (Right side) ---
    const bedGroup = new THREE.Group();
    const bedW = 1.3;
    const bedL = 2.1;
    const bedH = 0.45;
    const bedX = 1.8;
    const bedZ = 1.6;
    bedGroup.position.set(bedX, 0, bedZ);

    // Bed Wooden base frame
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(bedW, 0.22, bedL), woodDeskMat);
    bedBase.position.set(0, 0.11, 0);
    bedBase.castShadow = true;
    bedBase.receiveShadow = true;
    bedGroup.add(bedBase);

    // Cozy Linen Mattress / Duvet (Warm Ivory / Off-White)
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.08, 0.28, bedL - 0.08),
      new THREE.MeshStandardMaterial({ color: 0xfbf8f3, roughness: 0.9 })
    );
    mattress.position.set(0, 0.35, 0);
    mattress.castShadow = true;
    bedGroup.add(mattress);

    // Pastel throw blanket folded at the foot of bed
    const throwBlanket = new THREE.Mesh(
      new THREE.BoxGeometry(bedW - 0.06, 0.08, 0.65),
      pastelBlueMat
    );
    throwBlanket.position.set(0, 0.48, 0.6);
    throwBlanket.castShadow = true;
    bedGroup.add(throwBlanket);

    // Accent Pillows (Sage & Peach)
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.3), peachMat);
    pillow1.position.set(-0.25, 0.54, -0.7);
    pillow1.rotation.x = 0.2;
    bedGroup.add(pillow1);

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.3), sageMat);
    pillow2.position.set(0.25, 0.54, -0.68);
    pillow2.rotation.x = 0.22;
    bedGroup.add(pillow2);

    scene.add(bedGroup);

    // --- 14. Floor Monstera Plant in Terracotta Pot ---
    const monsteraGroup = new THREE.Group();
    monsteraGroup.position.set(-roomSize / 2 + 0.6, 0, roomSize / 2 - 0.8);

    const floorPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.2, 0.45, 24),
      terracottaMat
    );
    floorPot.position.set(0, 0.225, 0);
    floorPot.castShadow = true;
    monsteraGroup.add(floorPot);

    // Monstera large green leaves fan
    const leafGeo = new THREE.ConeGeometry(0.22, 0.45, 8);
    leafGeo.scale(1, 0.15, 1);
    for (let l = 0; l < 7; l++) {
      const leafMesh = new THREE.Mesh(leafGeo, plantGreenMat);
      const angle = (l / 7) * Math.PI * 2;
      leafMesh.position.set(Math.cos(angle) * 0.28, 0.45 + (l % 3) * 0.12, Math.sin(angle) * 0.28);
      leafMesh.rotation.y = angle;
      leafMesh.rotation.z = 0.5;
      leafMesh.castShadow = true;
      monsteraGroup.add(leafMesh);
    }
    scene.add(monsteraGroup);

    // --- 15. Subtle Ambient Dust / Sunlight Particles ---
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 5;
      particlePositions[p * 3 + 1] = Math.random() * 3.5 + 0.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffeedb,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    interactiveMeshesRef.current = interactives;

    // --- Raycasting & Pointer Interactions ---
    const raycaster = new THREE.Raycaster();
    const mouseCoords = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseCoords, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.isInteractive) {
          renderer.domElement.style.cursor = 'pointer';

          if (hoveredMesh !== hit) {
            hoveredMesh = hit;
            soundManager.playClick(720);
          }

          onHoverObjectChange({
            id: hit.userData.interactiveId,
            label: hit.userData.label,
            hint: hit.userData.hint,
            x: e.clientX,
            y: e.clientY,
          });
          return;
        }
      }

      renderer.domElement.style.cursor = 'default';
      if (hoveredMesh) {
        hoveredMesh = null;
      }
      onHoverObjectChange(null);
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      // Only register as deliberate click if not a rotation drag
      if (dx < 7 && dy < 7) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseCoords, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          if (hit.userData.isInteractive) {
            const id = hit.userData.interactiveId;

            // Special case: desk lamp toggles light directly or opens modal
            if (id === 'lamp') {
              deskLampStateRef.current = !deskLampStateRef.current;
              if (lampLightRef.current) {
                lampLightRef.current.intensity = deskLampStateRef.current ? (isDarkMode ? 2.4 : 1.2) : 0.05;
              }
              soundManager.playClick(440);
            }

            soundManager.playInspect();
            onSelectObject(id);
          }
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation toward target
      camera.position.lerp(targetCamPos.current, 0.045);
      controls.target.lerp(targetLookAt.current, 0.045);
      controls.update();

      // Gentle floating animation on plants & dust particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime * 0.8 + i) * 0.002;
        if (positions[i * 3 + 1] > 4.2) positions[i * 3 + 1] = 0.5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Gentle pulsating glow on computer screen
      if (monitorScreen.material instanceof THREE.MeshStandardMaterial) {
        monitorScreen.material.emissiveIntensity = 0.4 + Math.sin(elapsedTime * 2) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing outline-none"
    />
  );
};
