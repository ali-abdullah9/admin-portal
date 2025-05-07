"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeJsModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // Create a badge-like shape
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // Main badge body
    const badgeGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    const badgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Primary blue color
      roughness: 0.3,
      metalness: 0.7,
    });
    const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
    badgeGroup.add(badge);

    // Add letters "NT" on the badge
    const textGeometry1 = new THREE.BoxGeometry(0.8, 1.2, 0.1);
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.5,
    });
    
    // Letter N
    const letterN = new THREE.Group();
    const nBar1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.2, 0.15),
      textMaterial
    );
    const nBar2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.2, 0.15),
      textMaterial
    );
    const nDiagonal = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.4, 0.15),
      textMaterial
    );
    nBar1.position.set(-0.3, 0, 0.2);
    nBar2.position.set(0.3, 0, 0.2);
    nDiagonal.position.set(0, 0, 0.2);
    nDiagonal.rotation.z = Math.PI / 4;
    letterN.add(nBar1, nBar2, nDiagonal);
    letterN.position.set(-0.5, 0, 0.2);
    badgeGroup.add(letterN);
    
    // Letter T
    const letterT = new THREE.Group();
    const tTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.2, 0.15),
      textMaterial
    );
    const tStem = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.2, 0.15),
      textMaterial
    );
    tTop.position.set(0.5, 0.5, 0.2);
    tStem.position.set(0.5, 0, 0.2);
    letterT.add(tTop, tStem);
    badgeGroup.add(letterT);

    // Border rim for the badge
    const rimGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.8,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.15;
    badgeGroup.add(rim);

    const bottomRim = new THREE.Mesh(rimGeometry, rimMaterial);
    bottomRim.rotation.x = Math.PI / 2;
    bottomRim.position.y = -0.15;
    badgeGroup.add(bottomRim);

    // Add some spinning particles around the badge
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 500;
    const posArray = new Float32Array(particlesCnt * 3);
    
    for (let i = 0; i < particlesCnt * 3; i++) {
      // Create a ring-like distribution of particles
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      posArray[i3] = Math.cos(angle) * radius;
      posArray[i3 + 1] = (Math.random() - 0.5) * 3;
      posArray[i3 + 2] = Math.sin(angle) * radius;
    }
    
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x3b82f6,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x3b82f6, 2);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    // Animation loop
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      frame += 0.01;
      particlesMesh.rotation.y = frame * 0.3;
      
      // Make particles pulsate
      particlesMaterial.size = 0.02 + Math.sin(frame) * 0.01;
      
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
}