import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HairAnimation3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 0.5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x9400d3, 0.5); // Purple backlight
    backLight.position.set(-5, 3, -5);
    scene.add(backLight);

    // Remove head geometry - we'll just have floating hair

    // Flowing hair strands
    const hairGroup = new THREE.Group();
    const hairCount = 150;
    const hairStrands: THREE.Line[] = [];

    for (let i = 0; i < hairCount; i++) {
      // Create longer, more flowing hair curves
      const startX = (Math.random() - 0.5) * 3;
      const startZ = (Math.random() - 0.5) * 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, 2, startZ),
        new THREE.Vector3(startX + (Math.random() - 0.5) * 0.3, 1, startZ + (Math.random() - 0.5) * 0.3),
        new THREE.Vector3(startX + (Math.random() - 0.5) * 0.5, 0, startZ + (Math.random() - 0.5) * 0.5),
        new THREE.Vector3(startX + (Math.random() - 0.5) * 0.8, -1, startZ + (Math.random() - 0.5) * 0.8),
        new THREE.Vector3(startX + (Math.random() - 0.5) * 1.2, -2, startZ + (Math.random() - 0.5) * 1.2),
        new THREE.Vector3(startX + (Math.random() - 0.5) * 1.5, -3, startZ + (Math.random() - 0.5) * 1.5)
      ]);

      const points = curve.getPoints(60);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Create hair with various colors (browns, blacks, highlights)
      const hairColors = [
        new THREE.Color().setHSL(0.08, 0.4, 0.15), // Dark brown
        new THREE.Color().setHSL(0.06, 0.5, 0.1),  // Almost black
        new THREE.Color().setHSL(0.1, 0.3, 0.25),  // Medium brown
        new THREE.Color().setHSL(0.12, 0.2, 0.35), // Light brown highlight
      ];
      
      const material = new THREE.LineBasicMaterial({ 
        color: hairColors[Math.floor(Math.random() * hairColors.length)],
        linewidth: 1.5,
        transparent: true,
        opacity: 0.7 + Math.random() * 0.3
      });

      const hairStrand = new THREE.Line(geometry, material);
      
      // Random rotation for natural look
      hairStrand.rotation.x = (Math.random() - 0.5) * 0.3;
      hairStrand.rotation.y = (Math.random() - 0.5) * 0.3;
      hairStrand.rotation.z = (Math.random() - 0.5) * 0.3;
      
      hairStrands.push(hairStrand);
      hairGroup.add(hairStrand);
    }

    scene.add(hairGroup);

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      time += 0.008;

      // Gentle rotation of entire hair group
      hairGroup.rotation.y = Math.sin(time * 0.5) * 0.2;

      // Animate hair strands with flowing motion
      hairStrands.forEach((strand, i) => {
        const offset = i * 0.02;
        
        // Gentle swaying motion
        strand.rotation.x = Math.sin(time + offset) * 0.08;
        strand.rotation.z = Math.cos(time + offset) * 0.06;
        
        // Update hair position for realistic wind flow
        const positions = strand.geometry.attributes.position;
        if (positions) {
          const posArray = positions.array as Float32Array;
          for (let j = 6; j < posArray.length; j += 3) {
            const segmentRatio = j / posArray.length;
            const windStrength = segmentRatio * 0.015; // Stronger effect on hair ends
            const windEffect = Math.sin(time * 3 + j * 0.05 + offset) * windStrength;
            const gentleWave = Math.cos(time * 2 + j * 0.03) * windStrength * 0.5;
            
            posArray[j] += windEffect; // X movement
            posArray[j + 2] += gentleWave; // Z movement
          }
          positions.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Three.js resources
      hairStrands.forEach(strand => {
        strand.geometry.dispose();
        if (strand.material instanceof THREE.Material) {
          strand.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}