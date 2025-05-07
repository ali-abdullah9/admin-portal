"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const ThreeJsMajesticBadge = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000a20);

    // Camera setup - moved further back for better view
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Badge group
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // Create badge disk
    const diskGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 64);
    const diskMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.7,
      roughness: 0.2,
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    badgeGroup.add(disk);

    // Create a silver rim
    const rimGeometry = new THREE.TorusGeometry(2.05, 0.1, 16, 100);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    badgeGroup.add(rim);

    // Create single NT text sprite for better positioning
    function createTextSprite() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      
      const context = canvas.getContext('2d');
      context!.fillStyle = 'rgba(0, 0, 0, 0)';
      context!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text settings
      context!.font = 'bold 180px Arial';
      context!.textAlign = 'center';
      context!.textBaseline = 'middle';
      
      // Add white text with shadow for depth
      context!.shadowColor = 'rgba(0, 0, 0, 0.5)';
      context!.shadowBlur = 5;
      context!.shadowOffsetX = 3;
      context!.shadowOffsetY = 3;
      context!.fillStyle = 'white';
      context!.fillText("NT", canvas.width / 2, canvas.height / 2);
      
      // Create plane with texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      // Create plane rather than sprite for better control
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 1.25),
        material
      );
      
      // Position it in front of the badge
      plane.position.z = 0.15;
      
      return plane;
    }

    const textPlane = createTextSprite();
    badgeGroup.add(textPlane);

    // Create particles for space effect
    const particlesCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a galaxy-like distribution
      const radius = 3 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 5;
      
      posArray[i] = Math.cos(angle) * radius;
      posArray[i + 1] = height;
      posArray[i + 2] = Math.sin(angle) * radius;
    }
    
    particlesGeometry.setAttribute(
      "position", 
      new THREE.BufferAttribute(posArray, 3)
    );
    
    // Square particles with different sizes
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xaaccff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create energy rings
    function createEnergyRing(radius, color) {
      const geometry = new THREE.TorusGeometry(radius, 0.03, 8, 128);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        wireframe: true
      });
      return new THREE.Mesh(geometry, material);
    }
    
    const rings = [];
    const ringColors = [0x4287f5, 0x3b82f6, 0x0066ff];
    
    for (let i = 0; i < 3; i++) {
      const ring = createEnergyRing(i * 1 + 3, ringColors[i % ringColors.length]);
      ring.rotation.x = Math.PI / 4 + i * 0.2;
      ring.rotation.y = i * 0.3;
      rings.push(ring);
      scene.add(ring);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x0066ff, 1);
    light2.position.set(-5, -2, 3);
    scene.add(light2);
    
    // Add a point light for badge glow
    const pointLight = new THREE.PointLight(0x3b82f6, 1.5, 5);
    pointLight.position.set(0, 0, 1);
    badgeGroup.add(pointLight);

    // Mouse tracking for interactivity
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };
    
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      targetRotation.y = mouse.x * 0.3; // Reduced rotation amount for stability
      targetRotation.x = mouse.y * 0.2;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation variables
    let time = 0;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;
      
      // Smooth rotation with limited range
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      // Limit rotation to prevent extreme angles
      badgeGroup.rotation.x = Math.max(Math.min(currentRotation.x, 0.5), -0.5);
      badgeGroup.rotation.y = Math.max(Math.min(currentRotation.y + time * 0.1, 0.8), -0.8);
      
      // Rotate particles
      particlesMesh.rotation.y = time * 0.1;
      
      // Animate rings
      rings.forEach((ring, i) => {
        ring.rotation.z = time * 0.2 * (i % 2 ? 1 : -1);
      });
      
      // Pulse light intensity
      const pulseValue = Math.sin(time * 3) * 0.2 + 0.8;
      pointLight.intensity = pulseValue * 1.5;
      
      // Render
      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

    // Resize handler
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

    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-primary/20">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

export default ThreeJsMajesticBadge;