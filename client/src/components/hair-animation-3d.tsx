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

    // Head geometry (simplified)
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffdbac,
      specular: 0x050505,
      shininess: 100
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.scale.y = 1.2; // Make head slightly oval
    scene.add(head);

    // Hair strands
    const hairGroup = new THREE.Group();
    const hairCount = 200;
    const hairStrands: THREE.Line[] = [];

    for (let i = 0; i < hairCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -0.5, 0.1),
        new THREE.Vector3(0, -1, 0.2),
        new THREE.Vector3(0, -1.5, 0.3),
        new THREE.Vector3(0, -2, 0.4),
        new THREE.Vector3(0, -2.5, 0.5)
      ]);

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Create gradient material for hair
      const material = new THREE.LineBasicMaterial({ 
        color: new THREE.Color().setHSL(0.08, 0.3, 0.2 + Math.random() * 0.2), // Dark brown variations
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      });

      const hairStrand = new THREE.Line(geometry, material);
      
      // Position hair around the head
      const angle = (i / hairCount) * Math.PI * 2;
      const radius = 0.95 + Math.random() * 0.1;
      const yOffset = 0.8 - (i / hairCount) * 0.3;
      
      hairStrand.position.x = Math.cos(angle) * radius;
      hairStrand.position.y = yOffset;
      hairStrand.position.z = Math.sin(angle) * radius;
      
      // Random rotation for variety
      hairStrand.rotation.x = (Math.random() - 0.5) * 0.2;
      hairStrand.rotation.z = (Math.random() - 0.5) * 0.2;
      
      hairStrands.push(hairStrand);
      hairGroup.add(hairStrand);
    }

    scene.add(hairGroup);

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Rotate head slightly
      head.rotation.y = Math.sin(time) * 0.1;
      hairGroup.rotation.y = Math.sin(time) * 0.1;

      // Animate hair strands
      hairStrands.forEach((strand, i) => {
        const offset = i * 0.01;
        strand.rotation.x = Math.sin(time + offset) * 0.05;
        strand.rotation.z = Math.cos(time + offset) * 0.05;
        
        // Update hair position for flowing effect
        const positions = strand.geometry.attributes.position;
        if (positions) {
          const posArray = positions.array as Float32Array;
          for (let j = 3; j < posArray.length; j += 3) {
            const windEffect = Math.sin(time * 2 + j * 0.1) * 0.02;
            posArray[j] += windEffect; // X movement
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
      headGeometry.dispose();
      headMaterial.dispose();
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